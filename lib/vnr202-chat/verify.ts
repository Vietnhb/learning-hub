import { normalize, type Retrieved } from "./retrieval";

// ---------------------------------------------------------------------------
// Kiểm chứng câu trả lời của AI theo từng câu.
// Một câu chỉ được giữ khi:
//   - phần lớn từ ngữ nội dung của câu có trong đoạn tài liệu nó trích, và
//   - mọi con số / ngày tháng trong câu có trong đoạn đó (hoặc trong câu hỏi).
// Câu không đạt bị bỏ. Bỏ quá nhiều → không dùng lời AI, chỉ trích nguyên văn.
// ---------------------------------------------------------------------------

// Từ chức năng và từ dẫn dắt (không mang thông tin lịch sử) — bỏ qua khi đối chiếu
const IGNORE = new Set(
  (
    "va cua la cac nhung co duoc trong voi cho da khong mot nay do thi ra gi sao nao nhu the ve de o tu den khi hay vi ai " +
    "ma nen neu con cung deu rat se dang bi boi tai luc ay kia vay day do nhieu it hon nhat moi tung " +
    "tai lieu giao trinh slide kich ban nhom trinh bay theo cho thay ghi neu noi ro dung sai tien de ket luan " +
    "vi vay tuy nhien dong thoi sau truoc het ngoai tom lai ngan gon chinh viec dieu qua trong so phan " +
    "cau hoi tra loi doan trich nguyen van"
  ).split(" "),
);

function syllables(text: string): string[] {
  return normalize(text)
    .split(/[^a-z0-9]+/)
    .filter((s) => s.length > 1 && !IGNORE.has(s));
}

/** Cặp âm tiết liền nhau (bỏ cặp toàn từ chức năng) — bắt được câu ghép từ các chữ rời rạc */
function bigrams(text: string): string[] {
  const syl = normalize(text).split(/[^a-z0-9]+/).filter(Boolean);
  const out: string[] = [];
  for (let i = 0; i + 1 < syl.length; i += 1) {
    if (IGNORE.has(syl[i]) && IGNORE.has(syl[i + 1])) continue;
    out.push(`${syl[i]} ${syl[i + 1]}`);
  }
  return out;
}

const NUMBER_RE =
  /\d{1,2}\s*[/-]\s*\d{1,2}\s*[/-]\s*\d{4}|\d{1,2}\s*[/-]\s*\d{4}|\d{1,3}(?:[.,]\d{3})+|\d+(?:[.,]\d+)?\s*%|\b\d+\s+(?:ngày|tháng|năm|tuần|giờ|vạn|triệu|nghìn|ngàn|lần|ghế|người|khẩu|bộ|trung đoàn|tiểu đoàn)|\b\d{2,4}\b/gi;

function missingNumbers(sentence: string, haystack: string): string[] {
  const out: string[] = [];
  for (const raw of Array.from(new Set(sentence.replace(/\[\d+\]/g, "").match(NUMBER_RE) ?? []))) {
    const n = normalize(raw).replace(/\s+/g, " ").trim();
    if (![n, n.replace(/\b0(\d)/g, "$1")].some((v) => haystack.includes(v))) out.push(raw.trim());
  }
  return out;
}

interface Unit {
  text: string;
  /** Xuống dòng trước đơn vị này */
  breakBefore: boolean;
}

/** Tách câu trả lời thành từng câu; mỗi dòng gạch đầu dòng là một đơn vị */
function splitUnits(answer: string): Unit[] {
  const units: Unit[] = [];
  for (const line of answer.split(/\n+/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const parts = /^[-•*]\s/.test(trimmed)
      ? [trimmed]
      : trimmed.split(/(?<=[.!?…](?:\s*\[\d+\])*)\s+(?=[A-ZÀ-ỸĐ“"(])/);
    parts.forEach((p, i) => units.push({ text: p.trim(), breakBefore: i === 0 && units.length > 0 }));
  }
  return units;
}

export interface Verified {
  answer: string;
  kept: number;
  removed: number;
  unverifiedNumbers: string[];
}

export function verifyAnswer(answer: string, sources: Retrieved[], question: string): Verified {
  const units = splitUnits(answer);
  const allCitedIdx = Array.from(new Set(Array.from(answer.matchAll(/\[(\d+)\]/g)).map((m) => Number(m[1]) - 1))).filter(
    (i) => i >= 0 && i < sources.length,
  );
  const keep: Unit[] = [];
  let removed = 0;
  const unverifiedNumbers: string[] = [];

  units.forEach((unit, i) => {
    const own = Array.from(unit.text.matchAll(/\[(\d+)\]/g))
      .map((m) => Number(m[1]) - 1)
      .filter((n) => n >= 0 && n < sources.length);
    // Câu chưa trích thì mượn trích dẫn của câu kế tiếp trong cùng đoạn (AI hay ghi [n] cuối đoạn)
    const next = units[i + 1];
    const borrowed =
      !own.length && next && !next.breakBefore
        ? Array.from(next.text.matchAll(/\[(\d+)\]/g)).map((m) => Number(m[1]) - 1).filter((n) => n >= 0 && n < sources.length)
        : [];
    const refs = own.length ? own : borrowed.length ? borrowed : allCitedIdx;
    const passages = refs.map((r) => sources[r].text).join(" ");

    const content = syllables(unit.text.replace(/\[\d+\]/g, ""));
    // Câu chỉ có từ dẫn dắt ("Không.", "Theo giáo trình:") thì giữ
    if (content.length < 3) {
      keep.push(unit);
      return;
    }
    const bag = new Set(syllables(`${passages} ${question}`));
    const coverage = content.filter((s) => bag.has(s)).length / content.length;
    const pairs = bigrams(unit.text.replace(/\[\d+\]/g, ""));
    const pairBag = new Set(bigrams(`${passages} ${question}`));
    const pairCoverage = pairs.length ? pairs.filter((b) => pairBag.has(b)).length / pairs.length : 1;
    const threshold = own.length ? 0.72 : 0.8;
    const numbers = missingNumbers(unit.text, normalize(`${passages} ${question}`).replace(/\s+/g, " "));

    if (coverage >= threshold && pairCoverage >= 0.45 && !numbers.length) keep.push(unit);
    else {
      removed += 1;
      unverifiedNumbers.push(...numbers);
      if (process.env.NODE_ENV !== "production") {
        console.log(`[vnr202-chat] bỏ câu (phủ ${coverage.toFixed(2)}, cụm ${pairCoverage.toFixed(2)}${numbers.length ? `, số lạ ${numbers.join(",")}` : ""}):`, unit.text);
      }
    }
  });

  const text = keep
    .map((u, i) => (i > 0 ? (u.breakBefore ? "\n" : " ") : "") + u.text)
    .join("")
    .trim();
  return { answer: text, kept: keep.length, removed, unverifiedNumbers: Array.from(new Set(unverifiedNumbers)) };
}

/** Trích nguyên văn: chọn các câu trong đoạn giáo trình khớp câu hỏi nhất */
export function extractiveAnswer(question: string, sources: Retrieved[]): { answer: string; used: number[] } {
  const q = new Set(syllables(question));
  const candidates: { text: string; n: number; score: number }[] = [];
  sources.forEach((s, i) => {
    if (s.kind !== "giao-trinh" && candidates.length) return;
    for (const sentence of s.text.split(/(?<=[.!?…;])\s+/)) {
      const words = syllables(sentence);
      if (words.length < 4) continue;
      const score = words.filter((w) => q.has(w)).length / Math.sqrt(words.length);
      if (score > 0) candidates.push({ text: sentence.trim(), n: i + 1, score: score * (s.kind === "giao-trinh" ? 1.3 : 1) });
    }
  });
  const best = candidates.sort((a, b) => b.score - a.score).slice(0, 3);
  if (!best.length) return { answer: "", used: [] };
  return {
    answer: best.map((b) => `“${b.text.replace(/^["“]|["”]$/g, "")}” [${b.n}]`).join("\n"),
    used: Array.from(new Set(best.map((b) => b.n))),
  };
}

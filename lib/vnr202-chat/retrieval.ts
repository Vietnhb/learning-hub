import { allNodes } from "@/app/resources/VNR202/data";
import giaoTrinh from "./knowledge/giao-trinh-ch2.json";
import kichBan from "./knowledge/kich-ban.json";
import slides from "./knowledge/slides.json";

// ---------------------------------------------------------------------------
// Kho tri thức của AI chat VNR202. Chỉ gồm:
//   1. Giáo trình Lịch sử Đảng (2019), Chương 2, trang in 61–77
//   2. Slide và kịch bản thuyết trình của Nhóm 2
//   3. Nội dung các sự kiện, nhân vật trên trang VNR202
// AI chỉ được trả lời dựa trên các đoạn lấy ra từ kho này.
// ---------------------------------------------------------------------------

export type SourceKind = "giao-trinh" | "slide" | "kich-ban" | "trang-web";

export interface KnowledgeChunk {
  id: string;
  kind: SourceKind;
  label: string;
  text: string;
  page?: number;
}

const KIND_WEIGHT: Record<SourceKind, number> = {
  "giao-trinh": 1.2,
  slide: 1,
  "kich-ban": 0.95,
  "trang-web": 0.9,
};

function splitLong(text: string, max = 900): string[] {
  if (text.length <= max) return [text];
  const sentences = text.match(/[^.!?…]+[.!?…]*["”)]?\s*/g) ?? [text];
  const out: string[] = [];
  let cur = "";
  for (const s of sentences) {
    if (cur && (cur + s).length > max) {
      out.push(cur.trim());
      cur = "";
    }
    cur += s;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

function buildChunks(): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = [];

  // Gộp đoạn quá ngắn (tiêu đề mục) vào đoạn sau; nối câu bị cắt ngang giữa hai trang
  const blocks: { text: string; from: number; to: number }[] = [];
  let carry = null as { text: string; page: number } | null;
  for (const { page, paragraphs } of giaoTrinh as { page: number; paragraphs: string[] }[]) {
    for (let i = 0; i < paragraphs.length; i += 1) {
      const p = paragraphs[i];
      const prev = blocks[blocks.length - 1];
      const continues = i === 0 && prev && /^[a-zà-ỹđ0-9"“(]/.test(p) && !/[.:!?…]["”]?$/.test(prev.text);
      if (continues && !carry) {
        prev.text = `${prev.text} ${p}`;
        prev.to = page;
        continue;
      }
      const text = carry ? `${carry.text} — ${p}` : p;
      const from = carry ? carry.page : page;
      if (text.length < 160) carry = { text, page: from };
      else {
        blocks.push({ text, from, to: page });
        carry = null;
      }
    }
  }
  if (carry) blocks.push({ text: carry.text, from: carry.page, to: carry.page });

  const counter = new Map<number, number>();
  for (const block of blocks) {
    for (const text of splitLong(block.text)) {
      const n = counter.get(block.from) ?? 0;
      counter.set(block.from, n + 1);
      chunks.push({
        id: `gt-${block.from}-${n}`,
        kind: "giao-trinh",
        label: `Giáo trình LSĐ (2019), trang in ${block.from === block.to ? block.from : `${block.from}–${block.to}`}`,
        text,
        page: block.from,
      });
    }
  }

  for (const s of slides as { slide: number; title: string; presenter: string; text: string; notes: string }[]) {
    chunks.push({
      id: `slide-${s.slide}`,
      kind: "slide",
      label: `Slide ${s.slide}: ${s.title}`,
      text: [s.text, s.notes].filter(Boolean).join(" Ghi chú: "),
    });
  }

  for (const k of kichBan as { member: string; slide: number; text: string }[]) {
    chunks.push({
      id: `kb-${k.slide}`,
      kind: "kich-ban",
      label: `Kịch bản – ${k.member}, slide ${k.slide}`,
      text: k.text,
    });
  }

  for (const n of allNodes) {
    chunks.push({
      id: `web-${n.id}`,
      kind: "trang-web",
      label: `Trang VNR202: ${n.title} (${n.date})`,
      text: [n.title, n.date, n.summary, n.significance].filter(Boolean).join(". "),
    });
  }

  return chunks;
}

// ---------------------------------------------------------------------------
// Tìm kiếm BM25 trên âm tiết tiếng Việt (bỏ dấu) + cặp âm tiết liền nhau
// ---------------------------------------------------------------------------

const STOP = new Set(
  "va cua la cac nhung co duoc trong voi cho da khong mot nay do thi ra gi sao nao nhu the ve de o tu den khi hay vi ai em toi minh cau hoi giai thich cho biet hay neu ban oi a nhe vay khac nhau bao nhieu luc tai phai cung".split(
    " ",
  ),
);

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/(\d)\s*[/.-]\s*(?=\d)/g, "$1 ");
}

function terms(text: string): string[] {
  const syl = normalize(text).split(/[^a-z0-9]+/).filter(Boolean);
  const out: string[] = [];
  for (let i = 0; i < syl.length; i += 1) {
    if (!STOP.has(syl[i])) out.push(syl[i]);
    if (i + 1 < syl.length) out.push(`${syl[i]}_${syl[i + 1]}`);
  }
  return out;
}

interface Index {
  chunks: KnowledgeChunk[];
  tf: Map<string, number>[];
  len: number[];
  df: Map<string, number>;
  avg: number;
}

let index: Index | null = null;

function getIndex(): Index {
  if (index) return index;
  const chunks = buildChunks();
  const tf = chunks.map((c) => {
    const m = new Map<string, number>();
    for (const t of terms(`${c.label} ${c.text}`)) m.set(t, (m.get(t) ?? 0) + 1);
    return m;
  });
  const len = tf.map((m) => Array.from(m.values()).reduce((a, b) => a + b, 0));
  const df = new Map<string, number>();
  for (const m of tf) for (const t of Array.from(m.keys())) df.set(t, (df.get(t) ?? 0) + 1);
  index = { chunks, tf, len, df, avg: len.reduce((a, b) => a + b, 0) / len.length };
  return index;
}

export interface Retrieved extends KnowledgeChunk {
  score: number;
  /** Tỉ lệ (theo độ hiếm của từ) các âm tiết trong câu hỏi có mặt trong đoạn */
  coverage: number;
  /** Số cụm hai âm tiết liền nhau của câu hỏi khớp với đoạn */
  bigramHits: number;
}

// Tên gọi tương đương: câu hỏi hay dùng tên khác với cách giáo trình viết
const EXPANSIONS: [RegExp, string][] = [
  [/chien dich viet bac|viet bac 1947/, "thu dong 1947 atk viet bac tan cong mua dong"],
  [/chien dich bien gioi|bien gioi 1950/, "chien dich bien gioi thu dong 1950"],
  [/tong tuyen cu|bau cu 1946/, "bau cu quoc hoi tong tuyen cu"],
  [/(^|\s)tuong(\s|$)/, "trung hoa dan quoc"],
  [/trung hoa dan quoc/, "quan tuong"],
  [/khang chien kien quoc/, "chi thi khang chien kien quoc"],
  [/toan dan|toan dien|truong ky|lau dai|suc minh/, "khang chien toan dan toan dien lau dai dua vao suc minh la chinh"],
];

function expand(question: string): string {
  const n = normalize(question);
  return [question, ...EXPANSIONS.filter(([re]) => re.test(n)).map(([, add]) => add)].join(" ");
}

export function retrieve(question: string, context = "", k = 6): Retrieved[] {
  const idx = getIndex();
  const N = idx.chunks.length;
  const qMain = Array.from(new Set(terms(question)));
  const qExtra = Array.from(new Set(terms(expand(question)))).filter((t) => !qMain.includes(t));
  const qCtx = Array.from(new Set(terms(context))).filter((t) => !qMain.includes(t));
  const qUnigrams = qMain.filter((t) => !t.includes("_"));
  if (!qUnigrams.length) return [];
  const idfOf = (t: string) => {
    const df = idx.df.get(t) ?? 0;
    return Math.log(1 + (N - df + 0.5) / (df + 0.5));
  };
  const totalIdf = qUnigrams.reduce((a, t) => a + idfOf(t), 0);

  const scored = idx.chunks.map((chunk, i) => {
    let score = 0;
    let hitIdf = 0;
    let bigramHits = 0;
    const tf = idx.tf[i];
    const norm = 1.2 * (0.25 + 0.75 * (idx.len[i] / idx.avg));
    const add = (t: string, w: number) => {
      const f = tf.get(t);
      if (!f) return false;
      const df = idx.df.get(t) ?? 0;
      const idf = Math.log(1 + (N - df + 0.5) / (df + 0.5));
      const bigram = t.includes("_") ? 1.6 : 1;
      score += w * bigram * idf * ((f * 2.2) / (f + norm));
      return true;
    };
    for (const t of qMain) {
      if (!add(t, 1)) continue;
      if (t.includes("_")) bigramHits += 1;
      else hitIdf += idfOf(t);
    }
    for (const t of qExtra) add(t, 0.8);
    for (const t of qCtx) add(t, 0.35);
    return {
      ...chunk,
      score: score * KIND_WEIGHT[chunk.kind],
      coverage: totalIdf ? hitIdf / totalIdf : 0,
      bigramHits,
    };
  });

  const ranked = scored.filter((c) => c.score > 0).sort((a, b) => b.score - a.score);
  // Luôn đưa 3 đoạn giáo trình liên quan nhất lên đầu, rồi mới tới slide, kịch bản, trang web
  const textbook = ranked.filter((c) => c.kind === "giao-trinh").slice(0, 3);
  const others = ranked.filter((c) => !textbook.includes(c)).slice(0, Math.max(0, k - textbook.length));
  return [...textbook, ...others].sort((a, b) => (a.kind === "giao-trinh" ? 0 : 1) - (b.kind === "giao-trinh" ? 0 : 1) || b.score - a.score);
}

/** Đoạn lấy ra có đủ liên quan để AI được phép trả lời không */
export function isRelevant(results: Retrieved[]): boolean {
  const top = results[0];
  if (!top) return false;
  // Cần phủ phần lớn các từ "hiếm" của câu hỏi và khớp ít nhất một cụm từ hai âm tiết
  return results.some((r) => r.coverage >= 0.55 && r.bigramHits >= 1 && r.score >= 6);
}

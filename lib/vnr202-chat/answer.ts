import { isRelevant, normalize, retrieve, type Retrieved } from "./retrieval";

// ---------------------------------------------------------------------------
// Trả lời câu hỏi VNR202 CHỈ dựa trên các đoạn lấy từ kho tri thức.
// Ba lớp chặn để AI không bịa:
//   1. Không tìm thấy đoạn liên quan → trả lời "không có trong tài liệu", không gọi AI.
//   2. Lời nhắn hệ thống bắt AI chỉ dùng các đoạn được đánh số và trích [n].
//   3. Kiểm tra lại câu trả lời: phải có trích dẫn hợp lệ, mọi con số / ngày tháng
//      phải xuất hiện trong đoạn được trích; nếu không thì cảnh báo.
// ---------------------------------------------------------------------------

export const NOT_FOUND =
  "Mình không tìm thấy nội dung này trong giáo trình Chương 2 (trang in 61–77) hay tài liệu thuyết trình của nhóm, nên không trả lời để tránh nói sai. Bạn thử hỏi cụ thể hơn về giai đoạn 1945–1950 nhé.";

const DEFAULT_MODELS = [
  "google/gemma-4-31b-it:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "minimax/minimax-m3.1-flash:free",
];

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export interface SourceOut {
  n: number;
  kind: Retrieved["kind"];
  label: string;
  excerpt: string;
}

export interface AnswerOut {
  answer: string;
  sources: SourceOut[];
  unverified: string[];
  grounded: boolean;
}

const SYSTEM_PROMPT = `Bạn là trợ lý ôn tập môn Lịch sử Đảng Cộng sản Việt Nam (VNR202) cho sinh viên.

QUY TẮC BẮT BUỘC:
1. Chỉ được dùng thông tin trong các ĐOẠN TÀI LIỆU được đánh số [1], [2]... ở tin nhắn của người dùng. Tuyệt đối không dùng kiến thức bên ngoài, kể cả khi bạn tin là đúng.
2. Mỗi câu khẳng định phải kèm số đoạn làm căn cứ, ví dụ: "Ngày 6-1-1946 cả nước tổng tuyển cử [2]."
3. Giữ nguyên ngày tháng, con số, tên văn kiện như trong đoạn tài liệu. Không tự suy ra con số mới.
4. Nếu các đoạn tài liệu không đủ để trả lời, chỉ trả lời đúng một câu: "KHÔNG_ĐỦ_TÀI_LIỆU".
5. Ưu tiên trích các đoạn có nhãn "Giáo trình". Khi đoạn giáo trình và đoạn slide/kịch bản/trang web khác nhau, theo giáo trình và nói rõ điều đó.
6. Nội dung slide, kịch bản là phần trình bày của nhóm sinh viên, không phải nguyên văn giáo trình.
7. Trả lời bằng tiếng Việt, ngắn gọn (tối đa khoảng 180 từ), văn bản thường, không dùng bảng, không dùng tiêu đề markdown.`;

function sourceText(sources: Retrieved[]): string {
  return sources.map((s, i) => `[${i + 1}] (${s.label})\n${s.text}`).join("\n\n");
}

/** Con số, ngày tháng trong câu trả lời phải có trong đoạn được trích */
function checkNumbers(answer: string, cited: Retrieved[]): string[] {
  const haystack = normalize(cited.map((c) => c.text).join(" ")).replace(/\s+/g, " ");
  const found = answer.match(/\d{1,2}\s*[/-]\s*\d{1,2}\s*[/-]\s*\d{4}|\d{1,2}\s*[/-]\s*\d{4}|\d{1,3}(?:[.,]\d{3})+|\d+(?:[.,]\d+)?\s*%|\b\d{2,4}\b/g) ?? [];
  const missing: string[] = [];
  for (const raw of Array.from(new Set(found))) {
    const n = normalize(raw).replace(/\s+/g, " ").trim();
    // Chấp nhận cả 6-1-1946 / 6/1/1946 và ngày có số 0 đứng đầu
    const variants = [n, n.replace(/\b0(\d)/g, "$1")];
    if (!variants.some((v) => haystack.includes(v))) missing.push(raw.trim());
  }
  return missing;
}

function cleanAnswer(text: string): string {
  return text
    .replace(/<think>[\s\S]*?<\/think>/g, "")
    .replace(/^#+\s*/gm, "")
    .trim();
}

function modelList(): string[] {
  const configured = process.env.OPENROUTER_MODEL?.split(",").map((m) => m.trim()).filter(Boolean);
  return configured?.length ? configured : DEFAULT_MODELS;
}

async function callOpenRouter(messages: { role: string; content: string }[], models = modelList()): Promise<string> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("missing_key");

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      "X-Title": "Learning Hub VNR202",
    },
    body: JSON.stringify({
      model: models[0],
      models,
      messages,
      temperature: 0.1,
      max_tokens: 1600,
      // Model suy luận: giữ phần nghĩ ngắn và không trả về, để còn token cho câu trả lời
      reasoning: { effort: "low", exclude: true },
    }),
    signal: AbortSignal.timeout(45_000),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`openrouter_${res.status}: ${detail.slice(0, 200)}`);
  }
  const data = await res.json();
  if (process.env.NODE_ENV !== "production") {
    console.log("[vnr202-chat] model:", data?.model, "| finish:", data?.choices?.[0]?.finish_reason);
  }
  return String(data?.choices?.[0]?.message?.content ?? "");
}

export async function answerQuestion(question: string, history: ChatTurn[]): Promise<AnswerOut> {
  const lastUser = history.filter((t) => t.role === "user").slice(-1)[0]?.content ?? "";
  const results = retrieve(question, lastUser);

  if (!isRelevant(results)) {
    return { answer: NOT_FOUND, sources: [], unverified: [], grounded: false };
  }

  const sources = results.slice(0, 7);
  const sourcesOut: SourceOut[] = sources.map((s, i) => ({
    n: i + 1,
    kind: s.kind,
    label: s.label,
    excerpt: s.text.length > 420 ? `${s.text.slice(0, 420)}…` : s.text,
  }));

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.slice(-4).map((t) => ({ role: t.role, content: t.content.slice(0, 600) })),
    {
      role: "user",
      content: `ĐOẠN TÀI LIỆU:\n\n${sourceText(sources)}\n\nCÂU HỎI: ${question}\n\nNhớ: chỉ dùng các đoạn trên, trích [n] sau mỗi ý.`,
    },
  ];

  const validCitations = (text: string) =>
    Array.from(new Set(Array.from(text.matchAll(/\[(\d+)\]/g)).map((m) => Number(m[1])))).filter(
      (n) => n >= 1 && n <= sources.length,
    );

  const models = modelList();
  const rotated = models.length > 1 ? [...models.slice(1), models[0]] : models;
  let raw = cleanAnswer(await callOpenRouter(messages, models));
  // Trả về rỗng (thường do model suy luận hết token) → thử model kế tiếp
  if (!raw) raw = cleanAnswer(await callOpenRouter(messages, rotated));

  // Model quên trích dẫn → nhắc lại một lần, thử với model dự phòng
  if (raw && !/^KHÔNG_ĐỦ_TÀI_LIỆU/.test(raw) && !validCitations(raw).length) {
    raw = cleanAnswer(
      await callOpenRouter(
        [
          ...messages,
          { role: "assistant", content: raw },
          {
            role: "user",
            content:
              "Câu trả lời trên thiếu trích dẫn. Viết lại, chỉ dùng các đoạn tài liệu đã cho và ghi số đoạn [n] ngay sau mỗi ý.",
          },
        ],
        rotated,
      ),
    );
  }

  if (process.env.NODE_ENV !== "production") {
    console.log("[vnr202-chat] nguồn:", sources.map((s) => `${s.label} (${s.score.toFixed(1)})`).join(" | "));
    console.log("[vnr202-chat] AI:", raw.slice(0, 400));
  }

  // Có trích dẫn hợp lệ thì bỏ dấu "không đủ" lẫn trong câu; không có gì thì từ chối
  if (validCitations(raw).length) raw = raw.replace(/KHÔNG_ĐỦ_TÀI_LIỆU\.?/g, "").trim();
  if (!raw || /^KHÔNG_ĐỦ_TÀI_LIỆU/.test(raw) || (raw.includes("KHÔNG_ĐỦ_TÀI_LIỆU") && !validCitations(raw).length)) {
    return { answer: NOT_FOUND, sources: sourcesOut, unverified: [], grounded: false };
  }

  // Chỉ giữ trích dẫn trỏ tới đoạn thật; câu trả lời không có trích dẫn nào thì không tin
  const valid = validCitations(raw);
  const answer = raw.replace(/\[(\d+)\]/g, (m, n) => (valid.includes(Number(n)) ? m : ""));

  if (!valid.length) {
    return {
      answer:
        "AI chưa đưa ra được câu trả lời có trích dẫn rõ ràng, nên mình không hiển thị để tránh sai. Bạn đọc trực tiếp các đoạn tài liệu liên quan bên dưới nhé.",
      sources: sourcesOut,
      unverified: [],
      grounded: false,
    };
  }

  const cited = valid.map((n) => sources[n - 1]);
  return {
    answer,
    sources: sourcesOut.filter((s) => valid.includes(s.n)),
    unverified: checkNumbers(answer, cited),
    grounded: true,
  };
}

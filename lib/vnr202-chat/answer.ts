import { isRelevant, retrieve, type Retrieved } from "./retrieval";
import { extractiveAnswer, verifyAnswer } from "./verify";

// ---------------------------------------------------------------------------
// Trả lời câu hỏi VNR202 CHỈ dựa trên các đoạn lấy từ kho tri thức.
// Ba lớp chặn để AI không bịa:
//   1. Không tìm thấy đoạn liên quan → trả lời "không có trong tài liệu", không gọi AI.
//   2. Lời nhắn hệ thống bắt AI chỉ dùng các đoạn được đánh số và trích [n].
//   3. Kiểm chứng từng câu (verify.ts): câu không khớp đoạn được trích bị bỏ; bỏ quá nhiều
//      thì không dùng lời AI mà chỉ trích nguyên văn tài liệu.
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
  /** generated: lời AI đã qua kiểm chứng từng câu · extractive: trích nguyên văn · none: không trả lời */
  mode: "generated" | "extractive" | "none";
  /** Số câu của AI bị bỏ vì không đối chiếu được với tài liệu */
  removed: number;
}

const base: Omit<AnswerOut, "answer" | "sources"> = { unverified: [], grounded: false, mode: "none", removed: 0 };

const SYSTEM_PROMPT = `Bạn là trợ lý ôn tập môn Lịch sử Đảng Cộng sản Việt Nam (VNR202) cho sinh viên.

QUY TẮC BẮT BUỘC:
1. Chỉ được dùng thông tin trong các ĐOẠN TÀI LIỆU được đánh số [1], [2]... ở tin nhắn của người dùng. Tuyệt đối không dùng kiến thức bên ngoài, kể cả khi bạn tin là đúng.
2. Mỗi câu khẳng định phải kèm số đoạn làm căn cứ, ví dụ: "Ngày 6-1-1946 cả nước tổng tuyển cử [2]."
3. Giữ nguyên ngày tháng, con số, tên văn kiện như trong đoạn tài liệu. Không tự suy ra con số mới.
4. Nếu các đoạn tài liệu không đủ để trả lời, chỉ trả lời đúng một câu: "KHÔNG_ĐỦ_TÀI_LIỆU".
5. Ưu tiên trích các đoạn có nhãn "Giáo trình". Khi đoạn giáo trình và đoạn slide/kịch bản/trang web khác nhau, theo giáo trình và nói rõ điều đó.
6. Nội dung slide, kịch bản là phần trình bày của nhóm sinh viên, không phải nguyên văn giáo trình.
7. Nếu câu hỏi chứa tiền đề trái với tài liệu (ví dụ xuyên tạc, quy chụp), nói rõ tiền đề đó không đúng theo tài liệu rồi dẫn chứng; không lặp lại hay khuếch đại lời quy chụp.
8. Không nêu ý kiến cá nhân. Với câu hỏi "theo bạn", chỉ trình bày những gì tài liệu đánh giá.
9. Giữ đúng chủ thể của từng việc (Đảng, Chính phủ, Chủ tịch Hồ Chí Minh, Mặt trận Việt Minh, quân Pháp...) và gọi văn kiện bằng đúng tên đầy đủ trong tài liệu.
10. Đọc hết mọi đoạn trước khi kết luận. Chỉ khi không đoạn nào nhắc tới điều được hỏi mới nói "tài liệu không nêu…", không khẳng định điều đó có hay không có trên thực tế.
11. Trả lời bằng tiếng Việt, ngắn gọn (tối đa khoảng 180 từ), văn bản thường, không dùng bảng, không dùng tiêu đề markdown.`;

function sourceText(sources: Retrieved[]): string {
  return sources.map((s, i) => `[${i + 1}] (${s.label})\n${s.text}`).join("\n\n");
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
    return { ...base, answer: NOT_FOUND, sources: [] };
  }

  const sources = results.slice(0, 8);
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
    return { ...base, answer: NOT_FOUND, sources: sourcesOut };
  }

  // Chỉ giữ trích dẫn trỏ tới đoạn thật
  const valid = validCitations(raw);
  const cleaned = raw.replace(/\[(\d+)\]/g, (m, n) => (valid.includes(Number(n)) ? m : ""));
  const verified = valid.length ? verifyAnswer(cleaned, sources, question) : null;
  const total = verified ? verified.kept + verified.removed : 0;

  // Không trích dẫn, hoặc phải bỏ quá 1/3 số câu → không dùng lời AI, chỉ trích nguyên văn tài liệu
  if (!verified || !verified.answer || verified.removed / Math.max(total, 1) > 1 / 3) {
    const quote = extractiveAnswer(question, sources);
    if (!quote.answer) return { ...base, answer: NOT_FOUND, sources: sourcesOut };
    return {
      ...base,
      answer: quote.answer,
      sources: sourcesOut.filter((s) => quote.used.includes(s.n)),
      mode: "extractive",
      removed: verified?.removed ?? 0,
      grounded: true,
    };
  }

  const usedNums = validCitations(verified.answer);
  return {
    ...base,
    answer: verified.answer,
    sources: sourcesOut.filter((s) => usedNums.includes(s.n)),
    mode: "generated",
    removed: verified.removed,
    grounded: true,
  };
}

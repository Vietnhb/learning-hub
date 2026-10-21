import { NextResponse } from "next/server";
import { answerQuestion, type ChatTurn } from "@/lib/vnr202-chat/answer";
// Giới hạn tần suất đơn giản theo IP (bộ nhớ của từng instance) vì không yêu cầu đăng nhập
const WINDOW_MS = 60_000;
const PER_MINUTE = 6;
const PER_DAY = 60;
const hits = new Map<string, number[]>();

function limited(ip: string): boolean {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < 86_400_000);
  const lastMinute = list.filter((t) => now - t < WINDOW_MS).length;
  if (lastMinute >= PER_MINUTE || list.length >= PER_DAY) {
    hits.set(ip, list);
    return true;
  }
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return false;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (process.env.NODE_ENV === "production" && limited(ip)) {
    return NextResponse.json(
      { error: "Bạn hỏi hơi nhanh, đợi khoảng một phút rồi hỏi tiếp nhé." },
      { status: 429 },
    );
  }

  let body: { question?: unknown; history?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Yêu cầu không hợp lệ." }, { status: 400 });
  }

  const question = typeof body.question === "string" ? body.question.trim() : "";
  if (!question) return NextResponse.json({ error: "Bạn chưa nhập câu hỏi." }, { status: 400 });
  if (question.length > 500) {
    return NextResponse.json({ error: "Câu hỏi dài quá 500 ký tự." }, { status: 400 });
  }

  const history: ChatTurn[] = Array.isArray(body.history)
    ? body.history
        .filter(
          (t): t is ChatTurn =>
            !!t &&
            typeof t === "object" &&
            ((t as ChatTurn).role === "user" || (t as ChatTurn).role === "assistant") &&
            typeof (t as ChatTurn).content === "string",
        )
        .slice(-4)
    : [];

  try {
    return NextResponse.json(await answerQuestion(question, history));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[vnr202-chat]", message);
    if (message === "missing_key") {
      return NextResponse.json(
        { error: "Chưa cấu hình OPENROUTER_API_KEY trên máy chủ." },
        { status: 503 },
      );
    }
    if (message.startsWith("openrouter_429")) {
      return NextResponse.json(
        { error: "Model AI miễn phí đang quá tải, bạn thử lại sau ít phút nhé." },
        { status: 503 },
      );
    }
    return NextResponse.json({ error: "AI tạm thời không trả lời được, thử lại sau nhé." }, { status: 502 });
  }
}

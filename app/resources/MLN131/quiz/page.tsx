"use client";

import { StudyQuiz, type QuizQuestion } from "@/components/quiz/StudyQuiz";
import rawQuestions from "./questions.json";

const questions = rawQuestions as QuizQuestion[];

// Topics follow the 7 chapters of the 2021 textbook; checked in this order
// because a family or ethnicity question often also mentions the working class.
const CHAPTERS: Array<[string, RegExp]> = [
  ["Chương 7. Gia đình", /gia đình|hôn nhân|vợ chồng/],
  ["Chương 6. Dân tộc và tôn giáo", /dân tộc|tôn giáo|tín ngưỡng/],
  [
    "Chương 5. Cơ cấu xã hội – giai cấp và liên minh",
    /cơ cấu xã hội|liên minh|tầng lớp|trí thức|doanh nhân/,
  ],
  [
    "Chương 2. Sứ mệnh lịch sử của giai cấp công nhân",
    /giai cấp công nhân|sứ mệnh|giai cấp vô sản/,
  ],
  [
    "Chương 4. Dân chủ và nhà nước xã hội chủ nghĩa",
    /dân chủ|nhà nước|pháp quyền|quốc hội/,
  ],
  [
    "Chương 3. Chủ nghĩa xã hội và thời kỳ quá độ",
    /quá độ|chủ nghĩa xã hội|xã hội chủ nghĩa|hình thái/,
  ],
];

function detectTopic(question: QuizQuestion): string {
  const text = question.question.toLocaleLowerCase("vi");
  const chapter = CHAPTERS.find(([, pattern]) => pattern.test(text));
  return chapter ? chapter[0] : "Chương 1. Nhập môn chủ nghĩa xã hội khoa học";
}

export default function MLN131QuizPage() {
  return (
    <StudyQuiz
      code="MLN131"
      title="Ôn tập Chủ nghĩa xã hội khoa học"
      description="Ôn theo từng chương giáo trình, luyện trả lời và xem lại đáp án cùng các kiểu hỏi khác trong tài liệu."
      questions={questions}
      detectTopic={detectTopic}
    />
  );
}

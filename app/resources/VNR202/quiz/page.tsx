"use client";

import { StudyQuiz, type QuizQuestion } from "@/components/quiz/StudyQuiz";
import rawQuestions from "./questions.json";

const questions = rawQuestions as QuizQuestion[];

// Topics follow the course periods; the question text is matched first, then the
// correct choice (wrong choices often carry dates from other periods).
const PERIODS: Array<[string, RegExp]> = [
  [
    "Lãnh đạo công cuộc đổi mới (1986 – nay)",
    /đổi mới|19(8[6-9]|9\d)|20[0-2]\d|đại hội (lần thứ )?(vi|vii|viii|ix|x|xi|xii|xiii)\b|hội nhập|công nghiệp hóa, hiện đại hóa/,
  ],
  [
    "Cả nước đi lên chủ nghĩa xã hội (1975 – 1986)",
    /197[5-9]|198[0-5]|đại hội (lần thứ )?(iv|v)\b|thống nhất đất nước về mặt nhà nước|biên giới tây nam|biên giới phía bắc/,
  ],
  [
    "Kháng chiến chống Mỹ (1954 – 1975)",
    /mỹ|195[4-9]|196\d|197[0-4]|giơnevơ|giơ-ne-vơ|đồng khởi|đại hội (lần thứ )?iii\b|miền nam/,
  ],
  [
    "Đảng ra đời (1920 – 1930)",
    /19[12]\d|1930|thành lập đảng|cương lĩnh (chính trị )?đầu tiên|thanh niên cách mạng|nguyễn ái quốc|hội nghị hợp nhất/,
  ],
  [
    "Giành chính quyền và kháng chiến chống Pháp (1930 – 1954)",
    /pháp|193[1-9]|194\d|195[0-3]|tháng tám|việt minh|điện biên phủ|đại hội (lần thứ )?(i|ii)\b|khởi nghĩa/,
  ],
];

function detectTopic(question: QuizQuestion): string {
  const texts = [
    question.question,
    question.choices
      .filter((choice) => question.answers.includes(choice.id))
      .map((choice) => choice.text)
      .join(" "),
  ].map((text) => text.toLocaleLowerCase("vi"));

  for (const text of texts) {
    const period = PERIODS.find(([, pattern]) => pattern.test(text));
    if (period) return period[0];
  }
  return "Kiến thức chung";
}

export default function VNR202QuizPage() {
  return (
    <StudyQuiz
      code="VNR202"
      title="Ôn tập Lịch sử Đảng Cộng sản Việt Nam"
      description="Ôn theo từng giai đoạn lịch sử, luyện trả lời và xem lại đáp án từ tài liệu."
      questions={questions}
      detectTopic={detectTopic}
    />
  );
}

import HomeClient from "./HomeClient";
import { quizCounts } from "@/lib/quiz-counts.server";

export default function Page() {
  return <HomeClient counts={quizCounts} />;
}

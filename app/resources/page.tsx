import ResourcesClient from "./ResourcesClient";
import { quizCounts } from "@/lib/quiz-counts.server";

export default function Page() {
  return <ResourcesClient counts={quizCounts} />;
}

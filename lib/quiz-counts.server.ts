import hcm202 from "@/app/resources/HCM202/quiz/questions.json";
import ite302c from "@/app/resources/ITE302c/quiz/questions.json";
import prm393 from "@/app/resources/PRM393/quiz.json";
import mln122 from "@/app/resources/MLN122/quiz/questions.json";
import mln131 from "@/app/resources/MLN131/quiz/questions.json";
import vnr202 from "@/app/resources/VNR202/quiz/questions.json";

// Import only in server components; send counts, not question banks, to clients.
export const quizCounts = {
  HCM202: hcm202.length,
  ITE302c: ite302c.length,
  PRM393: prm393.length,
  MLN122: mln122.length,
  MLN131: mln131.length,
  VNR202: vnr202.length,
};

export type QuizCounts = typeof quizCounts;

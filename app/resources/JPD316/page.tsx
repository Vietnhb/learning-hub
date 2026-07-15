import TrainingOverviewClient from "./TrainingOverviewClient";
import grammarData from "./grammar/gramar.json";
import kanjiData from "./kanji/kanji.json";
import vocabularyData from "./vocabulary/kotoba.json";

export default function JPD316Page() {
  const grammarCount = grammarData.lessons.reduce(
    (sum, lesson) => sum + lesson.grammar.length,
    0,
  );
  const kanjiCount = kanjiData.lessons.reduce(
    (sum, lesson) => sum + lesson.kanji.length,
    0,
  );

  return (
    <TrainingOverviewClient
      vocabularyCount={vocabularyData.length}
      grammarCount={grammarCount}
      kanjiCount={kanjiCount}
    />
  );
}

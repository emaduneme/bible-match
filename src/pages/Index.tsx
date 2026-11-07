import { useMemo, useState } from "react";
import { Book } from "lucide-react";
import { Card } from "@/components/ui/card";
import { GameBoard } from "@/components/GameBoard";
import { ResultScreen } from "@/components/ResultScreen";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { hasCompletedIntro, getPlayerName } from "@/lib/player";
import { getPuzzleByNumber, ResolvedPuzzle } from "@/data/dailyPuzzles";
import {
  DailyRecord,
  getDailyStatus,
  loadDailyRecord,
  saveDailyRecord,
} from "@/lib/daily";
import { getStats, recordCompletion, GameStats, countMistakes } from "@/lib/storage";

/**
 * Preview any puzzle with ?day=N (e.g. /?day=3). Nothing is saved.
 * Useful for checking puzzles before their date.
 */
function getPreviewPuzzle(): ResolvedPuzzle | null {
  const raw = new URLSearchParams(window.location.search).get("day");
  if (!raw) return null;
  return getPuzzleByNumber(Number(raw));
}

const Index = () => {
  const [showIntro, setShowIntro] = useState(() => !hasCompletedIntro());
  const previewPuzzle = useMemo(getPreviewPuzzle, []);
  const status = useMemo(() => getDailyStatus(), []);

  const today = status.kind === "puzzle" ? status : null;
  const [record, setRecord] = useState<DailyRecord | null>(() =>
    today ? loadDailyRecord(today.dateKey, today.puzzle.number) : null
  );
  const [stats, setStats] = useState<GameStats>(() => getStats());
  const [previewResult, setPreviewResult] = useState<boolean[] | null>(null);

  if (showIntro) {
    return <WelcomeScreen onComplete={() => setShowIntro(false)} />;
  }

  // Preview mode: play any puzzle, save nothing.
  if (previewPuzzle) {
    if (previewResult) {
      return <ResultScreen puzzle={previewPuzzle} guesses={previewResult} stats={null} isPreview />;
    }
    return (
      <GameBoard
        puzzle={previewPuzzle}
        initialRecord={null}
        onProgress={() => {}}
        onComplete={(r) => setPreviewResult(r.guesses)}
      />
    );
  }

  if (status.kind === "prelaunch") {
    const launch = new Date(`${status.launchDate}T00:00:00`);
    const label = launch.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
    return (
      <MessageScreen
        title="Almost here"
        body={`The first daily puzzle comes out on ${label}. See you then.`}
      />
    );
  }

  if (status.kind === "caught-up") {
    return (
      <MessageScreen
        title="You're all caught up"
        body={`You have reached the end of our ${status.lastNumber} puzzles. New ones are coming soon.`}
      />
    );
  }

  const { dateKey, puzzle } = status;

  if (record?.completed) {
    return (
      <ResultScreen
        puzzle={puzzle}
        guesses={record.guesses}
        stats={stats}
        playerName={getPlayerName()}
      />
    );
  }

  return (
    <GameBoard
      puzzle={puzzle}
      initialRecord={record}
      onProgress={(r) => saveDailyRecord(dateKey, r)}
      onComplete={(r) => {
        saveDailyRecord(dateKey, r);
        setStats(recordCompletion(dateKey, countMistakes(r.guesses)));
        setRecord(r);
      }}
    />
  );
};

const MessageScreen = ({ title, body }: { title: string; body: string }) => (
  <div className="min-h-screen bg-muted flex items-center justify-center p-4 animate-fade-in">
    <Card className="max-w-md w-full p-8 text-center space-y-4 bg-white shadow-[var(--shadow-elevated)]">
      <div className="flex justify-center">
        <div className="p-4 bg-primary rounded-full">
          <Book className="h-8 w-8 text-primary-foreground" />
        </div>
      </div>
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      <p className="text-muted-foreground">{body}</p>
    </Card>
  </div>
);

export default Index;

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Share2, BookOpen } from "lucide-react";
import { toast } from "sonner";
import type { ResolvedPuzzle } from "@/data/dailyPuzzles";
import { countMistakes, getResultLine, getShareText, GameStats } from "@/lib/storage";
import { cn } from "@/lib/utils";

interface ResultScreenProps {
  puzzle: ResolvedPuzzle;
  guesses: boolean[];
  stats: GameStats | null; // null in preview mode
  playerName?: string | null;
  isPreview?: boolean;
}

export const ResultScreen = ({ puzzle, guesses, stats, playerName, isPreview }: ResultScreenProps) => {
  const mistakes = countMistakes(guesses);
  const perfect = mistakes === 0;

  const handleShare = async () => {
    const text = getShareText(puzzle.number, guesses);
    try {
      if (navigator.share) {
        await navigator.share({ text });
        return;
      }
    } catch (err) {
      // User closed the share sheet: do nothing.
      if (err instanceof DOMException && err.name === "AbortError") return;
    }
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Result copied. Paste it anywhere.");
    } catch {
      toast.error("Could not copy. Try again.");
    }
  };

  const heading = perfect ? "Clean sweep" : mistakes <= 2 ? "Well done" : "You got there";

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4 animate-fade-in">
      <div className="max-w-md w-full space-y-4">
        <Card className="p-6 md:p-8 text-center space-y-5 bg-white shadow-[var(--shadow-elevated)]">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Bible Match #{puzzle.number} · {puzzle.theme}
            </p>
            <h1 className="mt-1 text-3xl font-bold text-foreground">
              {heading}
              {playerName ? `, ${playerName}` : ""}!
            </h1>
          </div>

          {/* Guess grid: same squares as the share text */}
          <div className="flex flex-wrap justify-center gap-1.5" aria-label={`${guesses.length} guesses`}>
            {guesses.map((g, i) => (
              <span
                key={i}
                className={cn("h-7 w-7 rounded-md", g ? "bg-success" : "bg-destructive")}
              />
            ))}
          </div>
          <p className={cn("text-lg font-semibold", perfect ? "text-success" : "text-foreground")}>
            {getResultLine(mistakes)}
          </p>

          {stats && (
            <div className="grid grid-cols-3 gap-2 border-y border-border py-4">
              <Stat value={stats.streak} label="Day streak" />
              <Stat value={stats.gamesPlayed} label="Played" />
              <Stat value={stats.perfectGames} label="Clean" />
            </div>
          )}

          <Button variant="hero" size="lg" className="w-full h-12" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share result
          </Button>

          <p className="text-sm text-muted-foreground">
            {isPreview ? "Preview mode: this result was not saved." : "A new puzzle comes out at midnight."}
          </p>
        </Card>

        {/* Recap: what today's connections were */}
        <Card className="p-5 bg-white shadow-[var(--shadow-soft)]">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
            <BookOpen className="h-4 w-4" />
            Today's connections
          </h2>
          <ul className="space-y-3">
            {puzzle.pairs.map((pair) => (
              <li key={pair.id} className="text-sm">
                <p className="font-semibold text-foreground">
                  {pair.a} + {pair.b}
                </p>
                <p className="text-muted-foreground">
                  {pair.note} <span className="italic">({pair.verse})</span>
                </p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};

const Stat = ({ value, label }: { value: number; label: string }) => (
  <div>
    <p className="text-2xl font-bold text-foreground">{value}</p>
    <p className="text-xs text-muted-foreground">{label}</p>
  </div>
);

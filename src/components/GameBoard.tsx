import { useMemo, useState } from "react";
import { MatchCard } from "./MatchCard";
import { FeedbackDialog } from "./FeedbackDialog";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ResolvedPuzzle } from "@/data/dailyPuzzles";
import { DailyRecord, seededShuffle } from "@/lib/daily";
import { countMistakes } from "@/lib/storage";

interface GameBoardProps {
  puzzle: ResolvedPuzzle;
  /** Saved progress for today, so a refresh resumes instead of restarting. */
  initialRecord: DailyRecord | null;
  /** Called after every guess with the updated record. */
  onProgress: (record: DailyRecord) => void;
  /** Called once all pairs are found and the last verse is dismissed. */
  onComplete: (record: DailyRecord) => void;
}

interface CardItem {
  id: string;
  name: string;
  pairId: number;
}

export const GameBoard = ({ puzzle, initialRecord, onProgress, onComplete }: GameBoardProps) => {
  const totalPairs = puzzle.pairs.length;

  // Same layout for every player on the same puzzle.
  const allCards = useMemo<CardItem[]>(() => {
    const cards = puzzle.pairs.flatMap((pair) => [
      { id: `${pair.id}-a`, name: pair.a, pairId: pair.id },
      { id: `${pair.id}-b`, name: pair.b, pairId: pair.id },
    ]);
    return seededShuffle(cards, puzzle.number);
  }, [puzzle]);

  const [guesses, setGuesses] = useState<boolean[]>(initialRecord?.guesses ?? []);
  const [matchedPairIds, setMatchedPairIds] = useState<number[]>(
    initialRecord?.matchedPairIds ?? []
  );
  // Matched cards leave the grid after a short animation.
  const [removedPairIds, setRemovedPairIds] = useState<number[]>(
    initialRecord?.matchedPairIds ?? []
  );
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [correctCards, setCorrectCards] = useState<string[]>([]);
  const [incorrectCards, setIncorrectCards] = useState<string[]>([]);
  const [recentMiss, setRecentMiss] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState({ verse: "", note: "" });

  const visibleCards = allCards.filter((c) => !removedPairIds.includes(c.pairId));
  const mistakes = countMistakes(guesses);
  const isDone = matchedPairIds.length === totalPairs;

  const buildRecord = (nextGuesses: boolean[], nextMatched: number[]): DailyRecord => ({
    puzzleNumber: puzzle.number,
    guesses: nextGuesses,
    matchedPairIds: nextMatched,
    completed: nextMatched.length === totalPairs,
  });

  const handleCardClick = (cardId: string) => {
    const card = allCards.find((c) => c.id === cardId);
    if (!card || matchedPairIds.includes(card.pairId) || isDone) return;

    // Click a selected card again to deselect it.
    if (selectedCards.includes(cardId)) {
      setSelectedCards(selectedCards.filter((id) => id !== cardId));
      return;
    }
    // A guess is already being checked.
    if (selectedCards.length >= 2) return;

    navigator.vibrate?.(10);

    const nextSelection = [...selectedCards, cardId];
    setSelectedCards(nextSelection);
    if (nextSelection.length === 2) checkMatch(nextSelection);
  };

  const checkMatch = ([firstId, secondId]: string[]) => {
    const first = allCards.find((c) => c.id === firstId);
    const second = allCards.find((c) => c.id === secondId);
    if (!first || !second) return;

    const correct = first.pairId === second.pairId;
    const nextGuesses = [...guesses, correct];
    setGuesses(nextGuesses);

    if (correct) {
      const pair = puzzle.pairs.find((p) => p.id === first.pairId);
      const nextMatched = [...matchedPairIds, first.pairId];
      setMatchedPairIds(nextMatched);
      onProgress(buildRecord(nextGuesses, nextMatched));

      navigator.vibrate?.([50, 30, 50]);
      setCorrectCards([firstId, secondId]);
      setFeedback({ verse: pair?.verse ?? "", note: pair?.note ?? "" });
      setShowFeedback(true);
      setTimeout(() => {
        setRemovedPairIds((prev) => [...prev, first.pairId]);
        setCorrectCards([]);
      }, 400);
    } else {
      onProgress(buildRecord(nextGuesses, matchedPairIds));

      navigator.vibrate?.([30, 50, 30, 50, 30]);
      setIncorrectCards([firstId, secondId]);
      setRecentMiss(second.name);
      setTimeout(() => {
        setSelectedCards([]);
        setIncorrectCards([]);
      }, 600);
      setTimeout(() => setRecentMiss(null), 1200);
    }
  };

  const handleContinue = () => {
    setShowFeedback(false);
    setSelectedCards([]);
    if (isDone) onComplete(buildRecord(guesses, matchedPairIds));
  };

  return (
    <div className="min-h-screen bg-white p-3 md:p-6 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 space-y-4">
          {/* Title */}
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Bible Match #{puzzle.number}</p>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">{puzzle.theme}</h1>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Misses</p>
              <p className={cn("text-2xl font-bold", mistakes === 0 ? "text-success" : "text-foreground")}>
                {mistakes}
              </p>
              <span className="sr-only" aria-live="polite">
                {mistakes} {mistakes === 1 ? "miss" : "misses"}
              </span>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Find the {totalPairs} connections</span>
              <span>
                {matchedPairIds.length} of {totalPairs} found
              </span>
            </div>
            <Progress value={(matchedPairIds.length / totalPairs) * 100} className="h-3 bg-muted/40" />
            {guesses.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1" aria-hidden="true">
                {guesses.map((g, i) => (
                  <span
                    key={i}
                    className={cn("h-3 w-3 rounded-sm", g ? "bg-success" : "bg-destructive")}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Selection slots */}
          <div className="bg-white border border-border rounded-md p-4 shadow-[var(--shadow-soft)]">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-foreground">Choose a matching pair</div>
              {recentMiss && (
                <Badge variant="destructive" className="text-xs">
                  Not a match
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[0, 1].map((idx) => {
                const id = selectedCards[idx];
                const c = id ? allCards.find((x) => x.id === id) : undefined;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="text-xs font-medium text-center text-foreground">
                      {idx === 0 ? "FIRST" : "SECOND"}
                    </div>
                    <Card
                      className={cn(
                        "h-12 md:h-14 flex items-center justify-center border-2 transition-all px-2 text-center",
                        idx === 0 ? "border-primary/60 bg-primary/5" : "border-secondary/60 bg-secondary/5",
                        c && "shadow-[var(--shadow-elevated)]"
                      )}
                    >
                      <span className={cn("text-base md:text-lg font-medium", c && "animate-fade-scale-in")}>
                        {c ? c.name : "Tap a card"}
                      </span>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {visibleCards.map((card) => (
            <MatchCard
              key={card.id}
              name={card.name}
              isSelected={selectedCards.includes(card.id)}
              isMatched={matchedPairIds.includes(card.pairId)}
              isCorrect={correctCards.includes(card.id)}
              isIncorrect={incorrectCards.includes(card.id)}
              onClick={() => handleCardClick(card.id)}
            />
          ))}
        </div>

        <FeedbackDialog
          isOpen={showFeedback}
          isCorrect
          verse={feedback.verse}
          note={feedback.note}
          onContinue={handleContinue}
        />
      </div>
    </div>
  );
};

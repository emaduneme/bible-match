import { useState, useEffect } from "react";
import { MatchCard } from "./MatchCard";
import { FeedbackDialog } from "./FeedbackDialog";
import { VictoryScreen } from "./VictoryScreen";
import { matchPairs, MatchPair } from "@/data/matchPairs";
import { getPairsForTheme, ThemeId } from "@/data/themes";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface GameBoardProps {
  onBackToHome: () => void;
  themeId?: ThemeId;
}

interface CardItem {
  id: string;
  name: string;
  pairId: number;
}

export const GameBoard = ({ onBackToHome, themeId }: GameBoardProps) => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState({ verse: "", note: "" });
  const [gameComplete, setGameComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [attemptsLeft, setAttemptsLeft] = useState(5);
  const [gamePairs, setGamePairs] = useState<MatchPair[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [recentMiss, setRecentMiss] = useState<string | null>(null);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    // Choose pairs by theme (or all), cap to 5
    const sourcePairs = themeId ? getPairsForTheme(themeId, matchPairs) : matchPairs;
    const shuffledPairs = [...sourcePairs].sort(() => Math.random() - 0.5).slice(0, 5);
    setGamePairs(shuffledPairs);

    const gameCards: CardItem[] = [];
    shuffledPairs.forEach((pair) => {
      gameCards.push(
        { id: `${pair.id}-a`, name: pair.a, pairId: pair.id },
        { id: `${pair.id}-b`, name: pair.b, pairId: pair.id }
      );
    });
    const shuffled = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setMatchedPairs([]);
    setSelectedCards([]);
    setScore(0);
    setGameComplete(false);
    setAttemptsLeft(Math.min(5, shuffledPairs.length || 5));
    setGameOver(false);
  };

  const handleCardClick = (cardId: string) => {
    const card = cards.find((c) => c.id === cardId);
    if (!card || matchedPairs.includes(card.pairId) || selectedCards.includes(cardId)) {
      return;
    }

    const newSelection = [...selectedCards, cardId];
    setSelectedCards(newSelection);

    if (newSelection.length === 2) {
      checkMatch(newSelection);
    }
  };

  const checkMatch = (selection: string[]) => {
    const [card1Id, card2Id] = selection;
    const card1 = cards.find((c) => c.id === card1Id);
    const card2 = cards.find((c) => c.id === card2Id);

    if (card1 && card2 && card1.pairId === card2.pairId) {
      // Correct match
      const pair = gamePairs.find((p) => p.id === card1.pairId) || matchPairs.find((p) => p.id === card1.pairId);
      if (pair) {
        setIsCorrect(true);
        setCurrentFeedback({ verse: pair.verse, note: pair.note });
        const newMatched = [...matchedPairs, card1.pairId];
        setMatchedPairs(newMatched);
        const newScore = score + 1;
        setScore(newScore);
        // Remove matched cards from the board
        setCards((prev) => prev.filter((c) => c.pairId !== card1.pairId));
        setShowFeedback(true);

        // Check if game is complete
        const totalPairs = gamePairs.length || 5;
        if (newMatched.length === totalPairs) {
          setTimeout(() => {
            setGameComplete(true);
          }, 1500);
        }
      }
    } else {
      // Incorrect match
      setIsCorrect(false);
      setCurrentFeedback({ verse: "", note: "" });
      const next = attemptsLeft - 1;
      setAttemptsLeft(next);
      setRecentMiss(card2?.name ?? null);
      // Briefly show selection then clear it and return cards to grid
      setTimeout(() => setSelectedCards([]), 600);
      setTimeout(() => setRecentMiss(null), 1200);
      if (next <= 0) {
        // Delay ending to let the dialog show briefly
        setTimeout(() => {
          setGameOver(true);
        }, 500);
      }
    }
  };

  const handleContinue = () => {
    setShowFeedback(false);
    setSelectedCards([]);
  };

  const handleRestart = () => {
    initializeGame();
  };

  const totalPairs = gamePairs.length || 5;
  const maxAttempts = Math.min(5, totalPairs);
  const progress = (matchedPairs.length / totalPairs) * 100;

  if (gameComplete) {
    return <VictoryScreen score={score} totalPairs={totalPairs} onRestart={handleRestart} theme={themeId} />;
  }

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-destructive/10 p-4 md:p-8 animate-fade-in">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-4xl font-bold text-destructive">Game Over</h1>
          <p className="text-muted-foreground">You've used all attempts. Try again!</p>
          <div className="text-2xl font-semibold">Score: {score} / {matchPairs.length}</div>
          <Button variant="hero" size="lg" onClick={handleRestart}>Restart</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 p-3 md:p-6 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 space-y-4">
            <div className="flex items-center justify-between">
            <Button variant="outline" onClick={onBackToHome} size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Score</p>
                <p className="text-2xl font-bold text-primary">{score} / {totalPairs}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progress</span>
              <span>{matchedPairs.length} of {totalPairs} matched</span>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Attempts</span>
                <div className="flex gap-1">
                  {Array.from({ length: maxAttempts }).map((_, i) => (
                    <Badge key={i} variant={i < attemptsLeft ? "default" : "secondary"} className="px-2">
                      {i < attemptsLeft ? "●" : "○"}
                    </Badge>
                  ))}
                </div>
              </div>
              <span className="sr-only" aria-live="polite">Attempts left: {attemptsLeft}</span>
              <div className="text-sm text-muted-foreground">Pairs this game: {totalPairs}</div>
            </div>
          </div>
          {/* Selection box at the top with two slots */}
          <div className="bg-accent/10 border border-accent/30 rounded-md p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-foreground">Choose a matching pair</div>
              {recentMiss && (
                <Badge variant="destructive" className="text-xs">{recentMiss} returned</Badge>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[0,1].map((idx) => {
                const id = selectedCards[idx];
                const c = id ? cards.find((x) => x.id === id) : undefined;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="text-xs font-medium text-center" style={{ color: idx === 0 ? "hsl(42 78% 55%)" : "hsl(210 55% 70%)" }}>
                      {idx === 0 ? "FIRST" : "SECOND"}
                    </div>
                    <Card className={cn(
                      "h-14 md:h-16 flex items-center justify-center border-2 transition-all",
                      idx === 0 ? "border-primary/60 bg-primary/5" : "border-secondary/60 bg-secondary/5",
                      c && "shadow-[var(--shadow-elevated)]"
                    )}>
                      <span className={cn("text-base md:text-lg font-medium", c && "animate-fade-scale-in")}>
                        {c ? c.name : "—"}
                      </span>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {cards.map((card) => (
            <MatchCard
              key={card.id}
              name={card.name}
              isSelected={selectedCards.includes(card.id)}
              isMatched={matchedPairs.includes(card.pairId)}
              onClick={() => handleCardClick(card.id)}
            />
          ))}
        </div>

        <FeedbackDialog
          isOpen={showFeedback}
          isCorrect={isCorrect}
          verse={currentFeedback.verse}
          note={currentFeedback.note}
          onContinue={handleContinue}
        />
      </div>
    </div>
  );
};

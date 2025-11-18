import { useState, useEffect, useCallback, useMemo } from "react";
import { MatchCard } from "./MatchCard";
import { FeedbackDialog } from "./FeedbackDialog";
import { VictoryScreen } from "./VictoryScreen";
import { MatchPair } from "@/data/matchPairs";
import { getTier, getNextTier, ThemeId, TierId } from "@/data/themesWithTiers";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  getRecentTierIds,
  loadTierHistory,
  recordTierHistory,
  saveTierHistory,
  TierHistoryMap,
} from "@/lib/tierHistory";

interface GameBoardProps {
  onBackToHome: () => void;
  themeId?: ThemeId;
  tierId?: TierId;
  onSelectTier?: (themeId: ThemeId, tierId: TierId) => void;
  onTierComplete?: (themeId: ThemeId, tierId: TierId, nextTierId?: TierId) => void;
}

interface CardItem {
  id: string;
  name: string;
  pairId: number;
}

export const GameBoard = ({ onBackToHome, themeId, tierId, onSelectTier, onTierComplete }: GameBoardProps) => {
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
  const [incorrectCards, setIncorrectCards] = useState<string[]>([]);
  const [correctCards, setCorrectCards] = useState<string[]>([]);
  const [activeThemeId, setActiveThemeId] = useState<ThemeId | undefined>(themeId);
  const [activeTierId, setActiveTierId] = useState<TierId | undefined>(tierId);
  const [activeCombo, setActiveCombo] = useState(() => getTier(themeId, tierId));

  useEffect(() => {
    setActiveThemeId(themeId);
    setActiveTierId(tierId);
    setActiveCombo(getTier(themeId, tierId));
  }, [themeId, tierId]);

  const selectPairsForTier = useCallback((): MatchPair[] => {
    if (!activeCombo || !activeThemeId || !activeTierId) return [];
    const pool = activeCombo.tier.pairs;
    if (pool.length === 0) return [];
    const poolIds = new Set(pool.map((pair) => pair.id));
    
    // Load fresh history from storage to avoid circular dependency
    const currentHistory = loadTierHistory();
    const recent = getRecentTierIds(currentHistory, activeThemeId, activeTierId).filter((id) =>
      poolIds.has(id)
    );
    const available = pool.filter((pair) => !recent.includes(pair.id));
    const workingPool =
      available.length >= activeCombo.tier.pairCount ? available : [...pool];
    const shuffled = [...workingPool].sort(() => Math.random() - 0.5);
    const selection = shuffled.slice(0, activeCombo.tier.pairCount);
    
    // Record history and save immediately
    const updatedHistory = recordTierHistory(
      currentHistory,
      activeThemeId,
      activeTierId,
      selection.map((pair) => pair.id),
      pool.length
    );
    saveTierHistory(updatedHistory);
    
    return selection;
  }, [activeCombo, activeThemeId, activeTierId]);

  const initializeGame = useCallback(() => {
    if (!activeCombo) return;
    const sourcePairs = selectPairsForTier();
    if (sourcePairs.length === 0) return;
    
    // Store the selected pairs for the game logic
    setGamePairs(sourcePairs);
    
    const gameCards: CardItem[] = [];
    sourcePairs.forEach((pair) => {
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
    setAttemptsLeft(activeCombo.tier.maxLives);
    setGameOver(false);
  }, [activeCombo, selectPairsForTier]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const nextTier = useMemo(() => {
    if (!activeThemeId || !activeTierId) return undefined;
    return getNextTier(activeThemeId, activeTierId);
  }, [activeThemeId, activeTierId]);

  const handleCardClick = (cardId: string) => {
    const card = cards.find((c) => c.id === cardId);
    if (!card || matchedPairs.includes(card.pairId)) {
      return;
    }

    // Allow deselection: if card is already selected, remove it
    if (selectedCards.includes(cardId)) {
      setSelectedCards(selectedCards.filter((id) => id !== cardId));
      return;
    }

    // Add vibration feedback on mobile (if supported)
    if (navigator.vibrate) {
      navigator.vibrate(10); // Short, subtle vibration
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
      const pair = gamePairs.find((p) => p.id === card1.pairId);
      if (pair) {
        // Vibration feedback for success
        if (navigator.vibrate) {
          navigator.vibrate([50, 30, 50]); // Double pulse for success
        }
        
        // Visual feedback: mark cards as correct
        setCorrectCards([card1Id, card2Id]);
        
        setIsCorrect(true);
        setCurrentFeedback({ verse: pair.verse, note: pair.note });
        const newMatched = [...matchedPairs, card1.pairId];
        setMatchedPairs(newMatched);
        const newScore = score + 1;
        setScore(newScore);
        
        // Remove matched cards from the board after animation
        setTimeout(() => {
          setCards((prev) => prev.filter((c) => c.pairId !== card1.pairId));
          setCorrectCards([]);
        }, 400);
        
        setShowFeedback(true);

        // Check if game is complete
        const totalPairs = gamePairs.length || 5;
        if (newMatched.length === totalPairs) {
          if (activeThemeId && activeTierId) {
            const upcomingTier = getNextTier(activeThemeId, activeTierId);
            onTierComplete?.(activeThemeId, activeTierId, upcomingTier?.id);
          }
          setTimeout(() => {
            setGameComplete(true);
          }, 1500);
        }
      }
    } else {
      // Incorrect match
      // Vibration feedback for error
      if (navigator.vibrate) {
        navigator.vibrate([30, 50, 30, 50, 30]); // Triple short pulse for error
      }
      
      // Visual feedback: mark cards as incorrect
      setIncorrectCards([card1Id, card2Id]);
      
      setIsCorrect(false);
      setCurrentFeedback({ verse: "", note: "" });
      const next = attemptsLeft - 1;
      setAttemptsLeft(next);
      setRecentMiss(card2?.name ?? null);
      
      // Briefly show selection then clear it and return cards to grid
      setTimeout(() => {
        setSelectedCards([]);
        setIncorrectCards([]);
      }, 600);
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
  const maxAttempts = activeCombo?.tier.maxLives ?? Math.min(5, totalPairs);
  const progress = (matchedPairs.length / totalPairs) * 100;

  const handleBackClick = () => {
    const hasProgress = matchedPairs.length > 0 || selectedCards.length > 0;
    if (!hasProgress || window.confirm("Leave game? Your current progress will be lost.")) {
      onBackToHome();
    }
  };

  const handleSelectNextTier = (nextTierId: TierId) => {
    if (!activeThemeId) return;
    onSelectTier?.(activeThemeId, nextTierId);
    setShowFeedback(false);
    setGameComplete(false);
    setActiveTierId(nextTierId);
    setActiveCombo(getTier(activeThemeId, nextTierId));
  };

  if (!activeCombo) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <p className="text-lg text-muted-foreground">Select a theme and tier to start playing.</p>
          <Button onClick={onBackToHome}>Back to home</Button>
        </div>
      </div>
    );
  }

  if (gameComplete) {
    return (
      <VictoryScreen
        score={score}
        totalPairs={totalPairs}
        onRestart={handleRestart}
        theme={activeCombo.theme.title}
        nextTierLabel={nextTier ? `Continue to ${nextTier.label}` : undefined}
        onSelectNextTier={nextTier ? () => handleSelectNextTier(nextTier.id) : undefined}
        onSelectAnotherTheme={onBackToHome}
      />
    );
  }

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-destructive/10 p-4 md:p-8 animate-fade-in">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-4xl font-bold text-destructive">Game Over</h1>
          <p className="text-muted-foreground">You've used all attempts. Try again!</p>
          <div className="text-2xl font-semibold">Score: {score} / {totalPairs}</div>
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
            <Button variant="outline" onClick={handleBackClick} size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Score</p>
                <p className="text-2xl font-bold text-primary">{score} / {totalPairs}</p>
            </div>
          </div>
          {activeCombo && (
            <div className="flex flex-wrap items-center justify-between rounded-md border border-border/60 bg-card/30 px-3 py-2">
              <div>
                <p className="text-sm font-semibold text-foreground">{activeCombo.theme.title}</p>
                <p className="text-xs text-muted-foreground">{activeCombo.theme.description}</p>
              </div>
              <Badge variant="secondary" aria-label={activeCombo.tier.label}>
                {activeCombo.tier.label}
              </Badge>
            </div>
          )}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progress</span>
              <span>{matchedPairs.length} of {totalPairs} matched</span>
            </div>
            <Progress value={progress} className="h-3 bg-muted/40" />
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Lives remaining</span>
                <div className="flex gap-1">
                  {Array.from({ length: maxAttempts }).map((_, i) => (
                    <Badge key={i} variant={i < attemptsLeft ? "default" : "secondary"} className="px-2">
                      {i < attemptsLeft ? "●" : "○"}
                    </Badge>
                  ))}
                </div>
              </div>
              <span className="sr-only" aria-live="polite">Lives remaining: {attemptsLeft}</span>
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
                    <div className="text-xs font-medium text-center text-foreground">
                      {idx === 0 ? "FIRST" : "SECOND"}
                    </div>
                    <Card className={cn(
                      "h-12 md:h-14 flex items-center justify-center border-2 transition-all",
                      idx === 0 ? "border-primary/60 bg-primary/5" : "border-secondary/60 bg-secondary/5",
                      c && "shadow-[var(--shadow-elevated)]"
                    )}>
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

        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {cards.map((card) => (
            <MatchCard
              key={card.id}
              name={card.name}
              isSelected={selectedCards.includes(card.id)}
              isMatched={matchedPairs.includes(card.pairId)}
              isCorrect={correctCards.includes(card.id)}
              isIncorrect={incorrectCards.includes(card.id)}
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

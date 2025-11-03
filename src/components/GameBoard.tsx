import { useState, useEffect } from "react";
import { MatchCard } from "./MatchCard";
import { FeedbackDialog } from "./FeedbackDialog";
import { VictoryScreen } from "./VictoryScreen";
import { matchPairs, MatchPair } from "@/data/matchPairs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";

interface GameBoardProps {
  onBackToHome: () => void;
}

interface CardItem {
  id: string;
  name: string;
  pairId: number;
}

export const GameBoard = ({ onBackToHome }: GameBoardProps) => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState({ verse: "", note: "" });
  const [gameComplete, setGameComplete] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const gameCards: CardItem[] = [];
    matchPairs.forEach((pair) => {
      gameCards.push(
        { id: `${pair.id}-a`, name: pair.a, pairId: pair.id },
        { id: `${pair.id}-b`, name: pair.b, pairId: pair.id }
      );
    });
    // Shuffle cards
    const shuffled = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setMatchedPairs([]);
    setSelectedCards([]);
    setScore(0);
    setGameComplete(false);
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
      const pair = matchPairs.find((p) => p.id === card1.pairId);
      if (pair) {
        setIsCorrect(true);
        setCurrentFeedback({ verse: pair.verse, note: pair.note });
        setMatchedPairs([...matchedPairs, card1.pairId]);
        setScore(score + 1);
        setShowFeedback(true);

        // Check if game is complete
        if (matchedPairs.length + 1 === matchPairs.length) {
          setTimeout(() => {
            setGameComplete(true);
          }, 1500);
        }
      }
    } else {
      // Incorrect match
      setIsCorrect(false);
      setCurrentFeedback({ verse: "", note: "" });
      setShowFeedback(true);
    }
  };

  const handleContinue = () => {
    setShowFeedback(false);
    setSelectedCards([]);
  };

  const handleRestart = () => {
    initializeGame();
  };

  const progress = (matchedPairs.length / matchPairs.length) * 100;

  if (gameComplete) {
    return <VictoryScreen score={score} totalPairs={matchPairs.length} onRestart={handleRestart} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 p-4 md:p-8 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={onBackToHome} size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Score</p>
              <p className="text-2xl font-bold text-primary">{score} / {matchPairs.length}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progress</span>
              <span>{matchedPairs.length} of {matchPairs.length} matched</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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

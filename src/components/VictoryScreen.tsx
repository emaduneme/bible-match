import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy } from "lucide-react";

interface VictoryScreenProps {
  score: number;
  totalPairs: number;
  onRestart: () => void;
}

export const VictoryScreen = ({ score, totalPairs, onRestart }: VictoryScreenProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5 animate-fade-in">
      <Card className="max-w-lg w-full p-8 text-center space-y-6 shadow-[var(--shadow-elevated)]">
        <div className="flex justify-center">
          <Trophy className="h-24 w-24 text-primary animate-bounce-subtle" />
        </div>
        <h1 className="text-4xl font-bold text-foreground">Congratulations!</h1>
        <div className="space-y-2">
          <p className="text-xl text-muted-foreground">
            You've completed all the matches!
          </p>
          <p className="text-3xl font-bold text-primary">
            {score} / {totalPairs} Correct
          </p>
        </div>
        <div className="pt-4 space-y-2">
          <p className="text-sm italic text-muted-foreground">
            "For the Lord gives wisdom; from his mouth come knowledge and understanding."
          </p>
          <p className="text-xs text-muted-foreground">— Proverbs 2:6</p>
        </div>
        <Button variant="hero" size="lg" onClick={onRestart} className="w-full">
          Play Again
        </Button>
      </Card>
    </div>
  );
};

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, Share2 } from "lucide-react";
import { saveGameResult, getStats, getShareText } from "@/lib/storage";
import { useEffect, useState } from "react";

interface VictoryScreenProps {
  score: number;
  totalPairs: number;
  onRestart: () => void;
  theme?: string;
  nextTierLabel?: string;
  onSelectNextTier?: () => void;
  onSelectAnotherTheme?: () => void;
}

export const VictoryScreen = ({
  score,
  totalPairs,
  onRestart,
  theme = "Mixed",
  nextTierLabel,
  onSelectNextTier,
  onSelectAnotherTheme,
}: VictoryScreenProps) => {
  const [stats, setStats] = useState(getStats());

  useEffect(() => {
    saveGameResult(score === totalPairs);
    setStats(getStats());
  }, [score, totalPairs]);

  const handleShare = async () => {
    const text = getShareText(score, totalPairs, theme);
    if (navigator.share) {
      await navigator.share({ text });
    } else {
      await navigator.clipboard.writeText(text);
      alert("Results copied to clipboard!");
    }
  };
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
        <div className="pt-2 space-y-1 text-sm text-muted-foreground">
          <div>{stats.streak} day streak</div>
          <div>{stats.gamesWon}/{stats.gamesPlayed} wins</div>
        </div>
        <div className="flex flex-col gap-3">
          {nextTierLabel && (
            <Button variant="hero" size="lg" onClick={onSelectNextTier}>
              {nextTierLabel}
            </Button>
          )}
          <div className="flex gap-2">
            <Button variant="outline" size="lg" onClick={handleShare} className="flex-1">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="secondary" size="lg" onClick={onRestart} className="flex-1">
              Replay tier
            </Button>
          </div>
        </div>
        {(onSelectAnotherTheme || !nextTierLabel) && (
          <div className="pt-4 space-y-3">
            <Button variant="ghost" onClick={onSelectAnotherTheme}>
              Choose another theme
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

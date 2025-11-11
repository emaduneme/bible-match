import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MatchCardProps {
  name: string;
  isSelected: boolean;
  isMatched: boolean;
  isCorrect?: boolean;
  isIncorrect?: boolean;
  onClick: () => void;
}

export const MatchCard = ({ name, isSelected, isMatched, isCorrect, isIncorrect, onClick }: MatchCardProps) => {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "p-5 md:p-6 cursor-pointer transition-all duration-300 text-center font-semibold text-base md:text-lg",
        "hover:scale-105 hover:shadow-[var(--shadow-elevated)] active:scale-95",
        "bg-gradient-to-br from-card to-card/90 border-2",
        isMatched && "opacity-50 cursor-not-allowed bg-success/10 border-success",
        isSelected && !isMatched && !isCorrect && !isIncorrect && "border-primary shadow-[var(--shadow-elevated)] scale-105 bg-primary/5 -translate-y-1 animate-move-up",
        isCorrect && "border-success bg-success/20 animate-pulse-success",
        isIncorrect && "border-destructive bg-destructive/10 animate-shake-soft",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      )}
      role="button"
      tabIndex={isMatched ? -1 : 0}
      aria-pressed={isSelected}
      aria-disabled={isMatched}
      onKeyDown={(e) => {
        if (isMatched) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {name}
    </Card>
  );
};

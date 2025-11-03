import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MatchCardProps {
  name: string;
  isSelected: boolean;
  isMatched: boolean;
  onClick: () => void;
}

export const MatchCard = ({ name, isSelected, isMatched, onClick }: MatchCardProps) => {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "p-6 cursor-pointer transition-all duration-300 text-center font-semibold text-lg",
        "hover:scale-105 hover:shadow-[var(--shadow-elevated)] active:scale-95",
        "bg-gradient-to-br from-card to-card/90 border-2",
        isMatched && "opacity-50 cursor-not-allowed bg-success/10 border-success",
        isSelected && !isMatched && "border-primary shadow-[var(--shadow-elevated)] scale-105 bg-primary/5"
      )}
    >
      {name}
    </Card>
  );
};

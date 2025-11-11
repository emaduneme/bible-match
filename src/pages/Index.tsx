import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GameBoard } from "@/components/GameBoard";
import { Book } from "lucide-react";
import { getThemesWithPairs, ThemeId } from "@/data/themes";
import { matchPairs } from "@/data/matchPairs";
import { cn } from "@/lib/utils";

const Index = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<ThemeId | null>(null);

  if (gameStarted) {
    return <GameBoard onBackToHome={() => setGameStarted(false)} themeId={selectedTheme ?? undefined} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-3 md:p-4 animate-fade-in">
      <div className="max-w-4xl w-full space-y-10 md:space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="flex justify-center mb-4">
            <div className="p-6 bg-gradient-to-br from-primary to-accent rounded-full shadow-[var(--shadow-elevated)]">
              <Book className="h-16 w-16 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
            Bible Match
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Test Your Knowledge of Biblical Connections
          </p>
        </div>

        {/* Description Card */}
        <Card className="p-8 shadow-[var(--shadow-elevated)] bg-gradient-to-br from-card to-card/90">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground text-center">
              How to Play
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <h3 className="font-semibold text-foreground">Select Cards</h3>
                <p className="text-sm text-muted-foreground">
                  Click on two cards to form a pair
                </p>
              </div>
              <div className="text-center space-y-3">
                <h3 className="font-semibold text-foreground">Find Matches</h3>
                <p className="text-sm text-muted-foreground">
                  Match biblical names, places, and events that are connected
                </p>
              </div>
              <div className="text-center space-y-3">
                <h3 className="font-semibold text-foreground">Learn Scripture</h3>
                <p className="text-sm text-muted-foreground">
                  Discover the story behind each connection with verse references
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Theme picker */}
        <Card className="p-6 bg-gradient-to-br from-card to-card/90 shadow-[var(--shadow-elevated)]">
          <h2 className="text-xl font-semibold mb-4">Choose a Theme</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {getThemesWithPairs(matchPairs).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedTheme(t.id)}
                className={cn(
                  "text-left rounded-md border bg-card p-4 transition-[var(--transition-smooth)] hover:shadow-[var(--shadow-elevated)]",
                  selectedTheme === t.id && "ring-2 ring-primary"
                )}
              >
                <div className="font-semibold">{t.title}</div>
                <div className="text-sm text-muted-foreground">{t.description}</div>
              </button>
            ))}
          </div>
        </Card>

        {/* CTA Button */}
        <div className="text-center space-y-4">
          <Button
            variant="hero"
            size="lg"
            onClick={() => setGameStarted(true)}
            className="px-12 py-6 text-lg"
            disabled={!selectedTheme}
          >
            Start Playing
          </Button>
          <p className="text-sm text-muted-foreground italic">
            "Study to show thyself approved" — 2 Timothy 2:15
          </p>
        </div>

        {/* Footer */}
        <footer className="text-center py-6 text-sm text-muted-foreground border-t border-border/50">
          2025
        </footer>
      </div>
    </div>
  );
};

export default Index;

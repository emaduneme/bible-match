import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GameBoard } from "@/components/GameBoard";
import { Book } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getThemes, ThemeId, TierId } from "@/data/themesWithTiers";
import {
  loadProgress,
  saveProgress,
  unlockTierProgress,
  isTierUnlocked,
  ThemeProgressMap,
} from "@/lib/progress";

const Index = () => {
  const themes = useMemo(() => getThemes(), []);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedThemeId, setSelectedThemeId] = useState<ThemeId | null>(null);
  const [selectedTierId, setSelectedTierId] = useState<TierId | null>(null);
  const [progress, setProgress] = useState<ThemeProgressMap>(() => loadProgress(themes));

  const selectedTheme = useMemo(
    () => themes.find((theme) => theme.id === selectedThemeId) ?? null,
    [themes, selectedThemeId]
  );

  useEffect(() => {
    setProgress(loadProgress(themes));
  }, [themes]);

  useEffect(() => {
    if (!selectedTheme) return;
    const unlockedTiers = progress[selectedTheme.id] ?? [];
    const fallbackTierId =
      unlockedTiers.find((tier) => selectedTheme.tiers.some((t) => t.id === tier)) ??
      selectedTheme.tiers[0]?.id ??
      null;
    if (!fallbackTierId) {
      setSelectedTierId(null);
      return;
    }
    if (!selectedTierId || !unlockedTiers.includes(selectedTierId)) {
      setSelectedTierId(fallbackTierId);
    }
  }, [selectedTheme, selectedTierId, progress]);

  const handleTierComplete = (theme: ThemeId, tier: TierId, nextTier?: TierId) => {
    setProgress((prev) => {
      let updated = unlockTierProgress(prev, theme, tier);
      updated = unlockTierProgress(updated, theme, nextTier);
      saveProgress(updated);
      return updated;
    });
  };

  const canStartGame =
    !!selectedThemeId &&
    !!selectedTierId &&
    isTierUnlocked(progress, selectedThemeId, selectedTierId as TierId);

  if (gameStarted && canStartGame) {
    return (
      <GameBoard
        onBackToHome={() => {
          setGameStarted(false);
        }}
        themeId={selectedThemeId}
        tierId={selectedTierId as TierId}
        onSelectTier={(themeId, tierId) => {
          setSelectedThemeId(themeId);
          setSelectedTierId(tierId);
        }}
        onTierComplete={handleTierComplete}
      />
    );
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
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-semibold">Choose a Theme</h2>
            <p className="text-sm text-muted-foreground">Each theme contains tiered decks (Yellow → Blue).</p>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {themes.map((theme) => {
              const isSelected = selectedThemeId === theme.id;
              const unlockedTiers = progress[theme.id] ?? [];
              const defaultTier = unlockedTiers[0] ?? theme.tiers[0]?.id ?? null;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => {
                    setSelectedThemeId(theme.id);
                    setSelectedTierId(defaultTier);
                  }}
                  className={cn(
                    "text-left rounded-md border bg-card/80 p-4 transition-[var(--transition-smooth)] hover:shadow-[var(--shadow-elevated)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    isSelected && "ring-2 ring-primary"
                  )}
                  aria-pressed={isSelected}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-semibold text-foreground">{theme.title}</div>
                    <Badge variant="secondary">{theme.tiers.length} tiers</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{theme.description}</p>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Tier picker */}
        {selectedTheme && (
          <Card className="p-6 bg-gradient-to-br from-card to-card/90 shadow-[var(--shadow-elevated)]">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold">Choose a Tier</h2>
              <p className="text-sm text-muted-foreground">
                Start with Yellow for a warm-up, then climb toward the hidden gems in Blue.
              </p>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {selectedTheme.tiers.map((tier) => {
                const isSelected = selectedTierId === tier.id;
                const unlocked = isTierUnlocked(progress, selectedTheme.id, tier.id);
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => unlocked && setSelectedTierId(tier.id)}
                    disabled={!unlocked}
                    className={cn(
                      "text-left rounded-md border bg-card p-4 transition-[var(--transition-smooth)] hover:shadow-[var(--shadow-elevated)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 disabled:cursor-not-allowed",
                      isSelected && "ring-2 ring-primary"
                    )}
                    aria-pressed={isSelected}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-foreground">{tier.label}</div>
                      <Badge variant="secondary">
                        {unlocked ? tier.difficulty : "Locked"}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {tier.pairCount} pairs • {tier.maxLives} lives
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        )}

        {/* CTA Button */}
        <div className="text-center space-y-4">
          <Button
            variant="hero"
            size="lg"
            onClick={() => setGameStarted(true)}
            className="px-12 py-6 text-lg"
            disabled={!canStartGame}
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

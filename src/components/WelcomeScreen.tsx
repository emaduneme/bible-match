import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Book, User, ArrowRight } from "lucide-react";
import { setPlayerName, setGuestMode } from "@/lib/player";

interface WelcomeScreenProps {
  onComplete: () => void;
}

export const WelcomeScreen = ({ onComplete }: WelcomeScreenProps) => {
  const [name, setName] = useState("");

  const handleStartPlaying = () => {
    if (name.trim()) {
      setPlayerName(name.trim());
    } else {
      setGuestMode();
    }
    onComplete();
  };

  const handleSkipAsGuest = () => {
    setGuestMode();
    onComplete();
  };

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-5 bg-primary rounded-full shadow-[var(--shadow-elevated)]">
              <Book className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Bible Match</h1>
          <p className="text-muted-foreground">
            One Bible puzzle a day. Same puzzle for everyone.
          </p>
        </div>

        {/* Welcome Card */}
        <Card className="p-6 bg-white shadow-[var(--shadow-elevated)]">
          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground text-center">
                How to play
              </h2>
              <ol className="space-y-2 text-sm text-muted-foreground list-decimal pl-5">
                <li>You get 8 cards. They make 4 pairs that belong together.</li>
                <li>Tap two cards to make a guess. Tap a card again to undo it.</li>
                <li>Find all 4 pairs. The fewer misses, the better your score.</li>
                <li>Share your result. Come back tomorrow for a new puzzle.</li>
              </ol>
            </div>

            {/* Name Input */}
            <div className="space-y-2">
              <label
                htmlFor="player-name"
                className="text-sm font-medium text-foreground"
              >
                What should we call you? (optional)
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="player-name"
                  type="text"
                  placeholder="e.g. David"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleStartPlaying()}
                  className="pl-10 h-12 bg-white border-border"
                />
              </div>
            </div>

            {/* Start Button */}
            <Button
              variant="hero"
              size="lg"
              className="w-full h-12"
              onClick={handleStartPlaying}
            >
              Start Playing
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            {/* Skip Link */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleSkipAsGuest}
                className="text-sm text-muted-foreground underline hover:text-foreground transition-colors"
              >
                Skip and play as Guest
              </button>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <footer className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Bible Match
        </footer>
      </div>
    </div>
  );
};


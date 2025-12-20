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
            Test Your Knowledge of Biblical Connections
          </p>
        </div>

        {/* Welcome Card */}
        <Card className="p-6 bg-white shadow-[var(--shadow-elevated)]">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-foreground">
                Welcome, Player!
              </h2>
              <p className="text-sm text-muted-foreground">
                Enter your name to track your progress and high scores.
              </p>
            </div>

            {/* Name Input */}
            <div className="space-y-2">
              <label
                htmlFor="player-name"
                className="text-sm font-medium text-foreground"
              >
                Your Name
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
          © 2023 Bible Match. All rights reserved.
        </footer>
      </div>
    </div>
  );
};


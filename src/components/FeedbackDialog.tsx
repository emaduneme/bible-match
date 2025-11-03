import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";

interface FeedbackDialogProps {
  isOpen: boolean;
  isCorrect: boolean;
  verse: string;
  note: string;
  onContinue: () => void;
}

export const FeedbackDialog = ({
  isOpen,
  isCorrect,
  verse,
  note,
  onContinue,
}: FeedbackDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onContinue}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            {isCorrect ? (
              <>
                <CheckCircle2 className="h-8 w-8 text-success" />
                <span>Perfect Match!</span>
              </>
            ) : (
              <>
                <XCircle className="h-8 w-8 text-destructive" />
                <span>Not Quite...</span>
              </>
            )}
          </DialogTitle>
          <DialogDescription className="space-y-4 pt-4">
            {isCorrect ? (
              <>
                <p className="text-base font-medium text-foreground">{note}</p>
                <p className="text-sm text-muted-foreground italic">— {verse}</p>
              </>
            ) : (
              <p className="text-base text-foreground">
                These two don't match. Try selecting a different pair!
              </p>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center pt-2">
          <Button variant={isCorrect ? "success" : "default"} onClick={onContinue} size="lg">
            {isCorrect ? "Continue" : "Try Again"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

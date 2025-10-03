import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TransactionStatusProps {
  isVisible: boolean;
  onComplete: () => void;
}

export const TransactionStatus = ({
  isVisible,
  onComplete,
}: TransactionStatusProps) => {
  const [status, setStatus] = useState<"processing" | "confirming" | "success">(
    "processing"
  );
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const timer1 = setTimeout(() => {
      setStatus("confirming");
      setProgress(50);
    }, 1500);

    const timer2 = setTimeout(() => {
      setStatus("success");
      setProgress(100);
    }, 3000);

    const timer3 = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-surface rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center space-y-4">
          {status === "processing" && (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto" />
              <h3 className="text-lg font-semibold">Processing Transaction</h3>
              <p className="text-muted-foreground">
                Connecting to Lightning Network...
              </p>
            </>
          )}

          {status === "confirming" && (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-orange-500 mx-auto" />
              <h3 className="text-lg font-semibold">Generating Address</h3>
              <p className="text-muted-foreground">
                Creating payment address...
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <h3 className="text-lg font-semibold">Transaction Successful!</h3>
              <p className="text-muted-foreground">
                Payment confirmed and processed
              </p>
            </>
          )}

          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-success h-2 rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionStatus;

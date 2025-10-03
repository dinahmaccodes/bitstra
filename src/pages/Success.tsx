import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    type,
    recipient,
    amount,
    details,
    provider,
    customerEmail,
    paymentHash,
    invoiceId,
    paidAt,
  } = location.state || {};

  const getProductName = () => {
    switch (type) {
      case "airtime":
        return "Airtime";
      case "data":
        return "Data Bundle";
      case "utility":
        return "Utility Bill";
      default:
        return "Payment";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface rounded-2xl shadow-lg p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Payment Successful
          </h1>
          <p className="text-muted-foreground">
            Your {getProductName().toLowerCase()} purchase has been completed.
          </p>
        </div>

        <div className="space-y-3 mb-6 text-left">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Service:</span>
            <span className="font-medium">{getProductName()}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {type === "utility" ? "Meter:" : "Number:"}
            </span>
            <span className="font-medium">{recipient}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Provider:</span>
            <span className="font-medium">{provider}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount:</span>
            <span className="font-medium">₦{amount?.toLocaleString()}</span>
          </div>

          {customerEmail && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Receipt sent to:</span>
              <span className="font-medium text-xs">{customerEmail}</span>
            </div>
          )}

          {details && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Details:</span>
              <span className="font-medium">{details}</span>
            </div>
          )}

          {paidAt && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Paid at:</span>
              <span className="font-medium text-xs">{formatDate(paidAt)}</span>
            </div>
          )}

          {paymentHash && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Hash:</span>
              <span className="font-mono text-xs">
                {paymentHash.substring(0, 8)}...
              </span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <Button className="w-full" onClick={() => navigate("/")}>
            Back to Home
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate(-2)}
          >
            Make Another Payment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Success;

import { useLocation, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const Confirm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { type, recipient, amount, details, provider } = location.state || {};

  // Handle missing data
  if (!type || !recipient || !amount) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Payment data not found</h2>
          <p className="text-muted-foreground mb-4">
            Please return to the previous page and try again.
          </p>
          <Button onClick={() => navigate(-1)}>Go back</Button>
        </div>
      </div>
    );
  }

  // Corrected calculation: 100,000 Satoshi = 176,143 Nigerian Naira
  // So 1 Naira = 0.5677 Satoshi (approximately)
  const amountInSats = Math.floor(amount * 0.5677);
  const amountInUSD = (amount / 1481.21).toFixed(2);
  const fee = 4;
  const currentTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Mock QR data - in real app this would be the Lightning invoice
  const qrData = `lnbc${amountInSats}000m1p${type}_${amount}_${provider?.toLowerCase()}_${Date.now()}`;

  const getProductIcon = () => {
    switch (type) {
      case "airtime":
        return "📱";
      case "data":
        return "📶";
      case "utility":
        return "⚡";
      default:
        return "💳";
    }
  };

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

  const handleConfirm = () => {
    // In a real app, this would process the Lightning payment
    alert("Payment processing would start here!");
  };

  return (
    <div className="page-with-background">
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-4xl flex gap-8">
          {/* Left Side - Payment Details */}
          <div className="flex-1 bg-surface rounded-2xl shadow-lg p-8 z-10">
            <h1 className="text-2xl font-bold text-foreground mb-6">
              Make Payment
            </h1>

            {/* Product Info */}
            <div className="flex items-center gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
              <span className="text-3xl">{getProductIcon()}</span>
              <div>
                <h3 className="font-semibold">{getProductName()}</h3>
                <p className="text-sm text-muted-foreground">{provider}</p>
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-4 mb-6">
              {/* Recipient */}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {type === "utility" ? "Meter number" : "Recipient mobile"}
                </span>
                <span className="font-medium">{recipient}</span>
              </div>

              {/* Data Bundle / Details */}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {type === "data" ? "Data Bundle" : "Details"}
                </span>
                <span className="font-medium">{details}</span>
              </div>
            </div>

            {/* Amount Details */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-bold">${amountInUSD}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">SAT Amount:</span>
                <span className="font-bold">
                  {amountInSats.toLocaleString()} SAT
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Fee:</span>
                <span className="font-bold">{fee} SAT</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">BTC:</span>
                <span className="font-bold">₦173,899,297.19</span>
              </div>

              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Rate:</span>
                <span className="font-medium">$1 = ₦1,481.21</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">You will send:</span>
                <span className="font-bold">
                  {(amountInSats + fee).toLocaleString()} SAT
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">You'll Receive:</span>
                <span className="font-bold">₦{amount.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Time</span>
                <span className="font-bold">{currentTime}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <Button
                variant="success"
                className="flex-1 h-12"
                onClick={handleConfirm}
              >
                I've made payment
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-12"
                onClick={() => navigate(-1)}
              >
                Go back
              </Button>
            </div>
          </div>

          {/* Right Side - QR Code */}
          <div className="w-80 bg-surface rounded-2xl shadow-lg p-6 z-10">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Payment QR Code</h3>
              <div className="bg-white p-4 rounded-lg mb-4 inline-block">
                <QRCodeSVG
                  value={qrData}
                  size={200}
                  level="M"
                  includeMargin={true}
                  className="mx-auto"
                />
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Scan to make Payment in SAT
              </p>
              <p className="text-xs text-muted-foreground">
                {amountInSats.toLocaleString()} SAT
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirm;

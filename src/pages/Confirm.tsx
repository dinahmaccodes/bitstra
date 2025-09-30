import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Confirm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [useCashback, setUseCashback] = useState(false);
  
  const { type, recipient, amount, details, provider } = location.state || {};

  // Mock calculation
  const amountInSats = Math.floor(amount * 61);
  const amountInUSD = (amount / 1630).toFixed(2);
  const fee = 200;
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  // Mock QR data - in real app this would be the Lightning invoice
  const qrData = `lnbc${amountInSats}000m1pwjqwrzpp5mock_invoice_data_for_${type}_payment_${amount}_naira`;

  const getProductIcon = () => {
    switch (type) {
      case "airtime": return "📱";
      case "data": return "📶";
      case "utility": return "⚡";
      default: return "💳";
    }
  };

  const getProductName = () => {
    switch (type) {
      case "airtime": return "Airtime";
      case "data": return "Data Bundle";
      case "utility": return "Utility Bill";
      default: return "Payment";
    }
  };

  const handleConfirm = () => {
    // In a real app, this would process the Lightning payment
    alert("Payment processing would start here!");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex gap-8">
        {/* Left Side - Payment Details */}
        <div className="flex-1 bg-surface rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-foreground mb-6">Confirm</h1>
          
          <div className="space-y-4">
            {/* Product Name */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Product name</span>
              <div className="flex items-center gap-2">
                <span>{getProductIcon()}</span>
              </div>
            </div>

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

            {/* Use Cashback Toggle */}
            <div className="flex items-center justify-between py-2 border-b border-border">
              <Label htmlFor="cashback" className="text-muted-foreground">
                Use cashback (0.0)
              </Label>
              <Switch 
                id="cashback"
                checked={useCashback}
                onCheckedChange={setUseCashback}
              />
            </div>

            {/* Amount Details */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Amount(₦):</span>
                <span className="font-bold">₦{amount.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Amount(sats):</span>
                <span className="font-bold">{amountInSats.toLocaleString()} sats</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Amount($):</span>
                <span className="font-bold">${amountInUSD}</span>
              </div>
              
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Convert:</span>
                <span className="font-medium">100,000 satoshis ≈ ₦1,630.48</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">fee:</span>
                <span className="font-bold">{fee} sats</span>
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
                Confirm
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
        </div>

        {/* Right Side - QR Code */}
        <div className="w-80 bg-surface rounded-2xl shadow-lg p-6 flex items-center justify-center">
          <div className="text-center">
            <QRCodeSVG 
              value={qrData}
              size={250}
              level="M"
              includeMargin={true}
              className="mx-auto mb-4"
            />
            <p className="text-sm text-muted-foreground">
              Scan with your Lightning wallet
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirm;
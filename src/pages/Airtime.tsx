import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormCard from "@/components/FormCard";
import TopUpButton from "@/components/TopUpButton";
import TransactionStatus from "@/components/TransactionStatus";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Info } from "lucide-react";

const Airtime = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  // Handler to enforce max 10 digits and numeric only
  const handleMobileNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    if (value.length > 10) value = value.slice(0, 10);
    setMobileNumber(value);
  };
  const [countryCode, setCountryCode] = useState("+234");
  const [provider, setProvider] = useState("mtn");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTransactionStatus, setShowTransactionStatus] = useState(false);

  const topUpOptions = [
    { amount: 100 },
    { amount: 200 },
    { amount: 500 },
    { amount: 1000 },
    { amount: 2000 },
  ];

  // Load remembered data on mount
  useEffect(() => {
    const savedNumber = localStorage.getItem("savedMobileNumber");
    const savedCode = localStorage.getItem("savedCountryCode");
    const savedProv = localStorage.getItem("savedProvider");
    const savedEmail = localStorage.getItem("savedCustomerEmail");

    if (savedNumber) setMobileNumber(savedNumber);
    if (savedCode) setCountryCode(savedCode);
    if (savedProv) setProvider(savedProv);
    if (savedEmail) setCustomerEmail(savedEmail);
  }, []);

  const handleNext = async () => {
    const amount = selectedAmount || parseInt(customAmount);

    // Validation
    if (!mobileNumber || !amount || !customerEmail) {
      toast({
        title: "Missing Information",
        description:
          "Please enter a mobile number, email address, and select an amount",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    const minAmount = 50;
    const maxAmount = 250000;

    if (amount < minAmount || amount > maxAmount) {
      toast({
        title: "Invalid Amount",
        description: `Amount must be between ₦${minAmount.toLocaleString()} and ₦${maxAmount.toLocaleString()}`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setShowTransactionStatus(true);

    try {
      // Simulate transaction processing
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Show success message
      toast({
        title: "Transaction Successful",
        description: `Airtime of ₦${amount.toLocaleString()} sent to ${countryCode} ${mobileNumber}`,
        variant: "default",
      });

      // Navigate to payment page with transaction details
      navigate("/confirm", {
        state: {
          type: "airtime",
          recipient: `${countryCode} ${mobileNumber}`,
          amount: amount,
          details: "Airtime top-up",
          provider: provider,
          customerEmail: customerEmail,
          transactionId: `TXN-${Date.now()}`,
          status: "pending",
        },
      });

      // Save to remember me if checked
      if (rememberMe) {
        localStorage.setItem("savedMobileNumber", mobileNumber);
        localStorage.setItem("savedCountryCode", countryCode);
        localStorage.setItem("savedProvider", provider);
        localStorage.setItem("savedCustomerEmail", customerEmail);
      }
    } catch (error: unknown) {
      console.error("Airtime purchase error:", error);

      let errorMessage =
        "Failed to process airtime purchase. Please try again.";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      // Add helpful messages for common errors
      if (
        errorMessage.includes("insufficient") ||
        errorMessage.includes("balance")
      ) {
        errorMessage = "Insufficient balance. Please fund your wallet.";
      }

      toast({
        title: "Transaction Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setShowTransactionStatus(false);
    }
  };

  const handleTransactionComplete = () => {
    setShowTransactionStatus(false);
    setLoading(false);
  };

  return (
    <div className="page-with-background">
      <TransactionStatus
        isVisible={showTransactionStatus}
        onComplete={handleTransactionComplete}
      />
      <FormCard title="Airtime">
        <div className="space-y-6">
          {/* Asset Selection */}
          <div>
            <Label
              htmlFor="asset"
              className="text-sm font-medium text-foreground"
            >
              Asset
            </Label>
            <Input
              value="Bitcoin Lightning"
              readOnly
              className="mt-1 bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Provider Selection */}
          <div>
            <Label
              htmlFor="provider"
              className="text-sm font-medium text-foreground"
            >
              Network Provider
            </Label>
            <Select value={provider} onValueChange={setProvider}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mtn">MTN</SelectItem>
                <SelectItem value="glo">Glo</SelectItem>
                <SelectItem value="airtel">Airtel</SelectItem>
                <SelectItem value="9mobile">9Mobile</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mobile Number */}
          <div>
            <Label
              htmlFor="mobile"
              className="text-sm font-medium text-foreground"
            >
              Mobile Number
            </Label>
            <div className="flex mt-1 gap-2">
              <Select value={countryCode} onValueChange={setCountryCode}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="+234">+234</SelectItem>
                  <SelectItem value="+1">+1</SelectItem>
                  <SelectItem value="+44">+44</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="810000001"
                value={mobileNumber}
                onChange={handleMobileNumberChange}
                className="flex-1"
                type="tel"
                maxLength={10}
                inputMode="numeric"
                pattern="[0-9]{10}"
              />
            </div>
          </div>

          {/* Customer Email */}
          <div>
            <Label
              htmlFor="email"
              className="text-sm font-medium text-foreground"
            >
              Email Address
            </Label>
            <Input
              placeholder="your.email@example.com"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="mt-1"
              type="email"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Receipt will be sent to this email address
            </p>
          </div>

          {/* Top Up Options */}
          <div>
            <Label className="text-sm font-medium text-foreground">
              Top up
            </Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {topUpOptions.map((option) => (
                <TopUpButton
                  key={option.amount}
                  amount={option.amount}
                  selected={selectedAmount === option.amount}
                  onClick={() => {
                    setSelectedAmount(option.amount);
                    setCustomAmount("");
                  }}
                />
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div>
            <Label
              htmlFor="amount"
              className="text-sm font-medium text-foreground"
            >
              Custom Amount (₦50-₦250,000)
            </Label>
            <Input
              type="number"
              min={50}
              max={250000}
              placeholder="Enter custom amount"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setSelectedAmount(null);
              }}
              className="mt-2"
            />
          </div>

          {/* Remember Me */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            />
            <Label htmlFor="remember" className="text-sm text-muted-foreground">
              Remember me
            </Label>
          </div>

          {/* Next Button */}
          <Button
            variant="success"
            className="w-full h-12"
            onClick={handleNext}
            disabled={
              !mobileNumber || (!selectedAmount && !customAmount) || loading
            }
          >
            {loading ? "Processing..." : "Next"}
          </Button>
        </div>
      </FormCard>
    </div>
  );
};

export default Airtime;

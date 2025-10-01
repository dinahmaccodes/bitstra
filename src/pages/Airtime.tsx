import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormCard from "@/components/FormCard";
import TopUpButton from "@/components/TopUpButton";
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
import { buyAirtime, isSandboxMode, getWalletBalance } from "@/lib/bitnob";
import { useToast } from "@/hooks/use-toast";
import { Info } from "lucide-react";

const Airtime = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
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
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [checkingBalance, setCheckingBalance] = useState(false);

  const topUpOptions = [
    { amount: 100, cashback: "0.12Sats Cashback" },
    { amount: 200, cashback: "0.25Sats Cashback" },
    { amount: 500, cashback: "0.61Sats Cashback" },
    { amount: 1000, cashback: "1.23Sats Cashback" },
    { amount: 2000, cashback: "2.45Sats Cashback" },
  ];

  // Check wallet balance on mount (useful for sandbox testing)
  useEffect(() => {
    const checkBalance = async () => {
      if (isSandboxMode()) {
        setCheckingBalance(true);
        try {
          const balance = await getWalletBalance();
          setWalletBalance(balance?.data?.balance || 0);
        } catch (error) {
          console.warn("Could not fetch wallet balance:", error);
        } finally {
          setCheckingBalance(false);
        }
      }
    };

    checkBalance();
  }, []);

  // Load remembered data on mount
  useEffect(() => {
    const savedNumber = localStorage.getItem("savedMobileNumber");
    const savedCode = localStorage.getItem("savedCountryCode");
    const savedProv = localStorage.getItem("savedProvider");

    if (savedNumber) setMobileNumber(savedNumber);
    if (savedCode) setCountryCode(savedCode);
    if (savedProv) setProvider(savedProv);
  }, []);

  const handleNext = async () => {
    const amount = selectedAmount || parseInt(customAmount);

    // Validation
    if (!mobileNumber || !amount) {
      toast({
        title: "Missing Information",
        description: "Please enter a mobile number and select an amount",
        variant: "destructive",
      });
      return;
    }

    // In sandbox, we use smaller amounts for testing
    const minAmount = isSandboxMode() ? 50 : 50;
    const maxAmount = isSandboxMode() ? 50000 : 250000;

    if (amount < minAmount || amount > maxAmount) {
      toast({
        title: "Invalid Amount",
        description: `Amount must be between ₦${minAmount.toLocaleString()} and ₦${maxAmount.toLocaleString()}`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Remove country code prefix if present and format phone number
      const phoneNumber = mobileNumber.replace(/^0+/, "");
      const fullPhoneNumber =
        countryCode === "+234" ? phoneNumber : `${countryCode}${phoneNumber}`;

      console.log(`[Airtime Purchase] Initiating transaction:`, {
        phone: fullPhoneNumber,
        amount,
        provider,
        mode: isSandboxMode() ? "SANDBOX" : "PRODUCTION",
      });

      // Call Bitnob API
      const result = await buyAirtime(fullPhoneNumber, amount, provider);

      console.log("[Airtime Purchase] Success:", result);

      // Show success message
      toast({
        title: "Transaction Successful! 🎉",
        description: `Airtime of ₦${amount.toLocaleString()} sent to ${countryCode} ${mobileNumber}`,
        variant: "default",
      });

      // Navigate to confirmation page with transaction details
      navigate("/confirm", {
        state: {
          type: "airtime",
          recipient: `${countryCode} ${mobileNumber}`,
          amount: amount,
          details: "Airtime top-up",
          provider: provider,
          transactionId:
            result?.id || result?.reference || result?.data?.reference || "N/A",
          status: result?.status || result?.data?.status || "completed",
          response: result,
          mode: isSandboxMode() ? "sandbox" : "production",
        },
      });

      // Save to remember me if checked
      if (rememberMe) {
        localStorage.setItem("savedMobileNumber", mobileNumber);
        localStorage.setItem("savedCountryCode", countryCode);
        localStorage.setItem("savedProvider", provider);
      }

      // Refresh balance in sandbox mode
      if (isSandboxMode()) {
        setTimeout(async () => {
          try {
            const balance = await getWalletBalance();
            setWalletBalance(balance?.data?.balance || 0);
          } catch (error) {
            console.warn("Could not refresh balance:", error);
          }
        }, 2000);
      }
    } catch (error: any) {
      console.error("Airtime purchase error:", error);

      let errorMessage =
        error?.message ||
        "Failed to process airtime purchase. Please try again.";

      // Add helpful messages for common errors
      if (
        errorMessage.includes("insufficient") ||
        errorMessage.includes("balance")
      ) {
        errorMessage = isSandboxMode()
          ? "Insufficient balance. Please fund your sandbox wallet using testnet faucets (see console for links)."
          : "Insufficient balance. Please fund your wallet.";

        if (isSandboxMode()) {
          console.log("🪙 Get testnet coins from:");
          console.log("Lightning: https://htlc.me/");
          console.log("Bitcoin Signet: https://bitcoinfaucet.uo1.net/");
        }
      }

      toast({
        title: "Transaction Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormCard title="Airtime">
      <div className="space-y-6">
        {/* Sandbox Mode Alert */}
        {isSandboxMode() && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Sandbox Mode:</strong> Using testnet. No real money will
              be spent.
              {walletBalance !== null && (
                <span className="block mt-1">
                  Balance: ₦{walletBalance.toLocaleString()}{" "}
                  {checkingBalance && "(updating...)"}
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}

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

        {/* Top Up Options */}
        <div>
          <Label className="text-sm font-medium text-foreground">Top up</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {topUpOptions.map((option) => (
              <TopUpButton
                key={option.amount}
                amount={option.amount}
                cashback={option.cashback}
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
            Amount (₦{isSandboxMode() ? "50-₦50,000" : "50-₦250,000"})
          </Label>
          <Select
            value={customAmount}
            onValueChange={(value) => {
              setCustomAmount(value);
              setSelectedAmount(null);
            }}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select amount" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="500">₦500</SelectItem>
              <SelectItem value="1000">₦1,000</SelectItem>
              <SelectItem value="2500">₦2,500</SelectItem>
              <SelectItem value="5000">₦5,000</SelectItem>
              <SelectItem value="10000">₦10,000</SelectItem>
              <SelectItem value="15000">₦15,000</SelectItem>
              <SelectItem value="20000">₦20,000</SelectItem>
            </SelectContent>
          </Select>
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

        {/* Sandbox Helper */}
        {isSandboxMode() && (
          <div className="text-xs text-muted-foreground text-center">
            Need testnet funds? Check browser console for faucet links.
          </div>
        )}
      </div>
    </FormCard>
  );
};

export default Airtime;

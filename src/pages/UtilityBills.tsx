import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormCard from "@/components/FormCard";
import TransactionStatus from "@/components/TransactionStatus";
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
import { useToast } from "@/hooks/use-toast";

const UtilityBills = () => {
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [meterNumber, setMeterNumber] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [provider, setProvider] = useState("");
  const [utilityType, setUtilityType] = useState("Electricity");
  const [isLoading, setIsLoading] = useState(false);
  const [showTransactionStatus, setShowTransactionStatus] = useState(false);
  const { toast } = useToast();

  const topUpOptions = [
    { amount: 2000 },
    { amount: 4000 },
    { amount: 10000 },
    { amount: 15000 },
    { amount: 20000 },
  ];

  const utilityTypes = [
    { id: "Electricity", icon: "⚡", label: "Electricity" },
    { id: "Water", icon: "💧", label: "Water" },
    { id: "Cable", icon: "📺", label: "Cable" },
  ];

  const handleNext = async () => {
    const amount = selectedAmount || parseInt(customAmount);
    if (!meterNumber || !provider || !amount || !customerEmail) {
      toast({
        title: "Missing Information",
        description:
          "Please enter meter/account number, email address, provider, and amount",
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

    // Show transaction status modal
    setShowTransactionStatus(true);
    setIsLoading(true);

    try {
      // Simulate transaction processing
      await new Promise((resolve) => setTimeout(resolve, 3000));

      toast({
        title: "Transaction Successful",
        description: `Utility bill paid for ${meterNumber}`,
        variant: "default",
      });

      navigate("/confirm", {
        state: {
          type: "utility",
          recipient: meterNumber,
          amount: amount,
          details: `${utilityType} bill - ${provider}`,
          provider,
          customerEmail: customerEmail,
          transactionId: `TXN-${Date.now()}`,
          status: "pending",
        },
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to process utility bill payment.";
      toast({
        title: "Transaction Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setShowTransactionStatus(false);
    }
  };

  return (
    <div className="page-with-background">
      <FormCard title="Utility Bills">
        <div className="space-y-6">
          {/* Asset Selection */}
          <div>
            <Label
              htmlFor="asset"
              className="text-sm font-medium text-foreground"
            >
              Asset
            </Label>
            <Select defaultValue="bitcoin-lightning">
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bitcoin-lightning">
                  Bitcoin Lightning
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Utility Type */}
          <div>
            <Label className="text-sm font-medium text-foreground">
              Utility Type
            </Label>
            <div className="flex gap-2 mt-2">
              {utilityTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setUtilityType(type.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                    utilityType === type.id
                      ? "border-success text-success bg-success/10"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>{type.icon}</span>
                  <span className="text-sm">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Provider */}
          <div>
            <Label
              htmlFor="provider"
              className="text-sm font-medium text-foreground"
            >
              Provider
            </Label>
            <Select value={provider} onValueChange={setProvider}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="IKEDC" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IKEDC">IKEDC</SelectItem>
                <SelectItem value="EEDC">EEDC</SelectItem>
                <SelectItem value="AEDC">AEDC</SelectItem>
                <SelectItem value="KEDC">KEDC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Meter/Account Number */}
          <div>
            <Label
              htmlFor="meterNumber"
              className="text-sm font-medium text-foreground"
            >
              Meter ID / Account Number
            </Label>
            <Input
              type="text"
              placeholder="Enter meter/account number"
              value={meterNumber}
              onChange={(e) => setMeterNumber(e.target.value)}
              className="mt-1"
            />
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
              Amount (₦)
            </Label>
            <Input
              type="number"
              min={50}
              max={50000}
              placeholder="Enter custom amount"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setSelectedAmount(null);
              }}
              className="mt-1"
            />
          </div>

          {/* Next Button */}
          <Button
            variant="success"
            className="w-full h-12"
            onClick={handleNext}
            disabled={
              !meterNumber ||
              !provider ||
              (!selectedAmount && !customAmount) ||
              isLoading
            }
          >
            {isLoading ? "Processing..." : "Next"}
          </Button>
        </div>

        {/* Transaction Status Modal */}
        {showTransactionStatus && (
          <TransactionStatus
            isVisible={showTransactionStatus}
            onComplete={() => setShowTransactionStatus(false)}
          />
        )}
      </FormCard>
    </div>
  );
};

export default UtilityBills;

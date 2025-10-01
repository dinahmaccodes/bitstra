import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { payElectricity } from "@/lib/bitnob";

const UtilityBills = () => {
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [meterNumber, setMeterNumber] = useState("");
  const [provider, setProvider] = useState("");
  const [utilityType, setUtilityType] = useState("Electricity");

  const topUpOptions = [
    { amount: 2000, cashback: "2.45Sats Cashback" },
    { amount: 4000, cashback: "3.68Sats Cashback" },
    { amount: 10000, cashback: "4.80Sats Cashback" },
    { amount: 15000, cashback: "6.13Sats Cashback" },
    { amount: 20000, cashback: "7.36Sats Cashback" },
  ];

  const utilityTypes = [
    { id: "Electricity", icon: "⚡", label: "Electricity" },
    { id: "Water", icon: "💧", label: "Water" },
    { id: "Cable", icon: "📺", label: "Cable" },
  ];

  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    const amount = selectedAmount || parseInt(customAmount);
    if (!meterNumber || !provider || !amount) {
      toast({
        title: "Missing Information",
        description: "Please enter meter/account number, provider, and amount",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      // You may need to set meterType based on UI
      const meterType = "prepaid";
      const result = await payElectricity(
        meterNumber,
        amount,
        provider,
        meterType
      );
      toast({
        title: "Transaction Successful!",
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
          transactionId:
            result?.id || result?.reference || result?.data?.reference || "N/A",
          status: result?.status || result?.data?.status || "completed",
          response: result,
        },
      });
    } catch (error: any) {
      toast({
        title: "Transaction Failed",
        description:
          error?.message || "Failed to process utility bill payment.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
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
              <SelectItem value="bitcoin">Bitcoin</SelectItem>
              <SelectItem value="usdt">USDT</SelectItem>
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

        {/* Meter ID / Account Number */}
        <div>
          <Label
            htmlFor="meter"
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
            loading
          }
        >
          {loading ? "Processing..." : "Next"}
        </Button>
      </div>
    </FormCard>
  );
};

export default UtilityBills;

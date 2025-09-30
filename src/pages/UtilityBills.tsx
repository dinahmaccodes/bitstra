import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormCard from "@/components/FormCard";
import TopUpButton from "@/components/TopUpButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

  const handleNext = () => {
    const amount = selectedAmount || parseInt(customAmount);
    if (meterNumber && provider && amount) {
      navigate("/confirm", {
        state: {
          type: "utility",
          recipient: meterNumber,
          amount: amount,
          details: `${utilityType} bill - ${provider}`,
          provider: provider
        }
      });
    }
  };

  return (
    <FormCard title="Utility Bills">
      <div className="space-y-6">
        {/* Asset Selection */}
        <div>
          <Label htmlFor="asset" className="text-sm font-medium text-foreground">Asset</Label>
          <Select defaultValue="bitcoin-lightning">
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bitcoin-lightning">Bitcoin Lightning</SelectItem>
              <SelectItem value="bitcoin">Bitcoin</SelectItem>
              <SelectItem value="usdt">USDT</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Utility Type */}
        <div>
          <Label className="text-sm font-medium text-foreground">Utility Type</Label>
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
          <Label htmlFor="provider" className="text-sm font-medium text-foreground">Provider</Label>
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
          <Label htmlFor="meter" className="text-sm font-medium text-foreground">
            Meter ID / Account Number
          </Label>
          <Select value={meterNumber} onValueChange={setMeterNumber}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="0123456789" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0123456789">0123456789</SelectItem>
              <SelectItem value="9876543210">9876543210</SelectItem>
              <SelectItem value="1234567890">1234567890</SelectItem>
            </SelectContent>
          </Select>
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
          <Label htmlFor="amount" className="text-sm font-medium text-foreground">
            Amount (₦)
          </Label>
          <Select value={customAmount} onValueChange={(value) => {
            setCustomAmount(value);
            setSelectedAmount(null);
          }}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="10,000" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10000">₦10,000</SelectItem>
              <SelectItem value="15000">₦15,000</SelectItem>
              <SelectItem value="20000">₦20,000</SelectItem>
              <SelectItem value="25000">₦25,000</SelectItem>
              <SelectItem value="30000">₦30,000</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Next Button */}
        <Button 
          variant="success" 
          className="w-full h-12"
          onClick={handleNext}
          disabled={!meterNumber || !provider || (!selectedAmount && !customAmount)}
        >
          Next
        </Button>
      </div>
    </FormCard>
  );
};

export default UtilityBills;
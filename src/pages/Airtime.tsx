import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormCard from "@/components/FormCard";
import TopUpButton from "@/components/TopUpButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { buyAirtime } from "@/lib/bitnob";
import TopUpForm from "../components/TopUpForm";


const Airtime = () => {
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+234");
  const [rememberMe, setRememberMe] = useState(false);

  const topUpOptions = [
    { amount: 2000, cashback: "2.45Sats Cashback" },
    { amount: 2500, cashback: "3.68Sats Cashback" },
    { amount: 3000, cashback: "4.00Sats Cashback" },
    { amount: 3500, cashback: "5.13Sats Cashback" },
    { amount: 4000, cashback: "7.36Sats Cashback" },
  ];

  const handleNext = () => {
    const amount = selectedAmount || parseInt(customAmount);
    if (mobileNumber && amount) {
      navigate("/confirm", {
        state: {
          type: "airtime",
          recipient: `${countryCode} ${mobileNumber}`,
          amount: amount,
          details: "Airtime top-up"
        }
      });
    }
  };

  return (
    <FormCard title="Airtime">
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

        {/* Mobile Number */}
        <div>
          <Label htmlFor="mobile" className="text-sm font-medium text-foreground">Mobile Number</Label>
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
              placeholder="810 000 001"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="flex-1"
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
          <Label htmlFor="amount" className="text-sm font-medium text-foreground">
            Amount (₦2,000-₦250,000)
          </Label>
          <Select value={customAmount} onValueChange={(value) => {
            setCustomAmount(value);
            setSelectedAmount(null);
          }}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="5,000" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5000">₦5,000</SelectItem>
              <SelectItem value="10000">₦10,000</SelectItem>
              <SelectItem value="15000">₦15,000</SelectItem>
              <SelectItem value="20000">₦20,000</SelectItem>
              <SelectItem value="25000">₦25,000</SelectItem>
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
          disabled={!mobileNumber || (!selectedAmount && !customAmount)}
        >
          Next
        </Button>
      </div>
    </FormCard>
  );
};

export default Airtime;
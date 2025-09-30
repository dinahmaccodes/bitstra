import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormCard from "@/components/FormCard";
import DataPlanCard from "@/components/DataPlanCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Data = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [mobileNumber, setMobileNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+234");
  const [activeTab, setActiveTab] = useState("Hot");

  const dataPlanTabs = ["Hot", "Daily", "Weekly", "Monthly"];

  const hotPlans = [
    { data: "1GB", duration: "1 Day", price: "₦500", cashback: "1000Sats Cashback" },
    { data: "2.5GB", duration: "2 Day", price: "₦900", cashback: "1000Sats Cashback" },
    { data: "500MB", duration: "7 Day", price: "₦800", cashback: "1000Sats Cashback" },
    { data: "1GB", duration: "7 Day", price: "₦800", cashback: "1000Sats Cashback" },
    { data: "2.5GB", duration: "1 Day", price: "₦750", cashback: "1000Sats Cashback" },
  ];

  const handleNext = () => {
    if (mobileNumber && selectedPlan) {
      navigate("/confirm", {
        state: {
          type: "data",
          recipient: `${countryCode} ${mobileNumber}`,
          amount: parseInt(selectedPlan.price.replace("₦", "").replace(",", "")),
          details: `${selectedPlan.data} ${selectedPlan.duration} plan`
        }
      });
    }
  };

  return (
    <FormCard title="Data">
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

        {/* Data Plan Tabs */}
        <div>
          <Label className="text-sm font-medium text-foreground">Data plan</Label>
          <div className="flex gap-1 mt-2 p-1 bg-muted rounded-lg">
            {dataPlanTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab
                    ? "bg-success text-success-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Data Plans */}
        <div className="grid grid-cols-2 gap-3">
          {hotPlans.map((plan, index) => (
            <DataPlanCard
              key={index}
              data={plan.data}
              duration={plan.duration}
              price={plan.price}
              cashback={plan.cashback}
              selected={selectedPlan === plan}
              onClick={() => setSelectedPlan(plan)}
            />
          ))}
        </div>

        {/* Next Button */}
        <Button 
          variant="success" 
          className="w-full h-12"
          onClick={handleNext}
          disabled={!mobileNumber || !selectedPlan}
        >
          Next
        </Button>
      </div>
    </FormCard>
  );
};

export default Data;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormCard from "@/components/FormCard";
import DataPlanCard from "@/components/DataPlanCard";
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
import { buyData } from "@/lib/bitnob";
import { useToast } from "@/hooks/use-toast";

const Data = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [mobileNumber, setMobileNumber] = useState("");
  // Handler to enforce max 10 digits and numeric only
  const handleMobileNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 10) value = value.slice(0, 10);
    setMobileNumber(value);
  };
  const [countryCode, setCountryCode] = useState("+234");
  const [activeTab, setActiveTab] = useState("Hot");

  const dataPlanTabs = ["Hot", "Daily", "Weekly", "Monthly"];

  const hotPlans = [
    {
      data: "1GB",
      duration: "1 Day",
      price: "₦500",
      cashback: "1000Sats Cashback",
    },
    {
      data: "2.5GB",
      duration: "2 Day",
      price: "₦900",
      cashback: "1000Sats Cashback",
    },
    {
      data: "500MB",
      duration: "7 Day",
      price: "₦800",
      cashback: "1000Sats Cashback",
    },
    {
      data: "1GB",
      duration: "7 Day",
      price: "₦800",
      cashback: "1000Sats Cashback",
    },
    {
      data: "2.5GB",
      duration: "1 Day",
      price: "₦750",
      cashback: "1000Sats Cashback",
    },
  ];

  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (!mobileNumber || !selectedPlan) {
      toast({
        title: "Missing Information",
        description: "Please enter a mobile number and select a plan",
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
      // You may need to map plan to a planId if using real API
      const planId = selectedPlan.id || "mtn-1gb-daily";
      const provider = selectedPlan.provider || "mtn";
      const result = await buyData(fullPhoneNumber, planId, provider);
      toast({
        title: "Transaction Successful!",
        description: `Data plan sent to ${countryCode} ${mobileNumber}`,
        variant: "default",
      });
      navigate("/confirm", {
        state: {
          type: "data",
          recipient: `${countryCode} ${mobileNumber}`,
          amount: parseInt(
            selectedPlan.price.replace("₦", "").replace(",", "")
          ),
          details: `${selectedPlan.data} ${selectedPlan.duration} plan`,
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
        description: error?.message || "Failed to process data purchase.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormCard title="Data">
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
              maxLength={10}
              inputMode="numeric"
              pattern="[0-9]{10}"
            />
          </div>
        </div>

        {/* Data Plan Tabs */}
        <div>
          <Label className="text-sm font-medium text-foreground">
            Data plan
          </Label>
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
          disabled={!mobileNumber || !selectedPlan || loading}
        >
          {loading ? "Processing..." : "Next"}
        </Button>
      </div>
    </FormCard>
  );
};

export default Data;

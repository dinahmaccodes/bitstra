import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormCard from "@/components/FormCard";
import DataPlanCard from "@/components/DataPlanCard";
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
import { useToast } from "@/hooks/use-toast";

const Data = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<{
    data: string;
    duration: string;
    price: string;
  } | null>(null);
  const [mobileNumber, setMobileNumber] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showTransactionStatus, setShowTransactionStatus] = useState(false);
  const { toast } = useToast();

  // Handler to enforce max 10 digits and numeric only
  const handleMobileNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 10) value = value.slice(0, 10);
    setMobileNumber(value);
  };

  const [activeTab, setActiveTab] = useState("Hot");

  const dataPlanTabs = ["Hot", "Daily", "Weekly", "Monthly"];

  // All plans
  const allPlans = [
    {
      data: "1GB",
      duration: "1 Day",
      price: "₦500",
    },
    {
      data: "2.5GB",
      duration: "1 Day",
      price: "₦750",
    },
    {
      data: "2.5GB",
      duration: "2 Day",
      price: "₦900",
    },
    {
      data: "500MB",
      duration: "7 Day",
      price: "₦800",
    },
    {
      data: "1GB",
      duration: "7 Day",
      price: "₦800",
    },
  ];

  // Filter plans based on active tab
  const getFilteredPlans = () => {
    switch (activeTab) {
      case "Daily":
        return allPlans.filter((plan) => plan.duration === "1 Day");
      case "Weekly":
        return allPlans.filter((plan) => plan.duration === "7 Day");
      case "Monthly":
        return allPlans.filter((plan) => plan.duration.includes("Month"));
      case "Hot":
      default:
        return allPlans; // Show all plans for "Hot" tab
    }
  };

  const handleNext = async () => {
    if (!mobileNumber || !selectedPlan || !selectedNetwork || !customerEmail) {
      toast({
        title: "Missing Information",
        description:
          "Please enter a mobile number, email address, select a network, and choose a plan",
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
        description: `Data plan sent to +234 ${mobileNumber}`,
        variant: "default",
      });

      navigate("/confirm", {
        state: {
          type: "data",
          recipient: `+234 ${mobileNumber}`,
          amount: parseInt(
            selectedPlan.price.replace("₦", "").replace(",", "")
          ),
          details: `${selectedPlan.data} ${selectedPlan.duration} plan`,
          provider: selectedNetwork,
          customerEmail: customerEmail,
          transactionId: `TXN-${Date.now()}`,
          status: "pending",
        },
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to process data purchase.";
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
              <div className="w-24 flex items-center justify-center bg-gray-100 rounded-md px-3 text-sm font-medium text-gray-700">
                +234
              </div>
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

          {/* Network Selection */}
          <div>
            <Label
              htmlFor="network"
              className="text-sm font-medium text-foreground"
            >
              Network *
            </Label>
            <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select Network" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MTN">MTN</SelectItem>
                <SelectItem value="Airtel">Airtel</SelectItem>
                <SelectItem value="Glo">Glo</SelectItem>
                <SelectItem value="9mobile">9mobile</SelectItem>
              </SelectContent>
            </Select>
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
            {getFilteredPlans().map((plan, index) => (
              <DataPlanCard
                key={index}
                data={plan.data}
                duration={plan.duration}
                price={plan.price}
                selected={selectedPlan === plan}
                onClick={() => setSelectedPlan(plan)}
              />
            ))}
          </div>

          {/* Selected Plan Summary */}
          {selectedPlan && (
            <div className="bg-success/10 border border-success/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-success">Selected Plan</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedPlan.data} • {selectedPlan.duration} •{" "}
                    {selectedPlan.price}
                  </p>
                </div>
                <div className="text-lg font-bold text-success">
                  {selectedPlan.price}
                </div>
              </div>
            </div>
          )}

          {/* Next Button */}
          <Button
            variant="success"
            className="w-full h-12"
            onClick={handleNext}
            disabled={
              !mobileNumber || !selectedPlan || !selectedNetwork || isLoading
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

export default Data;

import { useLocation, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";
import {
  createLightningInvoice,
  getLightningInvoiceStatus,
  nairaToSatoshis,
  LightningInvoiceData,
} from "@/lib/bitnob";
import { useToast } from "@/hooks/use-toast";

const Confirm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [invoice, setInvoice] = useState<LightningInvoiceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);

  const { type, recipient, amount, details, provider, customerEmail } =
    location.state || {};

  // Helper functions
  const getProductIcon = useCallback(() => {
    switch (type) {
      case "airtime":
        return "📱";
      case "data":
        return "📶";
      case "utility":
        return "⚡";
      default:
        return "💳";
    }
  }, [type]);

  const getProductName = useCallback(() => {
    switch (type) {
      case "airtime":
        return "Airtime";
      case "data":
        return "Data Bundle";
      case "utility":
        return "Utility Bill";
      default:
        return "Payment";
    }
  }, [type]);

  // Convert amounts
  const amountInSats = nairaToSatoshis(amount || 0);
  const amountInUSD = ((amount || 0) / 1481.21).toFixed(2);
  const fee = 4; // Fee in satoshis
  const totalAmountInSats = amountInSats + fee;
  const currentTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }); // Helper functions

  // Create Lightning Invoice
  const createInvoice = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const description = `${getProductName()} payment for ${recipient} - ${provider}`;
      const reference = `${type}_${Date.now()}_${recipient?.replace(
        /\s+/g,
        ""
      )}`;

      console.log("Creating invoice with:", {
        amount: totalAmountInSats,
        description,
        reference,
        customerEmail: customerEmail || "default@example.com",
      });

      const response = await createLightningInvoice(
        totalAmountInSats,
        description,
        reference,
        customerEmail || "default@example.com", // Fallback email if not provided
        3600 // 1 hour expiry
      );

      console.log("Raw API response:", response);

      // Handle the response from our API function
      if (response && response.data) {
        setInvoice(response.data);
        console.log("Invoice data set successfully:", response.data);

        toast({
          title: "Invoice Created Successfully",
          description:
            "Lightning invoice generated. Scan QR code or copy the payment request to pay.",
        });
      } else {
        throw new Error("Invalid response structure from Lightning API");
      }
    } catch (err: unknown) {
      console.error("Invoice creation error:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to create Lightning invoice";
      setError(errorMessage);

      toast({
        title: "Invoice Creation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    totalAmountInSats,
    recipient,
    provider,
    type,
    customerEmail,
    toast,
    getProductName,
  ]);

  // Check payment status
  const checkPaymentStatus = useCallback(async () => {
    if (!invoice) return;

    setIsCheckingPayment(true);
    try {
      const response = await getLightningInvoiceStatus(invoice.id);

      if (response.status && response.data.settled) {
        // Payment confirmed
        toast({
          title: "Payment Confirmed!",
          description: "Your payment has been received successfully.",
        });

        // Navigate to success page
        navigate("/success", {
          state: {
            type,
            recipient,
            amount,
            details,
            provider,
            paymentHash: invoice.payment_hash,
            invoiceId: invoice.id,
            paidAt: new Date().toISOString(),
          },
        });
      }
    } catch (err: unknown) {
      console.error("Payment status check error:", err);
    } finally {
      setIsCheckingPayment(false);
    }
  }, [invoice, toast, navigate, type, recipient, amount, details, provider]);

  // Create invoice on component mount
  useEffect(() => {
    if (type && recipient && amount && customerEmail) {
      console.log("All required data available, creating invoice...");
      createInvoice();
    } else {
      console.log("Missing required data:", {
        type,
        recipient,
        amount,
        customerEmail,
      });
      setError("Missing required information for invoice creation");
    }
  }, [type, recipient, amount, customerEmail, createInvoice]);

  // Poll for payment status every 5 seconds when invoice exists
  useEffect(() => {
    // Disable automatic status checking for now since Bitnob doesn't provide proper invoice ID
    // if (!invoice || invoice.settled) return;
    // const interval = setInterval(checkPaymentStatus, 5000);
    // return () => clearInterval(interval);
  }, [invoice, checkPaymentStatus]);

  // Handle missing data
  if (!type || !recipient || !amount) {
    return (
      <div className="page-with-background">
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-surface rounded-2xl shadow-lg p-8 text-center">
            <h1 className="text-xl font-bold text-foreground mb-4">
              Missing Payment Information
            </h1>
            <p className="text-muted-foreground mb-6">
              Required payment details are missing. Please go back and fill out
              the form completely.
            </p>
            <div className="space-y-2 text-sm text-left bg-gray-50 p-4 rounded">
              <div className="flex justify-between">
                <span>Service Type:</span>
                <span className={type ? "text-green-600" : "text-red-600"}>
                  {type || "Missing"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Recipient:</span>
                <span className={recipient ? "text-green-600" : "text-red-600"}>
                  {recipient || "Missing"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className={amount ? "text-green-600" : "text-red-600"}>
                  {amount ? `₦${amount}` : "Missing"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Email:</span>
                <span
                  className={customerEmail ? "text-green-600" : "text-red-600"}
                >
                  {customerEmail || "Missing"}
                </span>
              </div>
            </div>
            <Button onClick={() => navigate(-1)} className="mt-6 w-full">
              Go Back to Form
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleManualConfirm = () => {
    // Show success toast
    toast({
      title: "Payment Confirmed",
      description: "Your payment has been confirmed successfully.",
      variant: "default",
    });

    // Navigate to success page or home after a short delay
    setTimeout(() => {
      navigate("/success", {
        state: {
          type,
          recipient,
          amount,
          details,
          provider,
          customerEmail,
          transactionId: `TXN-${Date.now()}`,
          status: "confirmed",
        },
      });
    }, 1000);
  };

  const handleRetry = () => {
    createInvoice();
  };

  return (
    <div className="page-with-background">
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-4xl flex gap-8">
          {/* Left Side - Payment Details */}
          <div className="flex-1 bg-surface rounded-2xl shadow-lg p-8 z-10">
            <h1 className="text-2xl font-bold text-foreground mb-6">
              Make Payment
            </h1>

            {/* Product Info */}
            <div className="flex items-center gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
              <span className="text-3xl">{getProductIcon()}</span>
              <div>
                <h3 className="font-semibold">{getProductName()}</h3>
                <p className="text-sm text-muted-foreground">{provider}</p>
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-4 mb-6">
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
            </div>

            {/* Amount Details */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-bold">${amountInUSD}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">SAT Amount:</span>
                <span className="font-bold">
                  {amountInSats.toLocaleString()} SAT
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Fee:</span>
                <span className="font-bold">{fee} SAT</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">BTC:</span>
                <span className="font-bold">₦173,899,297.19</span>
              </div>

              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Rate:</span>
                <span className="font-medium">$1 = ₦1,481.21</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">You will send:</span>
                <span className="font-bold">
                  {(amountInSats + fee).toLocaleString()} SAT
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">You'll Receive:</span>
                <span className="font-bold">₦{amount.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Time</span>
                <span className="font-bold">{currentTime}</span>
              </div>
            </div>

            {/* Status Messages */}
            {isLoading && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800">Creating Lightning invoice...</p>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {isCheckingPayment && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800">Checking payment status...</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              {error ? (
                <Button
                  variant="default"
                  className="flex-1 h-12"
                  onClick={handleRetry}
                  disabled={isLoading}
                >
                  {isLoading ? "Retrying..." : "Retry Creating Invoice"}
                </Button>
              ) : (
                <Button
                  variant="default"
                  className="flex-1 h-12 bg-green-600 hover:bg-green-700"
                  onClick={handleManualConfirm}
                  disabled={!invoice || isCheckingPayment || isLoading}
                >
                  {isCheckingPayment
                    ? "Checking..."
                    : isLoading
                    ? "Creating Invoice..."
                    : "I've Made Payment"}
                </Button>
              )}
              <Button
                variant="outline"
                className="flex-1 h-12"
                onClick={() => navigate(-1)}
              >
                Go Back
              </Button>
            </div>
          </div>

          {/* Right Side - QR Code */}
          {/* Right Side - QR Code and Payment Request */}
          <div className="w-80 bg-surface rounded-2xl shadow-lg p-6 z-10">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Lightning Payment</h3>

              {/* QR Code Section */}
              {isLoading ? (
                <div className="bg-gray-100 p-8 rounded-lg mb-4 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  <span className="ml-2 text-sm">Generating invoice...</span>
                </div>
              ) : error ? (
                <div className="bg-red-50 p-8 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-red-600 text-sm font-semibold">
                      Failed to generate invoice
                    </p>
                    <p className="text-red-500 text-xs mt-1">{error}</p>
                  </div>
                </div>
              ) : invoice && (invoice.payment_request || invoice.request) ? (
                <div className="bg-white p-4 rounded-lg mb-4 border shadow-sm">
                  <QRCodeSVG
                    value={invoice.payment_request || invoice.request}
                    size={180}
                    level="M"
                    includeMargin={true}
                    className="mx-auto"
                  />
                </div>
              ) : (
                <div className="bg-gray-100 p-8 rounded-lg mb-4 flex items-center justify-center">
                  <p className="text-gray-600 text-sm">Generating QR code...</p>
                </div>
              )}

              {/* Instructions */}
              <p className="text-sm text-muted-foreground mb-2">
                Scan with Lightning wallet to pay
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Amount: {totalAmountInSats.toLocaleString()} SAT
              </p>

              {/* Payment Request Copy Section */}
              {invoice && (invoice.payment_request || invoice.request) && (
                <div className="mt-4 text-left">
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Lightning Payment Request:
                  </p>
                  <div className="relative">
                    <textarea
                      className="text-xs font-mono bg-gray-50 p-3 rounded-lg w-full h-24 resize-none border border-gray-200 focus:border-blue-300 focus:outline-none"
                      value={invoice.payment_request || invoice.request}
                      readOnly
                      placeholder="Lightning payment request will appear here"
                      title="Lightning Payment Request - Click to select all"
                      onClick={(e) => e.currentTarget.select()}
                    />
                    <button
                      className="absolute top-2 right-2 px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
                      onClick={() => {
                        const paymentRequest =
                          invoice.payment_request || invoice.request;
                        if (paymentRequest) {
                          navigator.clipboard.writeText(paymentRequest);
                          toast({
                            title: "Copied",
                            description: "Payment request copied to clipboard",
                          });
                        }
                      }}
                    >
                      Copy
                    </button>
                  </div>

                  {/* Usage Instructions */}
                  <p className="text-xs text-gray-500 mt-2">
                    Copy and paste into your Lightning wallet, or scan the QR
                    code above.
                  </p>

                  {/* Invoice Details */}
                  <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
                    {invoice.expires_at && (
                      <p className="text-xs text-muted-foreground">
                        Expires: {new Date(invoice.expires_at).toLocaleString()}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Invoice ID: {invoice.id || "Generated"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Amount:{" "}
                      {invoice.satoshis || invoice.amount || totalAmountInSats}{" "}
                      sats
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Description: {invoice.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirm;

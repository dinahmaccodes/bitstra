// bitnob.ts
// Bitnob Sandbox API Integration
// Documentation: https://docs.bitnob.com/docs/development-mode
// Sandbox URL: https://sandboxapp.bitnob.co

import axios, { AxiosError } from "axios";

// Types
export interface BitnobResponse {
  status: string;
  message: string;
  data?: Record<string, unknown>;
  id?: string;
  reference?: string;
}

export interface AirtimeRequest {
  phoneNumber: string;
  amount: number;
  countryCode?: string;
  provider?: string;
}

export interface DataRequest {
  phoneNumber: string;
  planId: string;
  countryCode?: string;
  provider?: string;
}

export interface ElectricityRequest {
  meterNumber: string;
  amount: number;
  provider: string;
  countryCode?: string;
  meterType?: "prepaid" | "postpaid";
}

// Lightning Invoice Types based on Bitnob API documentation
export interface CreateInvoiceRequest {
  satoshis: number; // amount in satoshis (changed from 'amount' to 'satoshis' per API docs)
  description: string;
  customerEmail: string; // required field for customer email
  reference?: string;
  expiry?: number; // expiry time in seconds (default: 3600)
}

export interface LightningInvoiceData {
  id?: string; // Optional - might not be provided by Bitnob
  amount?: number;
  description: string;
  request: string; // This is what Bitnob returns (not payment_request)
  payment_request?: string; // We'll map request to this for consistency
  payment_hash?: string;
  expires_at?: string;
  created_at?: string;
  settled?: boolean;
  reference?: string;
  satoshis: string | number; // Bitnob returns this as string
}

export interface InvoiceResponse {
  status: boolean;
  message: string;
  data: LightningInvoiceData;
}

// Additional type definitions for other API responses
export interface DataPlan {
  id: string;
  name: string;
  price: number;
  validity: string;
  provider: string;
}

export interface DataPlansResponse {
  status: boolean;
  message: string;
  data: DataPlan[];
}

export interface MeterInfo {
  customerName: string;
  customerAddress: string;
  meterNumber: string;
  customerPhone: string;
}

export interface MeterVerificationResponse {
  status: boolean;
  message: string;
  data: MeterInfo;
}

export interface CableTVBouquet {
  id: string;
  name: string;
  price: number;
  provider: string;
}

export interface CableTVBouquetsResponse {
  status: boolean;
  message: string;
  data: CableTVBouquet[];
}

export interface TransactionData {
  id: string;
  amount: number;
  status: string;
  reference: string;
  created_at: string;
  updated_at: string;
}

export interface TransactionResponse {
  status: boolean;
  message: string;
  data: TransactionData;
}

export interface TransactionHistoryResponse {
  status: boolean;
  message: string;
  data: TransactionData[];
}

export interface WalletBalance {
  btc: number;
  usd: number;
  ngn: number;
}

export interface WalletBalanceResponse {
  status: boolean;
  message: string;
  data: WalletBalance;
}

export interface BitcoinAddress {
  address: string;
  qr_code: string;
}

export interface BitcoinAddressResponse {
  status: boolean;
  message: string;
  data: BitcoinAddress;
}

// Determine environment
const isDevelopment =
  import.meta.env.MODE === "development" ||
  import.meta.env.VITE_BITNOB_ENV === "sandbox";

// Base URLs - Updated to correct Bitnob endpoints
const SANDBOX_BASE_URL = "https://sandboxapi.bitnob.co/api/v1";
const PRODUCTION_BASE_URL = "https://api.bitnob.com/api/v1";

// Validate environment configuration
const API_KEY = import.meta.env.VITE_BITNOB_API_KEY;
if (!API_KEY && import.meta.env.MODE !== "test") {
  console.warn(
    "VITE_BITNOB_API_KEY is not configured - some features may not work"
  );
}

// Create axios instance
const api = axios.create({
  baseURL: isDevelopment ? SANDBOX_BASE_URL : PRODUCTION_BASE_URL,
  headers: {
    Authorization: API_KEY ? `Bearer ${API_KEY}` : "",
    "Content-Type": "application/json",
    Accept: "application/json",
    // Add header to request realistic test data (if supported)
    "X-Test-Mode": isDevelopment ? "realistic" : undefined,
  },
  timeout: 30000, // 30 second timeout
});

// Request interceptor for logging in development
api.interceptors.request.use(
  (config) => {
    if (isDevelopment) {
      console.log(
        `[Bitnob ${
          isDevelopment ? "Sandbox" : "Production"
        }] ${config.method?.toUpperCase()} ${config.url}`
      );
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for logging
api.interceptors.response.use(
  (response) => {
    if (isDevelopment) {
      console.log(`[Bitnob Response]`, response.data);
    }
    return response;
  },
  (error) => {
    if (isDevelopment) {
      console.error(`[Bitnob Error]`, error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);

// Error handler
function handleBitnobError(error: AxiosError): never {
  if (error.response) {
    // Server responded with error
    const errorData = error.response.data as {
      message?: string;
      error?: string;
    };
    const message =
      errorData?.message || errorData?.error || "Transaction failed";

    // Log detailed error in development
    if (isDevelopment) {
      console.error("[Bitnob Error Details]", {
        status: error.response.status,
        data: errorData,
        headers: error.response.headers,
      });
    }

    throw new Error(message);
  } else if (error.request) {
    // Request made but no response
    throw new Error(
      "Network error. Please check your connection and try again."
    );
  } else {
    // Something else happened
    throw new Error(error.message || "An unexpected error occurred");
  }
}

// Buy Airtime
export async function buyAirtime(
  phone: string,
  amount: number,
  provider: string = "mtn"
): Promise<BitnobResponse> {
  try {
    // Format phone number - remove leading zeros
    const formattedPhone = phone.replace(/^0+/, "");

    const payload = {
      phoneNumber: formattedPhone,
      amount,
      countryCode: "NG",
      provider: provider.toLowerCase(),
    };

    if (isDevelopment) {
      console.log("[Bitnob Airtime] Request payload:", payload);
    }

    const { data } = await api.post<BitnobResponse>("/bills/airtime", payload);
    return data;
  } catch (error) {
    return handleBitnobError(error as AxiosError);
  }
}

// Buy Data
export async function buyData(
  phone: string,
  planId: string,
  provider: string = "mtn"
): Promise<BitnobResponse> {
  try {
    const formattedPhone = phone.replace(/^0+/, "");

    const payload = {
      phoneNumber: formattedPhone,
      planId,
      countryCode: "NG",
      provider: provider.toLowerCase(),
    };

    if (isDevelopment) {
      console.log("[Bitnob Data] Request payload:", payload);
    }

    const { data } = await api.post<BitnobResponse>("/bills/data", payload);
    return data;
  } catch (error) {
    return handleBitnobError(error as AxiosError);
  }
}

// Get Data Plans
export async function getDataPlans(
  provider: string = "mtn"
): Promise<DataPlansResponse> {
  try {
    const { data } = await api.get(`/bills/data/plans`, {
      params: {
        provider: provider.toLowerCase(),
        countryCode: "NG",
      },
    });
    return data;
  } catch (error) {
    return handleBitnobError(error as AxiosError);
  }
}

// Pay Electricity Bill
export async function payElectricity(
  meterNumber: string,
  amount: number,
  provider: string,
  meterType: "prepaid" | "postpaid" = "prepaid"
): Promise<BitnobResponse> {
  try {
    const payload = {
      meterNumber,
      amount,
      provider: provider.toLowerCase(),
      countryCode: "NG",
      meterType,
    };

    if (isDevelopment) {
      console.log("[Bitnob Electricity] Request payload:", payload);
    }

    const { data } = await api.post<BitnobResponse>(
      "/bills/electricity",
      payload
    );
    return data;
  } catch (error) {
    return handleBitnobError(error as AxiosError);
  }
}

// Verify Meter Number
export async function verifyMeter(
  meterNumber: string,
  provider: string,
  meterType: "prepaid" | "postpaid" = "prepaid"
): Promise<MeterVerificationResponse> {
  try {
    const payload = {
      meterNumber,
      provider: provider.toLowerCase(),
      meterType,
      countryCode: "NG",
    };

    const { data } = await api.post("/bills/electricity/verify", payload);
    return data;
  } catch (error) {
    return handleBitnobError(error as AxiosError);
  }
}

// Pay Cable TV Subscription
export async function payCableTV(
  smartCardNumber: string,
  bouquetCode: string,
  provider: string
): Promise<BitnobResponse> {
  try {
    const payload = {
      smartCardNumber,
      bouquetCode,
      provider: provider.toLowerCase(),
      countryCode: "NG",
    };

    if (isDevelopment) {
      console.log("[Bitnob Cable TV] Request payload:", payload);
    }

    const { data } = await api.post<BitnobResponse>("/bills/tv", payload);
    return data;
  } catch (error) {
    return handleBitnobError(error as AxiosError);
  }
}

// Get Cable TV Bouquets
export async function getCableTVBouquets(
  provider: string
): Promise<CableTVBouquetsResponse> {
  try {
    const { data } = await api.get(`/bills/tv/bouquets`, {
      params: {
        provider: provider.toLowerCase(),
        countryCode: "NG",
      },
    });
    return data;
  } catch (error) {
    return handleBitnobError(error as AxiosError);
  }
}

// Get Transaction Status
export async function getTransactionStatus(
  transactionId: string
): Promise<TransactionResponse> {
  try {
    const { data } = await api.get(`/bills/transaction/${transactionId}`);
    return data;
  } catch (error) {
    return handleBitnobError(error as AxiosError);
  }
}

// Get Transaction History
export async function getTransactionHistory(
  limit: number = 10,
  offset: number = 0
): Promise<TransactionHistoryResponse> {
  try {
    const { data } = await api.get("/bills/transactions", {
      params: { limit, offset },
    });
    return data;
  } catch (error) {
    return handleBitnobError(error as AxiosError);
  }
}

// Get Wallet Balance
export async function getWalletBalance(): Promise<WalletBalanceResponse> {
  try {
    const { data } = await api.get("/wallets/balance");
    return data;
  } catch (error) {
    return handleBitnobError(error as AxiosError);
  }
}

/**
 * Create Lightning Invoice for receiving payments
 * Reference: https://docs.bitnob.com/reference/lightning/create-invoice
 *
 * @param amount - Amount in satoshis (must be positive integer)
 * @param description - Invoice description (required)
 * @param reference - Optional reference string for tracking
 * @param customerEmail - Customer email for receipt (required)
 * @param expiry - Expiry time in seconds (default: 3600 = 1 hour)
 * @returns Promise<InvoiceResponse> - Lightning invoice data
 */
export async function createLightningInvoice(
  amount: number,
  description: string,
  reference?: string,
  customerEmail?: string,
  expiry: number = 3600
): Promise<InvoiceResponse> {
  try {
    // Validate input parameters
    if (!amount || amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    if (!description || description.trim().length === 0) {
      throw new Error("Description is required");
    }

    if (!customerEmail || customerEmail.trim().length === 0) {
      throw new Error("Customer email is required");
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      throw new Error("Please enter a valid email address");
    }

    // Ensure amount is an integer (satoshis)
    const amountInSats = Math.floor(amount);

    const payload: CreateInvoiceRequest = {
      satoshis: amountInSats, // amount in satoshis - using 'satoshis' field as per API docs
      description: description.trim(),
      customerEmail: customerEmail.trim(),
      reference: reference || `bitstra_${Date.now()}`,
      expiry, // expiry in seconds
    };

    if (isDevelopment) {
      console.log("[Bitnob Lightning] Creating invoice with payload:", payload);
      console.log("[Bitnob Lightning] API Key present:", !!API_KEY);
      console.log(
        "[Bitnob Lightning] Base URL:",
        isDevelopment ? SANDBOX_BASE_URL : PRODUCTION_BASE_URL
      );
    }

    // Use the correct endpoint from Bitnob documentation
    const response = await api.post<InvoiceResponse>(
      "/wallets/ln/createinvoice",
      payload
    );

    if (isDevelopment) {
      console.log(
        "[Bitnob Lightning] Raw API response:",
        response.status,
        response.data
      );
      console.log("[Bitnob Lightning] Response data structure:", {
        hasStatus: !!response.data.status,
        hasMessage: !!response.data.message,
        hasData: !!response.data.data,
        dataFields: response.data.data ? Object.keys(response.data.data) : [],
        requestField: response.data.data?.request?.substring(0, 100),
      });
    }

    // Validate response structure
    if (!response.data || typeof response.data.status !== "boolean") {
      throw new Error("Invalid response format from Bitnob API");
    }

    // Map Bitnob response to our expected structure
    const bitnobData = response.data.data;

    if (isDevelopment) {
      console.log("[Bitnob Lightning] Processing response data:", bitnobData);
    }

    const mappedData: LightningInvoiceData = {
      ...bitnobData,
      payment_request: bitnobData.request, // Map 'request' to 'payment_request' for consistency
      id: bitnobData.id || `invoice_${Date.now()}`, // Generate ID if not provided
      amount:
        typeof bitnobData.satoshis === "string"
          ? parseInt(bitnobData.satoshis)
          : bitnobData.satoshis,
      expires_at:
        bitnobData.expires_at ||
        new Date(Date.now() + expiry * 1000).toISOString(),
      created_at: bitnobData.created_at || new Date().toISOString(),
      settled: bitnobData.settled || false,
      // Keep the original request field as well
      request: bitnobData.request,
    };

    if (isDevelopment) {
      console.log("[Bitnob Lightning] Mapped invoice data:", mappedData);
    }

    return {
      status: response.data.status,
      message: response.data.message,
      data: mappedData,
    };
  } catch (error) {
    if (isDevelopment) {
      console.error("[Bitnob Lightning] Invoice creation failed:", error);
      if (error instanceof AxiosError) {
        console.error("[Bitnob Lightning] Error details:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
          },
        });
      }
    }

    // Handle specific error cases
    if (error instanceof AxiosError && error.response) {
      const errorData = error.response.data as { message?: string | string[] };
      if (errorData?.message) {
        throw new Error(
          Array.isArray(errorData.message)
            ? errorData.message.join(", ")
            : errorData.message
        );
      }
    }

    throw error; // Re-throw the error instead of calling handleBitnobError
  }
}

/**
 * Get Lightning Invoice Status
 *
 * @param invoiceId - The unique invoice identifier
 * @returns Promise<InvoiceResponse> - Invoice status and details
 */
export async function getLightningInvoiceStatus(
  invoiceId: string
): Promise<InvoiceResponse> {
  try {
    // Validate input
    if (!invoiceId || invoiceId.trim().length === 0) {
      throw new Error("Invoice ID is required");
    }

    if (isDevelopment) {
      console.log("[Bitnob Lightning] Checking invoice status:", invoiceId);
    }

    const response = await api.get<InvoiceResponse>(
      `/wallets/ln/invoice/${invoiceId.trim()}`
    );

    if (isDevelopment) {
      console.log(
        "[Bitnob Lightning] Invoice status retrieved:",
        response.data
      );
    }

    return response.data;
  } catch (error) {
    if (isDevelopment) {
      console.error("[Bitnob Lightning] Failed to get invoice status:", error);
    }
    return handleBitnobError(error as AxiosError);
  }
}

/**
 * Verify Lightning Payment
 *
 * @param paymentHash - The payment hash to verify
 * @returns Promise<InvoiceResponse> - Payment verification result
 */
export async function verifyLightningPayment(
  paymentHash: string
): Promise<InvoiceResponse> {
  try {
    // Validate input
    if (!paymentHash || paymentHash.trim().length === 0) {
      throw new Error("Payment hash is required");
    }

    if (isDevelopment) {
      console.log("[Bitnob Lightning] Verifying payment:", paymentHash);
    }

    const response = await api.get<InvoiceResponse>(
      `/wallets/ln/verify/${paymentHash.trim()}`
    );

    if (isDevelopment) {
      console.log(
        "[Bitnob Lightning] Payment verification result:",
        response.data
      );
    }

    return response.data;
  } catch (error) {
    if (isDevelopment) {
      console.error("[Bitnob Lightning] Payment verification failed:", error);
    }
    return handleBitnobError(error as AxiosError);
  }
}

// Helper function to convert Naira to Satoshis
export function nairaToSatoshis(nairaAmount: number): number {
  if (!nairaAmount || nairaAmount <= 0) {
    throw new Error("Naira amount must be greater than 0");
  }

  // Current conversion rate: 1 Naira ≈ 0.5677 Satoshis
  // You can adjust this rate based on current market conditions
  const conversionRate = 0.5677;
  const satoshis = Math.floor(nairaAmount * conversionRate);

  // Ensure minimum amount (1 satoshi)
  return Math.max(1, satoshis);
}

// Helper function to convert USD to Satoshis
export function usdToSatoshis(usdAmount: number): number {
  if (!usdAmount || usdAmount <= 0) {
    throw new Error("USD amount must be greater than 0");
  }

  // Approximate conversion: 1 USD ≈ 1000-2000 Satoshis (depends on BTC price)
  // This is a rough estimate - you should use real-time conversion rates
  const conversionRate = 1500; // Adjust based on current BTC price
  const satoshis = Math.floor(usdAmount * conversionRate);

  // Ensure minimum amount (1 satoshi)
  return Math.max(1, satoshis);
}

// Helper function to validate Lightning payment request format
export function isValidLightningPaymentRequest(
  paymentRequest: string
): boolean {
  if (!paymentRequest || typeof paymentRequest !== "string") {
    return false;
  }

  // Lightning invoices start with "lnbc" for mainnet or "lntb" for testnet
  const trimmed = paymentRequest.trim().toLowerCase();
  return trimmed.startsWith("lnbc") || trimmed.startsWith("lntb");
}

// Helper function to validate satoshi amounts
export function validateSatoshiAmount(amount: number): number {
  if (!amount || !Number.isInteger(amount) || amount <= 0) {
    throw new Error("Amount must be a positive integer (satoshis)");
  }

  // Lightning Network minimum (1 satoshi) and reasonable maximum
  const MIN_SATOSHIS = 1;
  const MAX_SATOSHIS = 4294967295; // ~42.95 BTC

  if (amount < MIN_SATOSHIS) {
    throw new Error(`Amount must be at least ${MIN_SATOSHIS} satoshis`);
  }

  if (amount > MAX_SATOSHIS) {
    throw new Error(`Amount must not exceed ${MAX_SATOSHIS} satoshis`);
  }

  return amount;
}

// Lightning API object for easier imports
export const lightningAPI = {
  createInvoice: createLightningInvoice,
  getInvoiceStatus: getLightningInvoiceStatus,
  verifyPayment: verifyLightningPayment,
  // Helper functions
  nairaToSatoshis,
  usdToSatoshis,
  validateSatoshiAmount,
  isValidLightningPaymentRequest,
};

// Get Bitcoin Address (for receiving testnet BTC)
export async function getBitcoinAddress(): Promise<BitcoinAddressResponse> {
  try {
    const { data } = await api.get("/wallets/address/bitcoin");
    return data;
  } catch (error) {
    return handleBitnobError(error as AxiosError);
  }
}

// Utility function to check if in sandbox mode
export function isSandboxMode(): boolean {
  return isDevelopment;
}

// Utility to get testnet faucet URLs
export function getTestnetFaucets() {
  return {
    lightning: "https://htlc.me/",
    bitcoin: "https://bitcoinfaucet.uo1.net/",
    info: "Use these faucets to get testnet BTC for testing in sandbox mode",
  };
}

export default api;

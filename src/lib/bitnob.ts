// bitnob.ts
// Bitnob Sandbox API Integration
// Documentation: https://docs.bitnob.com/docs/development-mode
// Sandbox URL: https://sandboxapp.bitnob.co

import axios, { AxiosError } from "axios";

// Types
export interface BitnobResponse {
  status: string;
  message: string;
  data?: any;
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

// Determine environment
const isDevelopment =
  import.meta.env.MODE === "development" ||
  import.meta.env.VITE_BITNOB_ENV === "sandbox";

// Base URLs
const SANDBOX_BASE_URL = "https://sandboxapi.bitnob.com/api/v1";
const PRODUCTION_BASE_URL = "https://api.bitnob.com/api/v1";

// Create axios instance
const api = axios.create({
  baseURL: isDevelopment ? SANDBOX_BASE_URL : PRODUCTION_BASE_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_BITNOB_API_KEY}`,
    "Content-Type": "application/json",
    Accept: "application/json",
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
    const errorData = error.response.data as any;
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
export async function getDataPlans(provider: string = "mtn"): Promise<any> {
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
): Promise<any> {
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
export async function getCableTVBouquets(provider: string): Promise<any> {
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
): Promise<any> {
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
): Promise<any> {
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
export async function getWalletBalance(): Promise<any> {
  try {
    const { data } = await api.get("/wallets/balance");
    return data;
  } catch (error) {
    return handleBitnobError(error as AxiosError);
  }
}

// Create Lightning Invoice (for receiving testnet payments)
export async function createLightningInvoice(
  amount: number,
  description: string = "Top-up"
): Promise<any> {
  try {
    const payload = {
      amount,
      description,
    };

    const { data } = await api.post("/lightning/createinvoice", payload);
    return data;
  } catch (error) {
    return handleBitnobError(error as AxiosError);
  }
}

// Get Bitcoin Address (for receiving testnet BTC)
export async function getBitcoinAddress(): Promise<any> {
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

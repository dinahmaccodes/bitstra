import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BITNOB_BASE_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_BITNOB_API_KEY}`,
    "Content-Type": "application/json",
  },
});

// Example: Buy Airtime
export async function buyAirtime(phone: string, amount: number, provider = "mtn") {
  const { data } = await api.post("/bills/airtime", {
    phoneNumber: phone,
    amount,
    countryCode: "NG",
    provider,
  });
  return data;
}

// Example: Buy Data
export async function buyData(phone: string, planId: string, provider = "mtn") {
  const { data } = await api.post("/bills/data", {
    phoneNumber: phone,
    planId,
    countryCode: "NG",
    provider,
  });
  return data;
}

// Example: Pay Electricity
export async function payElectricity(meterNumber: string, amount: number, provider: string) {
  const { data } = await api.post("/bills/electricity", {
    meterNumber,
    amount,
    provider,
    countryCode: "NG",
  });
  return data;
}
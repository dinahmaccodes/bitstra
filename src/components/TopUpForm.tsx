import { useState } from "react";
import { buyAirtime, buyData, payElectricity } from "../lib/bitnob";

type TopUpType = "airtime" | "data" | "electricity";

interface TopUpFormProps {
  type: TopUpType;
}

export default function TopUpForm({ type }: TopUpFormProps) {
  const [phone, setPhone] = useState("");
  // Handler to enforce max 10 digits and numeric only
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 10) value = value.slice(0, 10);
    setPhone(value);
  };
  const [amount, setAmount] = useState<number>(100);
  const [planId, setPlanId] = useState(""); // for data
  const [meterNumber, setMeterNumber] = useState(""); // for electricity
  const [provider, setProvider] = useState("mtn");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResponse(null);
    try {
      let result;
      if (type === "airtime") {
        result = await buyAirtime(phone, amount, provider);
      } else if (type === "data") {
        result = await buyData(phone, planId, provider);
      } else if (type === "electricity") {
        result = await payElectricity(meterNumber, amount, provider);
      }
      setResponse(result);
    } catch (err: any) {
      setResponse({ error: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded">
      {type !== "electricity" && (
        <input
          className="border p-2 w-full"
          placeholder="Phone number"
          value={phone}
          onChange={handlePhoneChange}
          required
          maxLength={10}
          inputMode="numeric"
          pattern="[0-9]{10}"
        />
      )}
      {type === "data" && (
        <input
          className="border p-2 w-full"
          placeholder="Data Plan ID"
          value={planId}
          onChange={(e) => setPlanId(e.target.value)}
          required
        />
      )}
      {type === "electricity" && (
        <input
          className="border p-2 w-full"
          placeholder="Meter Number"
          value={meterNumber}
          onChange={(e) => setMeterNumber(e.target.value)}
          required
        />
      )}
      <input
        className="border p-2 w-full"
        placeholder="Amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        required={type !== "data"}
      />
      <input
        className="border p-2 w-full"
        placeholder="Network Provider (e.g. mtn, glo)"
        value={provider}
        onChange={(e) => setProvider(e.target.value)}
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Processing..." : "Top Up"}
      </button>
      {response && (
        <pre className="bg-gray-100 p-2 mt-2">
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </form>
  );
}

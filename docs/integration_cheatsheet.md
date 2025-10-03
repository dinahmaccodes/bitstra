# 🚀 Quick Reference - Bitnob Integration Cheat Sheet

## 📦 Files to Update

```bash
# Core API
src/lib/bitnob.ts                    # ✅ Replace

# Pages
src/pages/Airtime.tsx                # ✅ Replace
src/pages/Data.tsx                   # ✅ Replace
src/pages/UtilityBills.tsx           # ✅ Replace

# Components
src/components/DataPlanCard.tsx      # ✅ Replace
src/components/SandboxHelper.tsx     # ✅ Add (optional)
src/pages/DevTools.tsx               # ✅ Add (optional)

# Config
.env                                 # ✅ Create
```

---

## ⚡ Quick Setup

```bash
# 1. Create .env
echo 'VITE_BITNOB_API_KEY=your_key_here' > .env
echo 'VITE_BITNOB_ENV=sandbox' >> .env
echo 'MODE=development' >> .env

# 2. Restart server
npm run dev

# 3. Fund wallet
# Visit: https://htlc.me/

# 4. Test
# Navigate to /airtime and make a purchase
```

---

## 🔑 Environment Variables

```env
# Required
VITE_BITNOB_API_KEY=sk_test_xxxxx

# Optional (have defaults)
VITE_BITNOB_ENV=sandbox
MODE=development
```

---

## 📞 API Functions Quick Reference

```typescript
// Import
import {
  buyAirtime,
  buyData,
  getDataPlans,
  payElectricity,
  verifyMeter,
  getWalletBalance,
  createLightningInvoice,
  getBitcoinAddress,
  isSandboxMode,
} from "@/lib/bitnob";

// Airtime
await buyAirtime("8012345678", 1000, "mtn");

// Data
await buyData("8012345678", "mtn-1gb-daily", "mtn");
await getDataPlans("mtn");

// Electricity
await verifyMeter("1234567890", "ekedc", "prepaid");
await payElectricity("1234567890", 5000, "ekedc", "prepaid");

// Wallet
await getWalletBalance();
await createLightningInvoice(10000, "Top-up");
await getBitcoinAddress();

// Utility
isSandboxMode(); // true in development
```

---

## 🧪 Test Phone Numbers

```typescript
// Any 10-digit number works in sandbox
"8012345678"; // ✅ Valid
"7011111111"; // ✅ Valid
"9033333333"; // ✅ Valid

// Don't use leading zero
"08012345678"; // ❌ Invalid - remove the 0
```

---

## 🐛 Quick Troubleshooting

| Issue                  | Solution                     |
| ---------------------- | ---------------------------- |
| "Invalid API Key"      | Check `.env`, restart server |
| "Insufficient Balance" | Fund at <https://htlc.me/>   |
| "Network Error"        | Check internet, try again    |
| No console logs        | Set `MODE=development`       |
| Plans not loading      | Normal - uses fallback       |

---

## 💻 Console Commands

```javascript
// Check environment
console.log(import.meta.env.VITE_BITNOB_API_KEY);
console.log(isSandboxMode());

// Check balance
const balance = await getWalletBalance();
console.log(balance);

// Get faucet links
const faucets = getTestnetFaucets();
console.log(faucets);
```

---

## 🎨 Component Usage

### DataPlanCard

```typescript
<DataPlanCard
  plan={{
    id: "mtn-1gb-daily",
    data: "1GB",
    duration: "Daily",
    price: "₦350",
    priceValue: 350,
    cashback: "0.43Sats",
    provider: "mtn",
    popular: true,
  }}
  selected={selected}
  onClick={() => handleSelect(plan)}
  disabled={loading}
/>
```

### SandboxHelper

```typescript
import SandboxHelper from "@/components/SandboxHelper";

// In your page
<SandboxHelper />;
```

---

## 🔗 Important Links

| Resource          | URL                                                                                                |
| ----------------- | -------------------------------------------------------------------------------------------------- |
| Sandbox Dashboard | <https://sandboxapp.bitnob.co>                                                                     |
| API Docs          | <https://docs.bitnob.com>                                                                          |
| Lightning Faucet  | <https://htlc.me/>                                                                                 |
| Bitcoin Faucet    | <https://bitcoinfaucet.uo1.net/>                                                                   |
| Slack Community   | [Join](https://join.slack.com/t/bitnobcommunity/shared_invite/zt-2f64rtug6-fphlf4xKJg_d3dlDfMmgUg) |

---

## ✅ Testing Checklist

```
Setup:
□ API key in .env
□ Server restarted
□ Wallet funded
□ Balance > ₦0

Airtime:
□ Select provider
□ Enter phone
□ Choose amount
□ Click Next
□ See success toast

Data:
□ Select provider
□ Plans load
□ Select plan
□ Enter phone
□ Purchase works

Electricity:
□ Select provider
□ Enter meter
□ Verify meter
□ Enter amount
□ Payment works
```

---

## 🎯 Expected Response Times

| Operation        | Time   |
| ---------------- | ------ |
| Get Balance      | ~200ms |
| Fetch Plans      | ~500ms |
| Buy Airtime      | ~1-2s  |
| Buy Data         | ~1-2s  |
| Pay Bills        | ~2-3s  |
| Generate Invoice | ~300ms |

---

## 📊 Provider Codes

```typescript
// Telecom
"mtn", "glo", "airtel", "9mobile";

// Electricity
"ekedc", "ikedc", "aedc", "phed", "eedc", "kedco", "ibedc", "jedc", "kaedco";

// Cable TV
"dstv", "gotv", "startimes";
```

---

## 💡 Common Patterns

### Loading State

```typescript
const [loading, setLoading] = useState(false);

const handleAction = async () => {
  setLoading(true);
  try {
    await apiCall();
  } catch (error) {
    toast({ title: "Error", description: error.message });
  } finally {
    setLoading(false);
  }
};
```

### Error Handling

```typescript
try {
  const result = await buyAirtime(...);
  toast({ title: "Success! 🎉" });
  navigate("/confirm", { state: result });
} catch (error) {
  toast({
    title: "Failed",
    description: error.message,
    variant: "destructive"
  });
}
```

### Balance Check

```typescript
useEffect(() => {
  if (isSandboxMode()) {
    getWalletBalance().then((balance) => {
      setWalletBalance(balance?.data?.balance || 0);
    });
  }
}, []);
```

---

## 🔐 Security Notes

```typescript
// ✅ DO (Development/Testnet)
VITE_BITNOB_API_KEY=sk_test_xxxxx  // In .env
Frontend calls Bitnob API directly

// ❌ DON'T (Production)
Frontend calls Bitnob API directly   // NEVER do this
Expose API keys in client code       // NEVER do this

// ✅ DO (Production)
Frontend → Your Backend → Bitnob API
API keys in server environment only
Implement authentication
Use webhooks
```

---

## 🚀 Performance Tips

1. **Cache Plans** - Don't refetch on every render
2. **Debounce Input** - Wait for user to finish typing
3. **Use Loading States** - Disable during API calls
4. **Lazy Load** - Only fetch when needed
5. **Error Boundaries** - Catch component errors

---

## 📝 Code Snippets

### Buy Airtime with Validation

```typescript
const handleBuyAirtime = async (phone: string, amount: number) => {
  if (!phone || amount < 50) {
    toast({ title: "Invalid input" });
    return;
  }

  setLoading(true);
  try {
    const result = await buyAirtime(phone.replace(/^0+/, ""), amount, provider);
    toast({ title: "Success! 🎉" });
    return result;
  } catch (error) {
    toast({ title: "Failed", description: error.message });
  } finally {
    setLoading(false);
  }
};
```

### Fetch and Display Plans

```typescript
const [plans, setPlans] = useState<DataPlan[]>([]);

useEffect(() => {
  const fetchPlans = async () => {
    try {
      const response = await getDataPlans(provider);
      setPlans(response.data || getDefaultPlans(provider));
    } catch {
      setPlans(getDefaultPlans(provider));
    }
  };
  fetchPlans();
}, [provider]);
```

---

## 🎨 Tailwind Classes Reference

```typescript
// Buttons
"variant='success'"; // Green success button
"variant='topup'"; // Default plan card
"variant='topup-selected'"; // Selected plan card
"variant='destructive'"; // Error/delete button

// Layouts
"grid grid-cols-2 md:grid-cols-3 gap-3"; // Responsive grid
"flex items-center justify-between"; // Flex row
"flex flex-col gap-2"; // Flex column

// Spacing
"p-4"; // Padding 16px
"mt-2"; // Margin top 8px
"space-y-4"; // Vertical gap between children

// Colors
"text-success"; // Green text
"text-muted-foreground"; // Gray text
"bg-muted"; // Light gray background
```

---

## 🔄 Typical Flow

```
1. User visits page
   ↓
2. Check environment (sandbox/prod)
   ↓
3. Load balance (if sandbox)
   ↓
4. Fetch data (plans, providers, etc.)
   ↓
5. User fills form
   ↓
6. Validate input
   ↓
7. Call API
   ↓
8. Handle response (success/error)
   ↓
9. Show toast notification
   ↓
10. Navigate to confirmation (if success)
```

---


### Current Flow 
1. Visit /data page
2. See sandbox mode alert
3. Select provider (MTN/Glo/Airtel/9Mobile)
4. Plans load automatically (6 cards)
5. Click a plan → highlights with ⚡ icon
6. Enter phone number
7. Click "Next"
8. API call to Bitnob testnet
9. Success toast appears
10. Navigate to confirmation with transaction details


// Plans fetch from API
getDataPlans("mtn") → Bitnob API → Returns plans

// Transform to DataPlan objects
{ id, data, duration, price, priceValue, cashback }

// Display in grid
<DataPlanCard plan={plan} ... />

// User purchases
buyData(phone, planId, provider) → Bitnob API → ⚡ Lightning payment

## Gudie page for dealing with this 

https://github.com/Bitnob-Community/app-demo/tree/main/typescript

https://github.com/Bitnob-Community/app-demo/tree/main/typescript/labs

https://github.com/Bitnob-Community/app-demo/tree/main/typescript/labs/src

https://github.com/Bitnob-Community/app-demo/tree/main/typescript/labs/src/styles
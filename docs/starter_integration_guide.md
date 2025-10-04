#  Quick Start Guide - Bitnob Testnet Integration

##  5-Minute Setup

### Step 1: Get Bitnob Sandbox API Key (2 minutes)

1. Visit [https://sandboxapp.bitnob.co/accounts/signup](https://sandboxapp.bitnob.co/accounts/signup)
2. Create an account and verify email
3. Go to Settings → API Keys
4. Click "Generate API Key" and copy it

### Step 2: Configure Environment (1 minute)

Create `.env` in your project root:

```env
VITE_BITNOB_API_KEY=your_api_key_here
VITE_BITNOB_ENV=sandbox
MODE=development
```

**Important:** Restart your dev server after creating/modifying `.env`

```bash
npm run dev

```

### Step 3: Update Files (2 minutes)

Replace these files with the updated versions provided:

- `src/lib/bitnob.ts` - Enhanced API wrapper
- `src/pages/Airtime.tsx` - Updated Airtime component
- `src/pages/Data.tsx` - Updated Data component

Optional: Add the SandboxHelper component for easy testing:
- `src/components/SandboxHelper.tsx`

### Step 4: Fund Your Testnet Wallet

Your sandbox wallet needs testnet Bitcoin to make transactions:

#### Option A: Lightning (Instant)
1. Run your app and use the SandboxHelper component, OR
2. Call the API directly:
```typescript
import { createLightningInvoice } from '@/lib/bitnob';

const invoice = await createLightningInvoice(10000, "Test");
console.log("Pay this at https://htlc.me:", invoice);
```
3. Go to [https://htlc.me/](https://htlc.me/)
4. Paste your invoice and request payment

#### Option B: Onchain (Takes ~10 minutes)
1. Get your address:
```typescript
import { getBitcoinAddress } from '@/lib/bitnob';

const address = await getBitcoinAddress();
console.log("Send Signet BTC here:", address);
```
2. Go to [https://bitcoinfaucet.uo1.net/](https://bitcoinfaucet.uo1.net/)
3. Paste your address and request coins
4. Wait for confirmation

---

##  Testing Your Integration

### Test 1: Check Balance
```typescript
import { getWalletBalance } from '@/lib/bitnob';

const balance = await getWalletBalance();
console.log("Balance:", balance);
```

### Test 2: Buy Airtime
1. Go to your Airtime page
2. Enter a phone number: `8012345678`
3. Select provider: `MTN`
4. Choose amount: `₦100`
5. Click "Next"
6. Watch console for API logs

### Test 3: Buy Data
1. Go to your Data page
2. Enter same phone number
3. Select a data plan
4. Click "Next"
5. Check transaction completed

---

##  Verification Checklist

Use this checklist to ensure everything is working:

- [ ] `.env` file created with API key
- [ ] Dev server restarted after adding `.env`
- [ ] No errors in browser console about missing API key
- [ ] Sandbox mode alert shows on pages
- [ ] Wallet balance displays (may be 0 initially)
- [ ] Can generate Lightning invoice
- [ ] Can get Bitcoin address
- [ ] Wallet funded with testnet BTC
- [ ] Test airtime purchase completes successfully
- [ ] Console shows `[Bitnob Sandbox]` logs
- [ ] Toast notifications appear on success/error
- [ ] Transaction navigates to confirmation page

---

##  Common Issues & Fixes

### Issue: "Invalid API Key" or "401 Unauthorized"

**Solutions:**
- Check `.env` file exists in project root (not `src/`)
- Verify `VITE_BITNOB_API_KEY` is spelled correctly
- Ensure no quotes around the API key in `.env`
- Restart dev server: `Ctrl+C` then `npm run dev`
- Check API key is from **sandbox**, not production

### Issue: "Insufficient Balance"

**Solutions:**
- Fund your sandbox wallet using faucets
- Check balance: `getWalletBalance()`
- Lightning: Use [https://htlc.me/](https://htlc.me/)
- Onchain: Use [https://bitcoinfaucet.uo1.net/](https://bitcoinfaucet.uo1.net/)
- Wait for transaction to confirm (instant for Lightning, ~10 min for onchain)

### Issue: "Network Error" or Timeout

**Solutions:**
- Check internet connection
- Verify sandbox API is accessible
- Try again (sometimes API is slow)
- Check firewall/proxy settings
- Increase timeout in `bitnob.ts` if needed

### Issue: Console Shows No Logs

**Solutions:**
- Open browser DevTools (F12)
- Check Console tab
- Ensure `MODE=development` in `.env`
- Check `import.meta.env.MODE` is 'development'

### Issue: Phone Number Invalid

**Solutions:**
- Remove leading zero: Use `8012345678` not `08012345678`
- Use 10 digits for Nigerian numbers
- Don't include country code in number field (it's in dropdown)

### Issue: Data Plans Not Loading

**Solutions:**
- This is normal - fallback plans are used
- Check console for API error details
- Verify provider name is lowercase in API call
- Component will still work with default plans

---

##  Test Phone Numbers

For testing, you can use any phone number format. In sandbox mode, no actual airtime/data is sent.

**Example test numbers:**
- `8012345678`
- `7011111111`
- `9033333333`

The transaction will complete successfully in sandbox, but won't affect real phone numbers.

---

##  What Should Happen

When everything is working correctly:

1. **Airtime Page:**
   - Shows "Sandbox Mode" alert at top
   - Displays wallet balance
   - Can select provider and amount
   - Clicking "Next" shows loading state
   - Success toast appears
   - Navigates to confirmation page
   - Console shows API request/response

2. **Console Output:**
   ```
   [Bitnob Sandbox] POST /bills/airtime
   [Bitnob Airtime] Request payload: {phoneNumber: "...", ...}
   [Bitnob Response] {status: "success", ...}
   [Airtime Purchase] Success: {...}
   ```

3. **Toast Notification:**
   - "Transaction Successful! 
   - Shows amount and phone number

4. **Confirmation Page:**
   - Displays transaction details
   - Shows transaction ID
   - Shows "sandbox" mode badge

---

##  Next Steps After Setup

Once basic testing works:

1. **Add More Features:**
   - Implement Data.tsx with data plans
   - Add UtilityBills.tsx for electricity
   - Add cable TV payments

2. **Improve UI:**
   - Add loading skeletons
   - Better error messages
   - Transaction history page

3. **Add SandboxHelper:**
   - Makes testing much easier
   - Quick access to fund wallet
   - View transaction history

4. **Production Prep:**
   - Read the full setup guide
   - Plan backend API proxy
   - Implement webhooks
   - Add proper authentication

---

##  Getting Help

If you're still stuck:

1. **Check Browser Console:**
   - Look for error messages
   - Check API responses
   - Verify environment variables

2. **Bitnob Resources:**
   - Docs: [https://docs.bitnob.com](https://docs.bitnob.com)
   - Slack: [Join Community](https://join.slack.com/t/bitnobcommunity/shared_invite/zt-2f64rtug6-fphlf4xKJg_d3dlDfMmgUg)
   - Dashboard: [https://sandboxapp.bitnob.co](https://sandboxapp.bitnob.co)

3. **Debug Checklist:**
   ```typescript
   // Add this temporarily to debug
   console.log("API Key exists:", !!import.meta.env.VITE_BITNOB_API_KEY);
   console.log("Mode:", import.meta.env.MODE);
   console.log("Is Sandbox:", isSandboxMode());
   ```

---

##  Success Criteria

You'll know it's working when:

-  No errors in console
-  API requests show in Network tab
-  Transactions complete successfully
-  Balance updates after funding
-  Toast notifications appear
-  Can complete full purchase flow

**Estimated Setup Time:** 5-10 minutes
**First Successful Transaction:** Within 15 minutes

---

##  Pro Tips

1. **Use SandboxHelper** for faster testing
2. **Fund with Lightning** (instant) not onchain (slow)
3. **Check console logs** to understand what's happening
4. **Start with small amounts** (₦100) for testing
5. **Keep DevTools open** while testing
6. **Test one feature at a time** (start with airtime)

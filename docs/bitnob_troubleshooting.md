# Bitnob Integration: Troubleshooting and Best Practices

## 1. Environment Setup

- Set `VITE_BITNOB_API_KEY` in your `.env` file. Use the correct key for sandbox or production.
- Set `VITE_BITNOB_ENV=sandbox` for testing. Use `production` for live.
- Restart your dev server after changing `.env`.

## 2. Funding Your Wallet (Sandbox)

- Use <https://htlc.me/> to fund your Lightning wallet for test transactions.
- For on-chain (bitcoin) tests, use a testnet faucet like <https://bitcoinfaucet.uo1.net/>.
- Transactions will fail if your balance is zero.

## 3. Phone Number Format

- Always use a 10-digit phone number (e.g., `8012345678`).
- Do not include a leading zero or country code in the number field.
- Example: `+2348012345678` is split as `+234` (country code) and `8012345678` (number).

## 4. API Usage

- Use the provided Bitnob SDK or REST endpoints as shown in the Bitnob Community demo repo.
- Example for airtime:

  ```ts
  await buyAirtime("8012345678", 1000, "mtn");
  ```

- Example for data:

  ```ts
  await buyData("8012345678", "mtn-1gb-daily", "mtn");
  ```

- Always check the API response for errors and handle them in your UI.

## 5. Error Handling

- Log the full error response from the API for debugging.
- Common errors:
  - `Invalid API Key`: Check your `.env` and restart the server.
  - `Insufficient Balance`: Fund your wallet.
  - `Network Error`: Check your internet connection and API endpoint.
  - `Invalid Input`: Check phone number and required fields.

## 6. Testing

- Use the test phone numbers provided in the docs (any 10-digit number).
- Check your wallet balance before running transactions.
- Use the Bitnob sandbox dashboard to monitor transactions: <https://sandboxapp.bitnob.co>

## 7. Reference Code

- For working code examples, see:
  - <https://github.com/Bitnob-Community/app-demo/tree/main/typescript/labs/src/lib>
  - <https://github.com/Bitnob-Community/app-demo/tree/main/typescript/labs/src/app>
- Review the `buyAirtime`, `buyData`, and `getWalletBalance` functions for correct usage.

## 8. General Tips

- Always validate user input before sending to the API.
- Show clear error messages to users based on API responses.
- Use loading states during API calls to prevent duplicate submissions.
- Cache data plans and providers to reduce API calls.

## 9. Security (Production)

- Never expose your production API key in frontend code.
- For production, route API calls through your backend and secure your keys.

---

For more details, check the Bitnob Community demo repo and official API docs: <https://docs.bitnob.com>

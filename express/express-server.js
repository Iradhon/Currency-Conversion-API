const express = require("express");

const app = express();
const PORT = 2000;

const conversionRates = {
  usd: 1500,
  eur: 1700,
  cny: 2000,
};

// ─── Validation Middleware ────────────────────────────────────────────────────

function validateConversionQuery(req, res, next) {
  const { amount, currency } = req.query;

  if (amount === undefined || amount === "") {
    return res.status(400).json({
      error: "Missing required query parameter: amount",
    });
  }

  if (currency === undefined || currency === "") {
    return res.status(400).json({
      error: "Missing required query parameter: currency",
    });
  }

  const numericAmount = Number(amount);
  if (isNaN(numericAmount) || amount.trim() === "") {
    return res.status(400).json({
      error: "Invalid value for 'amount': must be a valid number",
    });
  }

  const normalizedCurrency = currency.toLowerCase();
  if (!conversionRates[normalizedCurrency]) {
    return res.status(400).json({
      error: `Unsupported currency: '${currency}'. Supported currencies are: ${Object.keys(conversionRates).join(", ")}`,
    });
  }

  // Attach cleaned values to req for the route handler
  req.conversion = {
    amount: numericAmount,
    currency: normalizedCurrency,
  };

  next();
}

// ─── Route Handler ────────────────────────────────────────────────────────────

function handleConvert(req, res) {
  const { amount, currency } = req.conversion;
  const convertedAmount = amount * conversionRates[currency];

  res.status(200).json({
    input: { amount, currency },
    convertedAmount,
    unit: "RWF",
  });
}

// ─── Route ────────────────────────────────────────────────────────────────────

app.get("/convert", validateConversionQuery, handleConvert);

// ─── 404 Fallback ─────────────────────────────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// ─── Start Server ─────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}`);
  console.log(`Try: http://localhost:${PORT}/convert?amount=50&currency=usd`);
});

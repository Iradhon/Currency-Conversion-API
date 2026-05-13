const http = require("http");
const url = require("url");

const conversionRates = {
  usd: 1500,
  eur: 1700,
  cny: 2000,
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (req.method !== "GET" || parsedUrl.pathname !== "/convert") {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
    return;
  }

  const { amount, currency } = parsedUrl.query;

  // Validate: missing amount
  if (amount === undefined || amount === "") {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Missing required query parameter: amount" }));
    return;
  }

  // Validate: missing currency
  if (currency === undefined || currency === "") {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Missing required query parameter: currency" }));
    return;
  }

  // Validate: amount must be a valid number
  const numericAmount = Number(amount);
  if (isNaN(numericAmount) || amount.trim() === "") {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Invalid value for 'amount': must be a valid number" }));
    return;
  }

  // Validate: supported currency
  const normalizedCurrency = currency.toLowerCase();
  if (!conversionRates[normalizedCurrency]) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        error: `Unsupported currency: '${currency}'. Supported currencies are: ${Object.keys(conversionRates).join(", ")}`,
      })
    );
    return;
  }

  const convertedAmount = numericAmount * conversionRates[normalizedCurrency];

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      input: {
        amount: numericAmount,
        currency: normalizedCurrency,
      },
      convertedAmount,
      unit: "RWF",
    })
  );
});

const PORT = 2000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Try: http://localhost:${PORT}/convert?amount=50&currency=usd`);
});
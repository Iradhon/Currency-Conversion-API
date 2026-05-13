# Currency Conversion API

![Node.js](https://img.shields.io/badge/Node.js-18%2B-brightgreen?logo=node.js) ![Express](https://img.shields.io/badge/Express-4.x-black?logo=express) ![License](https://img.shields.io/badge/license-MIT-blue)

A currency conversion REST API built twice — once with Node's built-in `http` module, once with Express.js — to demonstrate the difference between low-level and framework-based approaches.

> **Course:** Backend Web Development  
> **Assignment:** Homework — Currency Conversion API (Parts 1 & 2)  
> **Author:** Your Name Here

## Supported Currencies

| Code | Currency | Rate (to RWF) |
|------|----------|---------------|
| `usd` | US Dollar | 1,500 |
| `eur` | Euro | 1,700 |
| `cny` | Chinese Yuan | 2,000 |

---

## Project Structure

```
currency-conversion-api/
├── http-server.js       # Part 1 — built-in http module, no dependencies
├── express-server.js    # Part 2 — Express.js with middleware
├── package.json
└── README.md
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)

---

## Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/your-username/currency-conversion-api.git

# 2. Navigate into the project
cd currency-conversion-api

# 3. Install dependencies (only needed for Part 2)
npm install
```

---

## Part 1 — `http-server.js`

Uses **only** Node's built-in `http` and `url` modules. No dependencies required.

### Run

```bash
node http-server.js
```

---

## Part 2 — `express-server.js`

Rebuilt using **Express.js** with:
- Separated validation middleware (`validateConversionQuery`)
- Separated route handler (`handleConvert`)
- Clean JSON responses via `res.status().json()`

### Install & Run

```bash
npm install express
node express-server.js
```

---

## Endpoint

### `GET /convert`

**Query Parameters:**

| Parameter  | Type   | Required | Description                          |
|------------|--------|----------|--------------------------------------|
| `amount`   | number | ✅       | The amount to convert                |
| `currency` | string | ✅       | `usd`, `eur`, or `cny` (case-insensitive) |

**Success Response — `200 OK`:**

```json
{
  "input": {
    "amount": 50,
    "currency": "usd"
  },
  "convertedAmount": 75000,
  "unit": "RWF"
}
```

**Error Response — `400 Bad Request`:**

```json
{
  "error": "Unsupported currency: 'gbp'. Supported currencies are: usd, eur, cny"
}
```

**Error cases handled:**

| Case | Example URL |
|---|---|
| Missing `amount` | `/convert?currency=usd` |
| Missing `currency` | `/convert?amount=50` |
| Invalid number | `/convert?amount=abc&currency=usd` |
| Unsupported currency | `/convert?amount=50&currency=gbp` |

---

## Testing with curl

Once either server is running on port 2000, use these commands to test:

```bash
# ✅ Valid — USD conversion
curl "http://localhost:2000/convert?amount=50&currency=usd"

# ✅ Valid — EUR conversion
curl "http://localhost:2000/convert?amount=100&currency=eur"

# ✅ Valid — CNY conversion (uppercase also works)
curl "http://localhost:2000/convert?amount=25&currency=CNY"

# ❌ Missing amount
curl "http://localhost:2000/convert?currency=usd"

# ❌ Missing currency
curl "http://localhost:2000/convert?amount=50"

# ❌ Invalid number
curl "http://localhost:2000/convert?amount=abc&currency=usd"

# ❌ Unsupported currency
curl "http://localhost:2000/convert?amount=50&currency=gbp"
```

---

## Reflection Questions

### 1. What was harder when using the `http` module?

Everything had to be done manually. Parsing query parameters required importing `url` and calling `url.parse()`. Sending JSON back meant manually setting the `Content-Type` header and calling `res.end(JSON.stringify(...))` every single time. There was also no routing system, so checking `req.method` and `req.url` by hand got verbose fast. Any mistake in the boilerplate — like forgetting a header — could silently cause bugs.

### 2. What advantages did Express provide?

Express eliminated nearly all the boilerplate. `req.query` gives parsed parameters immediately, `res.status(400).json({...})` handles headers and serialization in one call, and the routing system (`app.get(...)`) is declarative and readable. It also made adding middleware trivial — one extra argument in the route definition.

### 3. Why is middleware useful?

Middleware separates *concerns*. Validation logic doesn't belong in the route handler — the handler should only deal with the happy path. By extracting validation into its own middleware function, each piece of code has one job. This makes both functions easier to test, reuse, and reason about. If validation rules change, there's exactly one place to update them.

### 4. Which version was easier to maintain?

The Express version, clearly. The separation between middleware and route handler means the codebase has an obvious structure even for someone reading it for the first time. Adding a new currency, a new validation rule, or a new endpoint all have a predictable, isolated place to go. The `http` version is a single growing block of `if` statements that gets harder to manage as requirements grow.

---

## http vs Express — Quick Comparison

| Feature | `http` module | Express.js |
|---|---|---|
| Query parsing | Manual (`url.parse`) | Built-in (`req.query`) |
| Send JSON | `res.end(JSON.stringify(...))` | `res.json({...})` |
| Set status code | `res.writeHead(400, ...)` | `res.status(400)` |
| Routing | Manual `if` checks | `app.get(path, ...)` |
| Middleware | Not built-in | First-class support |
| Lines of code | More | Less |

---

## License

MIT — free to use for educational purposes.

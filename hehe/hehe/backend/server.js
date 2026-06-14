const express = require("express");
const cors = require("cors");

const app = express();
const port = Number(process.env.PORT || 8080);

const apiKey = (process.env.BRIXHUB_API_KEY || "").trim();
const baseUrl = "https://brixhub.net/api/v1";

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(express.json({ limit: "1mb" }));
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Origin not allowed by CORS"));
    }
  })
);

function buildHeaders() {
  return {
    "X-API-Key": apiKey,
    "User-Agent": "MonApp/1.0",
    Accept: "application/json",
    "Content-Type": "application/json"
  };
}

async function callBrixHub(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      ...buildHeaders(),
      ...(options.headers || {})
    }
  });

  const raw = await response.text();
  let json = null;

  try {
    json = JSON.parse(raw);
  } catch (_error) {
    return {
      ok: false,
      status: 502,
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        error: "Upstream returned non-JSON response",
        upstream_status: response.status,
        upstream_content_type: response.headers.get("content-type") || "",
        upstream_preview: raw.slice(0, 180)
      }
    };
  }

  return {
    ok: response.ok,
    status: response.status,
    headers: {
      "Content-Type": "application/json",
      "X-RateLimit-Limit-Day": response.headers.get("X-RateLimit-Limit-Day") || "",
      "X-RateLimit-Remaining-Day": response.headers.get("X-RateLimit-Remaining-Day") || "",
      "X-RateLimit-Limit-Min": response.headers.get("X-RateLimit-Limit-Min") || ""
    },
    body: json
  };
}

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "yhnlookup-backend" });
});

app.get("/account", async (_req, res) => {
  if (!apiKey) {
    res.status(500).json({ error: "BRIXHUB_API_KEY missing on server" });
    return;
  }

  try {
    const result = await callBrixHub("/me", { method: "GET" });
    res.status(result.status).set(result.headers).json(result.body);
  } catch (error) {
    res.status(500).json({ error: "Internal server error", message: error.message });
  }
});

app.post("/search", async (req, res) => {
  if (!apiKey) {
    res.status(500).json({ error: "BRIXHUB_API_KEY missing on server" });
    return;
  }

  try {
    const result = await callBrixHub("/search", {
      method: "POST",
      body: JSON.stringify(req.body || {})
    });

    res.status(result.status).set(result.headers).json(result.body);
  } catch (error) {
    res.status(500).json({ error: "Internal server error", message: error.message });
  }
});

app.post("/lookup", async (req, res) => {
  if (!apiKey) {
    res.status(500).json({ error: "BRIXHUB_API_KEY missing on server" });
    return;
  }

  const { type, value } = req.body || {};
  const endpoints = {
    email: "lookup/email",
    phone: "lookup/phone",
    iban: "lookup/iban"
  };

  if (!type || !value || !endpoints[type]) {
    res.status(400).json({ error: "Missing or invalid type/value" });
    return;
  }

  try {
    const result = await callBrixHub(`/${endpoints[type]}/${encodeURIComponent(String(value))}`, {
      method: "GET"
    });

    res.status(result.status).set(result.headers).json(result.body);
  } catch (error) {
    res.status(500).json({ error: "Internal server error", message: error.message });
  }
});

app.listen(port, () => {
  console.log(`yhnlookup backend listening on port ${port}`);
});

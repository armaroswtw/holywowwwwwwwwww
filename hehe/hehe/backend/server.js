const express = require("express");
const cors = require("cors");

const app = express();
const port = Number(process.env.PORT || 8080);
const apiKey = String(process.env.BRIXHUB_API_KEY || "").trim();
const baseUrl = "https://brixhub.net/api/v1";

const allowedOrigins = String(process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((x) => x.trim())
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

function upstreamHeaders() {
  return {
    "X-API-Key": apiKey,
    "User-Agent": "MonApp/1.0",
    "Accept": "application/json",
    "Content-Type": "application/json"
  };
}

async function callBrix(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      ...upstreamHeaders(),
      ...(options.headers || {})
    }
  });

  const raw = await response.text();
  let json;
  try {
    json = JSON.parse(raw);
  } catch (_e) {
    return {
      status: 502,
      headers: { "Content-Type": "application/json" },
      body: {
        error: "Upstream returned non-JSON response",
        upstream_status: response.status,
        upstream_content_type: response.headers.get("content-type") || "",
        upstream_preview: raw.slice(0, 180)
      }
    };
  }

  return {
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
  res.status(200).json({ status: "ok", service: "proxy-backend" });
});

app.get("/account", async (_req, res) => {
  if (!apiKey) {
    res.status(500).json({ error: "BRIXHUB_API_KEY missing" });
    return;
  }

  try {
    const result = await callBrix("/me", { method: "GET" });
    res.status(result.status).set(result.headers).json(result.body);
  } catch (error) {
    res.status(500).json({ error: "Internal server error", message: error.message });
  }
});

app.post("/search", async (req, res) => {
  if (!apiKey) {
    res.status(500).json({ error: "BRIXHUB_API_KEY missing" });
    return;
  }

  try {
    const result = await callBrix("/search", {
      method: "POST",
      body: JSON.stringify(req.body || {})
    });

    res.status(result.status).set(result.headers).json(result.body);
  } catch (error) {
    res.status(500).json({ error: "Internal server error", message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Proxy backend running on port ${port}`);
});

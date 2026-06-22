import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import recipesRouter from "./routes/recipes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const configuredOrigins = new Set(
  (process.env.CORS_ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
);
const netlifyOriginRegex = /^https:\/\/(?:[a-zA-Z0-9-]+\.)?chefbonbon\.netlify\.app$/;

const isAllowedOrigin = (origin) => (
  !origin ||
  origin.startsWith("http://localhost:") ||
  netlifyOriginRegex.test(origin) ||
  configuredOrigins.has(origin)
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(limiter);
app.use(cors({
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) return callback(null, true);
    return callback(new Error(`Origin is not allowed by CORS: ${origin}`), false);
  },
}));
app.use(express.json({ limit: "50kb" }));
app.use("/api", recipesRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

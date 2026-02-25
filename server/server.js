import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import recipesRouter from "./routes/recipes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

const allowedOriginRegex =
  /^https:\/\/(?:[a-zA-Z0-9-]+\.)?chefbonbon\.netlify\.app$/;

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (origin && origin.startsWith("http://localhost:")) {
        return callback(null, true);
      }
      if (allowedOriginRegex.test(origin)) {
        callback(null, true);
      } else {
        const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}.`;
        callback(new Error(msg), false);
      }
    },
  })
);

app.use(express.json());

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

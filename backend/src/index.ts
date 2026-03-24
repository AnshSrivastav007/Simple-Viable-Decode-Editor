import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { executeRouter } from "./routes/execute";
import { snippetsRouter } from "./routes/snippets";
import { languagesRouter } from "./routes/languages";
import { startLanguageSyncJob } from "./jobs/languageSyncJob";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json({ limit: "1mb" }));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { error: "Too many requests" },
});
app.use(limiter);

app.use("/api/execute", executeRouter);
app.use("/api/snippets", snippetsRouter);
app.use("/api/languages", languagesRouter);

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

startLanguageSyncJob();

app.listen(PORT, () => {
  console.log(`🚀 SVDE Backend running on port ${PORT}`);
  console.log(`📅 Language sync job active`);
});

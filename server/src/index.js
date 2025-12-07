import "dotenv/config";
import express from "express";
import cors from "cors";
import dramaRoutes from "./routes/dramaRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, timestamp: Date.now() });
});

app.use("/api", dramaRoutes);

const PORT = process.env.PORT ?? 4000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Drama proxy server running on http://0.0.0.0:${PORT}`);
});

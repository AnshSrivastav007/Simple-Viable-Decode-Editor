import { Router } from "express";
import {
  getActiveLanguages,
  searchLanguages,
  syncLanguages,
} from "../services/languageSync";

export const languagesRouter = Router();

languagesRouter.get("/", async (req, res) => {
  try {
    const languages = await getActiveLanguages();
    res.json({ languages });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch languages" });
  }
});

languagesRouter.get("/search", async (req, res) => {
  const { q } = req.query;

  if (!q || typeof q !== "string") {
    return res.status(400).json({ error: "Query parameter 'q' required" });
  }

  try {
    const languages = await searchLanguages(q);
    res.json({ languages });
  } catch (error) {
    res.status(500).json({ error: "Search failed" });
  }
});

languagesRouter.post("/sync", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const result = await syncLanguages();
    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(500).json({ error: "Sync failed" });
  }
});

languagesRouter.get("/sync/history", async (req, res) => {
  try {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();

    const logs = await prisma.syncLog.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
    });

    res.json({ logs });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sync history" });
  }
});

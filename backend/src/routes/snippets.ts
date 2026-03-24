import { Router } from "express";
import { nanoid } from "nanoid";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const snippetsRouter = Router();

snippetsRouter.post("/", async (req, res) => {
  const { code, languageId } = req.body;

  if (!code || !languageId) {
    return res.status(400).json({ error: "Code and languageId are required" });
  }

  try {
    const id = nanoid(12);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const snippet = await prisma.snippet.create({
      data: {
        id,
        code,
        languageId,
        expiresAt,
      },
    });

    res.json({
      success: true,
      snippetId: id,
      expiresAt: snippet.expiresAt,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create snippet" });
  }
});

snippetsRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const snippet = await prisma.snippet.findUnique({
      where: { id },
      include: { language: true },
    });

    if (!snippet) {
      return res.status(404).json({ error: "Snippet not found" });
    }

    if (new Date() > snippet.expiresAt) {
      await prisma.snippet.delete({ where: { id } });
      return res.status(410).json({ error: "Snippet expired and deleted" });
    }

    res.json({
      success: true,
      code: snippet.code,
      language: snippet.language,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch snippet" });
  }
});

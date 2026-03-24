import { Router } from "express";
import axios from "axios";
import { nanoid } from "nanoid";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

const PISTON_API = "https://emkc.org/api/v2/piston";

const LANGUAGE_MAP: { [key: number]: { language: string; version: string } } = {
  1: { language: "python", version: "3.10.0" },
  2: { language: "javascript", version: "18.15.0" },
  4: { language: "java", version: "15.0.2" },
  7: { language: "c", version: "10.2.0" },
  10: { language: "c++", version: "10.2.0" },
  12: { language: "csharp", version: "6.12.0" },
  17: { language: "ruby", version: "3.0.1" },
  20: { language: "kotlin", version: "1.8.20" },
  21: { language: "go", version: "1.16.2" },
  23: { language: "typescript", version: "5.0.3" },
  29: { language: "rust", version: "1.68.2" },
  31: { language: "swift", version: "5.8" },
  8: { language: "php", version: "8.2.0" },
  44: { language: "bash", version: "5.2.0" },
  50: { language: "r", version: "4.1.1" },
  54: { language: "perl", version: "5.36.0" },
  55: { language: "lua", version: "5.4.4" },
  56: { language: "haskell", version: "9.4.1" },
  64: { language: "dart", version: "2.19.6" },
  71: { language: "scala", version: "3.2.2" },
  72: { language: "julia", version: "1.8.5" },
};

interface ExecuteRequest {
  code: string;
  languageId: number;
  stdin?: string;
}

router.post("/", async (req, res) => {
  const { code, languageId, stdin }: ExecuteRequest = req.body;

  if (!code || !languageId) {
    return res.status(400).json({ error: "Code and languageId are required" });
  }

  const langConfig = LANGUAGE_MAP[languageId];
  
  if (!langConfig) {
    return res.status(400).json({ 
      success: false, 
      error: `Language with ID ${languageId} not supported by Piston API`,
      executionTime: 0 
    });
  }

  const startTime = Date.now();

  try {
    console.log(`Executing code for languageId: ${languageId}, config:`, langConfig);
    
    const response = await axios.post(
      `${PISTON_API}/execute`,
      {
        language: langConfig.language,
        version: langConfig.version,
        files: [{ content: code }],
        stdin: stdin || "",
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log("Piston response:", response.data);

    const executionTime = Date.now() - startTime;
    const result = response.data;

    if (result.run) {
      const output = result.run.output || "";
      const stderr = result.run.stderr || "";
      
      if (stderr && !output) {
        res.json({
          success: false,
          error: stderr,
          executionTime,
          status: "Error",
        });
      } else {
        res.json({
          success: true,
          output: output,
          stderr: stderr,
          executionTime,
          status: "Completed",
        });
      }
    } else {
      res.json({
        success: false,
        error: result.message || "Execution failed",
        executionTime,
      });
    }
  } catch (error: any) {
    const executionTime = Date.now() - startTime;
    res.status(500).json({
      success: false,
      error: error.message || "Execution failed",
      executionTime,
    });
  }
});

router.post("/save", async (req, res) => {
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
    res.status(500).json({ error: "Failed to save snippet" });
  }
});

router.get("/:id", async (req, res) => {
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
      return res.status(410).json({ error: "Snippet expired" });
    }

    res.json({
      success: true,
      snippet: {
        code: snippet.code,
        language: snippet.language,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch snippet" });
  }
});

export const executeRouter = router;

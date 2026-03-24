import cron from "node-cron";
import { syncLanguages } from "../services/languageSync";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function startLanguageSyncJob() {
  console.log("📅 Language sync job scheduled");

  cron.schedule("0 3 * * *", async () => {
    console.log("🔄 Running scheduled language sync...");

    try {
      const result = await syncLanguages();

      await prisma.syncLog.create({
        data: {
          added: result.added,
          updated: result.updated,
          total: result.total,
          success: true,
        },
      });

      console.log("✅ Scheduled sync completed");
    } catch (error: any) {
      console.error("❌ Scheduled sync failed:", error);

      await prisma.syncLog.create({
        data: {
          added: 0,
          updated: 0,
          total: 0,
          success: false,
          error: error.message,
        },
      });
    }
  });
}

export async function runManualSync() {
  console.log("🔄 Running manual language sync...");
  return await syncLanguages();
}

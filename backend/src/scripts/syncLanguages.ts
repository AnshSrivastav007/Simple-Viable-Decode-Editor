import { syncLanguages } from "../services/languageSync";

async function main() {
  console.log("🔄 Starting manual language sync...");

  try {
    const result = await syncLanguages();

    console.log("\n✅ Sync completed successfully!");
    console.log(`   Added: ${result.added}`);
    console.log(`   Updated: ${result.updated}`);
    console.log(`   Total: ${result.total}`);

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Sync failed:", error);
    process.exit(1);
  }
}

main();

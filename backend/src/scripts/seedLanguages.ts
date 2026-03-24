import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEFAULT_LANGUAGES = [
  { judge0Id: 1, name: "Python", icon: "🐍", extension: "py" },
  { judge0Id: 2, name: "JavaScript", icon: "🟨", extension: "js" },
  { judge0Id: 4, name: "Java", icon: "☕", extension: "java" },
  { judge0Id: 7, name: "C", icon: "🔵", extension: "c" },
  { judge0Id: 10, name: "C++", icon: "⚡", extension: "cpp" },
  { judge0Id: 23, name: "TypeScript", icon: "🔷", extension: "ts" },
  { judge0Id: 12, name: "C#", icon: "💜", extension: "cs" },
  { judge0Id: 21, name: "Go", icon: "🐹", extension: "go" },
  { judge0Id: 29, name: "Rust", icon: "🦀", extension: "rs" },
  { judge0Id: 17, name: "Ruby", icon: "💎", extension: "rb" },
  { judge0Id: 8, name: "PHP", icon: "🐘", extension: "php" },
  { judge0Id: 31, name: "Swift", icon: "🍎", extension: "swift" },
  { judge0Id: 20, name: "Kotlin", icon: "🟣", extension: "kt" },
];

async function main() {
  console.log("Seeding default languages...");

  for (const lang of DEFAULT_LANGUAGES) {
    try {
      await prisma.language.upsert({
        where: { judge0Id: lang.judge0Id },
        update: lang,
        create: lang,
      });
      console.log(`✅ ${lang.name}`);
    } catch (e) {
      console.log(`⚠️ ${lang.name} - may already exist`);
    }
  }

  console.log("✅ Seeding complete!");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

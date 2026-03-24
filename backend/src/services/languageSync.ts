import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const JUDGE0_API = "https://judge0-ce.p.rapidapi.com";
const RAPID_API_KEY = process.env.RAPIDAPI_KEY || "";

interface Judge0Language {
  id: number;
  name: string;
}

interface LanguageIcon {
  [key: string]: string;
}

const languageIcons: LanguageIcon = {
  python: "🐍",
  javascript: "🟨",
  typescript: "🔷",
  java: "☕",
  "c++": "⚡",
  c: "🔵",
  "c#": "💜",
  go: "🐹",
  rust: "🦀",
  ruby: "💎",
  php: "🐘",
  swift: "🍎",
  kotlin: "🟣",
  scala: "🔴",
  r: "📊",
  perl: "🐪",
  lua: "🌙",
  haskell: "λ",
  elixir: "💧",
  clojure: "🔃",
  "f#": "🔷",
  dart: "🎯",
  julia: "🔮",
  bash: "🖥️",
  powershell: "💻",
  sql: "🗄️",
  prolog: "🧠",
  lisp: "🌿",
  scheme: "📝",
  erlang: "📞",
  ocaml: "🐫",
  nim: "👑",
  crystal: "💠",
  zig: "⚡",
  d: "🔶",
  ada: "🏛️",
  fortran: "🔢",
  cobol: "🏦",
  pascal: "📐",
  assembly: "🔧",
  brainfuck: "🧩",
  groovy: "🎸",
  objective: "📱",
  vb: "🔷",
  matlab: "📈",
  solidity: "⛓️",
};

function getLanguageIcon(languageName: string): string {
  const name = languageName.toLowerCase();
  
  if (languageIcons[name]) return languageIcons[name];
  
  for (const [key, icon] of Object.entries(languageIcons)) {
    if (name.includes(key) || key.includes(name)) {
      return icon;
    }
  }
  
  return "📄";
}

function getFileExtension(languageName: string): string {
  const extensionMap: { [key: string]: string } = {
    python: "py",
    javascript: "js",
    typescript: "ts",
    java: "java",
    "c++": "cpp",
    c: "c",
    "c#": "cs",
    go: "go",
    rust: "rs",
    ruby: "rb",
    php: "php",
    swift: "swift",
    kotlin: "kt",
    scala: "scala",
    r: "r",
    perl: "pl",
    lua: "lua",
    haskell: "hs",
    elixir: "ex",
    clojure: "clj",
    "f#": "fs",
    dart: "dart",
    julia: "jl",
    bash: "sh",
    powershell: "ps1",
    sql: "sql",
    prolog: "pl",
    lisp: "lisp",
    erlang: "erl",
    ocaml: "ml",
    nim: "nim",
    crystal: "cr",
    zig: "zig",
    d: "d",
    fortran: "f90",
    cobol: "cob",
    pascal: "pas",
    assembly: "asm",
    groovy: "groovy",
  };

  const name = languageName.toLowerCase();
  for (const [key, ext] of Object.entries(extensionMap)) {
    if (name.includes(key)) return ext;
  }
  
  return "txt";
}

export async function fetchLanguagesFromJudge0(): Promise<Judge0Language[]> {
  try {
    const response = await axios.get(`${JUDGE0_API}/languages`, {
      headers: {
        "X-RapidAPI-Key": RAPID_API_KEY,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching languages from Judge0:", error);
    return [];
  }
}

export async function syncLanguages(): Promise<{
  added: number;
  updated: number;
  total: number;
}> {
  console.log("🔄 Starting language sync...");

  let judge0Languages = await fetchLanguagesFromJudge0();

  if (judge0Languages.length === 0) {
    console.log("⚠️ Judge0 unavailable, trying Piston API...");
    judge0Languages = await fetchLanguagesFromPiston();
  }

  if (judge0Languages.length === 0) {
    console.log("⚠️ Using default languages (no API available)");
    return { added: 0, updated: 0, total: DEFAULT_LANGUAGES.length };
  }

  let added = 0;
  let updated = 0;

  for (const lang of judge0Languages) {
    const languageData = {
      judge0Id: lang.id,
      name: lang.name,
      icon: getLanguageIcon(lang.name),
      extension: getFileExtension(lang.name),
      isActive: true,
      updatedAt: new Date(),
    };

    try {
      const existing = await prisma.language.findUnique({
        where: { judge0Id: lang.id },
      });

      if (existing) {
        await prisma.language.update({
          where: { judge0Id: lang.id },
          data: languageData,
        });
        updated++;
      } else {
        await prisma.language.create({
          data: languageData,
        });
        added++;
      }
    } catch (error) {
      console.error(`Error syncing language ${lang.name}:`, error);
    }
  }

  console.log(`✅ Sync complete: ${added} added, ${updated} updated`);

  return {
    added,
    updated,
    total: judge0Languages.length,
  };
}

const DEFAULT_LANGUAGES = [
  { id: 1, judge0Id: 1, name: "Python", icon: "🐍", extension: "py", isActive: true },
  { id: 2, judge0Id: 2, name: "JavaScript", icon: "🟨", extension: "js", isActive: true },
  { id: 3, judge0Id: 4, name: "Java", icon: "☕", extension: "java", isActive: true },
  { id: 4, judge0Id: 7, name: "C", icon: "🔵", extension: "c", isActive: true },
  { id: 5, judge0Id: 10, name: "C++", icon: "⚡", extension: "cpp", isActive: true },
  { id: 6, judge0Id: 23, name: "TypeScript", icon: "🔷", extension: "ts", isActive: true },
  { id: 7, judge0Id: 12, name: "C#", icon: "💜", extension: "cs", isActive: true },
  { id: 8, judge0Id: 21, name: "Go", icon: "🐹", extension: "go", isActive: true },
  { id: 9, judge0Id: 29, name: "Rust", icon: "🦀", extension: "rs", isActive: true },
  { id: 10, judge0Id: 17, name: "Ruby", icon: "💎", extension: "rb", isActive: true },
  { id: 11, judge0Id: 8, name: "PHP", icon: "🐘", extension: "php", isActive: true },
  { id: 12, judge0Id: 31, name: "Swift", icon: "🍎", extension: "swift", isActive: true },
  { id: 13, judge0Id: 20, name: "Kotlin", icon: "🟣", extension: "kt", isActive: true },
];

async function fetchLanguagesFromPiston() {
  try {
    const response = await axios.get("https://emkc.org/api/v2/piston/runtimes");
    const runtimes = response.data;
    
    const pistonLangMap: { [key: string]: number } = {
      python: 1,
      javascript: 2,
      java: 4,
      c: 7,
      "c++": 10,
      csharp: 12,
      ruby: 17,
      kotlin: 20,
      go: 21,
      typescript: 23,
      rust: 29,
      swift: 31,
      php: 8,
    };

    return runtimes
      .filter((r: any) => pistonLangMap[r.language] && r.version.includes("."))
      .map((r: any) => ({
        id: pistonLangMap[r.language],
        name: r.language.charAt(0).toUpperCase() + r.language.slice(1),
      }));
  } catch (error) {
    console.error("Error fetching from Piston:", error);
    return [];
  }
}

export async function getActiveLanguages() {
  try {
    const languages = await prisma.language.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
    if (languages.length > 0) return languages;
  } catch (e) {
    console.log("Using default languages (no database)");
  }
  return DEFAULT_LANGUAGES;
}

export async function getLanguageById(id: number) {
  return await prisma.language.findUnique({
    where: { id },
  });
}

export async function searchLanguages(query: string) {
  return await prisma.language.findMany({
    where: {
      isActive: true,
      name: {
        contains: query,
        mode: "insensitive",
      },
    },
    orderBy: { name: "asc" },
  });
}

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Language {
  id: number;
  judge0Id: number;
  name: string;
  icon: string;
  extension: string;
}

interface EditorState {
  code: string;
  language: Language | null;
  languages: Language[];
  theme: "dark" | "light";
  output: string | null;
  error: string | null;
  executionTime: number | null;
  isRunning: boolean;
  isLoadingLanguages: boolean;
  setCode: (code: string) => void;
  setLanguage: (language: Language) => void;
  setLanguages: (languages: Language[]) => void;
  toggleTheme: () => void;
  setOutput: (output: string | null) => void;
  setError: (error: string | null) => void;
  setExecutionTime: (time: number | null) => void;
  setIsRunning: (running: boolean) => void;
  setIsLoadingLanguages: (loading: boolean) => void;
  clearEditor: () => void;
  fetchLanguages: () => Promise<void>;
}

const defaultCode: { [key: string]: string } = {
  python: 'print("Hello, World!")',
  javascript: 'console.log("Hello, World!");',
  java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
  c: `#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`,
};

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      code: defaultCode.python,
      language: null,
      languages: [],
      theme: "dark",
      output: null,
      error: null,
      executionTime: null,
      isRunning: false,
      isLoadingLanguages: false,

      setCode: (code) => set({ code }),

      setLanguage: (language) => {
        const langName = language.name.toLowerCase();
        const defaultCodeForLang =
          defaultCode[langName] ||
          defaultCode[language.extension] ||
          `// ${language.name} code here`;

        set({
          language,
          code: defaultCodeForLang,
          output: null,
          error: null,
        });
      },

      setLanguages: (languages) => set({ languages }),

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "dark" ? "light" : "dark",
        })),

      setOutput: (output) => set({ output }),
      setError: (error) => set({ error }),
      setExecutionTime: (executionTime) => set({ executionTime }),
      setIsRunning: (isRunning) => set({ isRunning }),
      setIsLoadingLanguages: (isLoadingLanguages) => set({ isLoadingLanguages }),

      clearEditor: () => {
        const { language } = get();
        if (!language) return;

        const langName = language.name.toLowerCase();
        const defaultCodeForLang =
          defaultCode[langName] ||
          defaultCode[language.extension] ||
          `// ${language.name} code here`;

        set({
          code: defaultCodeForLang,
          output: null,
          error: null,
          executionTime: null,
        });
      },

      fetchLanguages: async () => {
        set({ isLoadingLanguages: true });

        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
          const response = await fetch(`${API_URL}/api/languages`);
          const data = await response.json();

          if (data.languages && data.languages.length > 0) {
            set({ languages: data.languages });

            const python = data.languages.find((l: Language) =>
              l.name.toLowerCase().includes("python")
            );

            if (python && !get().language) {
              get().setLanguage(python);
            }
          }
        } catch (error) {
          console.error("Failed to fetch languages:", error);
        } finally {
          set({ isLoadingLanguages: false });
        }
      },
    }),
    {
      name: "slc-storage",
      partialize: (state) => ({
        code: state.code,
        language: state.language,
        theme: state.theme,
      }),
    }
  )
);

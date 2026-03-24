import { useCallback } from "react";
import { useEditorStore } from "@/store/editorStore";

export function useCodeExecution() {
  const { setOutput, setError, setExecutionTime, setIsRunning, language } = useEditorStore();

  const execute = useCallback(
    async (code: string) => {
      if (!language) {
        setError("Please select a language first");
        return;
      }

      setIsRunning(true);
      setOutput(null);
      setError(null);
      setExecutionTime(null);

      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        const response = await fetch(`${API_URL}/api/execute`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code,
            languageId: language.judge0Id,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setOutput(data.output || "(No output)");
          setExecutionTime(data.executionTime);
        } else {
          setError(data.error || "Execution failed");
          setExecutionTime(data.executionTime);
        }
      } catch (err: any) {
        setError(err.message || "Failed to connect to server");
      } finally {
        setIsRunning(false);
      }
    },
    [language, setOutput, setError, setExecutionTime, setIsRunning]
  );

  return { execute, isRunning: useEditorStore((s) => s.isRunning) };
}

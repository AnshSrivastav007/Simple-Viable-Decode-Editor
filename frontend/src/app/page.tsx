"use client";

import { useEffect } from "react";
import Editor from "@monaco-editor/react";
import LanguageSelector from "@/components/LanguageSelector";
import { useEditorStore } from "@/store/editorStore";
import { useCodeExecution } from "@/hooks/useCodeExecution";
import { Play, RotateCcw, Sun, Moon, Copy, Check, Share2 } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const { code, setCode, theme, toggleTheme, output, error, executionTime, clearEditor } = useEditorStore();
  const { execute, isRunning } = useCodeExecution();
  const [copied, setCopied] = useState(false);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    useEditorStore.getState().fetchLanguages();
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/execute/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          languageId: useEditorStore.getState().language?.judge0Id,
        }),
      });
      const data = await response.json();
      if (data.snippetId) {
        const url = `${window.location.origin}/snippet/${data.snippetId}`;
        await navigator.clipboard.writeText(url);
        setShowShare(true);
        setTimeout(() => setShowShare(false), 2000);
      }
    } catch (e) {
      console.error("Failed to share", e);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900">
      <header className="border-b border-gray-700 bg-gray-800/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white">
              SLC
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Sri Lankan Certificate</h1>
              <p className="text-xs text-gray-400">Online Code Editor</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <LanguageSelector />
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              title="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-750 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-sm text-gray-400 ml-2">main.{useEditorStore.getState().language?.extension || 'txt'}</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={handleCopy} className="p-1.5 hover:bg-gray-700 rounded transition-colors" title="Copy code">
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
              <button onClick={handleShare} className="p-1.5 hover:bg-gray-700 rounded transition-colors" title="Share snippet">
                {showShare ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
              </button>
              <button onClick={clearEditor} className="p-1.5 hover:bg-gray-700 rounded transition-colors" title="Reset code">
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="h-[500px]">
            <Editor
              height="100%"
              language={useEditorStore.getState().language?.extension || "plaintext"}
              theme={theme === "dark" ? "vs-dark" : "light"}
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
              }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => execute(code)}
              disabled={isRunning || !useEditorStore.getState().language}
              className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
            >
              <Play className={`w-5 h-5 ${isRunning ? "animate-pulse" : ""}`} />
              {isRunning ? "Running..." : "Run Code"}
            </button>
            {executionTime !== null && (
              <span className="text-sm text-gray-400">
                Execution time: {executionTime}ms
              </span>
            )}
          </div>

          <div className="flex-1 bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="px-4 py-2 bg-gray-750 border-b border-gray-700">
              <span className="text-sm font-medium text-gray-300">Output</span>
            </div>
            <div className="p-4 h-[440px] overflow-auto">
              {error ? (
                <pre className="text-red-400 whitespace-pre-wrap font-mono text-sm">{error}</pre>
              ) : output ? (
                <pre className="text-green-400 whitespace-pre-wrap font-mono text-sm">{output}</pre>
              ) : (
                <div className="text-gray-500 text-sm flex items-center justify-center h-full">
                  Click "Run Code" to see output
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

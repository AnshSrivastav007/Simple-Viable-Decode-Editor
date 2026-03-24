"use client";

import { useEffect } from "react";
import Editor from "@monaco-editor/react";
import LanguageSelector from "@/components/LanguageSelector";
import { useEditorStore } from "@/store/editorStore";
import { useCodeExecution } from "@/hooks/useCodeExecution";
import { Play, RotateCcw, Sun, Moon, Copy, Check, Share2 } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const { code, setCode, theme, toggleTheme, output, error, executionTime, clearEditor, language } = useEditorStore();
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
          languageId: language?.judge0Id,
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
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjAyIi8+PC9nPjwvc3ZnPg==')] opacity-30 pointer-events-none" />
      
      <header className="relative border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500/50 to-purple-600/50 rounded-xl flex items-center justify-center font-bold text-white border border-white/20 shadow-lg backdrop-blur-sm">
              SLC
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Simple Viable Decode Editor</h1>
              <p className="text-xs text-gray-400">Online Code Runner</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 relative z-50">
            <div className="bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm">
              <LanguageSelector />
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors border border-white/10 bg-white/5 backdrop-blur-sm"
              title="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-white" />}
            </button>
          </div>
        </div>
      </header>

      <div className="relative max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 shadow-xl shadow-black/20">
          <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-sm text-gray-300 ml-2">main.{language?.extension || 'txt'}</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={handleCopy} className="p-1.5 hover:bg-white/10 rounded transition-colors" title="Copy code">
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
              </button>
              <button onClick={handleShare} className="p-1.5 hover:bg-white/10 rounded transition-colors" title="Share snippet">
                {showShare ? <Check className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4 text-gray-400" />}
              </button>
              <button onClick={clearEditor} className="p-1.5 hover:bg-white/10 rounded transition-colors" title="Reset code">
                <RotateCcw className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
          
          <div className="h-[500px]">
            <Editor
              height="100%"
              language={language?.extension || "plaintext"}
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
              disabled={isRunning || !language}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-500/80 to-emerald-600/80 hover:from-green-500 hover:to-emerald-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl font-medium transition-all border border-white/10 shadow-lg shadow-green-500/20 backdrop-blur-sm"
            >
              <Play className={`w-5 h-5 ${isRunning ? "animate-pulse" : ""}`} />
              {isRunning ? "Running..." : "Run Code"}
            </button>
            {executionTime !== null && (
              <span className="text-sm text-gray-400 bg-white/5 px-3 py-1 rounded-lg border border-white/10 backdrop-blur-sm">
                Execution time: {executionTime}ms
              </span>
            )}
          </div>

          <div className="flex-1 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-xl shadow-black/20">
            <div className="px-4 py-2 bg-white/5 border-b border-white/10">
              <span className="text-sm font-medium text-gray-300">Output</span>
            </div>
            <div className="p-4 h-[440px] overflow-auto">
              {error ? (
                <pre className="text-red-400 whitespace-pre-wrap font-mono text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20 backdrop-blur-sm">{error}</pre>
              ) : output ? (
                <pre className="text-green-400 whitespace-pre-wrap font-mono text-sm bg-green-500/10 p-3 rounded-lg border border-green-500/20 backdrop-blur-sm">{output}</pre>
              ) : (
                <div className="text-gray-500 text-sm flex items-center justify-center h-full bg-white/5 rounded-lg border border-white/5 m-1">
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

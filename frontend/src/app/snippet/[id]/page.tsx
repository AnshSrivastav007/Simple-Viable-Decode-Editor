"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Editor from "@monaco-editor/react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function SnippetPage() {
  const params = useParams();
  const router = useRouter();
  const [code, setCode] = useState<string>("");
  const [language, setLanguage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        const res = await fetch(`${API_URL}/api/snippets/${params.id}`);
        const data = await res.json();

        if (data.success) {
          setCode(data.code);
          setLanguage(data.language);
        } else {
          setError(data.error || "Failed to load snippet");
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchSnippet();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center gap-4">
        <div className="text-red-400 text-lg">{error}</div>
        <Link href="/" className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500">
          Go to Editor
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="border-b border-gray-700 bg-gray-800/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/")}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white">
              SLC
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Shared Snippet</h1>
              <p className="text-xs text-gray-400">
                {language?.name || "Unknown"} - .{language?.extension || "txt"}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
          <Editor
            height="70vh"
            language={language?.extension || "plaintext"}
            theme="vs-dark"
            value={code}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>
      </div>
    </div>
  );
}

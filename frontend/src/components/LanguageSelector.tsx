"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Search, RefreshCw } from "lucide-react";
import { useEditorStore, Language } from "@/store/editorStore";

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const {
    language,
    languages,
    setLanguage,
    fetchLanguages,
    isLoadingLanguages,
  } = useEditorStore();

  useEffect(() => {
    if (languages.length === 0) {
      fetchLanguages();
    }
  }, []);

  const filteredLanguages = languages.filter((lang) =>
    lang.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
    setSearch("");
  };

  const handleRefresh = async () => {
    await fetchLanguages();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoadingLanguages}
        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg transition-all backdrop-blur-sm text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoadingLanguages ? (
          <RefreshCw className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <span className="text-xl">{language?.icon || "📄"}</span>
            <span className="font-medium">
              {language?.name || "Select Language"}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          <div className="absolute top-full left-0 mt-2 w-80 bg-gray-900/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/10 z-50">
            <div className="p-3 border-b border-white/10 flex items-center justify-between">
              <span className="font-semibold text-sm text-gray-200">
                {languages.length} Languages Available
              </span>
              <button
                onClick={handleRefresh}
                className="p-1 hover:bg-white/10 rounded transition-colors"
                title="Refresh languages"
              >
                <RefreshCw className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <div className="p-2 border-b border-white/10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search languages..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 rounded-md border border-white/10 focus:border-blue-500/50 focus:outline-none text-sm text-white placeholder-gray-500"
                  autoFocus
                />
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto p-2">
              {filteredLanguages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No languages found
                </div>
              ) : (
                filteredLanguages.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => handleSelect(lang)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all text-left
                               ${
                                 language?.id === lang.id
                                   ? "bg-blue-500/30 border border-blue-500/30"
                                   : "hover:bg-white/5 border border-transparent"
                               }`}
                  >
                    <span className="text-xl">{lang.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-200 truncate">{lang.name}</div>
                      <div className="text-xs text-gray-500">
                        .{lang.extension}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

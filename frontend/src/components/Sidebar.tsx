import { useState } from 'react';
import { useStore } from '../store/useStore';
import { LanguageSelector } from './LanguageSelector';

interface SidebarProps {
  onRun: () => void;
  onShare: () => void;
}

export function Sidebar({ onRun, onShare }: SidebarProps) {
  const { theme, isExecuting, languages, snippets, loadSnippet, currentSnippetId } = useStore();
  const [showSnippets, setShowSnippets] = useState(false);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`h-full flex flex-col rounded-xl overflow-hidden ${
      theme === 'dark'
        ? 'bg-gray-900/60 backdrop-blur-xl border border-white/10'
        : 'bg-white/60 backdrop-blur-xl border border-gray-200/50'
    }`}>
      {/* Header */}
      <div className={`px-4 py-4 border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'}`}>
        <h2 className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Settings
        </h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Language Selector */}
        <div>
          <label className={`block text-xs font-medium mb-2 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Language ({languages.length} available)
          </label>
          <LanguageSelector />
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <button
            onClick={onRun}
            disabled={isExecuting}
            className={`w-full flex items-center justify-center gap-2 py-3.5 md:py-3 rounded-xl font-medium transition-all touch-manipulation min-h-[48px] ${
              isExecuting
                ? 'bg-violet-500/50 cursor-not-allowed'
                : 'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/30 active:scale-[0.98]'
            } text-white`}
          >
            {isExecuting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Running...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="whitespace-nowrap">Run Code</span>
                <kbd className="hidden md:inline text-[10px] px-1.5 py-0.5 rounded bg-white/20 ml-1">⌘↵</kbd>
              </>
            )}
          </button>

          <button
            onClick={onShare}
            className={`w-full flex items-center justify-center gap-2 py-3.5 md:py-3 rounded-xl font-medium transition-all touch-manipulation min-h-[48px] ${
              theme === 'dark'
                ? 'bg-white/10 hover:bg-white/15 text-white border border-white/10 active:bg-white/20'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 active:bg-gray-300'
            }`}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span className="whitespace-nowrap">Share Code</span>
            <kbd className="hidden md:inline text-[10px] px-1.5 py-0.5 rounded bg-gray-500/20 ml-1">⌘S</kbd>
          </button>
        </div>

        {/* Saved Snippets */}
        <div className="pt-4">
          <button
            onClick={() => setShowSnippets(!showSnippets)}
            className={`w-full flex items-center justify-between py-2 touch-manipulation ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            <span className="text-xs font-medium">Saved Snippets ({snippets.length})</span>
            <svg
              className={`w-4 h-4 transition-transform ${showSnippets ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showSnippets && (
            <div className="mt-2 space-y-2 max-h-40 md:max-h-none overflow-y-auto">
              {snippets.length === 0 ? (
                <p className={`text-xs text-center py-4 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  No snippets saved yet
                </p>
              ) : (
                snippets.slice().reverse().map((snippet) => {
                  const lang = languages.find((l) => l.id === snippet.languageId);
                  return (
                    <button
                      key={snippet.id}
                      onClick={() => loadSnippet(snippet.id)}
                      className={`w-full text-left p-3 md:p-2 rounded-lg transition-all touch-manipulation ${
                        currentSnippetId === snippet.id
                          ? theme === 'dark'
                            ? 'bg-violet-500/20 border border-violet-500/30'
                            : 'bg-violet-100 border border-violet-200'
                          : theme === 'dark'
                            ? 'bg-white/5 hover:bg-white/10 border border-transparent'
                            : 'bg-gray-100 hover:bg-gray-200 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">{lang?.icon}</span>
                        <span className={`text-sm font-medium truncate ${
                          theme === 'dark' ? 'text-white' : 'text-gray-800'
                        }`}>
                          {snippet.title}
                        </span>
                      </div>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                        {formatDate(snippet.createdAt)}
                      </p>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer - Sync Info */}
      <div className={`px-4 py-3 border-t ${theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'}`}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            Auto-sync active • Daily 3 AM
          </span>
        </div>
      </div>
    </div>
  );
}

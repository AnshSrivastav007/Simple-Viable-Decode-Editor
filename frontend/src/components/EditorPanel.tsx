import { useStore } from '../store/useStore';
import { CodeEditor } from './CodeEditor';

export function EditorPanel() {
  const { selectedLanguage, theme, code } = useStore();

  const lineCount = code.split('\n').length;
  const charCount = code.length;

  return (
    <div className={`h-full flex flex-col rounded-xl overflow-hidden ${
      theme === 'dark'
        ? 'bg-gray-900/60 backdrop-blur-xl border border-white/10'
        : 'bg-white/60 backdrop-blur-xl border border-gray-200/50'
    }`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b ${
        theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'
      }`}>
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">{selectedLanguage?.icon}</span>
            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {selectedLanguage?.name || 'Select a language'}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              theme === 'dark' ? 'bg-white/10 text-gray-400' : 'bg-gray-100 text-gray-500'
            }`}>
              {selectedLanguage?.extension}
            </span>
          </div>
        </div>

        <div className={`flex items-center gap-4 text-xs ${
          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
        }`}>
          <span>{lineCount} lines</span>
          <span>{charCount} chars</span>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <CodeEditor />
      </div>
    </div>
  );
}

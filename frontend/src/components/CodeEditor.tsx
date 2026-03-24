import Editor from '@monaco-editor/react';
import { useStore } from '../store/useStore';

export function CodeEditor() {
  const { code, setCode, selectedLanguage, theme } = useStore();

  return (
    <div className="h-full w-full overflow-hidden rounded-xl">
      <Editor
        height="100%"
        language={selectedLanguage?.monacoId || 'javascript'}
        value={code}
        onChange={(value) => setCode(value || '')}
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        options={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 14,
          lineHeight: 24,
          padding: { top: 16, bottom: 16 },
          minimap: { enabled: true, scale: 1 },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          renderWhitespace: 'selection',
          bracketPairColorization: { enabled: true },
          automaticLayout: true,
          wordWrap: 'on',
          tabSize: 2,
          formatOnPaste: true,
          formatOnType: true,
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: 'on',
          folding: true,
          foldingStrategy: 'indentation',
          showFoldingControls: 'mouseover',
          links: true,
          colorDecorators: true,
          accessibilitySupport: 'auto',
        }}
        loading={
          <div className={`h-full w-full flex items-center justify-center ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-white'
          }`}>
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Loading Editor...
              </span>
            </div>
          </div>
        }
      />
    </div>
  );
}

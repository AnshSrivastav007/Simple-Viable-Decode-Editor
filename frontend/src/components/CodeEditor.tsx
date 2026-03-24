import { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { useStore } from '../store/useStore';

export function CodeEditor() {
  const { code, setCode, selectedLanguage, theme } = useStore();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
          fontSize: isMobile ? 13 : 14,
          lineHeight: isMobile ? 20 : 24,
          padding: { top: 12, bottom: 12 },
          minimap: { enabled: !isMobile, scale: 1 },
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
          folding: !isMobile,
          foldingStrategy: 'indentation',
          showFoldingControls: isMobile ? 'never' : 'mouseover',
          links: true,
          colorDecorators: true,
          accessibilitySupport: 'auto',
          quickSuggestions: !isMobile,
          parameterHints: { enabled: !isMobile },
          hover: { enabled: !isMobile },
          scrollbar: {
            vertical: 'auto',
            horizontal: isMobile ? 'hidden' : 'auto',
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
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

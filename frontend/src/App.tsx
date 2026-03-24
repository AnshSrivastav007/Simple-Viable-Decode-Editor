import { useState, useEffect } from 'react';
import { useStore } from './store/useStore';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { EditorPanel } from './components/EditorPanel';
import { OutputPanel } from './components/OutputPanel';
import { ShareModal } from './components/ShareModal';
import { SyncIndicator } from './components/SyncIndicator';

function App() {
  const { theme, setCode, setLanguage, languages, setIsExecuting, setOutput, code, selectedLanguage } = useStore();
  const [showShareModal, setShowShareModal] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter to run code
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRunCode();
      }
      // Ctrl/Cmd + S to share
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        setShowShareModal(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, selectedLanguage]);

  // Check for shared snippet in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shareParam = params.get('share');
    
    if (shareParam) {
      try {
        const decoded = JSON.parse(decodeURIComponent(atob(shareParam)));
        if (decoded.code) {
          setCode(decoded.code);
        }
        if (decoded.languageId) {
          const lang = languages.find((l) => l.id === decoded.languageId);
          if (lang) {
            setLanguage(lang);
          }
        }
        // Clear URL params
        window.history.replaceState({}, '', window.location.pathname);
      } catch (e) {
        console.error('Failed to parse share URL:', e);
      }
    }
  }, []);

  // Simulate code execution
  const handleRunCode = async () => {
    setIsExecuting(true);
    setOutput('');

    // Simulate execution delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulated output based on language
    const simulatedOutputs: Record<string, string> = {
      javascript: simulateJSExecution(code),
      typescript: simulateJSExecution(code),
      python: simulatePythonExecution(code),
      default: `[SLC Simulator] Running ${selectedLanguage?.name} code...\n\n✓ Compilation successful\n✓ Execution completed\n\n--- Output ---\nHello, World!\n\n--- Stats ---\nExecution time: ${Math.floor(Math.random() * 100) + 10}ms\nMemory used: ${Math.floor(Math.random() * 50) + 5}MB`,
    };

    const langId = selectedLanguage?.monacoId || 'default';
    const output = simulatedOutputs[langId] || simulatedOutputs.default;
    
    setOutput(output);
    setIsExecuting(false);
  };

  const simulateJSExecution = (code: string) => {
    const logs: string[] = [];
    
    try {
      // Try to execute simple console.log statements
      const consoleLogRegex = /console\.log\s*\(\s*(['"`])(.*?)\1\s*\)/g;
      let match;
      while ((match = consoleLogRegex.exec(code)) !== null) {
        logs.push(match[2]);
      }
      
      if (logs.length === 0) {
        // Default output
        logs.push('Hello, World!');
      }

      return `[JavaScript Runtime]\n\n${logs.join('\n')}\n\n✓ Execution completed successfully`;
    } catch (e) {
      return `[JavaScript Runtime]\n\n❌ Error: ${e}\n\nNote: This is a simulated environment.`;
    }
  };

  const simulatePythonExecution = (code: string) => {
    const outputs: string[] = [];
    
    // Find print statements
    const printRegex = /print\s*\(\s*(['"`])(.*?)\1\s*\)/g;
    let match;
    while ((match = printRegex.exec(code)) !== null) {
      outputs.push(match[2]);
    }

    // Find f-strings
    const fstringRegex = /print\s*\(\s*f(['"`])(.*?)\1\s*\)/g;
    while ((match = fstringRegex.exec(code)) !== null) {
      outputs.push(match[2]);
    }

    if (outputs.length === 0) {
      outputs.push('Hello, World!');
    }

    return `[Python 3.11]\n\n${outputs.join('\n')}\n\n✓ Process finished with exit code 0`;
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900'
        : 'bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200'
    }`}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-1/2 -left-1/2 w-full h-full rounded-full blur-3xl ${
          theme === 'dark'
            ? 'bg-violet-500/10'
            : 'bg-violet-300/20'
        } animate-blob`} />
        <div className={`absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full blur-3xl ${
          theme === 'dark'
            ? 'bg-purple-500/10'
            : 'bg-purple-300/20'
        } animate-blob animation-delay-2000`} />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 rounded-full blur-3xl ${
          theme === 'dark'
            ? 'bg-pink-500/5'
            : 'bg-pink-300/20'
        } animate-blob animation-delay-4000`} />
      </div>

      {/* Main Layout */}
      <div className="relative z-10 flex flex-col h-[100dvh]">
        <Header />

        <main className="flex-1 overflow-hidden">
          <div className="h-full max-w-[1920px] mx-auto p-2 md:p-4 flex gap-2 md:gap-4">
            {/* Mobile Toggle */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`lg:hidden fixed bottom-4 left-4 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg touch-manipulation ${
                theme === 'dark'
                  ? 'bg-violet-500 text-white'
                  : 'bg-violet-500 text-white'
              }`}
              aria-label={sidebarCollapsed ? "Open menu" : "Close menu"}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarCollapsed ? "M4 6h16M4 12h16M4 18h16" : "M6 18L18 6M6 6l12 12"} />
              </svg>
            </button>

            {/* Sidebar */}
            <div className={`${
              sidebarCollapsed ? 'hidden' : 'fixed inset-0 z-40 lg:relative lg:inset-auto'
            } lg:block lg:w-72 flex-shrink-0`}>
              <div className="h-full lg:h-auto p-2 lg:p-0" onClick={(e) => e.target === e.currentTarget && setSidebarCollapsed(true)}>
                <div className="h-full max-w-sm mx-auto lg:max-w-none">
                  <Sidebar 
                    onRun={handleRunCode}
                    onShare={() => setShowShareModal(true)}
                  />
                </div>
              </div>
            </div>

            {/* Editor & Output */}
            <div className="flex-1 flex flex-col lg:flex-row gap-2 md:gap-4 min-w-0">
              {/* Code Editor */}
              <div className="flex-1 min-h-[250px] sm:min-h-[300px] lg:min-h-0">
                <EditorPanel />
              </div>

              {/* Output Panel */}
              <div className="h-40 sm:h-48 lg:h-auto lg:w-96 flex-shrink-0">
                <OutputPanel />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Share Modal */}
      <ShareModal 
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />

      {/* Sync Indicator */}
      <SyncIndicator />
    </div>
  );
}

export default App;

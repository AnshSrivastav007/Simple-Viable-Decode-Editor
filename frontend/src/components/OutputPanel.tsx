import { useStore } from '../store/useStore';

export function OutputPanel() {
  const { output, theme, clearOutput, isExecuting } = useStore();

  return (
    <div className={`h-full flex flex-col rounded-xl overflow-hidden ${
      theme === 'dark'
        ? 'bg-gray-900/60 backdrop-blur-xl border border-white/10'
        : 'bg-white/60 backdrop-blur-xl border border-gray-200/50'
    }`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-3 md:px-4 py-2 md:py-3 border-b ${
        theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'
      }`}>
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className={`text-sm font-medium ml-1 md:ml-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Output
          </span>
          {isExecuting && (
            <div className="flex items-center gap-2 ml-1 md:ml-2">
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
              <span className="text-xs text-violet-400">Running...</span>
            </div>
          )}
        </div>
        <button
          onClick={clearOutput}
          className={`text-xs px-3 py-1.5 md:py-1 rounded-lg transition-all touch-manipulation ${
            theme === 'dark'
              ? 'text-gray-400 hover:text-white hover:bg-white/10'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          Clear
        </button>
      </div>

      {/* Output Content */}
      <div className="flex-1 overflow-auto p-4">
        {output ? (
          <pre className={`text-sm font-mono whitespace-pre-wrap ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {output}
          </pre>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className={`text-4xl mb-3 ${theme === 'dark' ? 'opacity-30' : 'opacity-40'}`}>
                ▶️
              </div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                Run your code to see output
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

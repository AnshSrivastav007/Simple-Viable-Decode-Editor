import { useStore } from '../store/useStore';

export function Header() {
  const { theme, toggleTheme, lastSync } = useStore();

  const formatLastSync = (timestamp: number | null) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <header className="relative z-10">
      <div className={`backdrop-blur-xl border-b ${
        theme === 'dark' 
          ? 'bg-gray-900/40 border-white/10' 
          : 'bg-white/40 border-gray-200/50'
      }`}>
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-violet-500 to-purple-600'
                  : 'bg-gradient-to-br from-violet-400 to-purple-500'
              } shadow-lg shadow-violet-500/30`}>
                <span className="text-white font-bold text-lg">&lt;/&gt;</span>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900 animate-pulse" />
              </div>
              <div>
                <h1 className={`text-xl font-bold tracking-tight ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  SVDE
                </h1>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Simple Viable Decode Editor
                </p>
              </div>
            </div>

            {/* Center - Sync Status */}
            <div className={`hidden lg:flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm ${
              theme === 'dark'
                ? 'bg-white/5 border border-white/10'
                : 'bg-gray-900/5 border border-gray-200/50'
            }`}>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className={`text-xs font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                60+ Languages Synced
              </span>
              <span className={`text-xs ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`}>
                • Last: {formatLastSync(lastSync)}
              </span>
            </div>

            {/* Right - Theme Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-violet-600/30 border border-violet-500/50'
                    : 'bg-amber-100 border border-amber-200'
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 rounded-full transition-all duration-300 flex items-center justify-center text-xs ${
                    theme === 'dark'
                      ? 'left-1 bg-violet-500 shadow-lg shadow-violet-500/50'
                      : 'left-7 bg-amber-400 shadow-lg shadow-amber-400/50'
                  }`}
                >
                  {theme === 'dark' ? '🌙' : '☀️'}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

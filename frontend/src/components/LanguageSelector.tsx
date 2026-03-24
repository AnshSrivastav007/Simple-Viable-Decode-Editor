import { useState, useMemo } from 'react';
import { useStore, Language } from '../store/useStore';

export function LanguageSelector() {
  const { languages, selectedLanguage, setLanguage, theme } = useStore();
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredLanguages = useMemo(() => {
    if (!search) return languages;
    return languages.filter((lang) =>
      lang.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [languages, search]);

  const handleSelect = (language: Language) => {
    setLanguage(language);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className="relative">
      {/* Selected Language Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
          theme === 'dark'
            ? 'bg-white/5 hover:bg-white/10 border border-white/10'
            : 'bg-gray-100 hover:bg-gray-200 border border-gray-200'
        }`}
      >
        <span className="text-xl">{selectedLanguage?.icon}</span>
        <div className="flex-1 text-left">
          <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {selectedLanguage?.name || 'Select Language'}
          </p>
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            {selectedLanguage?.extension || ''}
          </p>
        </div>
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''} ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl overflow-hidden z-50 shadow-2xl ${
            theme === 'dark'
              ? 'bg-gray-900/95 backdrop-blur-xl border border-white/10'
              : 'bg-white/95 backdrop-blur-xl border border-gray-200'
          }`}>
            {/* Search */}
            <div className="p-3 border-b border-white/10">
              <input
                type="text"
                placeholder="Search languages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg text-sm ${
                  theme === 'dark'
                    ? 'bg-white/5 text-white placeholder-gray-500 border border-white/10'
                    : 'bg-gray-100 text-gray-900 placeholder-gray-400 border border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-violet-500/50`}
                autoFocus
              />
            </div>

            {/* Language List */}
            <div className="max-h-[50vh] md:max-h-64 overflow-y-auto p-2">
              {filteredLanguages.length === 0 ? (
                <p className={`text-center py-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                  No languages found
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-1">
                  {filteredLanguages.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => handleSelect(lang)}
                      className={`flex items-center gap-3 px-3 py-3 md:py-2 rounded-lg text-left transition-all touch-manipulation ${
                        selectedLanguage?.id === lang.id
                          ? theme === 'dark'
                            ? 'bg-violet-500/20 text-violet-300'
                            : 'bg-violet-100 text-violet-700'
                          : theme === 'dark'
                            ? 'hover:bg-white/5 text-gray-300'
                            : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <span className="text-lg">{lang.icon}</span>
                      <span className="font-medium truncate">{lang.name}</span>
                      <span className={`text-xs ml-auto flex-shrink-0 ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        {lang.extension}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

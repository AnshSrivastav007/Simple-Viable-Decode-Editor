import { useState } from 'react';
import { useStore } from '../store/useStore';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShareModal({ isOpen, onClose }: ShareModalProps) {
  const { code, selectedLanguage, theme, saveSnippet } = useStore();
  const [title, setTitle] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    saveSnippet(title || 'Untitled Snippet');
    const encoded = btoa(encodeURIComponent(JSON.stringify({
      code,
      languageId: selectedLanguage?.id,
      title: title || 'Untitled Snippet',
    })));
    const url = `${window.location.origin}?share=${encoded}`;
    setShareUrl(url);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative w-full max-w-md rounded-2xl p-6 shadow-2xl ${
        theme === 'dark'
          ? 'bg-gray-900/90 backdrop-blur-xl border border-white/10'
          : 'bg-white/90 backdrop-blur-xl border border-gray-200'
      }`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            theme === 'dark'
              ? 'hover:bg-white/10 text-gray-400'
              : 'hover:bg-gray-100 text-gray-500'
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Share Snippet
          </h2>
          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Create a shareable link for your code
          </p>
        </div>

        {!shareUrl ? (
          <>
            {/* Title Input */}
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Snippet Title
              </label>
              <input
                type="text"
                placeholder="My awesome code"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl text-sm ${
                  theme === 'dark'
                    ? 'bg-white/5 text-white placeholder-gray-500 border border-white/10'
                    : 'bg-gray-100 text-gray-900 placeholder-gray-400 border border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-violet-500/50`}
              />
            </div>

            {/* Language Badge */}
            <div className={`flex items-center gap-2 mb-6 px-3 py-2 rounded-lg ${
              theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'
            }`}>
              <span>{selectedLanguage?.icon}</span>
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {selectedLanguage?.name}
              </span>
              <span className={`text-xs ml-auto ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                {code.split('\n').length} lines
              </span>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleSave}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium hover:from-violet-600 hover:to-purple-700 transition-all shadow-lg shadow-violet-500/30"
            >
              Generate Share Link
            </button>
          </>
        ) : (
          <>
            {/* Success State */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Your snippet is ready to share!
              </p>
            </div>

            {/* URL Display */}
            <div className={`p-3 rounded-xl mb-4 ${
              theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'
            }`}>
              <p className={`text-xs font-mono break-all ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {shareUrl}
              </p>
            </div>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className={`w-full py-3 rounded-xl font-medium transition-all ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/30'
              }`}
            >
              {copied ? '✓ Copied!' : 'Copy Link'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

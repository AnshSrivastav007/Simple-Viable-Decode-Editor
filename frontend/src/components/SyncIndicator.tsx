import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';

export function SyncIndicator() {
  const { theme, languages, setLastSync } = useStore();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success'>('idle');

  // Simulate auto-sync on component mount
  useEffect(() => {
    const runSync = async () => {
      setIsSyncing(true);
      setSyncStatus('syncing');
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      setLastSync(Date.now());
      setSyncStatus('success');
      
      setTimeout(() => {
        setIsSyncing(false);
        setSyncStatus('idle');
      }, 2000);
    };

    // Run initial sync
    runSync();

    // Set up daily sync simulation (every 60 seconds in demo)
    const interval = setInterval(runSync, 60000);

    return () => clearInterval(interval);
  }, []);

  if (!isSyncing) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg ${
      theme === 'dark'
        ? 'bg-gray-900/90 backdrop-blur-xl border border-white/10'
        : 'bg-white/90 backdrop-blur-xl border border-gray-200'
    }`}>
      {syncStatus === 'syncing' ? (
        <>
          <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <div>
            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Syncing Languages
            </p>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Fetching {languages.length}+ languages...
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Sync Complete
            </p>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {languages.length} languages updated
            </p>
          </div>
        </>
      )}
    </div>
  );
}

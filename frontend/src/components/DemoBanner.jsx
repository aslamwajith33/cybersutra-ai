import React from 'react';
import { RefreshCw } from 'lucide-react';
import { seedDemoData } from '../api/client';

export const DemoBanner = ({ onReload }) => {
  const [loading, setLoading] = React.useState(false);

  const handleResetSeed = async () => {
    try {
      setLoading(true);
      await seedDemoData(true);
      if (onReload) onReload();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#242a3a] border-b border-[#434655]/40 px-4 py-1 text-center font-mono text-[11px] text-[#c3c6d7] flex items-center justify-between gap-2">
      <div className="flex-1 text-center truncate">
        OFFICIAL EVALUATION SANDBOX • Rajasthan Police PS05 Demonstration Suite • Synthetic Operational Models
      </div>
      <button
        onClick={handleResetSeed}
        disabled={loading}
        className="shrink-0 px-2 py-0.5 rounded bg-[#151b2b] hover:bg-[#191f2f] text-[#ffb77d] border border-[#434655]/40 text-[10px] font-medium transition-colors flex items-center gap-1"
      >
        <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
        <span>Reset Data</span>
      </button>
    </div>
  );
};

import React from 'react';

export const RiskBadge = ({ level = 'Low', score = null, size = 'md' }) => {
  const norm = String(level).toLowerCase();
  
  let bg = 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80';
  let dot = 'bg-emerald-400';

  if (norm === 'critical' || (score !== null && score >= 75)) {
    bg = 'bg-red-950/70 text-red-300 border-red-800/90';
    dot = 'bg-red-500';
  } else if (norm === 'high' || (score !== null && score >= 50)) {
    bg = 'bg-orange-950/70 text-orange-300 border-orange-800/80';
    dot = 'bg-orange-400';
  } else if (norm === 'medium' || (score !== null && score >= 25)) {
    bg = 'bg-amber-950/60 text-amber-300 border-amber-800/80';
    dot = 'bg-amber-400';
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-xs font-semibold';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded border font-mono tracking-tight ${bg} ${sizeClasses}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      <span>{score !== null ? `${score}/100 • ` : ''}{level.toUpperCase()}</span>
    </span>
  );
};

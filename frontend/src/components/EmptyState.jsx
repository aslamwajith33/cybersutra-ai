import React from 'react';
import { ShieldAlert, Database, PlusCircle } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = ShieldAlert,
  title = "No investigation records found",
  description = "No digital evidence or cases match your criteria. You can load synthetic demonstration data or register a new case.",
  actionText = "Seed Demonstration Data",
  onAction = null,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm my-6">
      <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-slate-100 mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-md mb-6">{description}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors shadow-lg shadow-blue-600/20"
        >
          <Database className="w-4 h-4" />
          {actionText}
        </button>
      )}
    </div>
  );
};

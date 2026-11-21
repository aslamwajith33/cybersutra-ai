import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Database,
  RefreshCw,
  Trash2,
  Shield,
  Key,
  CheckCircle2,
  AlertTriangle,
  Server,
  UserCheck
} from 'lucide-react';
import { getSystemStatus, seedDemoData, resetDatabase } from '../api/client';

export const SettingsPage = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      setLoading(true);
      const data = await getSystemStatus();
      setStatus(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSeed = async () => {
    try {
      setIsProcessing(true);
      setActionMessage(null);
      const res = await seedDemoData(true);
      setActionMessage({ type: 'success', text: 'Synthetic demonstration intelligence re-seeded successfully.' });
      loadStatus();
    } catch (err) {
      setActionMessage({ type: 'error', text: 'Failed to seed demo data.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm("Are you sure you want to clear all investigation records? Database will be reset to empty state.")) {
      return;
    }
    try {
      setIsProcessing(true);
      setActionMessage(null);
      await resetDatabase();
      setActionMessage({ type: 'info', text: 'All cases and evidence cleared. Database is in pristine empty state.' });
      loadStatus();
    } catch (err) {
      setActionMessage({ type: 'error', text: 'Failed to reset database.' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Sliders className="w-6 h-6 text-cyan-400" />
          <h1 className="text-2xl font-bold text-white tracking-wide">System Settings & Data Administration</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Platform configurations, environment diagnostics, demonstration data controls, and statutory compliance.
        </p>
      </div>

      {actionMessage && (
        <div className={`p-4 rounded-xl border text-xs flex items-center justify-between ${
          actionMessage.type === 'success'
            ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
            : actionMessage.type === 'error'
            ? 'bg-red-950/40 border-red-800 text-red-300'
            : 'bg-blue-950/40 border-blue-800 text-blue-300'
        }`}>
          <div className="flex items-center gap-2">
            {actionMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
            <span>{actionMessage.text}</span>
          </div>
          <button onClick={() => setActionMessage(null)} className="text-xs text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* System Status Grid */}
      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 pb-2 border-b border-slate-800">
          <Server className="w-4 h-4 text-cyan-400" />
          Platform Diagnostics (PS05 Hackathon Architecture)
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Application Platform</span>
            <span className="text-slate-200 font-semibold">{status?.project_name || "CyberSutra AI"}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Problem Statement</span>
            <span className="text-cyan-400 font-mono font-semibold">PS05 Financial Crime</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Database Engine</span>
            <span className="text-slate-200 font-mono">{status?.database_type || "SQLite Zero-Config"}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Operational Status</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              Live & Verified
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-3 border-t border-slate-800/80 text-xs font-mono">
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Total Cases</span>
            <span className="text-base font-bold text-white">{status?.total_cases || 0}</span>
          </div>
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Complaints</span>
            <span className="text-base font-bold text-cyan-300">{status?.total_complaints || 0}</span>
          </div>
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Transactions</span>
            <span className="text-base font-bold text-amber-300">{status?.total_transactions || 0}</span>
          </div>
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">URLs Inspected</span>
            <span className="text-base font-bold text-purple-300">{status?.total_urls_analyzed || 0}</span>
          </div>
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">APKs Scanned</span>
            <span className="text-base font-bold text-pink-300">{status?.total_apks_analyzed || 0}</span>
          </div>
        </div>
      </div>

      {/* Synthetic Demonstration Intelligence Management */}
      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 pb-2 border-b border-slate-800">
          <Database className="w-4 h-4 text-emerald-400" />
          Demonstration Intelligence & Reset Controls
        </h3>

        <p className="text-xs text-slate-300 leading-relaxed">
          For hackathon evaluation and technical review, CyberSutra AI provides verified synthetic cases 
          mirroring real-world investigations by Rajasthan Police Cyber Crime Units (Jaipur, Jodhpur, Kota, Bharatpur).
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleSeed}
            disabled={isProcessing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
            {isProcessing ? 'Processing...' : 'Reload Synthetic Demonstration Intelligence'}
          </button>

          <button
            onClick={handleReset}
            disabled={isProcessing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-950/40 hover:bg-red-900/40 text-red-300 border border-red-800 text-xs font-semibold transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Reset Database to Empty State
          </button>
        </div>
      </div>

      {/* Investigator Profile */}
      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 pb-2 border-b border-slate-800">
          <UserCheck className="w-4 h-4 text-blue-400" />
          Active Investigator Credentials (Demonstration Mode)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Investigating Officer</span>
            <div className="font-semibold text-white">Insp. Vikram Rathore</div>
            <div className="text-slate-400 text-[11px]">io.jaipur@police.rajasthan.gov.in</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Command Center</span>
            <div className="font-semibold text-white">Cyber Crime Police Station, Jaipur</div>
            <div className="text-slate-400 text-[11px]">Rajasthan Police Headquarters</div>
          </div>
        </div>
      </div>
    </div>
  );
};

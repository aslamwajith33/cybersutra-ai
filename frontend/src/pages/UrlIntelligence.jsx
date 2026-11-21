import React, { useState, useEffect } from 'react';
import {
  Globe,
  Search,
  AlertTriangle,
  CheckCircle2,
  Shield,
  ExternalLink,
  Info,
  Clock,
  ArrowRight,
  ListChecks,
  Lock,
  Unlock,
  Radio
} from 'lucide-react';
import { analyzeUrl, getUrlHistory, getCases } from '../api/client';
import { RiskBadge } from '../components/RiskBadge';

const PRESET_URLS = [
  {
    label: "JVVNL Phishing Site (Bijli Bill Scam)",
    url: "http://jvvnl-bijli-update.site/pay-bill-online?consumer_no=1800291",
    notes: "Cloned electricity board payment portal harvesting NetBanking credentials."
  },
  {
    label: "Telegram VIP Task Scam Portal",
    url: "http://vip-task-earn.click/login?ref=tg_channel_89",
    notes: "Fake cryptocurrency review earning portal."
  },
  {
    label: "Raw IP Address Host (C2 Gateway)",
    url: "http://185.220.101.5:8080/c2/receive_sms.php",
    notes: "Direct IP endpoint with non-standard port extracted from seized malware."
  },
  {
    label: "Legitimate Rajasthan Police Portal",
    url: "https://police.rajasthan.gov.in/portal",
    notes: "Official Rajasthan Government domain."
  }
];

export const UrlIntelligence = () => {
  const [urlInput, setUrlInput] = useState('');
  const [notesInput, setNotesInput] = useState('');
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [cases, setCases] = useState([]);
  
  const [analyzing, setAnalyzing] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadHistory();
    loadCases();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getUrlHistory();
      setHistory(data);
      if (data.length > 0 && !currentResult) {
        setCurrentResult(data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadCases = async () => {
    try {
      const data = await getCases();
      setCases(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnalyze = async (e) => {
    if (e) e.preventDefault();
    if (!urlInput.trim()) return;

    setAnalyzing(true);
    setError(null);
    try {
      const res = await analyzeUrl(urlInput.trim(), notesInput.trim() || null, selectedCaseId || null);
      setCurrentResult(res);
      loadHistory();
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to analyze URL.");
    } finally {
      setAnalyzing(false);
    }
  };

  const applyPreset = (preset) => {
    setUrlInput(preset.url);
    setNotesInput(preset.notes);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Globe className="w-6 h-6 text-cyan-400" />
          <h1 className="text-2xl font-bold text-white tracking-wide">Phishing & URL Intelligence</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Static heuristic forensic inspection of suspicious domains, typosquatting patterns, and C2 hosts without live execution.
        </p>
      </div>

      {/* Input Analysis Form */}
      <div className="p-6 rounded-xl bg-slate-900/90 border border-slate-800">
        <h2 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
          <Search className="w-4 h-4 text-blue-400" />
          Inspect Suspicious URL / Link
        </h2>

        <form onSubmit={handleAnalyze} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Target URL or Hostname *</label>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="e.g. http://sbi-kyc-verify-update.site/login or 185.220.101.5:8080"
              className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Attach to Case (Optional)</label>
              <select
                value={selectedCaseId}
                onChange={(e) => setSelectedCaseId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="">-- No Case Association --</option>
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.case_number} - {c.title.substring(0, 45)}...
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Investigator Notes (Optional)</label>
              <input
                type="text"
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                placeholder="e.g. Received via victim WhatsApp SMS complaint"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Preset Buttons for Instant Evaluation */}
          <div className="pt-2">
            <span className="text-[11px] font-medium text-slate-400 block mb-2">Instant Test Intelligence Samples:</span>
            <div className="flex flex-wrap gap-2">
              {PRESET_URLS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/80 text-xs transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-950/50 border border-red-800 text-xs text-red-300">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Safe static inspection mode: Target URL will never be loaded in browser or executed.</span>
            </div>
            <button
              type="submit"
              disabled={analyzing}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all"
            >
              {analyzing ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Analyzing Heuristics...</span>
                </>
              ) : (
                <>
                  <Globe className="w-3.5 h-3.5" />
                  <span>Run Forensic URL Analysis</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Analysis Results View */}
      {currentResult && (
        <div className="space-y-6">
          {/* Top Score Banner */}
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            {/* Score circle */}
            <div className="flex items-center gap-4 border-r border-slate-800/80 pr-6">
              <div className={`h-20 w-20 rounded-2xl flex flex-col items-center justify-center font-mono font-bold border ${
                currentResult.risk_score >= 75 ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                currentResult.risk_score >= 50 ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' :
                currentResult.risk_score >= 25 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              }`}>
                <span className="text-2xl leading-none">{currentResult.risk_score}</span>
                <span className="text-[10px] font-sans font-normal uppercase text-slate-400 mt-1">/ 100 Risk</span>
              </div>
              <div>
                <RiskBadge level={currentResult.risk_category} size="md" />
                <p className="text-[11px] text-slate-400 mt-1.5 font-mono">
                  {currentResult.analysis_method || "Heuristic Static Engine"}
                </p>
              </div>
            </div>

            {/* Extracted Architecture */}
            <div className="md:col-span-3 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Target URL:</span>
                <span className="text-sm font-mono text-cyan-300 font-semibold break-all">{currentResult.url}</span>
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">Domain:</span>
                  <span className="font-mono text-slate-200 font-medium">{currentResult.domain}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">Scheme:</span>
                  <span className={`inline-flex items-center gap-1 font-mono font-medium ${currentResult.scheme === 'https' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {currentResult.scheme === 'https' ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                    {currentResult.scheme.toUpperCase()}
                  </span>
                </div>
                {currentResult.ip_address && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">Host IP:</span>
                    <span className="font-mono text-amber-400">{currentResult.ip_address}</span>
                  </div>
                )}
                {currentResult.is_shortener && (
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-semibold">
                    URL Shortener
                  </span>
                )}
                {currentResult.is_ip_host && (
                  <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-semibold">
                    Raw IP Host
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pt-1">
                {currentResult.explanation}
              </p>
            </div>
          </div>

          {/* Indicators & Steps Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Detected Indicators */}
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-semibold text-slate-200">Diagnostic Heuristic Indicators</h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {currentResult.indicators?.length || 0} Flagged
                </span>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {currentResult.indicators && currentResult.indicators.length > 0 ? (
                  currentResult.indicators.map((ind, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800/80">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-200">{ind.name}</span>
                        <div className="flex items-center gap-2">
                          <RiskBadge level={ind.severity} size="sm" />
                          <span className="font-mono text-[10px] text-slate-400">+{ind.risk_points} pts</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{ind.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 py-4 text-center">No structural or algorithmic risk anomalies identified.</p>
                )}
              </div>
            </div>

            {/* Actionable Verification Steps for Investigator */}
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <ListChecks className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-semibold text-slate-200">Investigator Action Directives</h3>
                </div>
                <span className="text-xs text-cyan-400 font-mono">SOP Guidelines</span>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {currentResult.verification_steps && currentResult.verification_steps.length > 0 ? (
                  currentResult.verification_steps.map((step, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-start gap-3">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-[10px] font-bold text-blue-400">
                        {idx + 1}
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">{step}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 py-4 text-center">Standard baseline checks applicable.</p>
                )}

                <div className="p-3 rounded-lg bg-blue-950/30 border border-blue-900/50 mt-4 text-xs text-slate-400">
                  <div className="font-semibold text-blue-300 mb-1">Statutory Preservation Note:</div>
                  Under Section 79(3)(b) & Section 69A of the IT Act, preserve WHOIS metadata, DNS records, and TLS certificate fingerprint before domain takedown execution.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analysis History Table */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-200">Recent URL Analysis Registry</h3>
          </div>
          <span className="text-xs text-slate-400">{history.length} records in repository</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase font-medium border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Analyzed URL</th>
                <th className="py-2.5 px-3">Domain</th>
                <th className="py-2.5 px-3">Scheme</th>
                <th className="py-2.5 px-3">Risk Assessment</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-mono max-w-sm truncate text-cyan-300">{item.url}</td>
                  <td className="py-3 px-3 font-mono">{item.domain}</td>
                  <td className="py-3 px-3 uppercase text-slate-400">{item.scheme}</td>
                  <td className="py-3 px-3">
                    <RiskBadge level={item.risk_category} score={item.risk_score} size="sm" />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setCurrentResult(item)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
                    >
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

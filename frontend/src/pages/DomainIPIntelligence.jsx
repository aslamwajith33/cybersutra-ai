import React, { useState, useEffect } from 'react';
import {
  Globe2,
  Server,
  Search,
  ShieldAlert,
  Lock,
  ExternalLink,
  Building2,
  ReceiptIndianRupee,
  Layers,
  Scale,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  FileDown
} from 'lucide-react';
import { analyzeInfrastructure, getInfrastructureHistory, getCases, draftNotice } from '../api/client';
import { RiskBadge } from '../components/RiskBadge';

const PRESET_INFRA = [
  { label: "Fake Electricity Bill (JVVNL Scam)", id: "jvvnl-bijli-update.site" },
  { label: "Illegal Loan App Server IP", id: "185.220.101.45" },
  { label: "Telegram Task Scam Website", id: "vip-task-earn.click" },
  { label: "Official Rajasthan Police Portal", id: "police.rajasthan.gov.in" }
];

export const DomainIPIntelligence = () => {
  const [identifier, setIdentifier] = useState('jvvnl-bijli-update.site');
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [cases, setCases] = useState([]);
  
  const [analyzing, setAnalyzing] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [noticeSuccess, setNoticeSuccess] = useState(null);

  useEffect(() => {
    loadData();
    handleAnalyze('jvvnl-bijli-update.site');
  }, []);

  const loadData = async () => {
    try {
      const [hist, caseList] = await Promise.all([
        getInfrastructureHistory(),
        getCases()
      ]);
      setHistory(hist);
      setCases(caseList);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnalyze = async (targetId = null) => {
    const idToUse = targetId || identifier;
    if (!idToUse.trim()) return;

    setAnalyzing(true);
    setNoticeSuccess(null);
    try {
      const res = await analyzeInfrastructure(idToUse.trim(), selectedCaseId || null);
      setCurrentResult(res);
      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleTakedownNotice = async () => {
    if (!currentResult) return;
    try {
      const caseIdToUse = selectedCaseId ? parseInt(selectedCaseId) : (cases[0]?.id || 1);
      const res = await draftNotice({
        case_id: caseIdToUse,
        notice_type: "SECTION_69A_IT",
        target_institution: "Designated Officer (Sec 69A IT Act), CERT-In / MeitY",
        target_identifier: currentResult.identifier,
        issuing_officer: "Insp. Vikram Rathore, IO"
      });
      setNoticeSuccess(`Section 69A IT Act emergency website takedown order drafted: ${res.notice_number}`);
    } catch (err) {
      alert("Failed to draft takedown notice.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#2563eb]/20 border border-[#2563eb]/40 flex items-center justify-center text-[#b4c5ff]">
            <Globe2 className="w-5 h-5 text-[#b4c5ff]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#dde2f8]">
                Scam Websites & IP Server Intelligence
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#2563eb]/20 text-[#b4c5ff] border border-[#2563eb]/30">
                Cyber Intel
              </span>
            </div>
            <p className="text-xs text-[#c3c6d7] mt-0.5">
              Inspect fake government portals, phishing URLs, and offshore criminal servers to uncover where they operate from.
            </p>
          </div>
        </div>
      </div>

      {/* Plain-English Explanation Banner */}
      <div className="p-4 rounded-xl bg-[#151b2b] border border-[#434655]/50 flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-[#ffb77d] shrink-0 mt-0.5" />
        <div className="text-xs text-[#c3c6d7] leading-relaxed">
          <span className="font-bold text-[#dde2f8]">How Scammers Use Fake Websites: </span>
          Criminals send SMS messages claiming a citizen's electricity will be cut off or promising easy online income. The link takes victims to a fake portal that steals their UPI and bank credentials. This tool inspects the domain name or IP address, identifies the offshore hosting provider, and drafts an emergency Section 69A IT Act blocking requisition to CERT-In.
        </div>
      </div>

      {/* Search Input Box */}
      <div className="p-5 sm:p-6 rounded-xl bg-[#151b2b] border border-[#434655]/50">
        <form onSubmit={(e) => { e.preventDefault(); handleAnalyze(); }} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#c3c6d7] mb-1.5">
              Enter Suspicious Domain Name or IP Address:
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. jvvnl-bijli-update.site or 185.220.101.45"
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#080e1d] border border-[#434655]/60 text-xs font-mono text-[#dde2f8] focus:outline-none focus:border-[#2563eb]"
                required
              />
              <button
                type="submit"
                disabled={analyzing}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#3b82f6] text-white text-xs font-bold transition-all shadow-md shrink-0"
              >
                {analyzing ? (
                  <>
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Resolving Server & DNS...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Analyze Website & IP</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-semibold text-[#8d90a0]">Try Live Test Samples:</span>
            {PRESET_INFRA.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setIdentifier(p.id);
                  handleAnalyze(p.id);
                }}
                className="px-2.5 py-1 rounded-lg bg-[#191f2f] hover:bg-[#242a3a] text-[#c3c6d7] hover:text-[#dde2f8] border border-[#434655]/40 text-xs transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </form>
      </div>

      {noticeSuccess && (
        <div className="p-4 rounded-xl bg-[#080e1d] border border-emerald-500/50 text-xs text-emerald-400 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{noticeSuccess}</span>
        </div>
      )}

      {/* Results View */}
      {currentResult && (
        <div className="space-y-5 animate-fadeIn">
          {/* Identity Card */}
          <div className="p-5 sm:p-6 rounded-xl bg-[#151b2b] border border-[#434655]/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#434655]/40">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-[#2563eb]/20 border border-[#2563eb]/40 flex items-center justify-center text-[#b4c5ff] font-bold font-mono text-xs">
                  {currentResult.entity_type}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#dde2f8] font-mono">
                    {currentResult.identifier}
                  </h3>
                  <p className="text-xs text-[#c3c6d7]">
                    {currentResult.threat_classification}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[11px] text-[#8d90a0] block">Threat Score</span>
                  <span className="text-lg font-bold font-mono text-[#ffb3ad]">
                    {currentResult.risk_score} / 100
                  </span>
                </div>
                <RiskBadge level={currentResult.risk_category} size="md" />
                <button
                  onClick={handleTakedownNotice}
                  className="px-3 py-1.5 rounded-lg bg-[#cf2c30]/20 hover:bg-[#cf2c30]/30 text-[#ffb3ad] border border-[#cf2c30]/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Sec 69A Takedown Notice</span>
                </button>
              </div>
            </div>

            {/* Hosting & Geolocation */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 text-xs">
              <div className="p-3 rounded-lg bg-[#080e1d] border border-[#434655]/40">
                <span className="text-[10px] uppercase font-bold text-[#8d90a0] block mb-0.5">
                  Resolved IP Address
                </span>
                <span className="font-mono text-[#b4c5ff] font-bold">
                  {currentResult.resolved_ip}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[#080e1d] border border-[#434655]/40">
                <span className="text-[10px] uppercase font-bold text-[#8d90a0] block mb-0.5">
                  Server Hosting ISP
                </span>
                <span className="text-[#dde2f8] font-semibold">
                  {currentResult.hosting_provider}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[#080e1d] border border-[#434655]/40">
                <span className="text-[10px] uppercase font-bold text-[#8d90a0] block mb-0.5">
                  Server Location
                </span>
                <span className="text-[#dde2f8] font-semibold">
                  {currentResult.country} ({currentResult.country_code})
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[#080e1d] border border-[#434655]/40">
                <span className="text-[10px] uppercase font-bold text-[#8d90a0] block mb-0.5">
                  Domain Registrar
                </span>
                <span className="text-[#dde2f8] font-semibold">
                  {currentResult.registrar || "Namecheap Inc / Offshore"}
                </span>
              </div>
            </div>

            {/* Technical Indicators */}
            {currentResult.threat_indicators && currentResult.threat_indicators.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[#434655]/40 space-y-2">
                <span className="text-xs font-bold text-[#dde2f8]">
                  Observed Malicious Behaviors:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentResult.threat_indicators.map((ind, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-[#080e1d] border border-[#434655]/40 text-xs text-[#c3c6d7] flex items-center gap-2"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-[#ffb77d] shrink-0" />
                      <span>{ind}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* History */}
      <div className="p-5 rounded-xl bg-[#151b2b] border border-[#434655]/50">
        <h3 className="text-sm font-bold text-[#dde2f8] mb-3">
          Recently Scanned Rogue Infrastructure
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#080e1d] text-[#8d90a0] uppercase font-bold text-[10px] border-b border-[#434655]/50">
              <tr>
                <th className="py-2.5 px-3">Target Domain / IP</th>
                <th className="py-2.5 px-3">Hosting Provider</th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3">Risk Category</th>
                <th className="py-2.5 px-3 text-right">Quick Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#434655]/30 text-[#dde2f8]">
              {history.map((h, idx) => (
                <tr key={idx} className="hover:bg-[#191f2f]/60 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-[#b4c5ff]">
                    {h.identifier}
                  </td>
                  <td className="py-3 px-3 text-[#c3c6d7]">{h.hosting_provider}</td>
                  <td className="py-3 px-3 text-[#8d90a0]">{h.country}</td>
                  <td className="py-3 px-3">
                    <RiskBadge level={h.risk_category} score={h.risk_score} size="sm" />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => {
                        setIdentifier(h.identifier);
                        handleAnalyze(h.identifier);
                      }}
                      className="px-2.5 py-1 rounded bg-[#2563eb]/20 hover:bg-[#2563eb]/30 text-[#b4c5ff] border border-[#2563eb]/30 text-xs font-semibold"
                    >
                      Re-Check
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

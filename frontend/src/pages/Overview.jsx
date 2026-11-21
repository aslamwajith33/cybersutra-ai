import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderGit2,
  AlertTriangle,
  ReceiptIndianRupee,
  Link2Off,
  Search,
  Printer,
  RefreshCw,
  FolderOpen,
  X,
  ArrowRight,
  ShieldAlert,
  Building2,
  GitFork,
  FileSpreadsheet,
  Gavel,
  Sparkles,
  Lightbulb,
  Fingerprint,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { getDashboardStats, seedDemoData } from '../api/client';
import { FeaturesGuideModal } from '../components/FeaturesGuideModal';

export const Overview = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalCase, setModalCase] = useState(null);
  const [showGuideModal, setShowGuideModal] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = async () => {
    await seedDemoData(false);
    loadData();
  };

  if (loading || !stats) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex items-center gap-2 text-xs font-mono text-[#c3c6d7]">
          <RefreshCw className="w-4 h-4 animate-spin text-[#b4c5ff]" />
          <span>LOADING INVESTIGATION PLATFORM...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col w-full gap-5">
        {/* Top Interactive Banner: For Normal People, Evaluators, and Police Officers */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#151b2b] via-[#191f2f] to-[#151b2b] border border-[#2563eb]/40 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffb77d] animate-pulse"></span>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#ffb77d]">
                Rajasthan Police PS05 • Financial Cybercrime Intelligence Platform
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-[#dde2f8]">
              Connecting Stolen Money Trails. Tracing Scam Websites & Dummy Accounts.
            </h1>
            <p className="text-xs text-[#c3c6d7] max-w-2xl leading-relaxed">
              When citizens are scammed, criminals quickly bounce money through dummy bank accounts and withdraw cash at ATMs within 35 minutes. CyberSutra traces the entire path in seconds and auto-generates bank freeze orders.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowGuideModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#3b82f6] text-white text-xs font-bold shadow-md transition-all group"
            >
              <Sparkles className="w-4 h-4 text-[#ffb77d] group-hover:rotate-12 transition-transform" />
              <span>Explore All Features (Interactive Guide)</span>
            </button>
          </div>
        </div>

        {/* 4-Step Plain English Workflow: How Police Solve Cybercrimes With This System */}
        <div className="bg-[#151b2b] p-4 sm:p-5 rounded-2xl border border-[#434655]/50 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffb77d]"></span>
              <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-[#dde2f8]">
                How Police Solves Cybercrime In 4 Simple Steps:
              </h2>
            </div>
            <span className="text-[11px] text-[#c3c6d7] hidden md:inline">
              Click any card to try it with live demo data
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div
              onClick={() => navigate('/statements')}
              className="p-3.5 rounded-xl bg-[#191f2f] hover:bg-[#242a3a] border border-[#434655]/40 hover:border-[#2563eb]/60 cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2 text-[#b4c5ff] mb-1.5">
                <FileSpreadsheet className="w-4 h-4" />
                <span className="font-bold text-xs">1. Upload Bank Statements</span>
              </div>
              <p className="text-[11px] text-[#c3c6d7] leading-relaxed">
                Drop any PDF or Excel file. The system reads thousands of transactions in 2 seconds.
              </p>
            </div>

            <div
              onClick={() => navigate('/mule-detection')}
              className="p-3.5 rounded-xl bg-[#191f2f] hover:bg-[#242a3a] border border-[#434655]/40 hover:border-[#2563eb]/60 cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2 text-[#ffb77d] mb-1.5">
                <Building2 className="w-4 h-4" />
                <span className="font-bold text-xs">2. Spot Dummy Accounts</span>
              </div>
              <p className="text-[11px] text-[#c3c6d7] leading-relaxed">
                AI catches rented accounts where stolen money arrives and drains out in 5 minutes.
              </p>
            </div>

            <div
              onClick={() => navigate('/money-trail')}
              className="p-3.5 rounded-xl bg-[#191f2f] hover:bg-[#242a3a] border border-[#2563eb]/50 hover:border-[#2563eb] cursor-pointer transition-all shadow-sm"
            >
              <div className="flex items-center gap-2 text-[#b4c5ff] mb-1.5">
                <GitFork className="w-4 h-4" />
                <span className="font-bold text-xs">3. Follow The Stolen Money</span>
              </div>
              <p className="text-[11px] text-[#c3c6d7] leading-relaxed">
                Enter any 12-digit UTR to draw the complete 5-hop path to ATM cashouts.
              </p>
            </div>

            <div
              onClick={() => navigate('/reports')}
              className="p-3.5 rounded-xl bg-[#191f2f] hover:bg-[#242a3a] border border-[#434655]/40 hover:border-[#cf2c30]/60 cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2 text-[#ffb3ad] mb-1.5">
                <Gavel className="w-4 h-4" />
                <span className="font-bold text-xs">4. Freeze Bank Accounts</span>
              </div>
              <p className="text-[11px] text-[#c3c6d7] leading-relaxed">
                Auto-generate Section 102 CrPC legal freeze letters to stop cash withdrawals.
              </p>
            </div>
          </div>
        </div>

        {/* 6 Plain-English KPI Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {/* 1. Total Complaints */}
          <div className="bg-[#151b2b] p-4 rounded-xl border border-[#434655]/40 flex flex-col justify-between gap-1.5 hover:bg-[#191f2f] transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#c3c6d7]">Citizen Complaints</span>
              <FolderGit2 className="w-4 h-4 text-[#b4c5ff]" />
            </div>
            <div className="text-2xl font-bold font-mono text-[#dde2f8]">{stats.total_complaints}</div>
            <div className="text-[10px] text-[#8d90a0]">Reported via 1930 / FIR</div>
          </div>

          {/* 2. Active Inquiries */}
          <div className="bg-[#151b2b] p-4 rounded-xl border border-[#434655]/40 flex flex-col justify-between gap-1.5 hover:bg-[#191f2f] transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#c3c6d7]">Active Cases</span>
              <Search className="w-4 h-4 text-[#b4c5ff]" />
            </div>
            <div className="text-2xl font-bold font-mono text-[#dde2f8]">{stats.active_investigations} FIRs</div>
            <div className="text-[10px] text-[#8d90a0]">Under active tracking</div>
          </div>

          {/* 3. Priority 1 Cases */}
          <div className="bg-[#151b2b] p-4 rounded-xl border border-[#cf2c30]/40 flex flex-col justify-between gap-1.5 hover:bg-[#191f2f] transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#ffb3ad]">Urgent Syndicates</span>
              <AlertTriangle className="w-4 h-4 text-[#ffb3ad]" />
            </div>
            <div className="text-2xl font-bold font-mono text-[#ffb3ad]">{stats.high_risk_cases} Gangs</div>
            <div className="text-[10px] text-[#ffb3ad]">Needs immediate freeze</div>
          </div>

          {/* 4. Flagged Txns */}
          <div className="bg-[#151b2b] p-4 rounded-xl border border-[#434655]/40 flex flex-col justify-between gap-1.5 hover:bg-[#191f2f] transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#c3c6d7]">Mule Transfers</span>
              <ReceiptIndianRupee className="w-4 h-4 text-[#b4c5ff]" />
            </div>
            <div className="text-2xl font-bold font-mono text-[#dde2f8]">{stats.flagged_transactions} Txns</div>
            <div className="text-[10px] text-[#8d90a0]">Rapid money bouncing</div>
          </div>

          {/* 5. Suspect Domains */}
          <div className="bg-[#151b2b] p-4 rounded-xl border border-[#434655]/40 flex flex-col justify-between gap-1.5 hover:bg-[#191f2f] transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#c3c6d7]">Scam Websites</span>
              <Link2Off className="w-4 h-4 text-[#b4c5ff]" />
            </div>
            <div className="text-2xl font-bold font-mono text-[#dde2f8]">{stats.suspect_domains} Rogue</div>
            <div className="text-[10px] text-[#8d90a0]">Phishing & task fraud</div>
          </div>

          {/* 6. Legal Notices */}
          <div className="bg-[#151b2b] p-4 rounded-xl border border-emerald-500/40 flex flex-col justify-between gap-1.5 hover:bg-[#191f2f] transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-400">Freeze Notices</span>
              <Gavel className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-400">
              {stats.statutory_notices_issued} Issued
            </div>
            <div className="text-[10px] font-bold text-emerald-400">₹19 Lakh Saved / Frozen</div>
          </div>
        </div>

        {/* Visual Charts: What the numbers mean */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left: 7-Day Complaint Inflow */}
          <div className="bg-[#151b2b] p-4 sm:p-5 rounded-2xl border border-[#434655]/50 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[#dde2f8]">
                  New Cyber Complaints (Past 7 Days)
                </div>
                <div className="text-[11px] text-[#c3c6d7]">
                  Shows when citizens report scam calls and message frauds
                </div>
              </div>
              <span className="text-[10px] font-mono text-[#b4c5ff] bg-[#080e1d] px-2 py-0.5 rounded border border-[#434655]/40">
                Peak: 6 complaints/day
              </span>
            </div>

            <div className="h-48 bg-[#080e1d] rounded-xl p-2 border border-[#434655]/30">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.complaints_trend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="friendlyAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#242a3a" />
                  <XAxis dataKey="date" stroke="#8d90a0" fontSize={10} tickLine={false} />
                  <YAxis stroke="#8d90a0" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#151b2b', borderColor: '#434655', borderRadius: '8px', fontSize: '11px', color: '#dde2f8' }}
                  />
                  <Area type="monotone" dataKey="complaints" stroke="#2563eb" strokeWidth={2.5} fill="url(#friendlyAreaGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right: Modus Operandi Breakdown */}
          <div className="bg-[#151b2b] p-4 sm:p-5 rounded-2xl border border-[#434655]/50 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[#dde2f8]">
                  Common Scam Methods Detected
                </div>
                <div className="text-[11px] text-[#c3c6d7]">
                  What tricks are criminals using against citizens in Rajasthan?
                </div>
              </div>
              <span className="text-[10px] font-mono text-[#ffb77d] bg-[#080e1d] px-2 py-0.5 rounded border border-[#434655]/40">
                #1 Threat: Task Scams
              </span>
            </div>

            <div className="h-48 bg-[#080e1d] rounded-xl p-3 border border-[#434655]/30 flex flex-col justify-center gap-2.5">
              {stats.fraud_distribution.slice(0, 4).map((item, idx) => {
                const maxCount = Math.max(...stats.fraud_distribution.map(d => d.count), 1);
                const pct = Math.round((item.count / maxCount) * 100);
                return (
                  <div key={idx} className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#dde2f8] font-medium">{item.category}</span>
                      <span className="font-mono text-[11px] text-[#ffb77d] font-semibold">{item.count} Cases</span>
                    </div>
                    <div className="w-full h-2 bg-[#242a3a] rounded-full overflow-hidden">
                      <div className="h-full bg-[#d97707] rounded-full" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Active Cases & Syndicate Alerts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Left (2 cols): Active Police Case Files */}
          <div className="xl:col-span-2 bg-[#151b2b] rounded-2xl border border-[#434655]/50 overflow-hidden flex flex-col">
            <div className="px-5 py-3.5 bg-[#0d1322] border-b border-[#434655]/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-[#b4c5ff]" />
                <span className="text-xs font-bold text-[#dde2f8] uppercase tracking-wider">
                  Active Police Case Files (FIRs)
                </span>
              </div>
              <button
                onClick={() => navigate('/cases')}
                className="text-xs text-[#b4c5ff] hover:text-white flex items-center gap-1 font-semibold"
              >
                View All Cases →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#080e1d] border-b border-[#434655]/40 text-[10px] font-mono text-[#c3c6d7] uppercase tracking-wider">
                    <th className="px-4 py-2.5">FIR Number</th>
                    <th className="px-3 py-2.5">What Happened & Loss</th>
                    <th className="px-3 py-2.5">Police Station</th>
                    <th className="px-3 py-2.5">Urgency</th>
                    <th className="px-4 py-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#434655]/30 text-xs">
                  {stats.recent_cases.map((c) => (
                    <tr key={c.id} className="hover:bg-[#191f2f]/60 transition-colors">
                      <td className="px-4 py-2.5 font-mono font-bold text-[#b4c5ff] whitespace-nowrap">
                        {c.case_number}
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="font-semibold text-[#dde2f8]">{c.title}</div>
                        <div className="text-[10px] text-[#ffb77d] font-mono">Loss: ₹{c.total_loss_amount.toLocaleString('en-IN')}</div>
                      </td>
                      <td className="px-3 py-2.5 text-[#c3c6d7]">{c.district}</td>
                      <td className="px-3 py-2.5">
                        <span className={`inline-block px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                          c.priority === 'Critical'
                            ? 'bg-[#cf2c30]/20 text-[#ffb3ad] border border-[#cf2c30]/30'
                            : 'bg-[#d97707]/20 text-[#ffb77d] border border-[#d97707]/30'
                        }`}>
                          {c.priority.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <button
                          onClick={() => setModalCase(c)}
                          className="px-3 py-1 rounded-lg bg-[#2563eb] hover:bg-[#3b82f6] text-white text-xs font-semibold transition-colors"
                        >
                          View File
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right (1 col): Cross-District Syndicate Alerts */}
          <div className="xl:col-span-1 bg-[#151b2b] rounded-2xl border border-[#434655]/50 flex flex-col overflow-hidden">
            <div className="px-5 py-3.5 bg-[#0d1322] border-b border-[#434655]/40 flex items-center justify-between">
              <span className="text-xs font-bold text-[#dde2f8] uppercase tracking-wider">
                Connected Gang Alerts
              </span>
              <span className="text-[10px] font-mono text-[#ffb77d] font-bold">DNA Match</span>
            </div>

            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-[#080e1d] border border-[#d97707]/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#ffb77d]">
                      GANG FNA-2026-001
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-700">
                      96% Match
                    </span>
                  </div>
                  <p className="text-xs text-[#c3c6d7] leading-relaxed">
                    Same offshore hosting, same ₹49,000 transfer pattern, and same UPI formula used in 4 different FIRs.
                  </p>
                  <button
                    onClick={() => navigate('/fraud-dna')}
                    className="w-full mt-1 py-1.5 rounded-lg bg-[#d97707]/20 hover:bg-[#d97707]/30 text-[#ffb77d] border border-[#d97707]/30 text-xs font-semibold text-center transition-colors block"
                  >
                    View Gang Fingerprint (DNA) →
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-[#080e1d] border border-[#434655]/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#b4c5ff]">
                      ALWAR CASH EXTRACTION
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#cf2c30]/20 text-[#ffb3ad] border border-[#cf2c30]/30">
                      ATM Cluster
                    </span>
                  </div>
                  <p className="text-xs text-[#c3c6d7] leading-relaxed">
                    ₹6.8 Lakh withdrawn across 3 ATMs in Alwar district within 35 minutes of victim transfers.
                  </p>
                  <button
                    onClick={() => navigate('/money-trail')}
                    className="w-full mt-1 py-1.5 rounded-lg bg-[#2563eb]/20 hover:bg-[#2563eb]/30 text-[#b4c5ff] border border-[#2563eb]/30 text-xs font-semibold text-center transition-colors block"
                  >
                    Trace Money Trail →
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-[#434655]/40 flex items-center justify-between">
                <span className="text-[11px] text-[#8d90a0]">Demo Sandbox Mode</span>
                <button
                  onClick={handleRefresh}
                  className="text-xs text-[#b4c5ff] hover:text-white flex items-center gap-1 font-semibold"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reload Data</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Case Details Modal */}
      {modalCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-[#151b2b] border border-[#434655] rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#434655]/40 mb-4">
              <div>
                <span className="font-mono text-xs font-bold text-[#b4c5ff]">
                  {modalCase.case_number}
                </span>
                <h3 className="text-base font-bold text-[#dde2f8]">
                  {modalCase.title}
                </h3>
              </div>
              <button
                onClick={() => setModalCase(null)}
                className="text-[#8d90a0] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#080e1d] border border-[#434655]/40 space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#8d90a0] block">
                  Incident Description
                </span>
                <p className="text-[#c3c6d7] leading-relaxed">{modalCase.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#080e1d] border border-[#434655]/40">
                  <span className="text-[10px] uppercase font-bold text-[#8d90a0] block">
                    Total Victim Loss
                  </span>
                  <span className="text-base font-bold font-mono text-[#ffb77d]">
                    ₹{modalCase.total_loss_amount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#080e1d] border border-[#434655]/40">
                  <span className="text-[10px] uppercase font-bold text-[#8d90a0] block">
                    Police Station
                  </span>
                  <span className="text-xs font-semibold text-[#dde2f8]">
                    {modalCase.district}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#434655]/40 mt-4">
              <button
                onClick={() => setModalCase(null)}
                className="px-4 py-2 rounded-xl bg-[#242a3a] text-[#c3c6d7] text-xs font-semibold hover:bg-[#191f2f]"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setModalCase(null);
                  navigate('/money-trail');
                }}
                className="px-4 py-2 rounded-xl bg-[#2563eb] text-white text-xs font-bold hover:bg-[#3b82f6] shadow-md flex items-center gap-1.5"
              >
                <span>Follow Stolen Money</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Interactive Guide Modal */}
      <FeaturesGuideModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
      />
    </>
  );
};

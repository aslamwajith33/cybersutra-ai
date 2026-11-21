import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  ShieldAlert,
  ArrowRightLeft,
  AlertTriangle,
  Scale,
  FileText,
  Clock,
  Filter,
  CheckCircle2,
  ExternalLink,
  Lightbulb,
  Search,
  ArrowRight
} from 'lucide-react';
import { getMuleAnalysis, getCases, draftNotice } from '../api/client';
import { RiskBadge } from '../components/RiskBadge';

export const MuleDetection = () => {
  const navigate = useNavigate();
  const [muleData, setMuleData] = useState(null);
  const [cases, setCases] = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Freeze notice draft modal
  const [targetMule, setTargetMule] = useState(null);
  const [noticeDrafting, setNoticeDrafting] = useState(false);
  const [noticeSuccess, setNoticeSuccess] = useState(null);

  useEffect(() => {
    loadMules();
  }, [selectedCaseId]);

  const loadMules = async () => {
    try {
      setLoading(true);
      const caseFilter = selectedCaseId ? parseInt(selectedCaseId) : null;
      const [res, caseList] = await Promise.all([
        getMuleAnalysis(caseFilter),
        getCases()
      ]);
      setMuleData(res);
      setCases(caseList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateNotice = async (mule) => {
    try {
      setNoticeDrafting(true);
      setNoticeSuccess(null);
      const caseIdToUse = selectedCaseId ? parseInt(selectedCaseId) : (cases[0]?.id || 1);
      
      const res = await draftNotice({
        case_id: caseIdToUse,
        notice_type: "SECTION_91_CRPC",
        target_institution: `${mule.bank_name} Nodal Officer / Fraud Risk Management`,
        target_identifier: mule.account_number,
        issuing_officer: "Insp. Vikram Rathore, IO"
      });

      setNoticeSuccess(`Statutory Section 91 Cr.P.C. freeze requisition generated: ${res.notice_number}`);
      setTargetMule(null);
    } catch (err) {
      alert("Failed to draft notice.");
    } finally {
      setNoticeDrafting(false);
    }
  };

  const filteredMules = muleData?.mule_accounts?.filter((m) => {
    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    return (
      m.account_number?.toLowerCase().includes(q) ||
      m.bank_name?.toLowerCase().includes(q) ||
      m.indicators?.some((ind) => ind.toLowerCase().includes(q))
    );
  }) || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#cf2c30]/20 border border-[#cf2c30]/40 flex items-center justify-center text-[#ffb3ad]">
              <Building2 className="w-5 h-5 text-[#ffb3ad]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#dde2f8]">
                  Mule Account Detector (Dummy Bank Accounts)
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#cf2c30]/20 text-[#ffb3ad] border border-[#cf2c30]/30">
                  AI Screening
                </span>
              </div>
              <p className="text-xs text-[#c3c6d7] mt-0.5">
                Automatically identifies rented bank accounts used by scammers to quickly bounce and siphon victim money.
              </p>
            </div>
          </div>
        </div>

        {/* Case Filter */}
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-xs text-[#c3c6d7] font-medium hidden sm:inline">Filter FIR:</label>
          <select
            value={selectedCaseId}
            onChange={(e) => setSelectedCaseId(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#080e1d] border border-[#434655]/60 text-xs text-[#dde2f8] focus:outline-none focus:border-[#2563eb]"
          >
            <option value="">All Rajasthan Cases</option>
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.case_number}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Plain English Explanation Card: For Anyone Viewing */}
      <div className="p-4 rounded-xl bg-[#151b2b] border border-[#434655]/50 flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-[#ffb77d] shrink-0 mt-0.5" />
        <div className="text-xs text-[#c3c6d7] leading-relaxed">
          <span className="font-bold text-[#dde2f8]">What is a Mule Account? </span>
          Cybercriminals rarely use their own bank accounts. Instead, they rent accounts from college students, farmers, or daily wage workers for ₹5,000. When victim money arrives, the criminals immediately transfer 95% of it to other accounts within 5–15 minutes. This tool automatically catches accounts with <span className="text-[#ffb77d] font-semibold">zero retention</span> (money enters and immediately leaves).
        </div>
      </div>

      {noticeSuccess && (
        <div className="p-4 rounded-xl bg-[#080e1d] border border-[#2563eb]/60 text-xs text-[#b4c5ff] flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#ffb77d] shrink-0" />
            <span className="font-medium">{noticeSuccess}</span>
          </div>
          <button
            onClick={() => navigate('/reports')}
            className="text-xs font-bold text-[#ffb77d] hover:underline"
          >
            View in Reports / Notices →
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-[#151b2b] border border-[#434655]/50">
          <span className="text-[11px] font-medium uppercase text-[#8d90a0] block mb-1">
            Mule Accounts Found
          </span>
          <div className="text-2xl font-bold font-mono text-[#ffb3ad]">
            {muleData?.mule_accounts?.length || 0}
          </div>
          <span className="text-[10px] text-[#c3c6d7] mt-1 block">
            Zero retention pass-through
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#151b2b] border border-[#434655]/50">
          <span className="text-[11px] font-medium uppercase text-[#8d90a0] block mb-1">
            Rapid Layering
          </span>
          <div className="text-2xl font-bold font-mono text-[#ffb77d]">
            {muleData?.layering_chains?.length || 0}
          </div>
          <span className="text-[10px] text-[#c3c6d7] mt-1 block">
            Transferred in &lt; 30 minutes
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#151b2b] border border-[#434655]/50">
          <span className="text-[11px] font-medium uppercase text-[#8d90a0] block mb-1">
            ₹49k Smurfing Alerts
          </span>
          <div className="text-2xl font-bold font-mono text-[#b4c5ff]">
            {muleData?.structuring_alerts?.length || 0}
          </div>
          <span className="text-[10px] text-[#c3c6d7] mt-1 block">
            Split under ₹50k to dodge alerts
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#151b2b] border border-[#434655]/50">
          <span className="text-[11px] font-medium uppercase text-[#8d90a0] block mb-1">
            Total Stolen Flow
          </span>
          <div className="text-2xl font-bold font-mono text-[#dde2f8]">
            ₹{muleData?.mule_accounts ? muleData.mule_accounts.reduce((acc, m) => acc + m.total_inflow, 0).toLocaleString('en-IN') : '0'}
          </div>
          <span className="text-[10px] text-[#c3c6d7] mt-1 block">
            Routed across dummy accounts
          </span>
        </div>
      </div>

      {/* Mule Accounts Table */}
      <div className="p-5 rounded-xl bg-[#151b2b] border border-[#434655]/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#434655]/40">
          <div>
            <h3 className="text-sm font-bold text-[#dde2f8]">
              Classified Mule Accounts & Money Movement
            </h3>
            <p className="text-xs text-[#c3c6d7]">
              Ranked by risk score based on rapid withdrawals, zero retained balance, and multi-victim deposits.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#8d90a0] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search account or bank..."
              className="w-full bg-[#080e1d] border border-[#434655]/60 rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#dde2f8] placeholder-[#8d90a0] focus:outline-none focus:border-[#2563eb]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#080e1d] text-[#8d90a0] uppercase font-bold text-[10px] border-b border-[#434655]/50">
              <tr>
                <th className="py-2.5 px-3">Bank Account</th>
                <th className="py-2.5 px-3">Bank Name</th>
                <th className="py-2.5 px-3">Money In vs Money Out</th>
                <th className="py-2.5 px-3">Kept in Account</th>
                <th className="py-2.5 px-3">Mule Risk</th>
                <th className="py-2.5 px-3">Why Flagged as Dummy Account</th>
                <th className="py-2.5 px-3 text-right">Police Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#434655]/30 text-[#dde2f8]">
              {filteredMules.map((mule, idx) => (
                <tr key={idx} className="hover:bg-[#191f2f]/60 transition-colors">
                  <td className="py-3 px-3">
                    <span className="font-mono font-bold text-[#ffb3ad] block">
                      {mule.account_number}
                    </span>
                    {mule.associated_cases && mule.associated_cases.length > 1 && (
                      <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#cf2c30]/20 text-[#ffb3ad] border border-[#cf2c30]/30">
                        Multi-Case Gang Node
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-medium text-[#c3c6d7]">{mule.bank_name}</td>
                  <td className="py-3 px-3 font-mono">
                    <div className="text-emerald-400 font-semibold">+₹{mule.total_inflow.toLocaleString('en-IN')}</div>
                    <div className="text-[#ffb3ad] font-semibold">-₹{mule.total_outflow.toLocaleString('en-IN')}</div>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-[#ffb77d]">
                    {(mule.retention_ratio * 100).toFixed(1)}%
                    <span className="block text-[9px] font-normal text-[#8d90a0]">drained immediately</span>
                  </td>
                  <td className="py-3 px-3">
                    <RiskBadge level={mule.mule_risk_level} score={mule.mule_score} size="sm" />
                  </td>
                  <td className="py-3 px-3 max-w-sm">
                    <div className="space-y-1">
                      {mule.indicators.map((ind, i) => (
                        <div key={i} className="text-[11px] text-[#c3c6d7] flex items-start gap-1.5">
                          <span className="text-[#cf2c30] font-bold">•</span>
                          <span>{ind}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleGenerateNotice(mule)}
                      disabled={noticeDrafting}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#cf2c30]/20 hover:bg-[#cf2c30]/30 text-[#ffb3ad] border border-[#cf2c30]/40 text-xs font-semibold transition-colors"
                      title="Generate official Section 91/102 Cr.P.C. freeze order to bank"
                    >
                      <Scale className="w-3.5 h-3.5" />
                      <span>Draft Bank Freeze</span>
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

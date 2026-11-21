import React, { useState, useEffect } from 'react';
import {
  ReceiptIndianRupee,
  Upload,
  AlertTriangle,
  ArrowRightLeft,
  Building2,
  Clock,
  ShieldAlert,
  FileSpreadsheet,
  PlusCircle,
  Filter,
  CheckCircle2,
  Search,
  Lightbulb,
  X
} from 'lucide-react';
import { getTransactions, getMuleAnalysis, uploadBankStatement, addTransaction, getCases } from '../api/client';
import { RiskBadge } from '../components/RiskBadge';

export const FinancialInvestigation = () => {
  const [transactions, setTransactions] = useState([]);
  const [muleAnalysis, setMuleAnalysis] = useState(null);
  const [cases, setCases] = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('mules'); // 'mules', 'layering', 'structuring', 'all'
  const [searchQuery, setSearchQuery] = useState('');

  // New transaction modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTxn, setNewTxn] = useState({
    transaction_id: '',
    from_account: '',
    from_bank: 'State Bank of India',
    to_account: '',
    to_bank: 'HDFC Bank',
    amount: '',
    channel: 'UPI',
    upi_ref: '',
    case_id: ''
  });

  useEffect(() => {
    loadAll();
  }, [selectedCaseId]);

  const loadAll = async () => {
    try {
      setLoading(true);
      const caseFilter = selectedCaseId ? parseInt(selectedCaseId) : null;
      const [txs, mules, caseList] = await Promise.all([
        getTransactions({ case_id: caseFilter }),
        getMuleAnalysis(caseFilter),
        getCases()
      ]);
      setTransactions(txs);
      setMuleAnalysis(mules);
      setCases(caseList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSampleStatement = async () => {
    try {
      setUploading(true);
      setUploadSuccess(null);
      const response = await fetch('/static/samples/Suspicious_Bank_Statement_Batch.csv');
      const blob = await response.blob();
      const file = new File([blob], 'Suspicious_Bank_Statement_Batch.csv', { type: 'text/csv' });

      const formData = new FormData();
      formData.append('file', file);
      if (selectedCaseId) formData.append('case_id', selectedCaseId);

      const res = await uploadBankStatement(formData);
      setUploadSuccess(`Successfully ingested ${res.imported_count} bank records. Flagged ${res.flagged_count} suspicious transfers.`);
      loadAll();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleAddTxnSubmit = async (e) => {
    e.preventDefault();
    try {
      await addTransaction({
        ...newTxn,
        amount: parseFloat(newTxn.amount),
        case_id: newTxn.case_id ? parseInt(newTxn.case_id) : (selectedCaseId ? parseInt(selectedCaseId) : null)
      });
      setShowAddModal(false);
      setNewTxn({
        transaction_id: '',
        from_account: '',
        from_bank: 'State Bank of India',
        to_account: '',
        to_bank: 'HDFC Bank',
        amount: '',
        channel: 'UPI',
        upi_ref: '',
        case_id: ''
      });
      loadAll();
    } catch (err) {
      alert(err?.response?.data?.detail || "Failed to record transaction.");
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.transaction_id?.toLowerCase().includes(q) ||
      t.from_account?.toLowerCase().includes(q) ||
      t.to_account?.toLowerCase().includes(q) ||
      t.from_bank?.toLowerCase().includes(q) ||
      t.to_bank?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#2563eb]/20 border border-[#2563eb]/40 flex items-center justify-center text-[#b4c5ff]">
            <ReceiptIndianRupee className="w-5 h-5 text-[#b4c5ff]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#dde2f8]">
                Unified Bank Transactions & Mule Intelligence
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#2563eb]/20 text-[#b4c5ff] border border-[#2563eb]/30">
                Ledger
              </span>
            </div>
            <p className="text-xs text-[#c3c6d7] mt-0.5">
              Inspect every financial debit/credit, track multi-hop layering, and uncover accounts with rapid fund pass-through.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
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

          <button
            onClick={handleUploadSampleStatement}
            disabled={uploading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#191f2f] hover:bg-[#242a3a] text-[#ffb77d] border border-[#ffb77d]/30 text-xs font-semibold transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>{uploading ? 'Processing...' : 'Load Sample Bank File'}</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#2563eb] hover:bg-[#3b82f6] text-white text-xs font-bold transition-all shadow-md"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Record Transaction</span>
          </button>
        </div>
      </div>

      {/* Explanation Banner */}
      <div className="p-4 rounded-xl bg-[#151b2b] border border-[#434655]/50 flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-[#ffb77d] shrink-0 mt-0.5" />
        <div className="text-xs text-[#c3c6d7] leading-relaxed">
          <span className="font-bold text-[#dde2f8]">Understanding the Bank Ledger: </span>
          Criminals disguise stolen funds by breaking them down into multiple smaller transactions (&lt; ₹50,000) and bouncing them through multiple regional accounts within minutes. Use the tabs below to view flagged mule accounts, rapid transfers under 30 minutes, or the complete unified transaction log.
        </div>
      </div>

      {uploadSuccess && (
        <div className="p-4 rounded-xl bg-[#080e1d] border border-emerald-500/50 text-xs text-emerald-400 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{uploadSuccess}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-[#151b2b] border border-[#434655]/50">
          <span className="text-[11px] font-medium uppercase text-[#8d90a0] block mb-1">
            Total Monitored Stolen Volume
          </span>
          <div className="text-2xl font-bold font-mono text-[#dde2f8]">
            ₹{muleAnalysis?.total_volume ? (muleAnalysis.total_volume).toLocaleString('en-IN') : '0'}
          </div>
          <span className="text-[10px] text-[#c3c6d7] mt-1 block">
            Across {muleAnalysis?.total_transactions || 0} transfers
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#151b2b] border border-[#434655]/50">
          <span className="text-[11px] font-medium uppercase text-[#8d90a0] block mb-1">
            Mule Accounts Flagged
          </span>
          <div className="text-2xl font-bold font-mono text-[#ffb3ad]">
            {muleAnalysis?.mule_accounts?.length || 0}
          </div>
          <span className="text-[10px] text-[#c3c6d7] mt-1 block">
            Zero retention pass-through
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#151b2b] border border-[#434655]/50">
          <span className="text-[11px] font-medium uppercase text-[#8d90a0] block mb-1">
            Rapid Layering (&lt; 30 Mins)
          </span>
          <div className="text-2xl font-bold font-mono text-[#ffb77d]">
            {muleAnalysis?.layering_chains?.length || 0}
          </div>
          <span className="text-[10px] text-[#c3c6d7] mt-1 block">
            Immediate outgoing bounce
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#151b2b] border border-[#434655]/50">
          <span className="text-[11px] font-medium uppercase text-[#8d90a0] block mb-1">
            ₹49k Smurfing Transfers
          </span>
          <div className="text-2xl font-bold font-mono text-[#b4c5ff]">
            {muleAnalysis?.structuring_alerts?.length || 0}
          </div>
          <span className="text-[10px] text-[#c3c6d7] mt-1 block">
            Split to bypass bank alarms
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#434655]/50 pb-2">
        <button
          onClick={() => setActiveTab('mules')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'mules'
              ? 'bg-[#2563eb] text-white shadow-sm'
              : 'text-[#c3c6d7] hover:text-white hover:bg-[#191f2f]'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Mule Accounts ({muleAnalysis?.mule_accounts?.length || 0})</span>
        </button>
        <button
          onClick={() => setActiveTab('layering')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'layering'
              ? 'bg-[#2563eb] text-white shadow-sm'
              : 'text-[#c3c6d7] hover:text-white hover:bg-[#191f2f]'
          }`}
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span>Rapid Layering ({muleAnalysis?.layering_chains?.length || 0})</span>
        </button>
        <button
          onClick={() => setActiveTab('structuring')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'structuring'
              ? 'bg-[#2563eb] text-white shadow-sm'
              : 'text-[#c3c6d7] hover:text-white hover:bg-[#191f2f]'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Smurfing Alerts ({muleAnalysis?.structuring_alerts?.length || 0})</span>
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'all'
              ? 'bg-[#2563eb] text-white shadow-sm'
              : 'text-[#c3c6d7] hover:text-white hover:bg-[#191f2f]'
          }`}
        >
          <ReceiptIndianRupee className="w-3.5 h-3.5" />
          <span>All Transactions Ledger ({transactions.length})</span>
        </button>
      </div>

      {/* Tab 1: Mule Accounts */}
      {activeTab === 'mules' && (
        <div className="p-5 rounded-xl bg-[#151b2b] border border-[#434655]/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#080e1d] text-[#8d90a0] uppercase font-bold text-[10px] border-b border-[#434655]/50">
                <tr>
                  <th className="py-2.5 px-3">Bank Account</th>
                  <th className="py-2.5 px-3">Bank</th>
                  <th className="py-2.5 px-3">Total Inflow</th>
                  <th className="py-2.5 px-3">Total Outflow</th>
                  <th className="py-2.5 px-3">Retained %</th>
                  <th className="py-2.5 px-3">Mule Score</th>
                  <th className="py-2.5 px-3">Diagnostic Indicators</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#434655]/30 text-[#dde2f8]">
                {muleAnalysis?.mule_accounts?.map((mule, idx) => (
                  <tr key={idx} className="hover:bg-[#191f2f]/60 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-[#ffb3ad]">
                      {mule.account_number}
                    </td>
                    <td className="py-3 px-3 text-[#c3c6d7]">{mule.bank_name}</td>
                    <td className="py-3 px-3 font-mono text-emerald-400 font-semibold">
                      +₹{mule.total_inflow.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 font-mono text-[#ffb3ad] font-semibold">
                      -₹{mule.total_outflow.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-[#ffb77d]">
                      {(mule.retention_ratio * 100).toFixed(1)}%
                    </td>
                    <td className="py-3 px-3">
                      <RiskBadge level={mule.mule_risk_level} score={mule.mule_score} size="sm" />
                    </td>
                    <td className="py-3 px-3 max-w-sm">
                      <div className="space-y-1">
                        {mule.indicators.map((ind, i) => (
                          <div key={i} className="text-[11px] text-[#c3c6d7] flex items-start gap-1">
                            <span className="text-[#cf2c30] font-bold">•</span>
                            <span>{ind}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Rapid Layering Chains */}
      {activeTab === 'layering' && (
        <div className="p-5 rounded-xl bg-[#151b2b] border border-[#434655]/50">
          <div className="space-y-3">
            {muleAnalysis?.layering_chains?.length > 0 ? (
              muleAnalysis.layering_chains.map((chain, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#080e1d] border border-[#434655]/40 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[#cf2c30]/20 border border-[#cf2c30]/40 flex items-center justify-center text-[#ffb3ad]">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#dde2f8] font-mono">
                          {chain.intermediary_account}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#191f2f] text-[#b4c5ff] border border-[#434655]/40 font-semibold">
                          {chain.bank}
                        </span>
                      </div>
                      <p className="text-xs text-[#c3c6d7] mt-0.5">{chain.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    <div className="text-right">
                      <span className="text-[#8d90a0] block text-[10px]">Received</span>
                      <span className="text-emerald-400 font-bold">
                        ₹{chain.inflow_amount.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <ArrowRightLeft className="w-4 h-4 text-[#8d90a0]" />
                    <div className="text-left">
                      <span className="text-[#8d90a0] block text-[10px]">Drained in {chain.time_difference_minutes}m</span>
                      <span className="text-[#ffb3ad] font-bold">
                        ₹{chain.outflow_amount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#c3c6d7] py-6 text-center">
                No rapid multi-hop layering transfers detected within current window.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Structuring / Smurfing */}
      {activeTab === 'structuring' && (
        <div className="p-5 rounded-xl bg-[#151b2b] border border-[#434655]/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#080e1d] text-[#8d90a0] uppercase font-bold text-[10px] border-b border-[#434655]/50">
                <tr>
                  <th className="py-2.5 px-3">Txn ID</th>
                  <th className="py-2.5 px-3">Remitter Account</th>
                  <th className="py-2.5 px-3">Beneficiary Account</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Why Flagged</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#434655]/30 text-[#dde2f8]">
                {muleAnalysis?.structuring_alerts?.map((sa, idx) => (
                  <tr key={idx} className="hover:bg-[#191f2f]/60 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-[#b4c5ff]">{sa.transaction_id}</td>
                    <td className="py-3 px-3 font-mono text-[#c3c6d7]">{sa.from_account}</td>
                    <td className="py-3 px-3 font-mono text-[#ffb3ad] font-semibold">{sa.to_account}</td>
                    <td className="py-3 px-3 font-mono font-bold text-[#ffb77d]">
                      ₹{sa.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-[#c3c6d7]">{sa.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: All Transactions */}
      {activeTab === 'all' && (
        <div className="p-5 rounded-xl bg-[#151b2b] border border-[#434655]/50">
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-3.5 h-3.5 text-[#8d90a0] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search UTR, account, bank..."
                className="w-full bg-[#080e1d] border border-[#434655]/60 rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#dde2f8] placeholder-[#8d90a0] focus:outline-none focus:border-[#2563eb]"
              />
            </div>
            <span className="text-[11px] font-mono text-[#8d90a0]">
              Showing {filteredTransactions.length} of {transactions.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#080e1d] text-[#8d90a0] uppercase font-bold text-[10px] border-b border-[#434655]/50">
                <tr>
                  <th className="py-2.5 px-3">Txn ID / UTR</th>
                  <th className="py-2.5 px-3">Sender Account</th>
                  <th className="py-2.5 px-3">Receiver Account</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Channel</th>
                  <th className="py-2.5 px-3">Risk Assessment</th>
                  <th className="py-2.5 px-3">Flags</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#434655]/30 text-[#dde2f8]">
                {filteredTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-[#191f2f]/60 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-[#b4c5ff]">
                      {t.transaction_id}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-mono text-[#dde2f8] font-semibold">{t.from_account}</div>
                      <div className="text-[10px] text-[#8d90a0]">{t.from_bank}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-mono text-[#ffb3ad] font-semibold">{t.to_account}</div>
                      <div className="text-[10px] text-[#8d90a0]">{t.to_bank}</div>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-white">
                      ₹{t.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 uppercase text-[#c3c6d7] font-semibold">{t.channel}</td>
                    <td className="py-3 px-3">
                      <RiskBadge level={t.mule_risk_level} score={t.risk_score} size="sm" />
                    </td>
                    <td className="py-3 px-3 text-[#c3c6d7]">
                      {t.risk_flags && t.risk_flags.length > 0 ? (
                        <span className="text-[#ffb77d] font-semibold">{t.risk_flags[0]}</span>
                      ) : (
                        <span className="text-[#8d90a0]">Normal</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#151b2b] border border-[#434655] rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#434655]/40 mb-4">
              <h3 className="text-base font-bold text-[#dde2f8]">
                Record Manual Bank Transaction
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#8d90a0] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTxnSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#c3c6d7] mb-1">
                  Transaction ID / UTR Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UTR-2026-990142"
                  value={newTxn.transaction_id}
                  onChange={(e) => setNewTxn({ ...newTxn, transaction_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#080e1d] border border-[#434655]/60 text-xs text-[#dde2f8] focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#c3c6d7] mb-1">
                    Sender Account
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ACC-VICTIM-1"
                    value={newTxn.from_account}
                    onChange={(e) => setNewTxn({ ...newTxn, from_account: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#080e1d] border border-[#434655]/60 text-xs text-[#dde2f8] focus:outline-none focus:border-[#2563eb]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#c3c6d7] mb-1">
                    Sender Bank
                  </label>
                  <input
                    type="text"
                    value={newTxn.from_bank}
                    onChange={(e) => setNewTxn({ ...newTxn, from_bank: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#080e1d] border border-[#434655]/60 text-xs text-[#dde2f8] focus:outline-none focus:border-[#2563eb]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#c3c6d7] mb-1">
                    Receiver Account
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ACC-MULE-9"
                    value={newTxn.to_account}
                    onChange={(e) => setNewTxn({ ...newTxn, to_account: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#080e1d] border border-[#434655]/60 text-xs text-[#dde2f8] focus:outline-none focus:border-[#2563eb]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#c3c6d7] mb-1">
                    Receiver Bank
                  </label>
                  <input
                    type="text"
                    value={newTxn.to_bank}
                    onChange={(e) => setNewTxn({ ...newTxn, to_bank: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#080e1d] border border-[#434655]/60 text-xs text-[#dde2f8] focus:outline-none focus:border-[#2563eb]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#c3c6d7] mb-1">
                  Amount (₹) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 50000"
                  value={newTxn.amount}
                  onChange={(e) => setNewTxn({ ...newTxn, amount: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#080e1d] border border-[#434655]/60 text-xs text-[#dde2f8] focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#434655]/40">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#242a3a] text-[#c3c6d7] text-xs font-semibold hover:bg-[#191f2f]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2563eb] text-white text-xs font-bold hover:bg-[#3b82f6] shadow-md"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

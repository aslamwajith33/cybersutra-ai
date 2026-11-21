import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Upload,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Building2,
  ReceiptIndianRupee,
  Clock,
  Download,
  Search,
  Filter,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { uploadStatement, getStatementHistory, getCases } from '../api/client';
import { RiskBadge } from '../components/RiskBadge';

export const StatementIntelligence = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [bankName, setBankName] = useState('State Bank of India');
  const [cases, setCases] = useState([]);
  
  const [uploading, setUploading] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [hist, caseList] = await Promise.all([
        getStatementHistory(),
        getCases()
      ]);
      setHistory(hist);
      setCases(caseList);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    if (e) e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', selectedFile);
    if (selectedCaseId) formData.append('case_id', selectedCaseId);
    formData.append('bank_name', bankName);

    try {
      const res = await uploadStatement(formData);
      setImportResult(res);
      loadData();
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to parse bank statement file.");
    } finally {
      setUploading(false);
    }
  };

  const handleSampleStatement = async () => {
    try {
      setUploading(true);
      setError(null);
      const resp = await fetch('/static/samples/Suspicious_Bank_Statement_Batch.csv');
      const blob = await resp.blob();
      const file = new File([blob], 'Suspicious_Bank_Statement_Batch.csv', { type: 'text/csv' });
      setSelectedFile(file);

      const formData = new FormData();
      formData.append('file', file);
      if (selectedCaseId) formData.append('case_id', selectedCaseId);
      formData.append('bank_name', 'HDFC Bank');

      const res = await uploadStatement(formData);
      setImportResult(res);
      loadData();
    } catch (err) {
      setError("Failed to load sample statement. Please upload manually.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#2563eb]/20 border border-[#2563eb]/40 flex items-center justify-center text-[#b4c5ff]">
            <FileSpreadsheet className="w-5 h-5 text-[#b4c5ff]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#dde2f8]">
                Bank Statement Reader & Auto-Extractor
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#2563eb]/20 text-[#b4c5ff] border border-[#2563eb]/30">
                Auto Normalizer
              </span>
            </div>
            <p className="text-xs text-[#c3c6d7] mt-0.5">
              Upload bank statements (.csv, .xlsx, .pdf). The system extracts all debits, credits, UTRs, and flags suspicious mule activity in 2 seconds.
            </p>
          </div>
        </div>
      </div>

      {/* Plain-English Explanation Banner */}
      <div className="p-4 rounded-xl bg-[#151b2b] border border-[#434655]/50 flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-[#ffb77d] shrink-0 mt-0.5" />
        <div className="text-xs text-[#c3c6d7] leading-relaxed">
          <span className="font-bold text-[#dde2f8]">How Investigators Use This: </span>
          When a victim is defrauded, the police collect their 50-page bank statement. Reading statements by hand is slow and prone to errors. Dropping the file here extracts every sender, receiver, and 12-digit UTR reference number automatically, flagging any account that emptied its balance immediately after receiving money.
        </div>
      </div>

      {/* Ingestion Panel */}
      <div className="p-5 sm:p-6 rounded-xl bg-[#151b2b] border border-[#434655]/50">
        <h2 className="text-sm font-bold text-[#dde2f8] mb-3 flex items-center gap-2">
          <Upload className="w-4 h-4 text-[#b4c5ff]" />
          <span>Upload Bank or UPI Account Statement</span>
        </h2>

        <form onSubmit={handleUpload} className="space-y-4">
          <div className="border-2 border-dashed border-[#434655]/60 hover:border-[#2563eb]/60 rounded-xl p-6 text-center transition-colors bg-[#080e1d]">
            <FileSpreadsheet className="w-8 h-8 text-[#b4c5ff] mx-auto mb-2" />
            <p className="text-xs text-[#dde2f8] font-semibold">
              {selectedFile ? selectedFile.name : "Select or drag and drop bank statement file (.csv, .xlsx, .pdf)"}
            </p>
            <p className="text-[11px] text-[#8d90a0] mt-1">
              Supports statements from SBI, HDFC, ICICI, PNB, Axis, Bank of Baroda, Paytm Payments Bank, and NPCI UPI logs
            </p>
            <input
              type="file"
              accept=".csv,.xlsx,.xls,.pdf"
              onChange={handleFileChange}
              className="mt-3 block mx-auto text-xs text-[#c3c6d7] file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#2563eb] file:text-white hover:file:bg-[#3b82f6] cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#c3c6d7] mb-1">
                Bank / Financial Institution
              </label>
              <select
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#080e1d] border border-[#434655]/60 text-xs text-[#dde2f8] focus:outline-none focus:border-[#2563eb]"
              >
                <option value="State Bank of India">State Bank of India (SBI)</option>
                <option value="HDFC Bank">HDFC Bank</option>
                <option value="ICICI Bank">ICICI Bank</option>
                <option value="Punjab National Bank">Punjab National Bank (PNB)</option>
                <option value="Axis Bank">Axis Bank</option>
                <option value="Bank of Baroda">Bank of Baroda</option>
                <option value="Paytm Payments Bank">Paytm Payments Bank</option>
                <option value="NPCI UPI Switch Log">NPCI UPI Gateway Log</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#c3c6d7] mb-1">
                Assign to Police Investigation Case (FIR)
              </label>
              <select
                value={selectedCaseId}
                onChange={(e) => setSelectedCaseId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#080e1d] border border-[#434655]/60 text-xs text-[#dde2f8] focus:outline-none focus:border-[#2563eb]"
              >
                <option value="">-- No Specific Case (General Sandbox) --</option>
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.case_number} - {c.title.substring(0, 45)}...
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-[#cf2c30]/20 border border-[#cf2c30]/40 text-xs text-[#ffb3ad]">
              {error}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#434655]/40">
            <button
              type="button"
              onClick={handleSampleStatement}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#ffb77d]/15 hover:bg-[#ffb77d]/25 text-[#ffb77d] border border-[#ffb77d]/30 text-xs font-semibold transition-colors"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>⚡ Try It Instantly: Load Sample Statement (HDFC Bank)</span>
            </button>

            <button
              type="submit"
              disabled={uploading || !selectedFile}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#2563eb] hover:bg-[#3b82f6] disabled:bg-[#242a3a] disabled:text-[#8d90a0] text-white text-xs font-bold shadow-md transition-all"
            >
              {uploading ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Reading Statement & Finding UTRs...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>Process Statement File</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Ingestion Result Summary */}
      {importResult && (
        <div className="p-5 sm:p-6 rounded-xl bg-[#151b2b] border border-[#2563eb]/60 space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#434655]/40">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                ✓ Bank Statement Processed Successfully
              </span>
              <h3 className="text-base font-bold text-[#dde2f8] mt-0.5">
                {importResult.filename}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-[#2563eb]/20 text-[#b4c5ff] border border-[#2563eb]/40 text-xs font-mono font-semibold">
                {importResult.valid_records} Valid Records
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3 rounded-lg bg-[#080e1d] border border-[#434655]/40">
              <span className="text-[10px] uppercase font-bold text-[#8d90a0] block mb-0.5">
                Total Transactions
              </span>
              <div className="text-lg font-bold font-mono text-[#dde2f8]">
                {importResult.total_records}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-[#080e1d] border border-[#434655]/40">
              <span className="text-[10px] uppercase font-bold text-[#8d90a0] block mb-0.5">
                Total Debits Out
              </span>
              <div className="text-lg font-bold font-mono text-[#ffb3ad]">
                ₹{importResult.total_debit.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-[#080e1d] border border-[#434655]/40">
              <span className="text-[10px] uppercase font-bold text-[#8d90a0] block mb-0.5">
                Total Credits In
              </span>
              <div className="text-lg font-bold font-mono text-emerald-400">
                ₹{importResult.total_credit.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-[#080e1d] border border-[#434655]/40">
              <span className="text-[10px] uppercase font-bold text-[#8d90a0] block mb-0.5">
                Duplicate Rows
              </span>
              <div className="text-lg font-bold font-mono text-[#ffb77d]">
                {importResult.duplicate_records}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-[#080e1d] border border-[#434655]/40">
              <span className="text-[10px] uppercase font-bold text-[#8d90a0] block mb-0.5">
                Dummy Mules Flagged
              </span>
              <div className="text-lg font-bold font-mono text-[#cf2c30]">
                {importResult.mule_accounts_flagged}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ingestion History */}
      <div className="p-5 rounded-xl bg-[#151b2b] border border-[#434655]/50">
        <h3 className="text-sm font-bold text-[#dde2f8] mb-3">
          Recently Ingested Bank Statements
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#080e1d] text-[#8d90a0] uppercase font-bold text-[10px] border-b border-[#434655]/50">
              <tr>
                <th className="py-2.5 px-3">File Name</th>
                <th className="py-2.5 px-3">Bank Name</th>
                <th className="py-2.5 px-3">Records Found</th>
                <th className="py-2.5 px-3">Mule Accounts</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Date Processed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#434655]/30 text-[#dde2f8]">
              {history.map((h, idx) => (
                <tr key={idx} className="hover:bg-[#191f2f]/60 transition-colors">
                  <td className="py-3 px-3 font-semibold font-mono text-[#b4c5ff]">
                    {h.filename}
                  </td>
                  <td className="py-3 px-3 text-[#c3c6d7]">{h.bank_name}</td>
                  <td className="py-3 px-3 font-mono">{h.valid_records} rows</td>
                  <td className="py-3 px-3">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#cf2c30]/20 text-[#ffb3ad] border border-[#cf2c30]/30">
                      {h.mules_flagged} Mules
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Normalized</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[#8d90a0] font-mono text-[11px]">
                    {new Date(h.timestamp).toLocaleString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
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

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  PlusCircle,
  Scale,
  Building2,
  Shield,
  FileCheck2,
  Clock,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  FileDown
} from 'lucide-react';
import { getReports, generateReport, getNotices, draftNotice, getCases } from '../api/client';

export const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [notices, setNotices] = useState([]);
  const [cases, setCases] = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dossiers'); // 'dossiers' or 'notices'

  // Modals
  const [showDossierModal, setShowDossierModal] = useState(false);
  const [showNoticeModal, setShowNoticeModal] = useState(false);

  // Form states
  const [newDossier, setNewDossier] = useState({
    case_id: '',
    title: '',
    generated_by: 'Insp. Vikram Rathore, IO',
    notes: ''
  });

  const [newNotice, setNewNotice] = useState({
    case_id: '',
    notice_type: 'SECTION_102_CRPC',
    target_institution: 'HDFC Bank Nodal Officer / Fraud Risk Management',
    target_identifier: 'HDFC-501004928172',
    issuing_officer: 'Insp. Vikram Rathore, IO'
  });

  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    loadData();
  }, [selectedCaseId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const caseFilter = selectedCaseId ? parseInt(selectedCaseId) : null;
      const [reps, nots, caseList] = await Promise.all([
        getReports(caseFilter),
        getNotices(caseFilter),
        getCases()
      ]);
      setReports(reps);
      setNotices(nots);
      setCases(caseList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDossier = async (e) => {
    e.preventDefault();
    if (!newDossier.case_id) return;
    try {
      const res = await generateReport({
        case_id: parseInt(newDossier.case_id),
        title: newDossier.title || 'Official Cybercrime Investigation Dossier',
        generated_by: newDossier.generated_by,
        notes: newDossier.notes
      });
      setShowDossierModal(false);
      setSuccessMessage(`Dossier ${res.report_number} generated successfully with official PDF download.`);
      loadData();
    } catch (err) {
      alert("Failed to generate report.");
    }
  };

  const handleCreateNotice = async (e) => {
    e.preventDefault();
    if (!newNotice.case_id) return;
    try {
      const res = await draftNotice({
        case_id: parseInt(newNotice.case_id),
        notice_type: newNotice.notice_type,
        target_institution: newNotice.target_institution,
        target_identifier: newNotice.target_identifier,
        issuing_officer: newNotice.issuing_officer
      });
      setShowNoticeModal(false);
      setSuccessMessage(`Statutory Notice ${res.notice_number} drafted successfully.`);
      loadData();
    } catch (err) {
      alert("Failed to draft notice.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Official Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#d97707]/20 border border-[#d97707]/40 flex items-center justify-center text-[#ffb77d]">
            <FileText className="w-5 h-5 text-[#ffb77d]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#dde2f8]">
                Police Case Dossiers & Bank Freeze Orders
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#d97707]/20 text-[#ffb77d] border border-[#d97707]/30">
                Statutory Tools
              </span>
            </div>
            <p className="text-xs text-[#c3c6d7] mt-0.5">
              1-click PDF reports for court evidence and official Section 102/91 CrPC bank account freeze directives.
            </p>
          </div>
        </div>

        {/* Filter Case */}
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

      {/* Plain-English Explanation Banner */}
      <div className="p-4 rounded-xl bg-[#151b2b] border border-[#434655]/50 flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-[#ffb77d] shrink-0 mt-0.5" />
        <div className="text-xs text-[#c3c6d7] leading-relaxed">
          <span className="font-bold text-[#dde2f8]">How Police Use These Legal Tools: </span>
          (1) <span className="text-[#b4c5ff] font-semibold">Section 102 Cr.P.C. / Section 94 BNSS Freeze Order</span>: An urgent legal order sent to bank managers and nodal officers demanding the immediate debit freeze of criminal mule accounts so the scammer cannot pull out cash.
          (2) <span className="text-[#ffb77d] font-semibold">Case Dossier PDF</span>: Complete court-ready case packet compiling victim statements, money-trail flowcharts, and technical server logs to submit to the magistrate.
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-[#080e1d] border border-emerald-500/50 text-xs text-emerald-400 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-xs text-[#8d90a0] hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Tabs & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#434655]/50 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('dossiers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'dossiers'
                ? 'bg-[#2563eb] text-[#eeefff] shadow-md'
                : 'bg-[#151b2b] text-[#c3c6d7] hover:bg-[#191f2f]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Case Investigation Dossiers ({reports.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('notices')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'notices'
                ? 'bg-[#2563eb] text-[#eeefff] shadow-md'
                : 'bg-[#151b2b] text-[#c3c6d7] hover:bg-[#191f2f]'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Bank Freeze Notices (Sec 102/91) ({notices.length})</span>
          </button>
        </div>

        <div>
          {activeTab === 'dossiers' ? (
            <button
              onClick={() => setShowDossierModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2563eb] hover:bg-[#3b82f6] text-white text-xs font-bold transition-all shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Generate New Dossier (PDF)</span>
            </button>
          ) : (
            <button
              onClick={() => setShowNoticeModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#cf2c30] hover:bg-[#dc2626] text-white text-xs font-bold transition-all shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Draft Bank Freeze Order (Sec 102)</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: DOSSIERS */}
      {activeTab === 'dossiers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((rep) => (
            <div
              key={rep.id}
              className="p-5 rounded-xl bg-[#151b2b] border border-[#434655]/50 flex flex-col justify-between space-y-4 hover:border-[#2563eb]/50 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-[#b4c5ff]">
                    {rep.report_number}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#2563eb]/20 text-[#b4c5ff] border border-[#2563eb]/30">
                    PDF Ready
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#dde2f8] leading-tight mb-1">
                  {rep.title}
                </h3>
                <p className="text-xs text-[#8d90a0]">
                  Generated by: {rep.generated_by}
                </p>
                {rep.notes && (
                  <p className="text-xs text-[#c3c6d7] mt-2 line-clamp-2 bg-[#080e1d] p-2.5 rounded-lg border border-[#434655]/30">
                    {rep.notes}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-[#434655]/40 flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#8d90a0]">
                  {new Date(rep.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
                <a
                  href={`/api/reports/${rep.id}/download`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2563eb]/20 hover:bg-[#2563eb]/30 text-[#b4c5ff] border border-[#2563eb]/40 text-xs font-bold transition-colors"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: BANK FREEZE NOTICES */}
      {activeTab === 'notices' && (
        <div className="p-5 rounded-xl bg-[#151b2b] border border-[#434655]/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#080e1d] text-[#8d90a0] uppercase font-bold text-[10px] border-b border-[#434655]/50">
                <tr>
                  <th className="py-2.5 px-3">Notice Number</th>
                  <th className="py-2.5 px-3">Statutory Order Type</th>
                  <th className="py-2.5 px-3">Target Bank / Institution</th>
                  <th className="py-2.5 px-3">Target Account / UTR</th>
                  <th className="py-2.5 px-3">Issuing Officer</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Official Document</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#434655]/30 text-[#dde2f8]">
                {notices.map((n, idx) => (
                  <tr key={idx} className="hover:bg-[#191f2f]/60 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-[#ffb77d]">
                      {n.notice_number}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#cf2c30]/20 text-[#ffb3ad] border border-[#cf2c30]/30">
                        {n.notice_type === 'SECTION_102_CRPC' ? 'Sec 102 Account Freeze' : 'Sec 91 Account Records'}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-[#dde2f8]">{n.target_institution}</td>
                    <td className="py-3 px-3 font-mono text-[#b4c5ff]">{n.target_identifier}</td>
                    <td className="py-3 px-3 text-[#c3c6d7]">{n.issuing_officer}</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Issued & Logged</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <a
                        href={`/api/reports/notices/${n.id}/download`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#2563eb]/20 hover:bg-[#2563eb]/30 text-[#b4c5ff] border border-[#2563eb]/40 text-xs font-semibold"
                      >
                        <FileDown className="w-3.5 h-3.5" />
                        <span>PDF</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Generate Dossier */}
      {showDossierModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#151b2b] border border-[#434655] rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-[#dde2f8] mb-1">
              Generate Official Court Dossier (PDF)
            </h3>
            <p className="text-xs text-[#c3c6d7] mb-4">
              Compiles all evidence, victim complaints, multi-hop UTR trails, and officer observations into an official police report.
            </p>
            <form onSubmit={handleCreateDossier} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#c3c6d7] mb-1">
                  Select Investigation Case (FIR)
                </label>
                <select
                  required
                  value={newDossier.case_id}
                  onChange={(e) => setNewDossier({ ...newDossier, case_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#080e1d] border border-[#434655]/60 text-xs text-[#dde2f8] focus:outline-none focus:border-[#2563eb]"
                >
                  <option value="">-- Choose Case --</option>
                  {cases.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.case_number} - {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#c3c6d7] mb-1">
                  Dossier Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Special Investigation Report - Investment Scam"
                  value={newDossier.title}
                  onChange={(e) => setNewDossier({ ...newDossier, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#080e1d] border border-[#434655]/60 text-xs text-[#dde2f8] focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#c3c6d7] mb-1">
                  Investigating Officer
                </label>
                <input
                  type="text"
                  value={newDossier.generated_by}
                  onChange={(e) => setNewDossier({ ...newDossier, generated_by: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#080e1d] border border-[#434655]/60 text-xs text-[#dde2f8] focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#c3c6d7] mb-1">
                  Investigator Observation Notes
                </label>
                <textarea
                  rows="3"
                  placeholder="Add case findings, witness statements, or judicial notes..."
                  value={newDossier.notes}
                  onChange={(e) => setNewDossier({ ...newDossier, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#080e1d] border border-[#434655]/60 text-xs text-[#dde2f8] focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#434655]/40">
                <button
                  type="button"
                  onClick={() => setShowDossierModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#242a3a] text-[#c3c6d7] text-xs font-semibold hover:bg-[#191f2f]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2563eb] text-white text-xs font-bold hover:bg-[#3b82f6] shadow-md"
                >
                  Generate Official Dossier PDF
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Draft Freeze Notice */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#151b2b] border border-[#434655] rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-[#dde2f8] mb-1">
              Draft Statutory Bank Freeze Order
            </h3>
            <p className="text-xs text-[#c3c6d7] mb-4">
              Issues an official legal directive to the bank nodal officer under Section 102 Cr.P.C. / Section 94 BNSS to immediately freeze the suspect account.
            </p>
            <form onSubmit={handleCreateNotice} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#c3c6d7] mb-1">
                  Select FIR
                </label>
                <select
                  required
                  value={newNotice.case_id}
                  onChange={(e) => setNewNotice({ ...newNotice, case_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#080e1d] border border-[#434655]/60 text-xs text-[#dde2f8] focus:outline-none focus:border-[#2563eb]"
                >
                  <option value="">-- Choose Case --</option>
                  {cases.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.case_number} - {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#c3c6d7] mb-1">
                  Statutory Order Type
                </label>
                <select
                  value={newNotice.notice_type}
                  onChange={(e) => setNewNotice({ ...newNotice, notice_type: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#080e1d] border border-[#434655]/60 text-xs text-[#dde2f8] focus:outline-none focus:border-[#2563eb]"
                >
                  <option value="SECTION_102_CRPC">Section 102 Cr.P.C. - Immediate Debit Freeze Order</option>
                  <option value="SECTION_91_CRPC">Section 91 Cr.P.C. - Production of KYC & Bank Logs</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#c3c6d7] mb-1">
                  Target Bank & Nodal Officer
                </label>
                <input
                  type="text"
                  required
                  value={newNotice.target_institution}
                  onChange={(e) => setNewNotice({ ...newNotice, target_institution: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#080e1d] border border-[#434655]/60 text-xs text-[#dde2f8] focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#c3c6d7] mb-1">
                  Target Bank Account Number or UPI ID
                </label>
                <input
                  type="text"
                  required
                  value={newNotice.target_identifier}
                  onChange={(e) => setNewNotice({ ...newNotice, target_identifier: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#080e1d] border border-[#434655]/60 text-xs text-[#dde2f8] focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#434655]/40">
                <button
                  type="button"
                  onClick={() => setShowNoticeModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#242a3a] text-[#c3c6d7] text-xs font-semibold hover:bg-[#191f2f]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#cf2c30] text-white text-xs font-bold hover:bg-[#dc2626] shadow-md"
                >
                  Issue Freeze Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

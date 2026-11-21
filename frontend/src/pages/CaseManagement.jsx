import React, { useState, useEffect } from 'react';
import {
  FolderGit2,
  PlusCircle,
  Search,
  Filter,
  Shield,
  Clock,
  ArrowRight,
  User,
  MapPin,
  Building2,
  Globe,
  FileCode2,
  FileText,
  AlertTriangle,
  X,
  Plus,
  Lightbulb
} from 'lucide-react';
import { getCases, getCaseDetail, createCase, addComplaintToCase } from '../api/client';
import { RiskBadge } from '../components/RiskBadge';

export const CaseManagement = () => {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [showAddComplaintModal, setShowAddComplaintModal] = useState(false);

  // Form states
  const [newCase, setNewCase] = useState({
    title: '',
    description: '',
    category: 'Investment Scam / Task Fraud',
    priority: 'High',
    status: 'Active',
    district: 'Jaipur',
    police_station: 'Cyber Crime Police Station Jaipur',
    investigating_officer: 'Insp. Vikram Rathore',
    total_loss_amount: ''
  });

  const [newComplaint, setNewComplaint] = useState({
    complainant_name: '',
    complainant_phone: '',
    complainant_district: 'Jaipur',
    loss_amount: '',
    category: 'Investment Scam / Task Fraud',
    modus_operandi: '',
    suspect_phone: '',
    suspect_upi: '',
    suspect_bank_acc: '',
    notes: ''
  });

  useEffect(() => {
    loadCases();
  }, [categoryFilter]);

  const loadCases = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (categoryFilter) params.category = categoryFilter;

      const data = await getCases(params);
      setCases(data);
      if (data.length > 0 && !selectedCase) {
        loadDetail(data[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadDetail = async (id) => {
    try {
      const detail = await getCaseDetail(id);
      setSelectedCase(detail);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCaseSubmit = async (e) => {
    e.preventDefault();
    try {
      const created = await createCase({
        ...newCase,
        total_loss_amount: newCase.total_loss_amount ? parseFloat(newCase.total_loss_amount) : 0.0
      });
      setShowNewCaseModal(false);
      loadCases();
      loadDetail(created.id);
    } catch (err) {
      alert("Failed to create case.");
    }
  };

  const handleAddComplaintSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCase) return;
    try {
      await addComplaintToCase(selectedCase.id, {
        ...newComplaint,
        loss_amount: newComplaint.loss_amount ? parseFloat(newComplaint.loss_amount) : 0.0
      });
      setShowAddComplaintModal(false);
      loadDetail(selectedCase.id);
      loadCases();
    } catch (err) {
      alert("Failed to add complaint.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#2563eb]/20 border border-[#2563eb]/40 flex items-center justify-center text-[#b4c5ff]">
            <FolderGit2 className="w-5 h-5 text-[#b4c5ff]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#dde2f8]">
                Police Case & Evidence Management
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#2563eb]/20 text-[#b4c5ff] border border-[#2563eb]/30">
                Case Files (FIRs)
              </span>
            </div>
            <p className="text-xs text-[#c3c6d7] mt-0.5">
              Organized investigation case records connecting victim complaints, bank statements, and seized digital evidence.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowNewCaseModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-[#3b82f6] text-white text-xs font-bold shadow-md transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Register New FIR Case</span>
        </button>
      </div>

      {/* Main Layout: Left List + Right Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Cases List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-[#151b2b] border border-[#434655]/50 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8d90a0]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadCases()}
                placeholder="Search by FIR, title, or suspect..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#080e1d] border border-[#434655]/60 text-xs text-[#dde2f8] placeholder-[#8d90a0] focus:outline-none focus:border-[#2563eb]"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-[#080e1d] border border-[#434655]/60 text-xs text-[#c3c6d7] focus:outline-none focus:border-[#2563eb]"
              >
                <option value="">All Fraud Categories</option>
                <option value="Investment Scam / Task Fraud">Investment / Task Fraud</option>
                <option value="Loan App Harassment">Loan App Harassment</option>
                <option value="Phishing / Net Banking Theft">Phishing / Net Banking</option>
                <option value="Mule Account Ring / SIM Swap">Mule Ring / SIM Swap</option>
              </select>
            </div>
          </div>

          <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
            {cases.map((c) => (
              <div
                key={c.id}
                onClick={() => loadDetail(c.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedCase?.id === c.id
                    ? 'bg-[#191f2f] border-[#2563eb] shadow-md'
                    : 'bg-[#151b2b] border-[#434655]/50 hover:border-[#434655]'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-mono font-bold text-[#b4c5ff]">{c.case_number}</span>
                  <RiskBadge level={c.priority} size="sm" />
                </div>
                <h4 className="text-xs font-bold text-[#dde2f8] line-clamp-1 mb-1">{c.title}</h4>
                <div className="flex items-center justify-between text-[11px] text-[#8d90a0] pt-2 border-t border-[#434655]/30">
                  <span>{c.district}</span>
                  <span className="font-mono text-[#ffb77d] font-bold">₹{c.total_loss_amount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Case Detailed Dossier (7 cols) */}
        <div className="lg:col-span-7">
          {selectedCase ? (
            <div className="p-6 rounded-xl bg-[#151b2b] border border-[#434655]/50 space-y-6">
              {/* Dossier Header */}
              <div className="pb-4 border-b border-[#434655]/40">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-[#2563eb]/20 text-[#b4c5ff] border border-[#2563eb]/40">
                    {selectedCase.case_number}
                  </span>
                  <div className="flex items-center gap-2">
                    <RiskBadge level={selectedCase.priority} size="sm" />
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#191f2f] text-[#c3c6d7] border border-[#434655]/50">
                      {selectedCase.status}
                    </span>
                  </div>
                </div>

                <h2 className="text-base font-bold text-[#dde2f8] mb-1.5">{selectedCase.title}</h2>
                <p className="text-xs text-[#c3c6d7] leading-relaxed mb-4">{selectedCase.description}</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-[#080e1d] border border-[#434655]/40 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#8d90a0] block">Investigating Officer</span>
                    <span className="text-[#dde2f8] font-medium">{selectedCase.investigating_officer}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#8d90a0] block">Cyber Police Unit</span>
                    <span className="text-[#dde2f8] font-medium">{selectedCase.police_station}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#8d90a0] block">Reported Loss</span>
                    <span className="font-mono text-[#ffb77d] font-bold">₹{selectedCase.total_loss_amount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Complaints Sub-Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#dde2f8] flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-[#b4c5ff]" />
                    <span>Associated Victim Complaints ({selectedCase.complaints?.length || 0})</span>
                  </h3>
                  <button
                    onClick={() => setShowAddComplaintModal(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#191f2f] hover:bg-[#242a3a] text-[#c3c6d7] hover:text-[#dde2f8] border border-[#434655]/40 text-xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#b4c5ff]" />
                    <span>Add Statement</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {selectedCase.complaints?.map((comp) => (
                    <div key={comp.id} className="p-3 rounded-xl bg-[#080e1d] border border-[#434655]/40 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono font-bold text-[#b4c5ff]">{comp.complaint_number}</span>
                        <span className="font-mono text-[#ffb77d] font-bold">₹{comp.loss_amount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="text-[#dde2f8] font-semibold">{comp.complainant_name} ({comp.complainant_district})</div>
                      <p className="text-[11px] text-[#c3c6d7] mt-1 leading-snug">{comp.modus_operandi}</p>
                      <div className="mt-2 pt-1 border-t border-[#434655]/30 flex flex-wrap gap-2 text-[10px] font-mono text-[#8d90a0]">
                        {comp.suspect_phone && <span>Tel: {comp.suspect_phone}</span>}
                        {comp.suspect_upi && <span>UPI: {comp.suspect_upi}</span>}
                        {comp.suspect_bank_acc && <span>A/c: {comp.suspect_bank_acc}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seized Digital Evidence Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* URLs */}
                <div className="p-3 rounded-xl bg-[#080e1d] border border-[#434655]/40 text-xs">
                  <div className="flex items-center gap-2 font-bold text-[#b4c5ff] mb-2">
                    <Globe className="w-3.5 h-3.5" />
                    <span>Seized Phishing URLs ({selectedCase.urls?.length || 0})</span>
                  </div>
                  <div className="space-y-1.5">
                    {selectedCase.urls?.map((u) => (
                      <div key={u.id} className="p-2 rounded-lg bg-[#151b2b] border border-[#434655]/30 truncate font-mono text-[11px] text-[#c3c6d7]">
                        {u.domain || u.url}
                      </div>
                    ))}
                  </div>
                </div>

                {/* APKs */}
                <div className="p-3 rounded-xl bg-[#080e1d] border border-[#434655]/40 text-xs">
                  <div className="flex items-center gap-2 font-bold text-[#ffb77d] mb-2">
                    <FileCode2 className="w-3.5 h-3.5" />
                    <span>Seized Android APKs ({selectedCase.apks?.length || 0})</span>
                  </div>
                  <div className="space-y-1.5">
                    {selectedCase.apks?.map((a) => (
                      <div key={a.id} className="p-2 rounded-lg bg-[#151b2b] border border-[#434655]/30 truncate text-[11px] text-[#c3c6d7]">
                        {a.app_name} ({a.package_name})
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-[#8d90a0] rounded-xl bg-[#151b2b] border border-[#434655]/50">
              Select an investigation case to view dossier particulars.
            </div>
          )}
        </div>
      </div>

      {/* Register New Case Modal */}
      {showNewCaseModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#151b2b] border border-[#434655] shadow-2xl p-6">
            <h3 className="text-base font-bold text-[#dde2f8] mb-4 flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-[#b4c5ff]" />
              <span>Register New Cybercrime Investigation Case (FIR)</span>
            </h3>

            <form onSubmit={handleCreateCaseSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#c3c6d7] mb-1 font-semibold">Case Title / Modus Operandi *</label>
                <input
                  type="text"
                  value={newCase.title}
                  onChange={(e) => setNewCase({ ...newCase, title: e.target.value })}
                  placeholder="e.g. Operation Mahadev: High-Yield Telegram Crypto Syndicate"
                  className="w-full px-3 py-2 rounded-xl bg-[#080e1d] border border-[#434655]/60 text-[#dde2f8] focus:outline-none focus:border-[#2563eb]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#c3c6d7] mb-1 font-semibold">Executive Case Synopsis</label>
                <textarea
                  rows={3}
                  value={newCase.description}
                  onChange={(e) => setNewCase({ ...newCase, description: e.target.value })}
                  placeholder="Summary of criminal scheme, victim contact channels, and initial evidence..."
                  className="w-full px-3 py-2 rounded-xl bg-[#080e1d] border border-[#434655]/60 text-[#dde2f8] focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#c3c6d7] mb-1 font-semibold">Classification</label>
                  <select
                    value={newCase.category}
                    onChange={(e) => setNewCase({ ...newCase, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#080e1d] border border-[#434655]/60 text-[#dde2f8] focus:outline-none focus:border-[#2563eb]"
                  >
                    <option value="Investment Scam / Task Fraud">Investment / Task Fraud</option>
                    <option value="Loan App Harassment">Loan App Harassment</option>
                    <option value="Phishing / Net Banking Theft">Phishing / Net Banking</option>
                    <option value="Mule Account Ring / SIM Swap">Mule Ring / SIM Swap</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#c3c6d7] mb-1 font-semibold">Initial Loss Estimate (INR)</label>
                  <input
                    type="number"
                    value={newCase.total_loss_amount}
                    onChange={(e) => setNewCase({ ...newCase, total_loss_amount: e.target.value })}
                    placeholder="500000"
                    className="w-full px-3 py-2 rounded-xl bg-[#080e1d] border border-[#434655]/60 text-[#dde2f8] focus:outline-none focus:border-[#2563eb]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#c3c6d7] mb-1 font-semibold">District Jurisdiction</label>
                  <select
                    value={newCase.district}
                    onChange={(e) => setNewCase({ ...newCase, district: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#080e1d] border border-[#434655]/60 text-[#dde2f8] focus:outline-none focus:border-[#2563eb]"
                  >
                    <option value="Jaipur">Jaipur</option>
                    <option value="Jodhpur">Jodhpur</option>
                    <option value="Kota">Kota</option>
                    <option value="Udaipur">Udaipur</option>
                    <option value="Alwar">Alwar</option>
                    <option value="Bharatpur">Bharatpur</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#c3c6d7] mb-1 font-semibold">Priority / Risk Level</label>
                  <select
                    value={newCase.priority}
                    onChange={(e) => setNewCase({ ...newCase, priority: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#080e1d] border border-[#434655]/60 text-[#dde2f8] focus:outline-none focus:border-[#2563eb]"
                  >
                    <option value="Critical">Critical (P1)</option>
                    <option value="High">High (P2)</option>
                    <option value="Medium">Medium (P3)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#434655]/40">
                <button
                  type="button"
                  onClick={() => setShowNewCaseModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#242a3a] text-[#c3c6d7] text-xs font-semibold hover:bg-[#191f2f]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2563eb] text-white text-xs font-bold hover:bg-[#3b82f6] shadow-md"
                >
                  Create FIR File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Complaint Modal */}
      {showAddComplaintModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#151b2b] border border-[#434655] shadow-2xl p-6">
            <h3 className="text-base font-bold text-[#dde2f8] mb-4 flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-[#b4c5ff]" />
              <span>Record Victim Complaint Statement</span>
            </h3>

            <form onSubmit={handleAddComplaintSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#c3c6d7] mb-1 font-semibold">Complainant Name *</label>
                  <input
                    type="text"
                    value={newComplaint.complainant_name}
                    onChange={(e) => setNewComplaint({ ...newComplaint, complainant_name: e.target.value })}
                    placeholder="e.g. Ramesh Kumar Sharma"
                    className="w-full px-3 py-2 rounded-xl bg-[#080e1d] border border-[#434655]/60 text-[#dde2f8] focus:outline-none focus:border-[#2563eb]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#c3c6d7] mb-1 font-semibold">Contact Phone</label>
                  <input
                    type="text"
                    value={newComplaint.complainant_phone}
                    onChange={(e) => setNewComplaint({ ...newComplaint, complainant_phone: e.target.value })}
                    placeholder="+91 98290 XXXXX"
                    className="w-full px-3 py-2 rounded-xl bg-[#080e1d] border border-[#434655]/60 text-[#dde2f8] focus:outline-none focus:border-[#2563eb]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#c3c6d7] mb-1 font-semibold">Loss Amount (INR) *</label>
                <input
                  type="number"
                  value={newComplaint.loss_amount}
                  onChange={(e) => setNewComplaint({ ...newComplaint, loss_amount: e.target.value })}
                  placeholder="250000"
                  className="w-full px-3 py-2 rounded-xl bg-[#080e1d] border border-[#434655]/60 text-[#dde2f8] focus:outline-none focus:border-[#2563eb]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#c3c6d7] mb-1 font-semibold">Modus Operandi Statement</label>
                <textarea
                  rows={2}
                  value={newComplaint.modus_operandi}
                  onChange={(e) => setNewComplaint({ ...newComplaint, modus_operandi: e.target.value })}
                  placeholder="Victim contacted via WhatsApp regarding part-time Youtube review task..."
                  className="w-full px-3 py-2 rounded-xl bg-[#080e1d] border border-[#434655]/60 text-[#dde2f8] focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[#8d90a0] mb-1 text-[11px]">Suspect Phone</label>
                  <input
                    type="text"
                    value={newComplaint.suspect_phone}
                    onChange={(e) => setNewComplaint({ ...newComplaint, suspect_phone: e.target.value })}
                    placeholder="+91 8890..."
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#080e1d] border border-[#434655]/60 text-[#dde2f8] font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-[#8d90a0] mb-1 text-[11px]">Suspect UPI ID</label>
                  <input
                    type="text"
                    value={newComplaint.suspect_upi}
                    onChange={(e) => setNewComplaint({ ...newComplaint, suspect_upi: e.target.value })}
                    placeholder="scam@ybl"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#080e1d] border border-[#434655]/60 text-[#dde2f8] font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-[#8d90a0] mb-1 text-[11px]">Suspect Bank Acc</label>
                  <input
                    type="text"
                    value={newComplaint.suspect_bank_acc}
                    onChange={(e) => setNewComplaint({ ...newComplaint, suspect_bank_acc: e.target.value })}
                    placeholder="912800..."
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#080e1d] border border-[#434655]/60 text-[#dde2f8] font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#434655]/40">
                <button
                  type="button"
                  onClick={() => setShowAddComplaintModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#242a3a] text-[#c3c6d7] text-xs font-semibold hover:bg-[#191f2f]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2563eb] text-white text-xs font-bold hover:bg-[#3b82f6] shadow-md"
                >
                  Save Complaint Statement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

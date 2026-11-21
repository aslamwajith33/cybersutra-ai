import React, { useState, useEffect } from 'react';
import {
  FileCode2,
  Upload,
  ShieldAlert,
  Hash,
  AlertTriangle,
  Lock,
  Radio,
  FileCheck2,
  Server,
  Layers,
  Clock,
  Download
} from 'lucide-react';
import { scanApk, getApkHistory, getCases } from '../api/client';
import { RiskBadge } from '../components/RiskBadge';

export const ApkScanner = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [notes, setNotes] = useState('');
  const [cases, setCases] = useState([]);
  
  const [scanning, setScanning] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadHistory();
    loadCases();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getApkHistory();
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

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleScan = async (e) => {
    if (e) e.preventDefault();
    if (!selectedFile) return;

    setScanning(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    if (selectedCaseId) formData.append('case_id', selectedCaseId);
    if (notes) formData.append('investigator_notes', notes);

    try {
      const res = await scanApk(formData);
      setCurrentResult(res);
      loadHistory();
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to scan APK file.");
    } finally {
      setScanning(false);
    }
  };

  const loadSampleLoanSharkApk = async () => {
    try {
      setScanning(true);
      setError(null);
      // Fetch synthetic sample APK from static endpoint
      const response = await fetch('/static/samples/InstantRupee_LoanShark_Sample.apk');
      const blob = await response.blob();
      const file = new File([blob], 'InstantRupee_LoanShark_Sample.apk', { type: 'application/vnd.android.package-archive' });
      setSelectedFile(file);
      setNotes('Seized during raid in Jodhpur predatory instant-loan extortion racket.');

      const formData = new FormData();
      formData.append('file', file);
      if (selectedCaseId) formData.append('case_id', selectedCaseId);
      formData.append('investigator_notes', 'Seized during raid in Jodhpur predatory instant-loan extortion racket.');

      const res = await scanApk(formData);
      setCurrentResult(res);
      loadHistory();
    } catch (err) {
      setError("Failed to load sample APK. Please upload manually.");
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <FileCode2 className="w-6 h-6 text-pink-400" />
          <h1 className="text-2xl font-bold text-white tracking-wide">Android APK Static Scanner</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Forensic inspection of seized Android applications: permission dissection, C2 IP extraction, predatory loan app signatures and banking overlay trojan heuristics.
        </p>
      </div>

      {/* Upload Box */}
      <div className="p-6 rounded-xl bg-slate-900/90 border border-slate-800">
        <h2 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
          <Upload className="w-4 h-4 text-pink-400" />
          Upload Seized Android Binary (.APK)
        </h2>

        <form onSubmit={handleScan} className="space-y-4">
          <div className="border-2 border-dashed border-slate-800 rounded-xl p-6 text-center hover:border-slate-700 transition-colors bg-slate-950/60">
            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs text-slate-200 font-medium">
              {selectedFile ? selectedFile.name : "Drag and drop APK file here or browse"}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Supports standard Android application packages (.apk) and binary ZIP archives
            </p>
            <input
              type="file"
              accept=".apk,.zip"
              onChange={handleFileChange}
              className="mt-3 block mx-auto text-xs text-slate-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
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
              <label className="block text-xs font-medium text-slate-300 mb-1">Seizure / Forensics Notes</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Seized from complainant's Vivo Y20 handset (IMEI: ...)"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-950/50 border border-red-800 text-xs text-red-300">
              {error}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/60">
            <button
              type="button"
              onClick={loadSampleLoanSharkApk}
              disabled={scanning}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-950/40 hover:bg-pink-900/40 text-pink-300 border border-pink-800/60 text-xs font-medium transition-colors"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              Quick Test: Load Sample Predatory Loan Shark APK
            </button>

            <button
              type="submit"
              disabled={scanning || !selectedFile}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all"
            >
              {scanning ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Decompressing & Dissecting DEX...</span>
                </>
              ) : (
                <>
                  <FileCode2 className="w-3.5 h-3.5" />
                  <span>Run Static APK Forensics</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Results View */}
      {currentResult && (
        <div className="space-y-6">
          {/* Identity & Hash Card */}
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 font-bold">
                  APK
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{currentResult.app_name}</h3>
                  <p className="text-xs font-mono text-cyan-300">{currentResult.package_name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs text-slate-400">Risk Assessment</div>
                  <div className="text-lg font-bold text-red-400 font-mono">{currentResult.risk_score} / 100</div>
                </div>
                <RiskBadge level={currentResult.risk_category} size="md" />
              </div>
            </div>

            {/* Cryptographic Hashes (Chain of Custody) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5 mb-1">
                  <Hash className="w-3 h-3 text-cyan-400" />
                  SHA-256 Hash (Section 65B Indian Evidence Act)
                </div>
                <div className="font-mono text-xs text-slate-200 break-all select-all">
                  {currentResult.sha256_hash}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5 mb-1">
                  <Hash className="w-3 h-3 text-slate-400" />
                  MD5 Hash & Package Size
                </div>
                <div className="font-mono text-xs text-slate-200 break-all select-all">
                  {currentResult.md5_hash || "N/A"} • {(currentResult.file_size_bytes / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
            </div>
          </div>

          {/* Dangerous Permissions Dissection */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                  <h3 className="text-sm font-semibold text-slate-200">High-Risk Permission Matrix</h3>
                </div>
                <span className="text-xs font-mono text-red-400">
                  {currentResult.dangerous_permissions?.length || 0} Dangerous
                </span>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {currentResult.dangerous_permissions && currentResult.dangerous_permissions.length > 0 ? (
                  currentResult.dangerous_permissions.map((perm, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-mono font-semibold text-pink-300">{perm.permission}</span>
                        <RiskBadge level={perm.severity} size="sm" />
                      </div>
                      <div className="text-xs font-medium text-slate-300 mb-0.5">{perm.threat}</div>
                      <p className="text-xs text-slate-400 leading-snug">{perm.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 py-4 text-center">No high-risk android permissions requested.</p>
                )}
              </div>
            </div>

            {/* Extracted C2 Networks & Malware Heuristics */}
            <div className="space-y-6">
              {/* Syndicate Heuristics */}
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-semibold text-slate-200">Syndicate Behavioral Signatures</h3>
                </div>

                <div className="space-y-2">
                  {currentResult.threat_indicators && currentResult.threat_indicators.length > 0 ? (
                    currentResult.threat_indicators.map((t, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                        <div className="flex items-center justify-between text-xs font-semibold text-amber-300 mb-1">
                          <span>{t.name}</span>
                          <span className="text-[10px] text-red-400 font-mono">{t.severity}</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-snug">{t.description}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 py-2">No specific extortion or banking trojan signatures matched.</p>
                  )}
                </div>
              </div>

              {/* Hardcoded C2 IPs & URLs */}
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800">
                  <Server className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-semibold text-slate-200">Extracted Network Command Endpoints</h3>
                </div>

                <div className="space-y-2">
                  {currentResult.extracted_ips && currentResult.extracted_ips.length > 0 && (
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">C2 IP Nodes:</span>
                      <div className="flex flex-wrap gap-2">
                        {currentResult.extracted_ips.map((ip, idx) => (
                          <span key={idx} className="font-mono text-xs px-2 py-1 rounded bg-slate-950 border border-slate-800 text-cyan-300">
                            {ip}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentResult.extracted_urls && currentResult.extracted_urls.length > 0 && (
                    <div className="mt-3">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Exfiltration URLs:</span>
                      <div className="space-y-1">
                        {currentResult.extracted_urls.slice(0, 4).map((u, idx) => (
                          <div key={idx} className="font-mono text-xs p-1.5 rounded bg-slate-950 border border-slate-800 text-slate-300 truncate">
                            {u}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* APK Scan History */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-200">Seized APK Forensic Registry</h3>
          </div>
          <span className="text-xs text-slate-400">{history.length} APKs logged</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase font-medium border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">App Name</th>
                <th className="py-2.5 px-3">Package Identifier</th>
                <th className="py-2.5 px-3">SHA-256 Hash</th>
                <th className="py-2.5 px-3">Risk Assessment</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-medium text-white">{item.app_name}</td>
                  <td className="py-3 px-3 font-mono text-cyan-300">{item.package_name}</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-400 truncate max-w-xs">{item.sha256_hash}</td>
                  <td className="py-3 px-3">
                    <RiskBadge level={item.risk_category} score={item.risk_score} size="sm" />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setCurrentResult(item)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
                    >
                      Inspect
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

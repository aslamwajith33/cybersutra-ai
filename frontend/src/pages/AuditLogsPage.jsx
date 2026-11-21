import React, { useState, useEffect } from 'react';
import {
  History,
  Shield,
  Search,
  Filter,
  Clock,
  User,
  Fingerprint
} from 'lucide-react';
import { getAuditLogs, getCases } from '../api/client';

export const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [cases, setCases] = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, [selectedCaseId, selectedAction]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCaseId) params.case_id = parseInt(selectedCaseId);
      if (selectedAction) params.action = selectedAction;

      const [logData, caseList] = await Promise.all([
        getAuditLogs(params),
        getCases()
      ]);
      setLogs(logData);
      setCases(caseList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-bold text-white tracking-wide">Investigation Audit Trail</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tamper-evident chronological audit records ensuring Section 65B Indian Evidence Act admissibility for digital forensics.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedCaseId}
            onChange={(e) => setSelectedCaseId(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="">All Rajasthan Cases</option>
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.case_number}
              </option>
            ))}
          </select>

          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="">All Actions</option>
            <option value="STATEMENT_INGESTED">Statement Ingested</option>
            <option value="NOTICE_ISSUED">Notice Issued</option>
            <option value="REPORT_GENERATED">Report Generated</option>
            <option value="EVIDENCE_LINKED">Evidence Linked</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-200">System Activity Records</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">{logs.length} logged events</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase font-medium border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Action Type</th>
                <th className="py-2.5 px-3">Officer Name</th>
                <th className="py-2.5 px-3">Role / Station</th>
                <th className="py-2.5 px-3">Audit Details</th>
                <th className="py-2.5 px-3">Terminal IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-mono text-slate-400 whitespace-nowrap">
                      {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'N/A'}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-white">{log.actor_name}</td>
                    <td className="py-3 px-3 text-slate-400">{log.actor_role}</td>
                    <td className="py-3 px-3 max-w-md text-slate-300 leading-snug">{log.details}</td>
                    <td className="py-3 px-3 font-mono text-slate-400 text-[11px] whitespace-nowrap">{log.ip_address}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No audit records found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

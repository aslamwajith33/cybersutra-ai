import React, { useState, useEffect } from 'react';
import {
  Clock,
  Filter,
  Calendar,
  AlertTriangle,
  ReceiptIndianRupee,
  Scale,
  FolderGit2,
  ArrowRight,
  Shield,
  Layers,
  CheckCircle2,
  Lightbulb
} from 'lucide-react';
import { getInvestigationTimeline, getCases } from '../api/client';
import { RiskBadge } from '../components/RiskBadge';

export const TimelinePage = () => {
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [cases, setCases] = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTimeline();
  }, [selectedCaseId]);

  const loadTimeline = async () => {
    try {
      setLoading(true);
      const caseFilter = selectedCaseId ? parseInt(selectedCaseId) : null;
      const [events, caseList] = await Promise.all([
        getInvestigationTimeline(caseFilter),
        getCases()
      ]);
      setTimelineEvents(events);
      setCases(caseList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getEventBadge = (type) => {
    switch (type) {
      case 'VICTIM_COMPLAINT_FILED':
        return {
          label: 'Victim Complaint',
          bg: 'bg-[#2563eb]/20',
          border: 'border-[#2563eb]/40',
          text: 'text-[#b4c5ff]',
          icon: FolderGit2
        };
      case 'LAYERING_TRANSFER':
        return {
          label: 'Rapid Layering Transfer',
          bg: 'bg-[#cf2c30]/20',
          border: 'border-[#cf2c30]/40',
          text: 'text-[#ffb3ad]',
          icon: AlertTriangle
        };
      case 'STATUTORY_NOTICE_ISSUED':
        return {
          label: 'Police Freeze Notice',
          bg: 'bg-emerald-950/40',
          border: 'border-emerald-700/50',
          text: 'text-emerald-400',
          icon: Scale
        };
      default:
        return {
          label: 'Financial Transfer',
          bg: 'bg-[#d97707]/20',
          border: 'border-[#d97707]/40',
          text: 'text-[#ffb77d]',
          icon: ReceiptIndianRupee
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Official Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#ffb77d]/20 border border-[#ffb77d]/40 flex items-center justify-center text-[#ffb77d]">
            <Clock className="w-5 h-5 text-[#ffb77d]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#dde2f8]">
                Crime Incident Timeline (Minute-by-Minute)
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#ffb77d]/20 text-[#ffb77d] border border-[#ffb77d]/30">
                Chrono-Log
              </span>
            </div>
            <p className="text-xs text-[#c3c6d7] mt-0.5">
              Minute-by-minute reconstruction of events: from the victim's complaint to the rapid transfers, ATM cashout, and police freeze order.
            </p>
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

      {/* Explanation Box */}
      <div className="p-4 rounded-xl bg-[#151b2b] border border-[#434655]/50 flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-[#ffb77d] shrink-0 mt-0.5" />
        <div className="text-xs text-[#c3c6d7] leading-relaxed">
          <span className="font-bold text-[#dde2f8]">Why Timing is Everything in Cybercrime: </span>
          The average cybercriminal drains stolen money within 35 minutes across 4 dummy accounts. This timeline merges bank transactions, 1930 victim calls, and police freeze notices into one chronological story to prove the crime sequence in court.
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="p-5 sm:p-6 rounded-xl bg-[#151b2b] border border-[#434655]/50">
        <div className="relative pl-6 sm:pl-8 border-l-2 border-[#434655]/50 space-y-6">
          {timelineEvents.map((evt, idx) => {
            const badge = getEventBadge(evt.event_type);
            const Icon = badge.icon;
            return (
              <div key={idx} className="relative group">
                {/* Node Dot */}
                <div className={`absolute -left-[31px] sm:-left-[39px] top-1 w-6 h-6 rounded-full ${badge.bg} border ${badge.border} flex items-center justify-center`}>
                  <Icon className={`w-3 h-3 ${badge.text}`} />
                </div>

                {/* Event Card */}
                <div className="p-4 rounded-xl bg-[#080e1d] border border-[#434655]/40 hover:border-[#2563eb]/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${badge.bg} ${badge.text} border ${badge.border}`}>
                        {badge.label}
                      </span>
                      <span className="text-xs font-bold text-[#dde2f8]">
                        {evt.title}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-[#8d90a0]">
                      {new Date(evt.timestamp).toLocaleString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <p className="text-xs text-[#c3c6d7] leading-relaxed mb-3">
                    {evt.description}
                  </p>

                  {/* Metadata Chips */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#434655]/30 text-[11px] font-mono">
                    {evt.amount && (
                      <span className="px-2 py-0.5 rounded bg-[#191f2f] text-[#ffb77d] font-bold border border-[#434655]/40">
                        Amount: ₹{evt.amount.toLocaleString('en-IN')}
                      </span>
                    )}
                    {evt.from_entity && (
                      <span className="px-2 py-0.5 rounded bg-[#191f2f] text-[#c3c6d7] border border-[#434655]/40">
                        From: {evt.from_entity}
                      </span>
                    )}
                    {evt.to_entity && (
                      <span className="px-2 py-0.5 rounded bg-[#191f2f] text-[#c3c6d7] border border-[#434655]/40">
                        To: {evt.to_entity}
                      </span>
                    )}
                    {evt.utr && (
                      <span className="px-2 py-0.5 rounded bg-[#2563eb]/15 text-[#b4c5ff] font-bold border border-[#2563eb]/30">
                        UTR: {evt.utr}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

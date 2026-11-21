import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Fingerprint,
  MessageSquare,
  Clock,
  ReceiptIndianRupee,
  FileSpreadsheet,
  Building2,
  GitFork,
  Globe2,
  Network,
  FolderGit2,
  FileText,
  History,
  Shield,
  Award
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard Overview', desc: 'Summary of cases & live alerts', icon: LayoutDashboard },
  { path: '/money-trail', label: 'Follow Stolen Money (UTR)', desc: 'Trace funds from victim to cashout', icon: GitFork, standout: true },
  { path: '/fraud-dna', label: 'Gang Fingerprint (DNA)', desc: 'Connect complaints to the same gang', icon: Fingerprint, standout: true },
  { path: '/mule-detection', label: 'Mule Account Detector', desc: 'Find rented dummy accounts', icon: Building2 },
  { path: '/statements', label: 'Upload Bank Statements', desc: 'Auto-read PDF & Excel statements', icon: FileSpreadsheet },
  { path: '/evidence-graph', label: 'Crime Connection Map', desc: 'Visual web of phones, banks & URLs', icon: Network },
  { path: '/copilot', label: 'AI Case Assistant', desc: 'Ask questions & get instant evidence', icon: MessageSquare },
  { path: '/timeline', label: 'Case Timeline', desc: 'Minute-by-minute money movement', icon: Clock },
  { path: '/domain-ip', label: 'Fake Websites & IP Intel', desc: 'Check scam links & hosting', icon: Globe2 },
  { path: '/cases', label: 'Police Cases & FIRs', desc: 'Manage case files & complaints', icon: FolderGit2 },
  { path: '/reports', label: 'Freeze Notices & PDF Reports', desc: '1-click bank freeze orders (Sec 102)', icon: FileText },
  { path: '/financial', label: 'All Transactions Table', desc: 'Search and filter bank debits/credits', icon: ReceiptIndianRupee },
  { path: '/audit-logs', label: 'Officer Activity Logs', desc: 'Security audit trail of all actions', icon: History },
];

export const Sidebar = ({ isOpen, setIsOpen }) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-72 bg-[#151b2b] border-r border-[#434655]/50 z-50 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header Block */}
        <div className="p-4 border-b border-[#434655]/40 bg-[#0d1322]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg bg-[#2563eb] flex items-center justify-center text-white shadow-sm font-bold">
                <Shield className="w-5 h-5 text-[#eeefff]" />
              </div>
              <div>
                <div className="font-bold text-sm tracking-tight text-[#dde2f8]">CYBERSUTRA AI</div>
                <div className="text-[10px] font-medium text-[#c3c6d7] tracking-wider uppercase">
                  RAJASTHAN POLICE CYBER CELL
                </div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-[#242a3a] border border-[#434655]/60 text-[10px] font-mono text-[#b4c5ff] font-semibold">
              PS05
            </span>
          </div>
          <div className="px-2 py-1 rounded bg-[#2563eb]/15 border border-[#2563eb]/40 text-[#b4c5ff] text-[10px] font-medium text-center">
            POLICE INVESTIGATION ASSISTANT
          </div>
        </div>

        {/* Navigation Items with Clear Subtitles */}
        <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-1">
          <div className="px-2 pb-1 text-[10px] font-mono uppercase font-bold text-[#8d90a0]">
            Investigation Tools
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-start gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#2563eb] text-[#eeefff] shadow-sm'
                      : 'text-[#c3c6d7] hover:bg-[#242a3a] hover:text-[#dde2f8]'
                  }`
                }
              >
                <Icon className="w-4 h-4 mt-0.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold truncate leading-tight flex items-center justify-between">
                    <span>{item.label}</span>
                    {item.standout && (
                      <span className="text-[9px] font-mono font-bold px-1 rounded bg-[#ffb77d]/20 text-[#ffb77d]">
                        KEY
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] opacity-75 truncate leading-tight mt-0.5">
                    {item.desc}
                  </div>
                </div>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer: Officer ID */}
        <div className="p-3 border-t border-[#434655]/40 bg-[#191f2f]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#242a3a] flex items-center justify-center text-[#ffb77d] shrink-0 border border-[#434655]/50">
              <Award className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-[#dde2f8] truncate">Insp. Vikram Rathore (IO)</div>
              <div className="text-[10px] text-[#c3c6d7] truncate">Cyber Crime Police Station, Jaipur</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

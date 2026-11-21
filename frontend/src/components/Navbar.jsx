import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Menu,
  Shield,
  HelpCircle,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { getDashboardStats } from '../api/client';
import { FeaturesGuideModal } from './FeaturesGuideModal';

export const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(4);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const stats = await getDashboardStats();
        if (stats?.priority_alerts) {
          setAlerts(stats.priority_alerts);
          setUnreadCount(stats.priority_alerts.length || 4);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchAlerts();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/cases?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 h-16 bg-[#151b2b]/95 backdrop-blur-xl border-b border-[#434655]/40 flex items-center px-4 lg:px-8 justify-between gap-4">
        {/* Left: Mobile trigger & Command Unit Badge */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg text-[#c3c6d7] hover:text-[#dde2f8] hover:bg-[#242a3a] lg:hidden"
            title="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffb77d] animate-pulse"></span>
            <span className="text-xs font-semibold text-[#dde2f8] tracking-wide">
              Rajasthan Police Cyber Crime Command • PHQ Jaipur
            </span>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-lg hidden md:block">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="w-4 h-4 text-[#8d90a0] absolute left-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by FIR number, 12-digit UTR, account, UPI or domain..."
              className="w-full bg-[#080e1d] border border-[#434655]/60 rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#dde2f8] placeholder-[#8d90a0] focus:outline-none focus:border-[#2563eb] transition-colors"
            />
          </form>
        </div>

        {/* Right: Quick Features Guide Button + Alert Bell */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Prominent Features Guide Button */}
          <button
            onClick={() => setShowGuideModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2563eb]/20 hover:bg-[#2563eb]/30 border border-[#2563eb]/50 text-[#b4c5ff] text-xs font-bold transition-all shadow-sm group"
            title="Open Interactive Guide to all features"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#ffb77d] group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">How It Works / Features Guide</span>
            <span className="sm:hidden">Guide</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl bg-[#191f2f] hover:bg-[#242a3a] text-[#c3c6d7] hover:text-[#dde2f8] border border-[#434655]/40 transition-colors"
              title="Recent Alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-[#cf2c30] text-[#ffecea] font-mono text-[9px] font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#191f2f] border border-[#434655] shadow-2xl p-4 z-50">
                <div className="flex items-center justify-between pb-2.5 border-b border-[#434655]/50">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#cf2c30]"></span>
                    <span className="font-bold text-xs text-[#dde2f8] uppercase tracking-wider">
                      Priority Cyber Alerts
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#8d90a0]">{alerts.length} live</span>
                </div>
                <div className="mt-2.5 space-y-2 max-h-72 overflow-y-auto">
                  {alerts.map((al, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-[#080e1d] border border-[#434655]/40 text-xs space-y-1 hover:border-[#2563eb]/50 transition-colors cursor-pointer"
                      onClick={() => {
                        setShowNotifications(false);
                        navigate('/money-trail');
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] font-bold text-[#ffb77d]">{al.target}</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#cf2c30]/20 text-[#ffb3ad] border border-[#cf2c30]/30">
                          {al.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#c3c6d7] line-clamp-2">{al.detail}</p>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-[#434655]/50 mt-2 text-center">
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      navigate('/money-trail');
                    }}
                    className="text-[11px] font-bold text-[#b4c5ff] hover:underline"
                  >
                    View All Live Money Trails →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Interactive Guide Modal */}
      <FeaturesGuideModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
      />
    </>
  );
};

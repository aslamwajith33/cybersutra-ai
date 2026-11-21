import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GitFork,
  Search,
  Gavel,
  AlertTriangle,
  FileText,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Shield,
  Building2,
  Clock,
  Sparkles,
  MapPin,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { traceMoneyTrail } from '../api/client';

const SAMPLE_TRAILS = [
  {
    id: 'UTR5010029101',
    label: 'Telegram Task Scam (₹2.45L)',
    amount: '₹2,45,000',
    time: '35 Minutes Total',
    status: 'Cashout in Alwar',
    victim: 'SBI Jaipur • 30918472019',
    mule1: 'HDFC Bank • 50100291018472',
    mule2: 'ICICI Bank • 000405192837',
    mule3: 'Axis Bank • 918010039482716',
    terminal: 'Alwar ATM #0942'
  },
  {
    id: 'UTR4910088219',
    label: 'Fake Electricity Bill (₹1.80L)',
    amount: '₹1,80,000',
    time: '28 Minutes Total',
    status: '₹1.10L Frozen by Police',
    victim: 'PNB Jodhpur • 48291049281',
    mule1: 'SBI Mule • 39281048291',
    mule2: 'Paytm Bank • 9188291048',
    mule3: 'Canara Bank • 1049281029',
    terminal: 'Jaipur ATM #0128'
  },
  {
    id: 'UTR6120094182',
    label: 'Illegal Loan App Extortion (₹3.50L)',
    amount: '₹3,50,000',
    time: '42 Minutes Total',
    status: 'Split across 4 Mules',
    victim: 'Bank of Baroda • 882910482',
    mule1: 'Kotak Bank • 7482910482',
    mule2: 'IndusInd • 2910482910',
    mule3: 'Yes Bank • 992810482',
    terminal: 'Bharatpur ATM #0331'
  }
];

export const MoneyTrailExplorer = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('UTR5010029101');
  const [tracing, setTracing] = useState(false);
  const [freezeStatus, setFreezeStatus] = useState("Select any mule account above to generate an immediate bank freeze order.");
  const [freezeActive, setFreezeActive] = useState(false);
  const [activeHop, setActiveHop] = useState(1);

  useEffect(() => {
    handleTrace('UTR5010029101');
  }, []);

  const handleTrace = async (q = null) => {
    const target = (q || searchQuery).trim();
    if (!target) return;
    setTracing(true);
    try {
      await traceMoneyTrail(target);
    } catch (err) {
      console.error(err);
    } finally {
      setTracing(false);
    }
  };

  const handleDraftFreeze = (hopName, bank, account, amount) => {
    const refId = 'SEC102-RJ-' + Math.floor(100000 + Math.random() * 900000);
    setFreezeStatus(`Legal Section 102 CrPC Freeze Issued: ${refId} • Sent to ${bank} (A/C ${account}) for ₹${amount}`);
    setFreezeActive(true);
  };

  return (
    <div className="flex flex-col w-full gap-5">
      {/* Friendly Explainer Banner */}
      <div className="bg-[#151b2b] p-4 sm:p-5 rounded-2xl border border-[#434655]/50 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2563eb] text-white flex items-center justify-center shrink-0 shadow-md">
            <GitFork className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-[#dde2f8]">
                Follow The Stolen Money (Multi-Hop UTR Tracer)
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#2563eb]/20 text-[#b4c5ff] border border-[#2563eb]/30">
                Live Money Flow
              </span>
            </div>
            <p className="text-xs text-[#c3c6d7] leading-relaxed mt-1 max-w-3xl">
              <span className="font-bold text-[#dde2f8]">How it works: </span>
              When a citizen is scammed, criminals immediately bounce the stolen funds across 3 to 4 dummy bank accounts to evade police. Enter any 12-digit UTR reference number from the victim's bank statement to map the complete step-by-step path to final ATM cashout.
            </p>
          </div>
        </div>

        {/* Quick Sample Selector */}
        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
          <span className="text-[11px] font-semibold text-[#8d90a0]">Try Samples:</span>
          {SAMPLE_TRAILS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setSearchQuery(s.id);
                handleTrace(s.id);
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all border ${
                searchQuery === s.id
                  ? 'bg-[#2563eb] text-white border-[#b4c5ff] shadow-sm'
                  : 'bg-[#191f2f] text-[#c3c6d7] hover:bg-[#242a3a] border-[#434655]/40'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top Search & Stats Bar */}
      <section className="bg-[#151b2b] rounded-2xl p-4 sm:p-5 border border-[#434655]/50 shadow-sm">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1 relative flex items-center bg-[#080e1d] rounded-xl px-3.5 py-2 border border-[#434655]/60">
              <Search className="w-4 h-4 text-[#8d90a0] mr-2 shrink-0" />
              <div className="flex flex-col flex-1 min-w-0">
                <label className="text-[10px] font-mono uppercase text-[#8d90a0] font-bold">
                  Enter 12-Digit Bank UTR / Transaction Reference:
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. UTR5010029101"
                  className="w-full bg-transparent font-mono text-xs text-[#dde2f8] focus:outline-none font-bold"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleTrace()}
              disabled={tracing}
              className="px-5 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#3b82f6] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shrink-0 shadow-md"
            >
              <GitFork className="w-4 h-4" />
              <span>{tracing ? 'Tracing Money Trail...' : 'Track Money Flow'}</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 shrink-0">
            <div className="bg-[#080e1d] rounded-xl px-3.5 py-2 border border-[#434655]/40">
              <div className="text-[10px] font-bold text-[#8d90a0] uppercase">Money Stolen</div>
              <div className="font-mono text-sm font-bold text-[#dde2f8]">₹2,45,000</div>
            </div>
            <div className="bg-[#080e1d] rounded-xl px-3.5 py-2 border border-[#434655]/40">
              <div className="text-[10px] font-bold text-[#8d90a0] uppercase">Time Taken</div>
              <div className="font-mono text-sm font-bold text-[#ffb77d]">35 Minutes</div>
            </div>
            <div className="bg-[#cf2c30]/20 rounded-xl px-3.5 py-2 border border-[#cf2c30]/40">
              <div className="text-[10px] font-bold text-[#ffb3ad] uppercase">Final Status</div>
              <div className="font-mono text-sm font-bold text-[#ffb3ad]">Cashout at ATM</div>
            </div>
          </div>
        </div>
      </section>

      {/* Freeze Notification Toast */}
      {freezeActive && (
        <div className="p-3.5 rounded-xl bg-[#080e1d] border border-emerald-500/60 text-xs text-emerald-400 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">{freezeStatus}</span>
          </div>
          <button
            onClick={() => navigate('/reports')}
            className="text-xs font-bold text-[#ffb77d] hover:underline"
          >
            View Official Freeze Order in Registry →
          </button>
        </div>
      )}

      {/* Multi-Hop Waterfall Cascade Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffb77d]"></span>
          <span className="text-xs font-bold uppercase tracking-wider text-[#dde2f8]">
            Step-by-Step Money Journey (5 Hops from Victim to Cash Withdrawal):
          </span>
        </div>
        <div className="text-[11px] text-[#c3c6d7] hidden sm:inline">
          Click "Freeze This Account" to generate an immediate bank freeze order
        </div>
      </div>

      {/* 5-Hop Step-by-Step Visual Cards with Animated Directional Connectors */}
      <section className="grid grid-cols-1 xl:grid-cols-5 gap-3.5 items-stretch relative">
        {/* Hop 0: Victim Account */}
        <article
          onClick={() => setActiveHop(0)}
          className={`rounded-2xl p-4 border flex flex-col justify-between gap-3 shadow-md transition-all cursor-pointer ${
            activeHop === 0
              ? 'bg-[#191f2f] border-[#2563eb] ring-2 ring-[#2563eb]/40'
              : 'bg-[#151b2b] border-[#434655]/50 hover:border-[#434655]'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded-lg bg-[#2563eb]/20 font-mono text-[10px] text-[#b4c5ff] font-bold border border-[#2563eb]/40">
                STEP 0 • VICTIM
              </span>
              <span className="font-mono text-[10px] text-[#8d90a0]">10:05 AM</span>
            </div>
            <h3 className="font-bold text-sm text-[#dde2f8]">Victim's Bank Account</h3>
            <p className="text-xs text-[#c3c6d7] mt-0.5">SBI Savings Bank, Jaipur</p>
            <div className="mt-2.5 bg-[#080e1d] rounded-xl p-2.5 border border-[#434655]/40">
              <div className="text-[9px] font-mono text-[#8d90a0]">ACCOUNT NUMBER</div>
              <div className="font-mono text-xs text-[#dde2f8] font-bold">30918472019</div>
            </div>
          </div>

          <div className="space-y-2 pt-2.5 border-t border-[#434655]/40">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#8d90a0]">AMOUNT DEBITED</span>
              <span className="font-mono text-xs font-bold text-[#ffb3ad]">-₹2,45,000</span>
            </div>
            <div className="bg-[#080e1d] rounded-lg p-1.5 text-center text-[10px] font-mono text-[#c3c6d7] border border-[#434655]/30">
              Sent via UPI (Net Banking)
            </div>
          </div>
        </article>

        {/* Hop 1: Primary Collector Mule (Key Rescue Point!) */}
        <article
          onClick={() => setActiveHop(1)}
          className={`rounded-2xl p-4 border flex flex-col justify-between gap-3 shadow-md transition-all cursor-pointer ${
            activeHop === 1
              ? 'bg-[#191f2f] border-[#d97707] ring-2 ring-[#d97707]/40'
              : 'bg-[#151b2b] border-[#d97707]/50 hover:border-[#d97707]'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded-lg bg-[#d97707]/20 font-mono text-[10px] text-[#ffb77d] font-bold border border-[#d97707]/40">
                STEP 1 • 1ST MULE
              </span>
              <span className="font-mono text-[10px] text-[#8d90a0]">10:07 AM</span>
            </div>
            <h3 className="font-bold text-sm text-[#dde2f8]">Primary Mule Account</h3>
            <p className="text-xs text-[#c3c6d7] mt-0.5">HDFC Bank (Rented Dummy A/C)</p>
            <div className="mt-2.5 bg-[#080e1d] rounded-xl p-2.5 border border-[#434655]/40">
              <div className="text-[9px] font-mono text-[#8d90a0]">ACCOUNT NUMBER</div>
              <div className="font-mono text-xs text-[#dde2f8] font-bold">50100291018472</div>
            </div>
          </div>

          <div className="space-y-2 pt-2.5 border-t border-[#434655]/40">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#8d90a0]">FORWARDED IN 12M</span>
              <span className="font-mono text-xs font-bold text-[#ffb77d]">₹95,000</span>
            </div>
            <div className="bg-emerald-950/40 rounded-lg p-1.5 text-center text-[10px] font-bold text-emerald-400 border border-emerald-700/50">
              ₹1.50L Still Inside! Can Be Saved!
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleDraftFreeze('STEP 1 (Primary Mule)', 'HDFC Bank', '50100291018472', '95,000');
              }}
              className="w-full mt-1 py-2 rounded-xl bg-[#2563eb] hover:bg-[#3b82f6] text-white text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 shadow-md"
            >
              <Gavel className="w-3.5 h-3.5 text-[#ffb77d]" />
              <span>Freeze Account Now</span>
            </button>
          </div>
        </article>

        {/* Hop 2: Layering Conduit */}
        <article
          onClick={() => setActiveHop(2)}
          className={`rounded-2xl p-4 border flex flex-col justify-between gap-3 shadow-md transition-all cursor-pointer ${
            activeHop === 2
              ? 'bg-[#191f2f] border-[#2563eb] ring-2 ring-[#2563eb]/40'
              : 'bg-[#151b2b] border-[#434655]/50 hover:border-[#434655]'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded-lg bg-[#242a3a] font-mono text-[10px] text-[#ffb77d] font-bold border border-[#434655]/40">
                STEP 2 • 2ND MULE
              </span>
              <span className="font-mono text-[10px] text-[#8d90a0]">10:19 AM</span>
            </div>
            <h3 className="font-bold text-sm text-[#dde2f8]">Layering Account</h3>
            <p className="text-xs text-[#c3c6d7] mt-0.5">ICICI Bank (Shell Firm A/C)</p>
            <div className="mt-2.5 bg-[#080e1d] rounded-xl p-2.5 border border-[#434655]/40">
              <div className="text-[9px] font-mono text-[#8d90a0]">ACCOUNT NUMBER</div>
              <div className="font-mono text-xs text-[#dde2f8] font-bold">000405192837</div>
            </div>
          </div>

          <div className="space-y-2 pt-2.5 border-t border-[#434655]/40">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#8d90a0]">FORWARDED IN 9M</span>
              <span className="font-mono text-xs font-bold text-[#ffb77d]">₹95,000</span>
            </div>
            <div className="bg-[#080e1d] rounded-lg p-1.5 text-center text-[10px] font-mono text-[#8d90a0] border border-[#434655]/30">
              Sent downstream via NEFT
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleDraftFreeze('STEP 2 (Layering)', 'ICICI Bank', '000405192837', '95,000');
              }}
              className="w-full mt-1 py-2 rounded-xl bg-[#242a3a] hover:bg-[#2563eb] text-[#dde2f8] hover:text-white text-[11px] font-semibold transition-all flex items-center justify-center gap-1.5 border border-[#434655]/50"
            >
              <Gavel className="w-3.5 h-3.5 text-[#ffb77d]" />
              <span>Freeze Account</span>
            </button>
          </div>
        </article>

        {/* Hop 3: Regional Distribution Mule */}
        <article
          onClick={() => setActiveHop(3)}
          className={`rounded-2xl p-4 border flex flex-col justify-between gap-3 shadow-md transition-all cursor-pointer ${
            activeHop === 3
              ? 'bg-[#191f2f] border-[#2563eb] ring-2 ring-[#2563eb]/40'
              : 'bg-[#151b2b] border-[#434655]/50 hover:border-[#434655]'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded-lg bg-[#242a3a] font-mono text-[10px] text-[#ffb77d] font-bold border border-[#434655]/40">
                STEP 3 • 3RD MULE
              </span>
              <span className="font-mono text-[10px] text-[#8d90a0]">10:28 AM</span>
            </div>
            <h3 className="font-bold text-sm text-[#dde2f8]">Regional Mule (Alwar)</h3>
            <p className="text-xs text-[#c3c6d7] mt-0.5">Axis Bank, Alwar Branch</p>
            <div className="mt-2.5 bg-[#080e1d] rounded-xl p-2.5 border border-[#434655]/40">
              <div className="text-[9px] font-mono text-[#8d90a0]">ACCOUNT NUMBER</div>
              <div className="font-mono text-xs text-[#dde2f8] font-bold">918010039482716</div>
            </div>
          </div>

          <div className="space-y-2 pt-2.5 border-t border-[#434655]/40">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#8d90a0]">RECEIVED & SPLIT</span>
              <span className="font-mono text-xs font-bold text-[#ffb77d]">₹95,000</span>
            </div>
            <div className="bg-[#080e1d] rounded-lg p-1.5 text-center text-[10px] font-mono text-[#8d90a0] border border-[#434655]/30">
              Sent to ATM card in Alwar
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleDraftFreeze('STEP 3 (Regional Mule)', 'Axis Bank, Alwar', '918010039482716', '95,000');
              }}
              className="w-full mt-1 py-2 rounded-xl bg-[#242a3a] hover:bg-[#2563eb] text-[#dde2f8] hover:text-white text-[11px] font-semibold transition-all flex items-center justify-center gap-1.5 border border-[#434655]/50"
            >
              <Gavel className="w-3.5 h-3.5 text-[#ffb77d]" />
              <span>Freeze Account</span>
            </button>
          </div>
        </article>

        {/* Hop 4: Terminal Node (Cash Withdrawn) */}
        <article
          onClick={() => setActiveHop(4)}
          className={`rounded-2xl p-4 border flex flex-col justify-between gap-3 shadow-md transition-all cursor-pointer ${
            activeHop === 4
              ? 'bg-[#cf2c30]/20 border-[#cf2c30] ring-2 ring-[#cf2c30]/40'
              : 'bg-[#cf2c30]/10 border-[#cf2c30]/40 hover:border-[#cf2c30]'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded-lg bg-[#cf2c30] font-mono text-[10px] text-[#ffecea] font-bold">
                STEP 4 • CASH TAKEN
              </span>
              <span className="font-mono text-[10px] text-[#ffb3ad]">10:42 AM</span>
            </div>
            <h3 className="font-bold text-sm text-[#dde2f8]">ATM Cash Withdrawal</h3>
            <p className="text-xs text-[#ffb3ad] mt-0.5">Over-the-Counter ATM (Alwar)</p>
            <div className="mt-2.5 bg-[#080e1d] rounded-xl p-2.5 border border-[#cf2c30]/30">
              <div className="text-[9px] font-mono text-[#8d90a0]">ATM MACHINE ID</div>
              <div className="font-mono text-xs text-[#ffb3ad] font-bold">ALW-ATM-0942-RJ</div>
            </div>
          </div>

          <div className="space-y-2 pt-2.5 border-t border-[#cf2c30]/40">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#ffb3ad]">CASH WITHDRAWN</span>
              <span className="font-mono text-xs font-bold text-[#ffb3ad]">₹95,000</span>
            </div>
            <div className="w-full py-1.5 rounded-xl bg-[#cf2c30] text-[#ffecea] text-[10px] font-mono font-bold flex items-center justify-center gap-1.5 shadow-sm">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>CASH WITHDRAWN AT ATM</span>
            </div>
            <div className="text-[10px] text-center text-[#ffb3ad]">
              Police team dispatched for ATM CCTV footage
            </div>
          </div>
        </article>
      </section>

      {/* Velocity and Geographic Hotspot Cards */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Left: How fast did the money travel? */}
        <div className="xl:col-span-7 bg-[#151b2b] rounded-2xl p-5 border border-[#434655]/50 flex flex-col gap-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[#dde2f8]">
                Money Velocity Curve (How Fast Funds Were Moved)
              </div>
              <div className="text-[11px] text-[#c3c6d7]">
                Average hop speed: 11.6 minutes between accounts
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-lg bg-[#080e1d] font-mono text-[10px] text-[#b4c5ff] border border-[#434655]/40 font-bold">
              Total Time: 35 Mins
            </span>
          </div>

          <div className="bg-[#080e1d] rounded-xl p-4 border border-[#434655]/30">
            <svg aria-label="Fund Velocity Waterfall Chart" className="w-full h-32 text-[#b4c5ff]" viewBox="0 0 600 140">
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.6} />
                </linearGradient>
                <linearGradient id="cashoutGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#cf2c30" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#991b1b" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <line stroke="currentColor" strokeDasharray="4 4" strokeOpacity="0.1" x1="40" x2="580" y1="20" y2="20"></line>
              <line stroke="currentColor" strokeDasharray="4 4" strokeOpacity="0.1" x1="40" x2="580" y1="65" y2="65"></line>
              <line stroke="currentColor" strokeOpacity="0.2" x1="40" x2="580" y1="110" y2="110"></line>
              <rect fill="url(#barGrad)" height="90" rx="4" width="68" x="60" y="20"></rect>
              <rect fill="url(#barGrad)" height="38" rx="4" width="68" x="170" y="72"></rect>
              <rect fill="url(#barGrad)" height="38" rx="4" width="68" x="280" y="72"></rect>
              <rect fill="url(#barGrad)" height="38" rx="4" width="68" x="390" y="72"></rect>
              <rect fill="url(#cashoutGrad)" height="38" rx="4" width="68" x="500" y="72"></rect>
              <text fill="#dde2f8" fontFamily="sans-serif" fontSize="10" fontWeight="bold" textAnchor="middle" x="94" y="126">Victim (₹2.45L)</text>
              <text fill="#dde2f8" fontFamily="sans-serif" fontSize="10" fontWeight="bold" textAnchor="middle" x="204" y="126">Mule 1 (₹95K)</text>
              <text fill="#dde2f8" fontFamily="sans-serif" fontSize="10" fontWeight="bold" textAnchor="middle" x="314" y="126">Mule 2 (₹95K)</text>
              <text fill="#dde2f8" fontFamily="sans-serif" fontSize="10" fontWeight="bold" textAnchor="middle" x="424" y="126">Mule 3 (₹95K)</text>
              <text fill="#ffb3ad" fontFamily="sans-serif" fontSize="10" fontWeight="bold" textAnchor="middle" x="534" y="126">ATM Cashout</text>
            </svg>
          </div>
        </div>

        {/* Right: Where was the money withdrawn? */}
        <div className="xl:col-span-5 bg-[#151b2b] rounded-2xl p-5 border border-[#434655]/50 flex flex-col justify-between gap-3 shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-xs font-bold text-[#dde2f8]">
                  ATM Cashout Location (Alwar Cluster)
                </div>
                <div className="text-[11px] text-[#c3c6d7]">
                  Where did the criminal physically withdraw the cash?
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-lg bg-[#cf2c30]/20 border border-[#cf2c30]/40 font-mono text-[10px] text-[#ffb3ad] font-bold">
                Alwar, Rajasthan
              </span>
            </div>

            <div className="w-full bg-[#080e1d] rounded-xl border border-[#434655]/40 p-3.5 font-mono text-xs space-y-1.5">
              <div className="text-[#ffb77d] font-bold flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#cf2c30]" />
                <span>ATM Terminal: ALW-ATM-0942-RJ</span>
              </div>
              <div className="text-[#dde2f8]">Location: MIA Industrial Area, Alwar</div>
              <div className="text-[11px] text-[#8d90a0]">Status: Police Section 91 order sent for ATM CCTV recording</div>
            </div>
          </div>

          <div className="bg-[#080e1d] rounded-xl p-3 border border-[#434655]/40 flex items-center justify-between gap-3">
            <div className="min-w-0 text-xs">
              <div className="text-[10px] font-mono uppercase text-[#8d90a0] font-bold">LEGAL FREEZE STATUS</div>
              <div className={`font-mono truncate ${freezeActive ? 'text-[#ffb77d] font-bold' : 'text-[#c3c6d7]'}`}>
                {freezeStatus}
              </div>
            </div>
            <FileText className="w-5 h-5 text-[#b4c5ff] shrink-0" />
          </div>
        </div>
      </section>
    </div>
  );
};

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Network,
  Plus,
  Minus,
  Maximize2,
  Dock,
  Shield,
  Building2,
  Smartphone,
  Globe,
  Server,
  Gavel,
  Download,
  X,
  Play,
  RotateCcw,
  Sparkles,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

const NODE_DATA = {
  'case-jpr': {
    id: 'case-jpr',
    type: 'VICTIM POLICE CASE (FIR)',
    role: 'Victim 1 Complaint',
    title: 'FIR-2026-JPR-014',
    badge: 'ACTIVE FIR',
    badgeClass: 'bg-[#2563eb]/20 text-[#b4c5ff] border border-[#2563eb]/40',
    color: '#2563eb',
    icon: Shield,
    balance: '₹18,40,000 Reported Loss',
    plainExplainer: 'Victim in Jaipur was tricked by a fake KYC update link and lost ₹18.4 Lakh via net banking.',
    kyc: 'PS Jaipur Cyber Cell • Section 318(4) BNS',
    complaints: ['FIR-2026-JPR-014'],
    connectedTo: ['bank-primary'],
    policeAction: 'View FIR Details',
    actionType: 'CASE'
  },
  'case-kot': {
    id: 'case-kot',
    type: 'VICTIM POLICE CASE (FIR)',
    role: 'Victim 2 Complaint',
    title: 'FIR-2026-KOT-008',
    badge: 'ACTIVE FIR',
    badgeClass: 'bg-[#2563eb]/20 text-[#b4c5ff] border border-[#2563eb]/40',
    color: '#2563eb',
    icon: Shield,
    balance: '₹4,25,000 Reported Loss',
    plainExplainer: 'Victim in Kota reported losing ₹4.25 Lakh to the same fake bank login page on the same day.',
    kyc: 'PS Kota Cyber Cell • Section 66D IT Act',
    complaints: ['FIR-2026-KOT-008'],
    connectedTo: ['bank-primary'],
    policeAction: 'View FIR Details',
    actionType: 'CASE'
  },
  'bank-primary': {
    id: 'bank-primary',
    type: 'DUMMY MULE ACCOUNT (COLLECTOR)',
    role: 'Primary Money Collector',
    title: 'HDFC Bank ••4829',
    badge: 'FROZEN BY POLICE',
    badgeClass: 'bg-[#cf2c30]/20 text-[#ffb3ad] border border-[#cf2c30]/40',
    color: '#d97707',
    icon: Building2,
    balance: '₹14,82,450 Seized in A/C',
    plainExplainer: 'Dummy account rented from a student. Both victims’ money was sent directly into this account within 15 minutes.',
    kyc: 'Suspect Mule • PAN Mismatch • Zero Retention',
    complaints: ['FIR-2026-JPR-014', 'FIR-2026-KOT-008'],
    connectedTo: ['case-jpr', 'case-kot', 'bank-secondary', 'phone-suspect'],
    policeAction: 'Issue Section 102 CrPC Freeze Order',
    actionType: 'FREEZE'
  },
  'bank-secondary': {
    id: 'bank-secondary',
    type: 'LAYERING CONDUIT ACCOUNT',
    role: 'Layering Account',
    title: 'ICICI Bank ••9104',
    badge: 'DEBIT ON HOLD',
    badgeClass: 'bg-[#d97707]/20 text-[#ffb77d] border border-[#d97707]/40',
    color: '#d97707',
    icon: Building2,
    balance: '₹6,15,200 Remaining Balance',
    plainExplainer: 'A shell proprietorship account used to layer and forward funds downstream to avoid police detection.',
    kyc: 'Shell Trading Firm • Jaipur Registered',
    complaints: ['FIR-2026-JPR-014'],
    connectedTo: ['bank-primary', 'ip-c2'],
    policeAction: 'Issue Section 102 CrPC Freeze Order',
    actionType: 'FREEZE'
  },
  'phone-suspect': {
    id: 'phone-suspect',
    type: 'SCAMMER TELECOM SIM',
    role: 'Scammer Phone Number',
    title: '+91 98290-••412',
    badge: 'TRACKED TOWER',
    badgeClass: 'bg-[#06b6d4]/20 text-[#67e8f9] border border-[#06b6d4]/40',
    color: '#06b6d4',
    icon: Smartphone,
    balance: 'IMEI: 358240051111012',
    plainExplainer: 'Phone number used to register the HDFC mule account and administer the phishing domain.',
    kyc: 'Tower Active: Bharatpur • Fake Aadhaar KYC',
    complaints: ['FIR-2026-JPR-014', 'FIR-2026-KOT-008'],
    connectedTo: ['bank-primary', 'domain-phish'],
    policeAction: 'Issue Section 91 CDR & Tower Requisition',
    actionType: 'TELECOM'
  },
  'domain-phish': {
    id: 'domain-phish',
    type: 'PHISHING SCAM WEBSITE',
    role: 'Fake Bank Website',
    title: 'kyc-sbi-update.in',
    badge: 'TAKEDOWN ORDERED',
    badgeClass: 'bg-[#cf2c30]/20 text-[#ffb3ad] border border-[#cf2c30]/40',
    color: '#cf2c30',
    icon: Globe,
    balance: '142 Citizen Clicks Logged',
    plainExplainer: 'Fake website mimicking an official bank login to steal user net banking passwords and OTPs.',
    kyc: 'Registrar: Namecheap Inc • Offshore Abuse',
    complaints: ['FIR-2026-JPR-014', 'FIR-2026-KOT-008'],
    connectedTo: ['phone-suspect', 'ip-c2'],
    policeAction: 'Draft Section 69A IT Act Takedown Notice',
    actionType: 'TAKEDOWN'
  },
  'ip-c2': {
    id: 'ip-c2',
    type: 'OFFSHORE HACKER SERVER (C2)',
    role: 'Command & Control Server',
    title: '185.220.101.44',
    badge: 'CRITICAL HOST',
    badgeClass: 'bg-[#8b5cf6]/20 text-[#c4b5fd] border border-[#8b5cf6]/40',
    color: '#8b5cf6',
    icon: Server,
    balance: 'ASN 205100 • Frankfurt DE',
    plainExplainer: 'Bulletproof offshore server hosting the scam site and receiving stolen OTP callbacks from victim browsers.',
    kyc: 'Tor Exit / Bulletproof Offshore Provider',
    complaints: ['FIR-2026-JPR-014', 'FIR-2026-KOT-008'],
    connectedTo: ['domain-phish', 'bank-secondary'],
    policeAction: 'Send CERT-In International Legal Requisition',
    actionType: 'SERVER'
  }
};

const STORY_STEPS = [
  {
    step: 1,
    title: '1. Two Victims File Separate Complaints',
    focusNode: 'case-jpr',
    highlightNodes: ['case-jpr', 'case-kot'],
    summary: 'Two citizens in Jaipur and Kota lost ₹22.6 Lakh after receiving SMS messages asking them to update bank KYC.'
  },
  {
    step: 2,
    title: '2. Stolen Money Lands in Same Dummy Account',
    focusNode: 'bank-primary',
    highlightNodes: ['case-jpr', 'case-kot', 'bank-primary'],
    summary: 'Both victim payments flowed directly into HDFC Account ••4829. Police successfully froze ₹14.82 Lakh.'
  },
  {
    step: 3,
    title: '3. Scammer Layers Money into 2nd Account',
    focusNode: 'bank-secondary',
    highlightNodes: ['bank-primary', 'bank-secondary'],
    summary: 'Within 12 minutes, scammers moved ₹95,000 into an ICICI shell account to disguise the money trail.'
  },
  {
    step: 4,
    title: '4. Linked Scammer Phone & Fake Website',
    focusNode: 'domain-phish',
    highlightNodes: ['bank-primary', 'phone-suspect', 'domain-phish'],
    summary: 'The phone used for the mule KYC (+91 98290) was also used to set up the phishing website kyc-sbi-update.in.'
  },
  {
    step: 5,
    title: '5. Hosted on Offshore Hacker Server (C2)',
    focusNode: 'ip-c2',
    highlightNodes: ['domain-phish', 'bank-secondary', 'ip-c2'],
    summary: 'The scam domain is hosted in Frankfurt (185.220.101.44), where stolen victim passwords were sent in real time.'
  }
];

export const EvidenceGraph = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('ALL');
  const [zoom, setZoom] = useState(1);
  const [selectedNodeKey, setSelectedNodeKey] = useState('bank-primary');
  const [showDrawer, setShowDrawer] = useState(true);
  const [storyStep, setStoryStep] = useState(0); // 0 = off, 1-5 = story active
  const [actionSuccess, setActionSuccess] = useState(null);

  const activeNode = NODE_DATA[selectedNodeKey] || NODE_DATA['bank-primary'];

  const handleZoom = (delta) => {
    setZoom((prev) => Math.min(1.6, Math.max(0.6, prev + delta)));
  };

  const handleReset = () => {
    setZoom(1);
    setStoryStep(0);
  };

  const handleStepClick = (stepIndex) => {
    if (storyStep === stepIndex) {
      setStoryStep(0);
    } else {
      setStoryStep(stepIndex);
      const stepData = STORY_STEPS.find((s) => s.step === stepIndex);
      if (stepData) {
        setSelectedNodeKey(stepData.focusNode);
      }
    }
  };

  const handleAction = () => {
    const noticeNum = 'SEC102-RJ-' + Math.floor(100000 + Math.random() * 900000);
    setActionSuccess(`Action Executed: Legal directive ${noticeNum} drafted for ${activeNode.title}.`);
    setTimeout(() => setActionSuccess(null), 6000);
  };

  // Check if an edge is active
  const isEdgeHighlighted = (from, to) => {
    if (storyStep > 0) {
      const stepData = STORY_STEPS.find((s) => s.step === storyStep);
      return stepData?.highlightNodes.includes(from) && stepData?.highlightNodes.includes(to);
    }
    return selectedNodeKey === from || selectedNodeKey === to;
  };

  const isNodeHighlighted = (nodeId) => {
    if (storyStep > 0) {
      const stepData = STORY_STEPS.find((s) => s.step === storyStep);
      return stepData?.highlightNodes.includes(nodeId);
    }
    if (selectedNodeKey === nodeId) return true;
    return activeNode.connectedTo.includes(nodeId);
  };

  return (
    <div className="flex flex-col w-full gap-4">
      {/* Friendly Explainer Banner: What does this screen do? */}
      <div className="bg-[#151b2b] p-4 sm:p-5 rounded-2xl border border-[#434655]/50 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2563eb] text-white flex items-center justify-center shrink-0 shadow-md">
            <Network className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-[#dde2f8]">
                Crime Connection Map (Visual Evidence Web)
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#ffb77d]/20 text-[#ffb77d] border border-[#ffb77d]/30">
                Interactive Link Analysis
              </span>
            </div>
            <p className="text-xs text-[#c3c6d7] leading-relaxed mt-1 max-w-3xl">
              <span className="font-bold text-[#dde2f8]">What this shows: </span>
              How multiple clues connect to the same cyber gang. Two victims in Jaipur and Kota were scammed by the same fake website. Their money went to the same dummy account, controlled by one suspect phone and hosted on a German hacker server.
            </p>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleStepClick(1)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2563eb] hover:bg-[#3b82f6] text-white text-xs font-bold transition-all shadow-md"
          >
            <Play className="w-3.5 h-3.5 text-[#ffb77d] fill-current" />
            <span>{storyStep > 0 ? 'Restart Story Walkthrough' : 'Play Crime Story (Step-by-Step)'}</span>
          </button>
        </div>
      </div>

      {/* Step-by-Step Crime Story Bar */}
      <div className="bg-[#191f2f] rounded-2xl p-3 sm:p-4 border border-[#434655]/50 flex flex-col lg:flex-row lg:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#ffb77d] shrink-0" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#dde2f8]">
            Click Any Step to Understand What Happened:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {STORY_STEPS.map((s) => (
            <button
              key={s.step}
              onClick={() => handleStepClick(s.step)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                storyStep === s.step
                  ? 'bg-[#2563eb] text-white shadow-md border border-[#b4c5ff]'
                  : 'bg-[#080e1d] text-[#c3c6d7] hover:bg-[#242a3a] border border-[#434655]/40'
              }`}
            >
              <span>{s.title}</span>
            </button>
          ))}
          {storyStep > 0 && (
            <button
              onClick={() => setStoryStep(0)}
              className="px-2.5 py-1.5 rounded-xl bg-[#242a3a] text-[#8d90a0] hover:text-white text-xs font-bold"
              title="Clear Story Mode"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Active Story Step Synopsis Banner (when story mode active) */}
      {storyStep > 0 && (
        <div className="p-3.5 rounded-xl bg-[#080e1d] border border-[#2563eb]/60 text-xs text-[#dde2f8] flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffb77d] animate-ping"></span>
            <span className="font-bold text-[#b4c5ff]">
              {STORY_STEPS[storyStep - 1].title}:
            </span>
            <span className="text-[#c3c6d7]">
              {STORY_STEPS[storyStep - 1].summary}
            </span>
          </div>
          <button
            onClick={() => {
              if (storyStep < 5) handleStepClick(storyStep + 1);
              else setStoryStep(0);
            }}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#ffb77d] hover:underline shrink-0 ml-3"
          >
            <span>{storyStep < 5 ? 'Next Step →' : 'Done'}</span>
          </button>
        </div>
      )}

      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-[#080e1d] border border-emerald-500/50 text-xs text-emerald-400 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">{actionSuccess}</span>
          </div>
          <button
            onClick={() => navigate('/reports')}
            className="text-xs font-bold text-[#ffb77d] hover:underline"
          >
            View in Registry →
          </button>
        </div>
      )}

      {/* Filter Chips & Inspector Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-1 border-b border-[#434655]/40">
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#151b2b] rounded-xl p-1 border border-[#434655]/50 text-xs font-semibold">
            <button
              onClick={() => { setFilter('ALL'); setStoryStep(0); }}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filter === 'ALL' ? 'bg-[#2563eb] text-white shadow-sm' : 'text-[#c3c6d7] hover:text-white'
              }`}
            >
              All Connections (7 Nodes, 7 Links)
            </button>
            <button
              onClick={() => { setFilter('FINANCIAL'); setStoryStep(0); }}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filter === 'FINANCIAL' ? 'bg-[#2563eb] text-white shadow-sm' : 'text-[#c3c6d7] hover:text-white'
              }`}
            >
              Bank Money Trail (Mules & FIRs)
            </button>
            <button
              onClick={() => { setFilter('INFRA'); setStoryStep(0); }}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filter === 'INFRA' ? 'bg-[#2563eb] text-white shadow-sm' : 'text-[#c3c6d7] hover:text-white'
              }`}
            >
              Cyber Infrastructure (Domains & Servers)
            </button>
          </div>
        </div>

        <button
          onClick={() => setShowDrawer(!showDrawer)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#191f2f] text-[#dde2f8] hover:bg-[#242a3a] text-xs font-bold border border-[#434655]/50 transition-colors shadow-sm"
        >
          <Dock className="w-3.5 h-3.5 text-[#ffb77d]" />
          <span>{showDrawer ? 'Hide Evidence Panel' : 'Show Evidence Panel'}</span>
        </button>
      </div>

      {/* Main Workspace: Graph Canvas + Right Slide-out Drawer */}
      <div className="relative flex w-full h-[620px] rounded-2xl overflow-hidden bg-[#080e1d] border border-[#434655]/60 shadow-2xl">
        {/* Interactive Graph Canvas */}
        <div className="relative flex-1 h-full overflow-hidden select-none">
          {/* Grid Background */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern height="36" id="cyber-grid" patternUnits="userSpaceOnUse" width="36">
                <path d="M 36 0 L 0 0 0 36" fill="none" stroke="#434655" strokeWidth="0.75"></path>
              </pattern>
            </defs>
            <rect fill="url(#cyber-grid)" height="100%" width="100%"></rect>
          </svg>

          {/* Transformable Graph Stage */}
          <div
            className="relative w-full h-full origin-center transition-transform duration-200 ease-out"
            style={{ transform: `scale(${zoom})` }}
          >
            {/* SVG Relationship Edges with Laser-Flow Dashes */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="xMidYMid meet" viewBox="0 0 1000 700">
              <defs>
                <marker id="arrow-blue" markerHeight="6" markerWidth="6" orient="auto-start-reverse" refX="8" refY="5" viewBox="0 0 10 10">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#2563eb"></path>
                </marker>
                <marker id="arrow-gold" markerHeight="6" markerWidth="6" orient="auto-start-reverse" refX="8" refY="5" viewBox="0 0 10 10">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#d97707"></path>
                </marker>
                <marker id="arrow-red" markerHeight="6" markerWidth="6" orient="auto-start-reverse" refX="8" refY="5" viewBox="0 0 10 10">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#cf2c30"></path>
                </marker>
                <marker id="arrow-purple" markerHeight="6" markerWidth="6" orient="auto-start-reverse" refX="8" refY="5" viewBox="0 0 10 10">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#8b5cf6"></path>
                </marker>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Edge 1: Case JPR-014 -> Bank Primary Mule */}
              {filter !== 'INFRA' && (
                <g opacity={isEdgeHighlighted('case-jpr', 'bank-primary') ? 1 : 0.25} className="transition-opacity duration-300">
                  <line
                    x1="200" y1="210" x2="440" y2="210"
                    stroke="#2563eb" strokeWidth={isEdgeHighlighted('case-jpr', 'bank-primary') ? 3.5 : 2}
                    strokeDasharray="6 4"
                    className="animate-flow-dash"
                    markerEnd="url(#arrow-blue)"
                  />
                  <rect fill="#151b2b" height="20" rx="4" width="120" x="260" y="196" stroke="#2563eb" strokeWidth="1" />
                  <text fill="#b4c5ff" fontFamily="sans-serif" fontSize="10" fontWeight="bold" textAnchor="middle" x="320" y="210">
                    ₹18.4L STOLEN
                  </text>
                </g>
              )}

              {/* Edge 2: Case KOT-008 -> Bank Primary Mule */}
              {filter !== 'INFRA' && (
                <g opacity={isEdgeHighlighted('case-kot', 'bank-primary') ? 1 : 0.25} className="transition-opacity duration-300">
                  <line
                    x1="200" y1="430" x2="440" y2="240"
                    stroke="#2563eb" strokeWidth={isEdgeHighlighted('case-kot', 'bank-primary') ? 3.5 : 2}
                    strokeDasharray="6 4"
                    className="animate-flow-dash"
                    markerEnd="url(#arrow-blue)"
                  />
                  <rect fill="#151b2b" height="20" rx="4" width="114" x="260" y="325" stroke="#2563eb" strokeWidth="1" />
                  <text fill="#b4c5ff" fontFamily="sans-serif" fontSize="10" fontWeight="bold" textAnchor="middle" x="317" y="339">
                    ₹4.25L STOLEN
                  </text>
                </g>
              )}

              {/* Edge 3: Bank Primary Mule -> Bank Secondary Layering */}
              {filter !== 'INFRA' && (
                <g opacity={isEdgeHighlighted('bank-primary', 'bank-secondary') ? 1 : 0.25} className="transition-opacity duration-300">
                  <line
                    x1="490" y1="210" x2="700" y2="160"
                    stroke="#d97707" strokeWidth={isEdgeHighlighted('bank-primary', 'bank-secondary') ? 4 : 2.5}
                    strokeDasharray="8 4"
                    className="animate-flow-dash"
                    markerEnd="url(#arrow-gold)"
                  />
                  <rect fill="#151b2b" height="20" rx="4" width="134" x="530" y="165" stroke="#d97707" strokeWidth="1" />
                  <text fill="#ffb77d" fontFamily="sans-serif" fontSize="10" fontWeight="bold" textAnchor="middle" x="597" y="179">
                    LAYERED (12 MINS)
                  </text>
                </g>
              )}

              {/* Edge 4: Bank Primary Mule -> Suspect Phone */}
              {filter === 'ALL' && (
                <g opacity={isEdgeHighlighted('bank-primary', 'phone-suspect') ? 1 : 0.25} className="transition-opacity duration-300">
                  <line
                    x1="465" y1="250" x2="465" y2="420"
                    stroke="#06b6d4" strokeWidth={isEdgeHighlighted('bank-primary', 'phone-suspect') ? 3 : 2}
                    strokeDasharray="5 4"
                    className="animate-flow-dash"
                  />
                  <rect fill="#151b2b" height="20" rx="4" width="110" x="410" y="325" stroke="#06b6d4" strokeWidth="1" />
                  <text fill="#67e8f9" fontFamily="sans-serif" fontSize="10" fontWeight="bold" textAnchor="middle" x="465" y="339">
                    KYC MOBILE LINK
                  </text>
                </g>
              )}

              {/* Edge 5: Suspect Phone -> Phishing Scam Domain */}
              {filter !== 'FINANCIAL' && (
                <g opacity={isEdgeHighlighted('phone-suspect', 'domain-phish') ? 1 : 0.25} className="transition-opacity duration-300">
                  <line
                    x1="500" y1="450" x2="700" y2="400"
                    stroke="#cf2c30" strokeWidth={isEdgeHighlighted('phone-suspect', 'domain-phish') ? 3.5 : 2}
                    strokeDasharray="6 4"
                    className="animate-flow-dash"
                    markerEnd="url(#arrow-red)"
                  />
                  <rect fill="#151b2b" height="20" rx="4" width="116" x="540" y="410" stroke="#cf2c30" strokeWidth="1" />
                  <text fill="#ffb3ad" fontFamily="sans-serif" fontSize="10" fontWeight="bold" textAnchor="middle" x="598" y="424">
                    ADMIN CREATED
                  </text>
                </g>
              )}

              {/* Edge 6: Phishing Scam Domain -> Offshore Hacker C2 Server */}
              {filter !== 'FINANCIAL' && (
                <g opacity={isEdgeHighlighted('domain-phish', 'ip-c2') ? 1 : 0.25} className="transition-opacity duration-300">
                  <line
                    x1="760" y1="395" x2="865" y2="520"
                    stroke="#8b5cf6" strokeWidth={isEdgeHighlighted('domain-phish', 'ip-c2') ? 3.5 : 2}
                    strokeDasharray="6 4"
                    className="animate-flow-dash"
                    markerEnd="url(#arrow-purple)"
                  />
                  <rect fill="#151b2b" height="20" rx="4" width="114" x="755" y="445" stroke="#8b5cf6" strokeWidth="1" />
                  <text fill="#c4b5fd" fontFamily="sans-serif" fontSize="10" fontWeight="bold" textAnchor="middle" x="812" y="459">
                    HOSTED ON C2
                  </text>
                </g>
              )}

              {/* Edge 7: Layering Bank -> C2 IP */}
              {filter !== 'FINANCIAL' && (
                <g opacity={isEdgeHighlighted('bank-secondary', 'ip-c2') ? 1 : 0.25} className="transition-opacity duration-300">
                  <line
                    x1="740" y1="190" x2="880" y2="510"
                    stroke="#8d90a0" strokeDasharray="4 4" strokeWidth="1.5"
                    className="animate-flow-dash-reverse"
                  />
                  <rect fill="#151b2b" height="20" rx="4" width="120" x="760" y="300" stroke="#434655" strokeWidth="1" />
                  <text fill="#c3c6d7" fontFamily="sans-serif" fontSize="9" fontWeight="bold" textAnchor="middle" x="820" y="314">
                    OTP CALLBACK API
                  </text>
                </g>
              )}
            </svg>

            {/* Nodes Rendered on Stage */}
            {/* 1. Case Jaipur */}
            {filter !== 'INFRA' && (
              <button
                onClick={() => setSelectedNodeKey('case-jpr')}
                className={`absolute left-[15%] top-[24%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 group focus:outline-none transition-all ${
                  isNodeHighlighted('case-jpr') ? 'scale-110 z-30' : 'opacity-70 scale-95 z-10'
                }`}
              >
                <div className="relative">
                  {selectedNodeKey === 'case-jpr' && (
                    <div className="absolute -inset-2 rounded-2xl bg-[#2563eb]/40 animate-ping pointer-events-none" />
                  )}
                  <div className="w-13 h-13 rounded-2xl bg-[#2563eb] text-white flex items-center justify-center shadow-xl border-2 border-white/20 group-hover:scale-105 transition-transform p-3">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-xl bg-[#151b2b] text-[#dde2f8] font-bold text-[11px] border border-[#2563eb]/60 shadow-lg whitespace-nowrap">
                  FIR: Jaipur Cyber PS
                  <span className="block text-[9px] text-[#ffb77d] font-mono">₹18.4L Loss</span>
                </div>
              </button>
            )}

            {/* 2. Case Kota */}
            {filter !== 'INFRA' && (
              <button
                onClick={() => setSelectedNodeKey('case-kot')}
                className={`absolute left-[15%] top-[56%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 group focus:outline-none transition-all ${
                  isNodeHighlighted('case-kot') ? 'scale-110 z-30' : 'opacity-70 scale-95 z-10'
                }`}
              >
                <div className="relative">
                  {selectedNodeKey === 'case-kot' && (
                    <div className="absolute -inset-2 rounded-2xl bg-[#2563eb]/40 animate-ping pointer-events-none" />
                  )}
                  <div className="w-13 h-13 rounded-2xl bg-[#2563eb] text-white flex items-center justify-center shadow-xl border-2 border-white/20 group-hover:scale-105 transition-transform p-3">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-xl bg-[#151b2b] text-[#dde2f8] font-bold text-[11px] border border-[#2563eb]/60 shadow-lg whitespace-nowrap">
                  FIR: Kota Cyber PS
                  <span className="block text-[9px] text-[#ffb77d] font-mono">₹4.25L Loss</span>
                </div>
              </button>
            )}

            {/* 3. Primary Mule Account (HDFC) */}
            {filter !== 'INFRA' && (
              <button
                onClick={() => setSelectedNodeKey('bank-primary')}
                className={`absolute left-[46%] top-[29%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 group focus:outline-none transition-all ${
                  isNodeHighlighted('bank-primary') ? 'scale-115 z-40' : 'opacity-70 scale-95 z-10'
                }`}
              >
                <div className="relative">
                  {selectedNodeKey === 'bank-primary' && (
                    <div className="absolute -inset-3 rounded-2xl bg-[#d97707]/40 animate-pulse-halo pointer-events-none" />
                  )}
                  <div className="w-15 h-15 rounded-2xl bg-gradient-to-br from-[#d97707] to-[#b45309] text-white flex items-center justify-center shadow-2xl border-2 border-amber-300/60 p-3.5">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="px-3 py-1 rounded-xl bg-[#d97707] text-[#432100] font-bold text-xs shadow-lg whitespace-nowrap">
                  HDFC Bank ••4829
                  <span className="block text-[9px] text-[#432100] font-mono font-bold">₹14.8L Frozen by Police</span>
                </div>
              </button>
            )}

            {/* 4. Layering Account (ICICI) */}
            {filter !== 'INFRA' && (
              <button
                onClick={() => setSelectedNodeKey('bank-secondary')}
                className={`absolute left-[73%] top-[22%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 group focus:outline-none transition-all ${
                  isNodeHighlighted('bank-secondary') ? 'scale-110 z-30' : 'opacity-70 scale-95 z-10'
                }`}
              >
                <div className="relative">
                  {selectedNodeKey === 'bank-secondary' && (
                    <div className="absolute -inset-2 rounded-2xl bg-[#d97707]/40 animate-ping pointer-events-none" />
                  )}
                  <div className="w-12 h-12 rounded-2xl bg-[#191f2f] text-[#ffb77d] flex items-center justify-center shadow-xl border-2 border-[#d97707]/60 group-hover:scale-105 transition-transform p-3">
                    <Building2 className="w-6 h-6" />
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-xl bg-[#151b2b] text-[#ffb77d] font-bold text-[11px] border border-[#d97707]/40 shadow-lg whitespace-nowrap">
                  ICICI Bank ••9104
                  <span className="block text-[9px] text-[#8d90a0] font-mono">Layering Account</span>
                </div>
              </button>
            )}

            {/* 5. Suspect Phone */}
            {filter === 'ALL' && (
              <button
                onClick={() => setSelectedNodeKey('phone-suspect')}
                className={`absolute left-[46%] top-[62%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 group focus:outline-none transition-all ${
                  isNodeHighlighted('phone-suspect') ? 'scale-110 z-30' : 'opacity-70 scale-95 z-10'
                }`}
              >
                <div className="relative">
                  {selectedNodeKey === 'phone-suspect' && (
                    <div className="absolute -inset-2 rounded-2xl bg-[#06b6d4]/40 animate-ping pointer-events-none" />
                  )}
                  <div className="w-12 h-12 rounded-full bg-[#191f2f] text-[#67e8f9] flex items-center justify-center shadow-xl border-2 border-[#06b6d4]/60 group-hover:scale-105 transition-transform p-3">
                    <Smartphone className="w-6 h-6" />
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-xl bg-[#151b2b] text-[#67e8f9] font-bold text-[11px] border border-[#06b6d4]/40 shadow-lg whitespace-nowrap">
                  +91 98290-••412
                  <span className="block text-[9px] text-[#8d90a0] font-mono">Scammer Telecom SIM</span>
                </div>
              </button>
            )}

            {/* 6. Phishing Domain */}
            {filter !== 'FINANCIAL' && (
              <button
                onClick={() => setSelectedNodeKey('domain-phish')}
                className={`absolute left-[73%] top-[54%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 group focus:outline-none transition-all ${
                  isNodeHighlighted('domain-phish') ? 'scale-110 z-30' : 'opacity-70 scale-95 z-10'
                }`}
              >
                <div className="relative">
                  {selectedNodeKey === 'domain-phish' && (
                    <div className="absolute -inset-2 rounded-2xl bg-[#cf2c30]/40 animate-ping pointer-events-none" />
                  )}
                  <div className="w-13 h-13 rounded-2xl bg-[#cf2c30] text-white flex items-center justify-center shadow-xl border-2 border-white/20 group-hover:scale-105 transition-transform p-3">
                    <Globe className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-xl bg-[#151b2b] text-[#ffb3ad] font-bold text-[11px] border border-[#cf2c30]/60 shadow-lg whitespace-nowrap">
                  kyc-sbi-update.in
                  <span className="block text-[9px] text-[#cf2c30] font-mono font-bold">Fake Scam Website</span>
                </div>
              </button>
            )}

            {/* 7. Offshore C2 Server IP */}
            {filter !== 'FINANCIAL' && (
              <button
                onClick={() => setSelectedNodeKey('ip-c2')}
                className={`absolute left-[88%] top-[74%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 group focus:outline-none transition-all ${
                  isNodeHighlighted('ip-c2') ? 'scale-110 z-30' : 'opacity-70 scale-95 z-10'
                }`}
              >
                <div className="relative">
                  {selectedNodeKey === 'ip-c2' && (
                    <div className="absolute -inset-2 rounded-2xl bg-[#8b5cf6]/40 animate-ping pointer-events-none" />
                  )}
                  <div className="w-13 h-13 rounded-2xl bg-[#191f2f] text-[#c4b5fd] flex items-center justify-center shadow-xl border-2 border-[#8b5cf6]/60 group-hover:scale-105 transition-transform p-3">
                    <Server className="w-7 h-7" />
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-xl bg-[#151b2b] text-[#c4b5fd] font-bold text-[11px] border border-[#8b5cf6]/40 shadow-lg whitespace-nowrap">
                  185.220.101.44
                  <span className="block text-[9px] text-[#8d90a0] font-mono">Frankfurt Hacker Server</span>
                </div>
              </button>
            )}
          </div>

          {/* Bottom-Left Legend Overlay */}
          <div className="absolute bottom-4 left-4 bg-[#151b2b]/95 backdrop-blur-md rounded-2xl p-3.5 border border-[#434655]/50 shadow-2xl">
            <div className="text-[10px] font-bold text-[#8d90a0] uppercase mb-2 tracking-wider">
              CRIME ENTITY GUIDE
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-[#2563eb]"></span>
                <span className="text-[11px] text-[#dde2f8] font-medium">Police FIR</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-[#d97707]"></span>
                <span className="text-[11px] text-[#dde2f8] font-medium">Dummy Bank Mule</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#06b6d4]"></span>
                <span className="text-[11px] text-[#dde2f8] font-medium">Scammer SIM</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-[#cf2c30]"></span>
                <span className="text-[11px] text-[#dde2f8] font-medium">Fake Website</span>
              </div>
              <div className="flex items-center gap-2 col-span-2">
                <span className="w-3 h-3 rounded-md bg-[#8b5cf6]"></span>
                <span className="text-[11px] text-[#dde2f8] font-medium">Hacker C2 Server (Frankfurt)</span>
              </div>
            </div>
          </div>

          {/* Bottom-Right Zoom & View Controls */}
          <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-[#151b2b]/95 backdrop-blur-md rounded-2xl p-1.5 border border-[#434655]/50 shadow-2xl font-mono text-xs">
            <button
              onClick={() => handleZoom(0.15)}
              className="p-1.5 rounded-lg text-[#c3c6d7] hover:bg-[#242a3a] hover:text-white"
              title="Zoom In"
            >
              <Plus className="w-4 h-4" />
            </button>
            <span className="px-2 text-xs font-bold text-[#dde2f8]">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => handleZoom(-0.15)}
              className="p-1.5 rounded-lg text-[#c3c6d7] hover:bg-[#242a3a] hover:text-white"
              title="Zoom Out"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg text-[#c3c6d7] hover:bg-[#242a3a] hover:text-white"
              title="Reset View"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Slide-out Evidence Inspection Drawer */}
        {showDrawer && (
          <aside className="w-88 sm:w-96 shrink-0 bg-[#151b2b] h-full border-l border-[#434655]/50 flex flex-col justify-between p-5 overflow-y-auto shadow-2xl">
            <div className="space-y-4">
              {/* Drawer Header */}
              <div className="flex items-start justify-between gap-2 border-b border-[#434655]/40 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-[#ffb77d] uppercase tracking-wider block">
                    {activeNode.role}
                  </span>
                  <h2 className="text-base font-bold text-[#dde2f8] mt-0.5">
                    {activeNode.title}
                  </h2>
                </div>
                <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${activeNode.badgeClass}`}>
                  {activeNode.badge}
                </span>
              </div>

              {/* Plain English What is this? Box */}
              <div className="p-3.5 rounded-xl bg-[#080e1d] border border-[#434655]/40 space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#8d90a0] block">
                  What This Means For Police:
                </span>
                <p className="text-xs text-[#c3c6d7] leading-relaxed">
                  {activeNode.plainExplainer}
                </p>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 gap-2.5">
                <div className="bg-[#191f2f] rounded-xl p-3 border border-[#434655]/40">
                  <div className="text-[10px] font-bold text-[#8d90a0] uppercase">
                    Financial Exposure / Log Volume
                  </div>
                  <div className="text-lg font-bold font-mono text-[#ffb77d] mt-0.5">
                    {activeNode.balance}
                  </div>
                </div>

                <div className="bg-[#191f2f] rounded-xl p-3 border border-[#434655]/40">
                  <div className="text-[10px] font-bold text-[#8d90a0] uppercase">
                    Forensic Classification
                  </div>
                  <div className="text-xs font-semibold text-[#dde2f8] mt-0.5">
                    {activeNode.kyc}
                  </div>
                </div>
              </div>

              {/* Connected Complaints */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold uppercase text-[#8d90a0]">
                  Linked Police FIRs:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeNode.complaints.map((c) => (
                    <span key={c} className="px-2.5 py-1 rounded-lg bg-[#080e1d] text-[#b4c5ff] font-mono text-xs font-bold border border-[#434655]/50">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* How it connects */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold uppercase text-[#8d90a0]">
                  Connected Network Nodes:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeNode.connectedTo.map((nodeKey) => {
                    const target = NODE_DATA[nodeKey];
                    if (!target) return null;
                    return (
                      <button
                        key={nodeKey}
                        onClick={() => setSelectedNodeKey(nodeKey)}
                        className="px-2.5 py-1 rounded-lg bg-[#242a3a] hover:bg-[#2563eb] text-[#dde2f8] hover:text-white text-xs font-semibold border border-[#434655]/50 transition-colors flex items-center gap-1"
                      >
                        <span>{target.title}</span>
                        <ArrowRight className="w-3 h-3 text-[#ffb77d]" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-[#434655]/40 space-y-2 mt-4">
              <button
                type="button"
                onClick={handleAction}
                className="w-full py-2.5 px-4 rounded-xl bg-[#2563eb] hover:bg-[#3b82f6] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <Gavel className="w-4 h-4 text-[#ffb77d]" />
                <span>{activeNode.policeAction}</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/reports')}
                className="w-full py-2 px-3 rounded-xl bg-[#191f2f] hover:bg-[#242a3a] text-[#dde2f8] text-xs font-semibold flex items-center justify-center gap-2 border border-[#434655]/50 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[#b4c5ff]" />
                <span>View Full Case File (PDF)</span>
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  GitFork,
  Fingerprint,
  Building2,
  FileSpreadsheet,
  Network,
  MessageSquare,
  FileText,
  Clock,
  Globe2,
  ArrowRight,
  Shield,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';

export const FeaturesGuideModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('money-trail');

  if (!isOpen) return null;

  const features = [
    {
      id: 'money-trail',
      title: '1. Follow Stolen Money (UTR)',
      badge: 'Core Feature',
      icon: GitFork,
      color: 'text-[#b4c5ff]',
      bgColor: 'bg-[#2563eb]/20',
      borderColor: 'border-[#2563eb]/40',
      path: '/money-trail',
      tagline: 'Trace funds hop-by-hop from the victim to the cash withdrawal in 35 minutes.',
      problem:
        'When a victim loses money, scammers bounce the funds through 4 or 5 different bank accounts in less than 30 minutes, finally withdrawing cash at an ATM before police can react.',
      solution:
        'Enter the 12-digit bank UTR reference number from the victim\'s transaction. CyberSutra instantly maps the 5-hop cascade (Victim → Primary Mule → Layering Mule → Regional Mule → ATM Withdrawal) and shows where the money is right now.',
      policeBenefit:
        'Identifies the exact branch and ATM location (e.g. Alwar ATM cluster) and lets the officer generate a 1-click Section 102 CrPC bank freeze order before cash is pulled out.',
      buttonText: 'Open Money Trail Explorer'
    },
    {
      id: 'fraud-dna',
      title: '2. Gang Fingerprint (Fraud DNA)',
      badge: 'Secret Weapon',
      icon: Fingerprint,
      color: 'text-[#ffb77d]',
      bgColor: 'bg-[#d97707]/20',
      borderColor: 'border-[#d97707]/40',
      path: '/fraud-dna',
      tagline: 'Automatically link separate victim complaints across Rajasthan to one single cyber gang.',
      problem:
        'Victims file complaints in different districts (Jaipur, Jodhpur, Kota). To individual police stations, they look like isolated scams, so the mastermind stays hidden.',
      solution:
        'The Fraud Network DNA engine analyzes digital signatures across complaints. It matches same offshore hosting (Seychelles/AS48031), same DNS server, identical ₹49,000 transfer smurfing, and matching UPI handles (pay.secure*@axis).',
      policeBenefit:
        'Generates Syndicate Profile FNA-2026-001 with 96% match confidence, linking 4 separate FIRs into one coordinated state-level syndicate operation.',
      buttonText: 'View Gang DNA Profile'
    },
    {
      id: 'mule-detection',
      title: '3. Mule Account Detector',
      badge: 'AI Screening',
      icon: Building2,
      color: 'text-[#ffb3ad]',
      bgColor: 'bg-[#cf2c30]/20',
      borderColor: 'border-[#cf2c30]/40',
      path: '/mule-detection',
      tagline: 'Spot rented dummy bank accounts used by criminals to launder stolen money.',
      problem:
        'Scammers never use their own bank accounts. They rent accounts from innocent villagers or students, receive lakhs of rupees, and transfer 95% out within minutes.',
      solution:
        'CyberSutra scans bank accounts for zero-retention behavior: accounts receiving multiple victim credits and immediately draining the balance within 2 to 15 minutes, or splitting transactions into ₹49,000 chunks to avoid bank compliance alarms.',
      policeBenefit:
        'Flags dangerous accounts with a Risk Score (e.g. 94/100) and enables 1-click legal freeze requisitions under Section 91/102 Cr.P.C. to freeze the account instantly.',
      buttonText: 'Scan Mule Accounts'
    },
    {
      id: 'statements',
      title: '4. Bank Statement Reader',
      badge: 'Time Saver',
      icon: FileSpreadsheet,
      color: 'text-[#b4c5ff]',
      bgColor: 'bg-[#2563eb]/20',
      borderColor: 'border-[#2563eb]/40',
      path: '/statements',
      tagline: 'Drop any bank PDF or Excel statement — auto-read and organize in 2 seconds.',
      problem:
        'Police officers receive 50-to-200-page bank statements in messy formats from SBI, HDFC, ICICI, or Paytm. Manually reading each page to find who got the money takes days.',
      solution:
        'Upload any statement (.csv, .xlsx, or .pdf). CyberSutra auto-detects the bank, standardizes dates, amounts, sender/receiver names, and extracts all 12-digit UTR numbers automatically.',
      policeBenefit:
        'Turns 2 days of manual clerical work into 2 seconds, immediately highlighting which transactions are suspicious and sending them to the money trail tracer.',
      buttonText: 'Try Statement Reader'
    },
    {
      id: 'copilot',
      title: '5. AI Police Copilot',
      badge: 'Interactive Assistant',
      icon: MessageSquare,
      color: 'text-[#dde2f8]',
      bgColor: 'bg-[#191f2f]',
      borderColor: 'border-[#434655]/60',
      path: '/copilot',
      tagline: 'Ask questions in plain English and get instant, evidence-backed answers.',
      problem:
        'Investigating officers have to comb through multiple FIRs, bank tables, and digital logs to answer basic questions like "Where did the ₹2.5 lakh go?" or "Who owns this UPI ID?".',
      solution:
        'The AI Copilot reads all case evidence and answers in simple words with verifiable evidence citations, confidence ratings (e.g. 95%), and suggested next police actions.',
      policeBenefit:
        'Officers can type "What connects Case 2026-0041 to Case 2026-0089?" and get an instant summary showing the shared hosting IP and matching mule account.',
      buttonText: 'Ask AI Copilot'
    },
    {
      id: 'evidence-graph',
      title: '6. Crime Connection Map',
      badge: 'Visual Network',
      icon: Network,
      color: 'text-[#b4c5ff]',
      bgColor: 'bg-[#2563eb]/20',
      borderColor: 'border-[#2563eb]/40',
      path: '/evidence-graph',
      tagline: 'Interactive visual diagram linking phones, bank accounts, fake URLs, and servers.',
      problem:
        'Financial crimes involve multiple moving parts: a phishing SMS, a fake website, a UPI handle, 3 bank accounts, and an ATM. Explaining these connections in court or to senior officers is hard.',
      solution:
        'CyberSutra renders an interactive SVG web connecting every entity with relationship lines (TRANSFERRED_TO, LINKED_KYC, HOSTED_ON, OPERATES).',
      policeBenefit:
        'Officers can click on any node to view account balances, phone numbers, or trigger immediate statutory freeze orders.',
      buttonText: 'Explore Crime Map'
    },
    {
      id: 'reports',
      title: '7. 1-Click Freeze Notices & PDF Reports',
      badge: 'Legal Tool',
      icon: FileText,
      color: 'text-[#ffb77d]',
      bgColor: 'bg-[#d97707]/20',
      borderColor: 'border-[#d97707]/40',
      path: '/reports',
      tagline: 'Generate official Section 102 / Section 91 CrPC freeze orders and court dossiers in 1 click.',
      problem:
        'Drafting formal legal notices to bank nodal officers requires specific legal language under Section 102 Cr.P.C. or Section 94 BNSS. Delays in drafting mean scammers withdraw all cash.',
      solution:
        'With 1 click, the system drafts an official statutory freeze notice pre-filled with the exact account number, IFSC, UTR trail, and investigating officer details, ready to email to the bank.',
      policeBenefit:
        'Also generates a comprehensive Forensic Investigation Dossier PDF with Rajasthan Police branding, ready to submit to court.',
      buttonText: 'Generate Legal Notices'
    }
  ];

  const currentFeature = features.find((f) => f.id === activeTab) || features[0];
  const Icon = currentFeature.icon;

  const handleNavigate = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-4xl bg-[#151b2b] border border-[#434655] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-[#0d1322] border-b border-[#434655]/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2563eb] flex items-center justify-center text-white shadow-md">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-[#dde2f8]">
                  How CyberSutra AI Works
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#ffb77d]/20 text-[#ffb77d] border border-[#ffb77d]/30">
                  PS05 Quick Guide
                </span>
              </div>
              <p className="text-xs text-[#c3c6d7]">
                Simple explanation of every tool for normal people, evaluators, and police officers.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#c3c6d7] hover:text-[#dde2f8] hover:bg-[#242a3a] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Left Feature Tabs + Right Details */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-0">
          {/* Left Column: Feature Navigation Tabs */}
          <div className="md:col-span-5 bg-[#0d1322]/60 border-r border-[#434655]/40 overflow-y-auto p-3 space-y-1.5">
            <div className="text-[10px] uppercase font-bold text-[#8d90a0] px-2 mb-2 tracking-wider">
              Select A Feature to Learn More:
            </div>
            {features.map((item) => {
              const ItemIcon = item.icon;
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 border ${
                    isSelected
                      ? 'bg-[#191f2f] border-[#2563eb] shadow-sm'
                      : 'border-transparent hover:bg-[#191f2f]/60 hover:border-[#434655]/40 text-[#c3c6d7]'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg ${item.bgColor} flex items-center justify-center shrink-0 mt-0.5`}
                  >
                    <ItemIcon className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-xs font-semibold truncate ${isSelected ? 'text-[#dde2f8]' : 'text-[#c3c6d7]'}`}>
                        {item.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8d90a0] line-clamp-1 mt-0.5">
                      {item.tagline}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Detailed Explanation of Selected Feature */}
          <div className="md:col-span-7 bg-[#151b2b] p-5 sm:p-6 overflow-y-auto flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              {/* Feature Header Card */}
              <div className={`p-4 rounded-xl ${currentFeature.bgColor} border ${currentFeature.borderColor}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-5 h-5 ${currentFeature.color}`} />
                    <h3 className="text-sm font-bold text-[#dde2f8]">
                      {currentFeature.title}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#080e1d] text-[#b4c5ff]">
                    {currentFeature.badge}
                  </span>
                </div>
                <p className="text-xs text-[#dde2f8] font-medium leading-relaxed">
                  {currentFeature.tagline}
                </p>
              </div>

              {/* The Problem & Solution Breakdown */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-[#080e1d] border border-[#434655]/40 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#cf2c30]">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>The Real Problem in Cybercrime:</span>
                  </div>
                  <p className="text-xs text-[#c3c6d7] leading-relaxed pl-6">
                    {currentFeature.problem}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#080e1d] border border-[#434655]/40 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#2563eb]">
                    <Lightbulb className="w-4 h-4 text-[#b4c5ff] shrink-0" />
                    <span>How CyberSutra Solves It:</span>
                  </div>
                  <p className="text-xs text-[#dde2f8] leading-relaxed pl-6">
                    {currentFeature.solution}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#191f2f] border border-[#434655]/40 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#ffb77d]">
                    <CheckCircle2 className="w-4 h-4 text-[#ffb77d] shrink-0" />
                    <span>Why Police Officers & Courts Love This:</span>
                  </div>
                  <p className="text-xs text-[#c3c6d7] leading-relaxed pl-6">
                    {currentFeature.policeBenefit}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-[#434655]/40 flex items-center justify-between gap-3">
              <span className="text-[11px] text-[#8d90a0]">
                Live on sandbox data • Click below to test
              </span>
              <button
                onClick={() => handleNavigate(currentFeature.path)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-[#3b82f6] text-white text-xs font-bold shadow-md transition-all group"
              >
                <span>{currentFeature.buttonText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

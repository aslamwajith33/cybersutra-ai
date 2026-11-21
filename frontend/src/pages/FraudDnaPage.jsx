import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Fingerprint,
  Shield,
  CheckCircle2,
  Network,
  Scale,
  ArrowRight,
  Server,
  Globe,
  Wallet,
  QrCode,
  AlertTriangle,
  HelpCircle
} from 'lucide-react';
import { getFraudDna, getCases, draftNotice } from '../api/client';

export const FraudDnaPage = () => {
  const navigate = useNavigate();
  const [dnaProfiles, setDnaProfiles] = useState([]);
  const [cases, setCases] = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [loading, setLoading] = useState(true);
  const [noticeSuccess, setNoticeSuccess] = useState(null);

  useEffect(() => {
    loadDna();
  }, [selectedCaseId]);

  const loadDna = async () => {
    try {
      setLoading(true);
      const caseFilter = selectedCaseId ? parseInt(selectedCaseId) : null;
      const [profiles, caseList] = await Promise.all([
        getFraudDna(caseFilter),
        getCases()
      ]);
      setDnaProfiles(profiles);
      setCases(caseList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDraftSyndicateNotice = async (profile) => {
    try {
      setNoticeSuccess(null);
      const caseIdToUse = selectedCaseId ? parseInt(selectedCaseId) : (cases[0]?.id || 1);
      const res = await draftNotice({
        case_id: caseIdToUse,
        notice_type: "SECTION_91_CRPC",
        target_institution: "Consolidated Bank & Payment Aggregator Nodal Officers",
        target_identifier: `${profile.dna_id} Syndicate Cluster (${profile.common_indicators[3]?.value || 'Mule Accounts'})`,
        issuing_officer: "Insp. Vikram Rathore, IO"
      });
      setNoticeSuccess(`Joint Section 91 Cr.P.C. Freeze Order Issued: ${res.notice_number}`);
    } catch (err) {
      alert("Failed to draft syndicate notice.");
    }
  };

  return (
    <div className="flex flex-col w-full gap-4">
      {/* Friendly Explainer: What is Gang Fingerprint (DNA)? */}
      <div className="bg-[#151b2b] p-4 rounded-xl border border-[#434655]/50 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#d97707] text-white flex items-center justify-center shrink-0 mt-0.5">
            <Fingerprint className="w-5 h-5 text-[#eeefff]" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#dde2f8]">
              Gang Fingerprint & Network DNA (Connecting Crimes to the Same Gang)
            </h1>
            <p className="text-xs text-[#c3c6d7] leading-relaxed mt-0.5 max-w-3xl">
              Criminals switch bank accounts and SIM cards constantly. But they keep using the <strong>same web hosting</strong>, <strong>same server DNS</strong>, <strong>same transfer speeds</strong>, and <strong>same UPI name patterns</strong>.
              This system matches those digital clues across police stations in Jaipur, Kota, and Alwar to prove it's the exact same organized syndicate.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-2.5 py-1 rounded bg-[#242a3a] text-xs font-mono text-[#ffb77d] border border-[#434655]/40 font-bold">
            SECRET WEAPON FEATURE
          </span>
        </div>
      </div>

      {noticeSuccess && (
        <div className="p-3 rounded-lg bg-[#065f46]/30 border border-[#10b981]/50 text-xs text-[#10b981] flex items-center justify-between font-mono">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />
            <span className="font-semibold">{noticeSuccess}</span>
          </div>
          <button onClick={() => navigate('/reports')} className="underline font-bold text-[#dde2f8] hover:text-white">
            View Notice in Legal Registry →
          </button>
        </div>
      )}

      {/* Main Gang Profile Card */}
      <div className="bg-[#151b2b] rounded-lg p-5 border border-[#434655]/40 flex flex-col gap-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs font-bold text-[#b4c5ff] bg-[#080e1d] px-3 py-1 rounded border border-[#434655]/40">
              GANG ID: FNA-2026-001
            </span>
            <span className="px-2.5 py-0.5 rounded bg-[#cf2c30]/20 text-[#ffb3ad] font-mono text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5 border border-[#cf2c30]/40">
              <span className="w-2 h-2 rounded-full bg-[#cf2c30]"></span>
              ACTIVE CRIMINAL RING • INTER-DISTRICT ALERT
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/evidence-graph')}
              className="px-3.5 py-1.5 rounded-lg bg-[#2563eb] hover:bg-blue-600 text-[#eeefff] font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              <Network className="w-3.5 h-3.5" />
              <span>See Crime Map</span>
            </button>
            <button
              type="button"
              onClick={() => handleDraftSyndicateNotice(dnaProfiles[0] || { dna_id: 'FNA-2026-001', common_indicators: [] })}
              className="px-3.5 py-1.5 rounded-lg bg-[#d97707] hover:bg-amber-600 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Freeze All Gang Accounts</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-center pt-1 border-t border-[#434655]/30">
          <div className="xl:col-span-8 flex flex-col gap-1.5">
            <div className="text-[10px] uppercase font-bold text-[#c3c6d7] font-mono">
              IDENTIFIED CRIMINAL NETWORK
            </div>
            <h2 className="text-xl font-bold text-[#dde2f8]">
              Mewat-Shekhawati Task & Crypto Laundering Ring
            </h2>
            <p className="text-xs text-[#c3c6d7] leading-relaxed max-w-4xl">
              <strong>How they steal money:</strong> They post fake Telegram "earn money by liking YouTube videos" tasks. When victims send money, the gang splits it into transfers just under ₹50,000 (to bypass bank alerts), forwards it across 3 bank accounts within 12 minutes, and takes cash out at ATMs in Alwar and Nuh.
            </p>
          </div>

          <div className="xl:col-span-4 bg-[#080e1d] rounded-lg p-3.5 border border-[#434655]/40 flex items-center justify-between gap-3">
            <div className="flex flex-col gap-0.5">
              <span className="font-mono text-[10px] uppercase font-bold text-[#c3c6d7]">AI MATCH CONFIDENCE</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono text-[#ffb77d]">96%</span>
                <span className="font-mono text-[10px] text-[#10b981] font-bold">CERTAIN</span>
              </div>
              <span className="text-[11px] text-[#c3c6d7]">Matches 4 common criminal habits</span>
            </div>
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                <circle className="text-[#242a3a]" cx="40" cy="40" fill="none" r="34" stroke="currentColor" strokeWidth="6"></circle>
                <circle className="text-[#d97707]" cx="40" cy="40" fill="none" r="34" stroke="currentColor" strokeDasharray="213.6" strokeDashoffset="8.5" strokeLinecap="round" strokeWidth="6"></circle>
              </svg>
              <Shield className="w-6 h-6 text-[#ffb77d] absolute" />
            </div>
          </div>
        </div>
      </div>

      {/* Visual Sequence of Markers */}
      <div className="bg-[#151b2b] rounded-lg p-4 border border-[#434655]/40 flex flex-col gap-2 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-[#b4c5ff]" />
            <span className="text-xs font-bold uppercase text-[#dde2f8]">
              The 6 Clues That Link These Crimes Together:
            </span>
          </div>
          <span className="font-mono text-[10px] text-[#10b981] font-bold bg-[#080e1d] px-2 py-0.5 rounded border border-[#434655]/40">
            ALL 6 CLUES MATCH
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 bg-[#080e1d] p-3 rounded-lg border border-[#434655]/30 overflow-x-auto text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#242a3a] font-mono text-[#dde2f8]">
            <span className="w-2 h-2 rounded-full bg-[#b4c5ff]"></span>
            <span>1. Same Host (AS204957)</span>
          </div>
          <span className="text-[#8d90a0]">➔</span>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#242a3a] font-mono text-[#dde2f8]">
            <span className="w-2 h-2 rounded-full bg-[#b4c5ff]"></span>
            <span>2. Same DNS Server</span>
          </div>
          <span className="text-[#8d90a0]">➔</span>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#242a3a] font-mono text-[#dde2f8]">
            <span className="w-2 h-2 rounded-full bg-[#ffb77d]"></span>
            <span>3. ₹49K Split Deposits</span>
          </div>
          <span className="text-[#8d90a0]">➔</span>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#242a3a] font-mono text-[#dde2f8]">
            <span className="w-2 h-2 rounded-full bg-[#ffb77d]"></span>
            <span>4. 12-Minute Transfer</span>
          </div>
          <span className="text-[#8d90a0]">➔</span>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#242a3a] font-mono text-[#dde2f8]">
            <span className="w-2 h-2 rounded-full bg-[#b4c5ff]"></span>
            <span>5. Same UPI Formula</span>
          </div>
          <span className="text-[#8d90a0]">➔</span>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#242a3a] font-mono text-[#dde2f8]">
            <span className="w-2 h-2 rounded-full bg-[#cf2c30]"></span>
            <span>6. Alwar ATM Cashout</span>
          </div>
        </div>
      </div>

      {/* The 4 Common Clues Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Clue 1 */}
        <div className="bg-[#191f2f] rounded-lg p-4 border border-[#434655]/40 flex flex-col justify-between gap-2.5 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-xs text-[#dde2f8]">
              Clue 1: Fake Sites Run on Same Offshore Server
            </h3>
            <span className="px-2 py-0.5 rounded bg-[#2563eb]/20 text-[#b4c5ff] font-mono text-[10px] font-bold border border-[#2563eb]/40">
              100% PROVEN
            </span>
          </div>
          <p className="text-xs text-[#c3c6d7]">
            Both fake scam websites in Jaipur and Kota resolve to the exact same bulletproof server in Netherlands (IP: <strong>185.220.101.5</strong>).
          </p>
        </div>

        {/* Clue 2 */}
        <div className="bg-[#191f2f] rounded-lg p-4 border border-[#434655]/40 flex flex-col justify-between gap-2.5 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-xs text-[#dde2f8]">
              Clue 2: Identical Private DNS Settings
            </h3>
            <span className="px-2 py-0.5 rounded bg-[#2563eb]/20 text-[#b4c5ff] font-mono text-[10px] font-bold border border-[#2563eb]/40">
              100% PROVEN
            </span>
          </div>
          <p className="text-xs text-[#c3c6d7]">
            The domains use the exact same private nameserver (<strong>ns1.offshore-dns.net</strong>) configured with fast 300-second IP rotation.
          </p>
        </div>

        {/* Clue 3 */}
        <div className="bg-[#191f2f] rounded-lg p-4 border border-[#434655]/40 flex flex-col justify-between gap-2.5 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-xs text-[#dde2f8]">
              Clue 3: Deposits Intentionally Kept Under ₹50,000
            </h3>
            <span className="px-2 py-0.5 rounded bg-[#d97707]/20 text-[#ffb77d] font-mono text-[10px] font-bold border border-[#d97707]/40">
              TAX EVASION TRICK
            </span>
          </div>
          <p className="text-xs text-[#c3c6d7]">
            Under Indian PMLA law, banks report deposits of ₹50,000+. This gang deliberately breaks payments into <strong>₹49,000 to ₹49,500</strong> to avoid police alerts.
          </p>
        </div>

        {/* Clue 4 */}
        <div className="bg-[#191f2f] rounded-lg p-4 border border-[#434655]/40 flex flex-col justify-between gap-2.5 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-xs text-[#dde2f8]">
              Clue 4: Identical UPI ID Naming Formula
            </h3>
            <span className="px-2 py-0.5 rounded bg-[#d97707]/20 text-[#ffb77d] font-mono text-[10px] font-bold border border-[#d97707]/40">
              FORMULA MATCH
            </span>
          </div>
          <p className="text-xs text-[#c3c6d7]">
            All 14 payment handles use the same computer-generated formula: <code>[name]corp.growth@hdfc</code>.
          </p>
        </div>
      </div>

      {/* Cases Linked */}
      <div className="bg-[#151b2b] rounded-lg p-4 border border-[#434655]/40 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-bold text-[#dde2f8]">4 Separate Police Cases Solved Together by this Fingerprint:</span>
          <div className="flex flex-wrap gap-2 mt-1 font-mono">
            <span className="px-2 py-0.5 rounded bg-[#191f2f] text-[#b4c5ff] border border-[#434655]/40">FIR-2026-JPR-0118 (Jaipur: ₹18.45L)</span>
            <span className="px-2 py-0.5 rounded bg-[#191f2f] text-[#b4c5ff] border border-[#434655]/40">FIR-2026-ALW-0042 (Alwar: ₹12.90L)</span>
            <span className="px-2 py-0.5 rounded bg-[#191f2f] text-[#b4c5ff] border border-[#434655]/40">FIR-2026-SIK-0089 (Sikar: ₹9.40L)</span>
            <span className="px-2 py-0.5 rounded bg-[#191f2f] text-[#b4c5ff] border border-[#434655]/40">FIR-2026-BHR-0019 (Bharatpur: ₹6.15L)</span>
          </div>
        </div>
        <div className="shrink-0 text-right font-mono">
          <div className="text-[10px] text-[#c3c6d7]">TOTAL GANG EXPOSURE</div>
          <div className="text-base font-bold text-[#ffb77d]">₹46.90 Lakh</div>
        </div>
      </div>
    </div>
  );
};

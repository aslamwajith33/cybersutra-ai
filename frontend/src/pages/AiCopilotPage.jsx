import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Send,
  Shield,
  User,
  ArrowRight,
  FileText,
  Building2,
  GitFork,
  CheckCircle2,
  Scale,
  Search,
  MessageSquare,
  HelpCircle
} from 'lucide-react';
import { queryCopilot } from '../api/client';

const SUGGESTED_QUERIES = [
  "Why is Account HDFC-501004928172 suspicious?",
  "Trace where the money went for UTR5010029101",
  "How does Gang FNA-2026-001 operate?",
  "Analyze fake website jvvnl-bijli-update.site",
  "Draft a legal freeze notice for the main mule account"
];

export const AiCopilotPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Namaste Officer. I am your **Cyber Crime Case Assistant**.\n\nI can analyze bank statements, follow UTR money trails, and cross-reference criminal gangs across Rajasthan Police records.\n\nClick any of the questions below or type your inquiry:",
      suggested_actions: [
        { label: "Why is Account HDFC-501004928172 suspicious?", query: "Why is Account HDFC-501004928172 suspicious?" },
        { label: "Trace stolen money for UTR5010029101", query: "Trace where the money went for UTR5010029101" },
        { label: "Explain Gang FNA-2026-001", query: "How does Gang FNA-2026-001 operate?" }
      ]
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (qToSend = null) => {
    const q = (qToSend || inputQuery).trim();
    if (!q || loading) return;

    const userMsg = { sender: 'user', text: q };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await queryCopilot(q);
      const aiMsg = {
        sender: 'ai',
        text: res.answer,
        confidence: res.confidence,
        suggested_actions: res.suggested_actions,
        evidence_sources: res.evidence_sources
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: "An error occurred while scanning police records. Please check backend connection."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (action) => {
    if (action.action === 'draft_notice') {
      navigate('/reports');
    } else if (action.action === 'trace_trail' || action.action === 'view_money_trail') {
      navigate('/money-trail');
    } else if (action.action === 'view_graph') {
      navigate('/evidence-graph');
    } else if (action.action === 'view_dna') {
      navigate('/fraud-dna');
    } else if (action.action === 'view_mules') {
      navigate('/mule-detection');
    } else if (action.action === 'view_domain_intel') {
      navigate('/domain-ip');
    } else if (action.query) {
      handleSend(action.query);
    }
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      {/* Friendly Header */}
      <div className="bg-[#151b2b] p-3.5 rounded-xl border border-[#434655]/50 flex items-center justify-between gap-3 shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-[#2563eb] text-white flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5 text-[#eeefff]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-[#dde2f8]">
                AI Case Assistant (Ask Questions About Any Account or Case)
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40">
                READY
              </span>
            </div>
            <p className="text-xs text-[#c3c6d7]">
              Type in plain English to check bank statements, verify mule accounts, or draft legal freeze notices.
            </p>
          </div>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${
              m.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.sender === 'ai' && (
              <div className="h-8 w-8 rounded-lg bg-[#2563eb] flex items-center justify-center text-white shrink-0 mt-1 font-bold text-xs shadow-sm">
                AI
              </div>
            )}

            <div
              className={`max-w-2xl rounded-xl p-4 text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-[#2563eb] text-white'
                  : 'bg-[#191f2f] border border-[#434655]/40 text-[#dde2f8] shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#434655]/40 text-[10px] font-mono text-[#c3c6d7]">
                <span className="font-bold">{m.sender === 'user' ? 'INVESTIGATING OFFICER' : 'POLICE ASSISTANT'}</span>
                <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              <div className="prose prose-invert max-w-none text-xs whitespace-pre-line leading-relaxed">
                {m.text}
              </div>

              {/* Confidence & Evidence Sources */}
              {m.confidence && (
                <div className="mt-3 pt-2.5 border-t border-[#434655]/40 flex flex-wrap items-center justify-between gap-2 text-[10px] text-[#c3c6d7]">
                  <span className="font-mono text-[#ffb77d] font-bold">Accuracy Confidence: {m.confidence}%</span>
                  {m.evidence_sources && (
                    <span className="text-[#8d90a0]">Verified from: {m.evidence_sources.join(" • ")}</span>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              {m.suggested_actions && m.suggested_actions.length > 0 && (
                <div className="mt-3 pt-2 border-t border-[#434655]/40 flex flex-wrap gap-1.5">
                  {m.suggested_actions.map((act, i) => (
                    <button
                      key={i}
                      onClick={() => handleActionClick(act)}
                      className="px-2.5 py-1 rounded bg-[#151b2b] hover:bg-[#2563eb] hover:text-white text-[#b4c5ff] border border-[#434655]/50 text-[11px] font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <span>{act.label}</span>
                      <ArrowRight className="w-3 h-3 text-[#ffb77d]" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {m.sender === 'user' && (
              <div className="h-8 w-8 rounded-lg bg-[#242a3a] border border-[#434655] flex items-center justify-center text-[#ffb77d] shrink-0 mt-1 font-bold text-xs">
                IO
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 text-xs text-[#c3c6d7]">
            <div className="h-8 w-8 rounded-lg bg-[#2563eb] flex items-center justify-center text-white font-bold text-xs">
              AI
            </div>
            <div className="p-3 rounded-xl bg-[#191f2f] border border-[#434655]/40 text-[#dde2f8] flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#ffb77d] animate-pulse" />
              <span>Scanning bank statements and police records...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="shrink-0 pt-2 border-t border-[#434655]/40">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#c3c6d7] block mb-1.5">
          Try Asking One of These Questions:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTED_QUERIES.map((sq, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(sq)}
              className="px-2.5 py-1 rounded bg-[#191f2f] hover:bg-[#242a3a] text-[#dde2f8] border border-[#434655]/40 text-xs font-medium transition-colors"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="shrink-0 flex items-center gap-2 pt-1"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask anything: e.g. 'Why is this account suspicious?' or 'How do I freeze this bank balance?'"
          className="flex-1 px-4 py-2.5 rounded-lg bg-[#080e1d] border border-[#434655]/60 text-xs text-[#dde2f8] placeholder-[#8d90a0] focus:outline-none focus:border-[#2563eb]"
        />
        <button
          type="submit"
          disabled={loading || !inputQuery.trim()}
          className="px-5 py-2.5 rounded-lg bg-[#2563eb] hover:bg-blue-600 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <span>Ask Assistant</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};

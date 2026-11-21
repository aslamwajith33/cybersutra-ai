import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, User, ArrowRight, Award } from 'lucide-react';
import { login } from '../api/client';

export const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('io_jaipur');
  const [password, setPassword] = useState('demo_password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await login(username, password);
      if (onLoginSuccess) onLoginSuccess(res.user);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.detail || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = () => {
    setUsername('io_jaipur');
    setPassword('demo_password');
    handleSubmit();
  };

  return (
    <div className="min-h-screen bg-[#070b14] flex flex-col justify-center items-center px-4 py-12 relative">
      <div className="w-full max-w-md relative z-10">
        {/* Emblem & Official Police Branding */}
        <div className="text-center mb-7">
          <div className="inline-flex h-16 w-16 rounded-lg bg-gradient-to-br from-amber-600 via-amber-700 to-yellow-800 items-center justify-center shadow-lg text-amber-100 font-bold border border-amber-500/40 mb-3">
            <Shield className="w-8 h-8 text-amber-200" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wider uppercase font-serif">CyberSutra</h1>
          <p className="text-xs text-amber-400 font-semibold tracking-wide uppercase mt-0.5">
            State Cyber Crime Intelligence Portal
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Rajasthan Police • Criminal Investigation Department (CID-CB)
          </p>
        </div>

        {/* Secure Form Card */}
        <div className="p-7 rounded-lg bg-[#0f172a] border border-slate-700 shadow-xl space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Investigator Authentication
              </h2>
              <span className="text-[10px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                SCRB SECURE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Authorized law enforcement personnel credentials required under official secrets protocol.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                Investigator Service ID / Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded bg-[#090e1a] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                Departmental Encryption Key (Password)
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded bg-[#090e1a] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-600"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded bg-red-950/70 border border-red-800 text-xs text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold tracking-wide uppercase transition-colors flex items-center justify-center gap-2"
            >
              {loading ? 'Verifying Credentials...' : 'Authenticate & Enter Portal'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Demo Access for Hackathon Judges */}
          <div className="pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={handleQuickDemo}
              className="w-full py-2 rounded bg-[#090e1a] hover:bg-slate-800 text-amber-300 border border-amber-600/40 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>One-Click Sign In: Insp. Vikram Rathore (IO)</span>
            </button>
            <p className="text-[10px] text-slate-500 text-center mt-2">
              Evaluation sandbox pre-configured with Jaipur, Kota & Jodhpur cases.
            </p>
          </div>
        </div>

        {/* Footer legal disclaimer */}
        <p className="text-[10px] text-slate-500 text-center mt-6">
          Official Software of Rajasthan Police • Designed for Problem Statement PS05
        </p>
      </div>
    </div>
  );
};

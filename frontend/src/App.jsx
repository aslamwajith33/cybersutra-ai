import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DemoBanner } from './components/DemoBanner';

// Pages
import { Overview } from './pages/Overview';
import { FraudDnaPage } from './pages/FraudDnaPage';
import { AiCopilotPage } from './pages/AiCopilotPage';
import { TimelinePage } from './pages/TimelinePage';
import { FraudAnalysis } from './pages/FraudAnalysis';
import { FinancialInvestigation } from './pages/FinancialInvestigation';
import { StatementIntelligence } from './pages/StatementIntelligence';
import { MuleDetection } from './pages/MuleDetection';
import { MoneyTrailExplorer } from './pages/MoneyTrailExplorer';
import { DomainIPIntelligence } from './pages/DomainIPIntelligence';
import { UrlIntelligence } from './pages/UrlIntelligence';
import { ApkScanner } from './pages/ApkScanner';
import { EvidenceGraph } from './pages/EvidenceGraph';
import { CaseManagement } from './pages/CaseManagement';
import { ReportsPage } from './pages/ReportsPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { SettingsPage } from './pages/SettingsPage';
import { Login } from './pages/Login';

export function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState({
    username: 'io_jaipur',
    full_name: 'Insp. Vikram Rathore',
    department: 'Cyber Crime Police Station Jaipur',
    role: 'Investigator'
  });

  return (
    <Router>
      <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans antialiased selection:bg-blue-600/30 selection:text-blue-200">
        <Routes>
          {/* Public Login Route */}
          <Route path="/login" element={<Login onLoginSuccess={setUser} />} />

          {/* Protected Main Layout */}
          <Route
            path="*"
            element={
              <div className="flex h-screen overflow-hidden">
                {/* Persistent Sidebar Navigation */}
                <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 lg:pl-72 overflow-hidden">
                  {/* Global Demonstration Intelligence Banner */}
                  <DemoBanner onReload={() => window.location.reload()} />

                  {/* Top Navbar */}
                  <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

                  {/* Scrollable Viewport */}
                  <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                      <Routes>
                        <Route path="/" element={<Overview />} />
                        <Route path="/fraud-dna" element={<FraudDnaPage />} />
                        <Route path="/copilot" element={<AiCopilotPage />} />
                        <Route path="/timeline" element={<TimelinePage />} />
                        <Route path="/financial" element={<FinancialInvestigation />} />
                        <Route path="/statements" element={<StatementIntelligence />} />
                        <Route path="/mule-detection" element={<MuleDetection />} />
                        <Route path="/money-trail" element={<MoneyTrailExplorer />} />
                        <Route path="/domain-ip" element={<DomainIPIntelligence />} />
                        <Route path="/fraud-analysis" element={<FraudAnalysis />} />
                        <Route path="/url-intel" element={<UrlIntelligence />} />
                        <Route path="/apk-scanner" element={<ApkScanner />} />
                        <Route path="/evidence-graph" element={<EvidenceGraph />} />
                        <Route path="/cases" element={<CaseManagement />} />
                        <Route path="/cases/:id" element={<CaseManagement />} />
                        <Route path="/reports" element={<ReportsPage />} />
                        <Route path="/audit-logs" element={<AuditLogsPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </div>
                  </main>
                </div>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication
export const login = async (username, password) => {
  const res = await api.post('/auth/login', { username, password });
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await api.get('/auth/me');
  return res.data;
};

// Dashboard
export const getDashboardStats = async () => {
  const res = await api.get('/dashboard/stats');
  return res.data;
};

// Cases
export const getCases = async (params = {}) => {
  const res = await api.get('/cases', { params });
  return res.data;
};

export const getCaseDetail = async (id) => {
  const res = await api.get(`/cases/${id}`);
  return res.data;
};

export const createCase = async (data) => {
  const res = await api.post('/cases', data);
  return res.data;
};

export const updateCase = async (id, data) => {
  const res = await api.put(`/cases/${id}`, data);
  return res.data;
};

export const addComplaintToCase = async (caseId, data) => {
  const res = await api.post(`/cases/${caseId}/complaints`, data);
  return res.data;
};

// Statement Intelligence (Module 1)
export const uploadStatement = async (formData) => {
  const res = await api.post('/statements/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const uploadBankStatement = uploadStatement;

export const getStatementHistory = async (caseId = null) => {
  const params = caseId ? { case_id: caseId } : {};
  const res = await api.get('/statements/history', { params });
  return res.data;
};

export const getStatementValidationReport = async (importId) => {
  const res = await api.get(`/statements/${importId}/validation-report`);
  return res.data;
};

// Mule Account Detection (Module 2) & Financial Transactions
export const getTransactions = async (params = {}) => {
  const res = await api.get('/financial/transactions', { params });
  return res.data;
};

export const addTransaction = async (data) => {
  const res = await api.post('/financial/transactions', data);
  return res.data;
};

export const getMuleAnalysis = async (caseId = null) => {
  const params = caseId ? { case_id: caseId } : {};
  const res = await api.get('/financial/mule-analysis', { params });
  return res.data;
};

// Money Trail Explorer (Module 5)
export const traceMoneyTrail = async (query, caseId = null) => {
  const params = { query };
  if (caseId) params.case_id = caseId;
  const res = await api.get('/money-trail/trace', { params });
  return res.data;
};

// Domain & IP Infrastructure Intelligence (Module 6)
export const analyzeInfrastructure = async (identifier, caseId = null) => {
  const params = { identifier };
  if (caseId) params.case_id = caseId;
  const res = await api.get('/infrastructure/analyze', { params });
  return res.data;
};

export const getInfrastructureHistory = async (caseId = null) => {
  const params = caseId ? { case_id: caseId } : {};
  const res = await api.get('/infrastructure/history', { params });
  return res.data;
};

// Secret Weapon: Fraud Network DNA
export const getFraudDna = async (caseId = null) => {
  const params = caseId ? { case_id: caseId } : {};
  const res = await api.get('/fraud-dna', { params });
  return res.data;
};

// AI Investigation Copilot
export const queryCopilot = async (query, caseId = null) => {
  const res = await api.post('/copilot/query', { query, case_id: caseId });
  return res.data;
};

// Investigation Timeline
export const getInvestigationTimeline = async (caseId = null) => {
  const params = caseId ? { case_id: caseId } : {};
  const res = await api.get('/timeline', { params });
  return res.data;
};

// URL Intelligence
export const analyzeUrl = async (url, notes = null, caseId = null) => {
  const res = await api.post('/url-intel/analyze', {
    url,
    investigator_notes: notes,
    case_id: caseId ? parseInt(caseId) : null,
  });
  return res.data;
};

export const getUrlHistory = async (params = {}) => {
  const res = await api.get('/url-intel/history', { params });
  return res.data;
};

// APK Scanner
export const scanApk = async (formData) => {
  const res = await api.post('/apk-scanner/scan', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const getApkHistory = async (params = {}) => {
  const res = await api.get('/apk-scanner/history', { params });
  return res.data;
};

// Evidence Graph & Correlation
export const getEvidenceGraph = async (params = {}) => {
  const res = await api.get('/evidence/graph', { params });
  return res.data;
};

export const getCrossCaseAlerts = async () => {
  const res = await api.get('/evidence/cross-case-alerts');
  return res.data;
};

// Statutory Lawful Notices (Sec 91/102 CrPC)
export const draftNotice = async (data) => {
  const res = await api.post('/notices/draft', data);
  return res.data;
};

export const getNotices = async (caseId = null) => {
  const params = caseId ? { case_id: caseId } : {};
  const res = await api.get('/notices', { params });
  return res.data;
};

// Reports
export const getReports = async (caseId = null) => {
  const params = caseId ? { case_id: caseId } : {};
  const res = await api.get('/reports', { params });
  return res.data;
};

export const generateReport = async (data) => {
  const res = await api.post('/reports/generate', data);
  return res.data;
};

// Audit Logs
export const getAuditLogs = async (params = {}) => {
  const res = await api.get('/audit-logs', { params });
  return res.data;
};

// Settings & System
export const getSystemStatus = async () => {
  const res = await api.get('/settings/status');
  return res.data;
};

export const seedDemoData = async (force = false) => {
  const res = await api.post(`/settings/seed-demo-data?force=${force}`);
  return res.data;
};

export const resetDatabase = async () => {
  const res = await api.post('/settings/reset-database');
  return res.data;
};

export default api;

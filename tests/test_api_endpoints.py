import unittest
from fastapi.testclient import TestClient
from backend.main import app

class TestCyberSutraAPIEndpoints(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_root_and_status(self):
        res = self.client.get("/")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["api_status"], "OPERATIONAL")
        self.assertIn("PS05", data["hackathon_problem_statement"])

        status_res = self.client.get("/api/settings/status")
        self.assertEqual(status_res.status_code, 200)
        self.assertGreaterEqual(status_res.json()["total_cases"], 1)

    def test_dashboard_stats(self):
        res = self.client.get("/api/dashboard/stats")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("total_cases", data)
        self.assertIn("complaints_trend", data)
        self.assertIn("fraud_distribution", data)

    def test_cases_and_complaints(self):
        res = self.client.get("/api/cases")
        self.assertEqual(res.status_code, 200)
        cases = res.json()
        self.assertGreater(len(cases), 0)
        
        # Test case detail
        case_id = cases[0]["id"]
        detail_res = self.client.get(f"/api/cases/{case_id}")
        self.assertEqual(detail_res.status_code, 200)
        self.assertIn("complaints", detail_res.json())

    def test_url_intelligence(self):
        payload = {"url": "http://jvvnl-bijli-update.site/pay-bill-online"}
        res = self.client.post("/api/url-intel/analyze", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertGreaterEqual(data["risk_score"], 50)
        self.assertEqual(data["domain"], "jvvnl-bijli-update.site")

    def test_mule_analysis(self):
        res = self.client.get("/api/financial/mule-analysis")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("mule_accounts", data)
        self.assertIn("layering_chains", data)
        self.assertIn("structuring_alerts", data)

    def test_money_trail_explorer(self):
        res = self.client.get("/api/money-trail/trace?query=UTR5010029101")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("hops", data)
        self.assertIn("graph", data)

    def test_infrastructure_intelligence(self):
        res = self.client.get("/api/infrastructure/analyze?identifier=jvvnl-bijli-update.site")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["entity_type"], "DOMAIN")
        self.assertIn("linked_bank_accounts", data)

    def test_evidence_graph_and_cross_case_alerts(self):
        graph_res = self.client.get("/api/evidence/graph")
        self.assertEqual(graph_res.status_code, 200)
        g_data = graph_res.json()
        self.assertIn("nodes", g_data)
        self.assertIn("edges", g_data)

        alerts_res = self.client.get("/api/evidence/cross-case-alerts")
        self.assertEqual(alerts_res.status_code, 200)
        alerts = alerts_res.json()
        self.assertIsInstance(alerts, list)

    def test_audit_logs(self):
        res = self.client.get("/api/audit-logs")
        self.assertEqual(res.status_code, 200)
        self.assertIsInstance(res.json(), list)

    def test_fraud_network_dna(self):
        res = self.client.get("/api/fraud-dna")
        self.assertEqual(res.status_code, 200)
        dna_list = res.json()
        self.assertGreaterEqual(len(dna_list), 1)
        first_dna = dna_list[0]
        self.assertIn("dna_id", first_dna)
        self.assertEqual(first_dna["dna_id"], "FNA-2026-001")
        self.assertIn("confidence_score", first_dna)
        self.assertIn("common_indicators", first_dna)
        self.assertGreaterEqual(first_dna["confidence_score"], 85)

    def test_ai_copilot_query(self):
        payload = {"query": "Why is Account HDFC-501004928172 suspicious?"}
        res = self.client.post("/api/copilot/query", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("answer", data)
        self.assertIn("confidence", data)
        self.assertIn("evidence_sources", data)

    def test_investigation_timeline(self):
        res = self.client.get("/api/timeline")
        self.assertEqual(res.status_code, 200)
        events = res.json()
        self.assertIsInstance(events, list)
        self.assertGreaterEqual(len(events), 1)
        self.assertIn("event_type", events[0])
        self.assertIn("title", events[0])

    def test_report_generation(self):
        cases_res = self.client.get("/api/cases")
        cases = cases_res.json()
        if cases:
            case_id = cases[0]["id"]
            req_data = {
                "case_id": case_id,
                "title": "Comprehensive Rajasthan Cyber Investigation Report",
                "executive_summary": "Test automated dossier generation",
                "officer_name": "Insp. Vikram Rathore"
            }
            gen_res = self.client.post("/api/reports/generate", json=req_data)
            self.assertEqual(gen_res.status_code, 200)
            rep_info = gen_res.json()
            self.assertIn("pdf_filename", rep_info)

if __name__ == "__main__":
    unittest.main()

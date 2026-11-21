import unittest
import os
from backend.services.url_analyzer import analyze_url
from backend.services.apk_analyzer import analyze_apk_file
from backend.services.financial_analyzer import analyze_transaction_batch, parse_csv_bank_statement
from backend.services.statement_parser import parse_statement_file
from backend.services.notice_generator import generate_lawful_notice_text
from backend.models import Case

class TestCyberSutraCoreFeatures(unittest.TestCase):

    def test_url_analyzer_phishing(self):
        """Test URL heuristic risk scoring on known phishing and benign URLs."""
        # 1. Phishing URL mimicking electricity discom with suspicious TLD
        result = analyze_url("http://jvvnl-bijli-update.site/pay-bill-online?consumer_no=1800291")
        self.assertGreaterEqual(result["risk_score"], 60)
        self.assertIn(result["risk_category"], ["High", "Critical"])
        self.assertTrue(result["is_suspicious_tld"])
        self.assertEqual(result["scheme"], "http")
        self.assertGreater(len(result["indicators"]), 0)
        self.assertGreater(len(result["verification_steps"]), 0)

        # 2. Raw IP address C2 endpoint
        ip_result = analyze_url("http://185.220.101.5:8080/c2/receive_sms.php")
        self.assertTrue(ip_result["is_ip_host"])
        self.assertGreaterEqual(ip_result["risk_score"], 70)

        # 3. Legitimate HTTPS URL
        legit_result = analyze_url("https://police.rajasthan.gov.in/portal")
        self.assertLess(legit_result["risk_score"], 40)
        self.assertEqual(legit_result["scheme"], "https")

    def test_financial_analyzer_mule_and_layering(self):
        """Test detection of pass-through mule accounts and rapid layering (< 30 mins)."""
        sample_txns = [
            # Victim deposits structuring amount below 50k
            {
                "transaction_id": "TX-01",
                "from_account": "ACC-VICTIM-1",
                "from_bank": "State Bank of India",
                "to_account": "MULE-HDFC-99",
                "to_bank": "HDFC Bank",
                "amount": 49500.0,
                "timestamp": "2025-05-10T10:00:00",
                "channel": "UPI"
            },
            # Second structured deposit within 5 mins
            {
                "transaction_id": "TX-02",
                "from_account": "ACC-VICTIM-2",
                "from_bank": "Bank of Baroda",
                "to_account": "MULE-HDFC-99",
                "to_bank": "HDFC Bank",
                "amount": 48500.0,
                "timestamp": "2025-05-10T10:05:00",
                "channel": "UPI"
            },
            # Rapid layering: Outward drain of 95,000 within 12 minutes!
            {
                "transaction_id": "TX-03",
                "from_account": "MULE-HDFC-99",
                "from_bank": "HDFC Bank",
                "to_account": "MULE-ICICI-88",
                "to_bank": "ICICI Bank",
                "amount": 95000.0,
                "timestamp": "2025-05-10T10:17:00",
                "channel": "IMPS"
            }
        ]

        analysis = analyze_transaction_batch(sample_txns)
        self.assertEqual(analysis["total_transactions"], 3)
        self.assertEqual(analysis["total_volume"], 193000.0)
        
        # Check that MULE-HDFC-99 is detected as mule
        mule_accs = [m["account_number"] for m in analysis["mule_accounts"]]
        self.assertIn("MULE-HDFC-99", mule_accs)
        
        # Check layering chains
        self.assertGreater(len(analysis["layering_chains"]), 0)
        self.assertEqual(analysis["layering_chains"][0]["intermediary_account"], "MULE-HDFC-99")

        # Check structuring alerts (< 50,000 threshold evasion)
        self.assertGreaterEqual(len(analysis["structuring_alerts"]), 2)

    def test_statement_parser_csv(self):
        """Test polymorphic statement parser with normalization."""
        csv_data = b"""Date,Txn ID,Sender Account,Receiver Account,Amount,Debit,Credit,Balance,Sender Bank,Receiver Bank,Channel,UTR,Narration
2025-05-10 10:15:00,TXN-9001,ACC-VICTIM-1,HDFC-99,49500,0,49500,49500,SBI,HDFC,UPI,UTR501001,Telegram task deposit
2025-05-10 10:25:00,TXN-9002,HDFC-99,ICICI-88,48000,48000,0,1500,HDFC,ICICI,IMPS,UTR501002,Layering transfer
"""
        parsed = parse_statement_file(csv_data, "test_statement.csv")
        self.assertEqual(parsed["total_records"], 2)
        self.assertEqual(parsed["valid_transactions"][0]["amount"], 49500.0)
        self.assertEqual(parsed["valid_transactions"][1]["debit_amount"], 48000.0)

    def test_notice_generator_sec91(self):
        """Test statutory notice generator for Section 91 Cr.P.C. bank requisition."""
        fake_case = Case(
            case_number="RJ-CC-2025-0104",
            title="Operation Golden Falcon",
            police_station="Cyber Crime Police Station Jaipur",
            total_loss_amount=1850000.0
        )
        notice = generate_lawful_notice_text(
            notice_type="SECTION_91_CRPC",
            case=fake_case,
            target_institution="HDFC Bank Fraud Risk Nodal Officer",
            target_identifier="HDFC-501004928172",
            issuing_officer="Insp. Vikram Rathore, IO"
        )
        self.assertIn("SECTION 91 OF THE CODE OF CRIMINAL PROCEDURE", notice["content_text"])
        self.assertIn("HDFC-501004928172", notice["content_text"])
        self.assertIn("RJ-CC-2025-0104", notice["content_text"])

    def test_apk_analyzer_synthetic(self):
        """Test static APK analyzer on generated test APK."""
        apk_path = os.path.join(os.getcwd(), "sample_data", "InstantRupee_LoanShark_Sample.apk")
        if os.path.exists(apk_path):
            res = analyze_apk_file(apk_path, "InstantRupee_LoanShark_Sample.apk")
            self.assertIn("package_name", res)
            self.assertGreater(len(res["sha256_hash"]), 30)
            self.assertGreaterEqual(res["risk_score"], 60)

if __name__ == "__main__":
    unittest.main()

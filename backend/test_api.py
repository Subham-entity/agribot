"""
Test script for AgriMarket backend API
"""
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health():
    res = client.get("/")
    assert res.status_code == 200
    assert res.json()["status"] == "online"
    print("[OK] Health check passed")

def test_auth():
    # Valid Aadhaar
    res = client.post("/api/auth/login", json={
        "aadhaar_number": "9821-4821-4821",
        "role": "farmer",
        "otp": "123456"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["profile"]["role"] == "farmer"

    # Invalid Aadhaar
    res_bad = client.post("/api/auth/login", json={
        "aadhaar_number": "123",
        "role": "farmer"
    })
    assert res_bad.status_code == 422
    print("[OK] Aadhaar auth verification passed")

def test_rates_and_predictions():
    res = client.get("/api/rates")
    assert res.status_code == 200
    data = res.json()
    assert len(data["rates"]) > 0
    tomato = next(r for r in data["rates"] if r["crop"] == "Tomato")
    assert "predictions" in tomato
    assert "1_month" in tomato["predictions"]
    print("[OK] Market rates and AI forecast passed")

def test_ai_assistant():
    res = client.post("/api/ai-assistant", json={
        "query": "What is the tomato price predicted next month?",
        "role": "farmer"
    })
    assert res.status_code == 200
    data = res.json()
    assert "reply" in data
    assert "Tomato" in data["reply"]
    print("[OK] AI Assistant NLP query passed")

def test_produce_and_validation():
    # Attempt invalid past date
    res_bad = client.post("/api/produce", json={
        "crop_name": "Tomato",
        "quantity_quintals": 10,
        "min_price_per_kg": 25,
        "expiry_deadline": "2020-01-01",
        "pickup_location": "Nashik Farm"
    })
    assert res_bad.status_code == 422

    # Valid listing
    res_good = client.post("/api/produce", json={
        "crop_name": "Tomato",
        "quantity_quintals": 50,
        "min_price_per_kg": 32,
        "expiry_deadline": "2026-12-31",
        "pickup_location": "Niphad Farm Gate, Nashik"
    })
    assert res_good.status_code == 200
    print("[OK] Produce creation and strict deadline validation passed")

def test_reputation_rating_trigger():
    # Rating on incomplete transaction should fail
    res_bad = client.post("/api/transactions/rate", json={
        "transaction_id": "TXN_78203",  # IN_TRANSIT
        "quality_rating": 5,
        "feedback": "Great"
    })
    assert res_bad.status_code == 400

    # Rating on eligible completed transaction
    res_good = client.post("/api/transactions/rate", json={
        "transaction_id": "TXN_78202",  # COMPLETED and unrated
        "quality_rating": 5,
        "feedback": "Outstanding export-grade Nashik Red onions!"
    })
    assert res_good.status_code == 200
    data = res_good.json()
    assert data["success"] is True
    assert "updated_reputation_score" in data
    print("[OK] Mandatory Quality Rating access control and reputation calculation passed")

if __name__ == "__main__":
    test_health()
    test_auth()
    test_rates_and_predictions()
    test_ai_assistant()
    test_produce_and_validation()
    test_reputation_rating_trigger()
    print("\nALL BACKEND TESTS PASSED SUCCESSFULLY!")

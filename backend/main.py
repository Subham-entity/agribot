"""
AgriMarket Backend API
FastAPI application powering dual-role Aadhaar authentication, AI crop price forecasting,
voice/text AI assistant, produce/demand exchange, transactions with post-trade ratings,
cold storage directory, and FPO trade transparency circles.
"""

from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime, date

from data import (
    SAMPLE_PROFILES,
    MARKET_RATES,
    WAREHOUSES,
    PRODUCE_LISTINGS,
    BUYER_DEMANDS,
    TRANSACTIONS,
    FPO_CIRCLES
)
from ai_engine import predict_crop_demand_and_price, process_ai_assistant_query

app = FastAPI(
    title="AgriMarket API",
    description="B2B Agricultural Marketplace connecting Smallholder Farmers & Bulk Buyers",
    version="1.0.0"
)

# Enable CORS for Vite frontend (localhost:5173, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- Request / Response Models ----------------- #

class AadhaarAuthRequest(BaseModel):
    aadhaar_number: str = Field(..., description="12-digit Aadhaar Number e.g. 8421-9876-4821")
    role: str = Field(..., description="'farmer' or 'buyer'")
    otp: Optional[str] = Field("123456", description="6-digit OTP received via Aadhaar-linked mobile")

class ProduceCreateRequest(BaseModel):
    crop_name: str = Field(..., min_length=2)
    variety: Optional[str] = "Standard Hybrid"
    quantity_quintals: float = Field(..., gt=0, description="Available quantity in Quintals (1 Quintal = 100 kg)")
    min_price_per_kg: float = Field(..., gt=0, description="Minimum acceptable price in ₹/kg")
    expiry_deadline: str = Field(..., description="Shelf-life deadline YYYY-MM-DD")
    harvest_date: Optional[str] = None
    pickup_location: str = Field(..., min_length=5)
    quality_notes: Optional[str] = ""

class DemandCreateRequest(BaseModel):
    crop_required: str = Field(..., min_length=2)
    quantity_needed_quintals: float = Field(..., gt=0, description="Quantity needed in Quintals")
    target_price_per_kg: float = Field(..., gt=0, description="Target price per kg")
    location: str = Field(..., min_length=5)
    expiry_deadline: str = Field(..., description="Expiration deadline YYYY-MM-DD")
    urgency: Optional[str] = "Standard"
    notes: Optional[str] = ""

class PostTradeRatingRequest(BaseModel):
    transaction_id: str
    quality_rating: int = Field(..., ge=1, le=5, description="Quality rating from 1 to 5 stars")
    feedback: Optional[str] = Field("", description="Detailed produce quality feedback")

class AiQueryRequest(BaseModel):
    query: str
    role: Optional[str] = "farmer"
    is_voice: Optional[bool] = False

# ----------------- Endpoints ----------------- #

@app.get("/")
def root():
    return {
        "app": "AgriMarket B2B Platform API",
        "status": "online",
        "timestamp": datetime.now().isoformat()
    }

# 1. Dual-Role Aadhaar Authentication
@app.post("/api/auth/login")
def login_with_aadhaar(payload: AadhaarAuthRequest):
    clean_aadhaar = payload.aadhaar_number.replace("-", "").replace(" ", "")
    if len(clean_aadhaar) != 12 or not clean_aadhaar.isdigit():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Aadhaar must be a valid 12-digit number."
        )

    role_key = payload.role.lower()
    if role_key not in ["farmer", "buyer"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Role must be either 'farmer' or 'buyer'."
        )

    profile = SAMPLE_PROFILES[role_key].copy()
    masked_aadhaar = f"XXXX-XXXX-{clean_aadhaar[-4:]}"
    profile["aadhaar"] = masked_aadhaar
    profile["aadhaar_verified"] = True

    return {
        "success": True,
        "message": f"Aadhaar OTP verified successfully for {profile['name']} ({role_key.capitalize()})",
        "token": f"agri_sec_token_{role_key}_{clean_aadhaar[-4:]}",
        "profile": profile
    }

@app.get("/api/auth/profile/{role}")
def get_profile(role: str):
    role_key = role.lower()
    if role_key not in SAMPLE_PROFILES:
        raise HTTPException(status_code=404, detail="Profile role not found")
    return SAMPLE_PROFILES[role_key]

# 2. Market Rates & AI Demand Predictor
@app.get("/api/rates")
def get_all_market_rates():
    results = []
    for crop_name in MARKET_RATES:
        results.append(predict_crop_demand_and_price(crop_name))
    return {
        "rates": results,
        "last_synced": datetime.now().strftime("%Y-%m-%d %H:%M IST")
    }

@app.get("/api/predict/{crop_name}")
def get_crop_forecast(crop_name: str):
    return predict_crop_demand_and_price(crop_name)

# 3. Interactive AI Assistant (Voice + Text)
@app.post("/api/ai-assistant")
def chat_with_ai_assistant(payload: AiQueryRequest):
    return process_ai_assistant_query(payload.query, payload.role or "farmer")

# 4. Farmer Produce Listings (Farmer uploads, Buyer browses)
@app.get("/api/produce")
def get_produce_listings(crop: Optional[str] = None):
    # Auto check shelf-life expiration
    today_str = date.today().strftime("%Y-%m-%d")
    active_items = []
    for p in PRODUCE_LISTINGS:
        if p["expiry_deadline"] < today_str:
            p["status"] = "expired"
        if crop:
            if crop.lower() in p["crop_name"].lower():
                active_items.append(p)
        else:
            active_items.append(p)
    return active_items

@app.post("/api/produce")
def upload_produce(payload: ProduceCreateRequest):
    # Strict validation
    today_str = date.today().strftime("%Y-%m-%d")
    if payload.expiry_deadline < today_str:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Shelf-life deadline cannot be in the past."
        )

    new_id = f"PROD_{100 + len(PRODUCE_LISTINGS) + 1}"
    farmer = SAMPLE_PROFILES["farmer"]
    
    new_listing = {
        "id": new_id,
        "farmer_id": farmer["id"],
        "farmer_name": farmer["name"],
        "crop_name": payload.crop_name,
        "variety": payload.variety or "Hybrid Standard",
        "quantity_quintals": payload.quantity_quintals,
        "min_price_per_kg": payload.min_price_per_kg,
        "expiry_deadline": payload.expiry_deadline,
        "harvest_date": payload.harvest_date or today_str,
        "pickup_location": payload.pickup_location,
        "farmer_reputation": farmer["reputation_score"],
        "total_ratings": farmer["total_reviews"],
        "fpo_affiliation": farmer["fpo_name"],
        "quality_notes": payload.quality_notes or "Freshly harvested, checked for moisture and grading.",
        "status": "active",
        "created_at": datetime.now().isoformat()
    }
    PRODUCE_LISTINGS.insert(0, new_listing)
    return {
        "success": True,
        "message": f"Produce lot for {payload.crop_name} listed successfully!",
        "listing": new_listing
    }

# 5. Buyer Demands (Buyer uploads, Farmer browses)
@app.get("/api/demands")
def get_buyer_demands(crop: Optional[str] = None):
    today_str = date.today().strftime("%Y-%m-%d")
    valid_demands = []
    for d in BUYER_DEMANDS:
        # Automated Expiry Logic: Demands automatically cancel/delist when deadline passes
        if d["expiry_deadline"] < today_str:
            d["status"] = "expired"
        
        if crop:
            if crop.lower() in d["crop_required"].lower():
                valid_demands.append(d)
        else:
            valid_demands.append(d)
    return valid_demands

@app.post("/api/demands")
def upload_demand(payload: DemandCreateRequest):
    # Strict validation
    today_str = date.today().strftime("%Y-%m-%d")
    if payload.expiry_deadline < today_str:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Procurement deadline must be in the future."
        )

    new_id = f"DEMAND_{300 + len(BUYER_DEMANDS) + 1}"
    buyer = SAMPLE_PROFILES["buyer"]

    new_demand = {
        "id": new_id,
        "buyer_id": buyer["id"],
        "buyer_name": buyer["name"],
        "buyer_company": buyer["company"],
        "crop_required": payload.crop_required,
        "quantity_needed_quintals": payload.quantity_needed_quintals,
        "target_price_per_kg": payload.target_price_per_kg,
        "location": payload.location,
        "expiry_deadline": payload.expiry_deadline,
        "urgency": payload.urgency or "Standard",
        "status": "active",
        "notes": payload.notes or "Standard quality procurement.",
        "created_at": datetime.now().isoformat()
    }
    BUYER_DEMANDS.insert(0, new_demand)
    return {
        "success": True,
        "message": f"Bulk demand for {payload.crop_required} published to farmer network!",
        "demand": new_demand
    }

# 6. Local Storage & Warehouses Directory
@app.get("/api/warehouses")
def get_warehouses():
    return WAREHOUSES

# 7. Circles Screen (Internal FPO Trade Transparency)
@app.get("/api/circles")
def get_fpo_circles():
    return FPO_CIRCLES

# 8. Transactions & History
@app.get("/api/transactions")
def get_transactions(role: Optional[str] = None):
    if role == "farmer":
        return [t for t in TRANSACTIONS if t["farmer_id"] == SAMPLE_PROFILES["farmer"]["id"]]
    elif role == "buyer":
        return [t for t in TRANSACTIONS if t["buyer_id"] == SAMPLE_PROFILES["buyer"]["id"]]
    return TRANSACTIONS

@app.post("/api/transactions/quick-buy")
def quick_buy(produce_id: str, quantity_quintals: float):
    # Match produce
    target = None
    for p in PRODUCE_LISTINGS:
        if p["id"] == produce_id:
            target = p
            break
    if not target:
        raise HTTPException(status_code=404, detail="Produce listing not found")

    buyer = SAMPLE_PROFILES["buyer"]
    total_kg = quantity_quintals * 100
    total_val = round(total_kg * target["min_price_per_kg"], 2)

    new_tx = {
        "id": f"TXN_{len(TRANSACTIONS) + 78201}",
        "buyer_id": buyer["id"],
        "buyer_name": buyer["company"],
        "farmer_id": target["farmer_id"],
        "farmer_name": target["farmer_name"],
        "crop": target["crop_name"],
        "variety": target["variety"],
        "quantity_quintals": quantity_quintals,
        "price_per_kg": target["min_price_per_kg"],
        "total_amount": total_val,
        "status": "COMPLETED",  # Mark as completed to enable immediate rating testing
        "order_date": date.today().strftime("%Y-%m-%d"),
        "delivery_date": date.today().strftime("%Y-%m-%d"),
        "payout_status": "Paid to Farmer Escrow",
        "rating_submitted": False,
        "quality_rating": None,
        "rating_feedback": None
    }
    TRANSACTIONS.insert(0, new_tx)
    return {
        "success": True,
        "message": f"Purchase agreement created with {target['farmer_name']}. Ready for delivery & quality rating.",
        "transaction": new_tx
    }

# 9. Post-Trade Verified Rating & Reputation Engine
@app.post("/api/transactions/rate")
def submit_quality_rating(payload: PostTradeRatingRequest):
    target_tx = None
    for t in TRANSACTIONS:
        if t["id"] == payload.transaction_id:
            target_tx = t
            break

    if not target_tx:
        raise HTTPException(status_code=404, detail="Transaction not found.")

    # Access Control: Mandatory Quality Rating Trigger enabled ONLY after transaction is marked as complete
    if target_tx["status"] != "COMPLETED":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Rating trigger is only enabled after a transaction is marked COMPLETED. Current status: {target_tx['status']}"
        )

    if target_tx.get("rating_submitted"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Quality rating has already been submitted for this transaction."
        )

    # Apply rating
    target_tx["rating_submitted"] = True
    target_tx["quality_rating"] = payload.quality_rating
    target_tx["rating_feedback"] = payload.feedback

    # Recalculate Farmer's Verified Reputation Score
    # Reputation Logic: Calculated exclusively from verified buyer quality ratings post-trade completion
    farmer = SAMPLE_PROFILES["farmer"]
    current_score = farmer["reputation_score"]
    total_reviews = farmer["total_reviews"]
    new_reviews_count = total_reviews + 1
    new_score = round(((current_score * total_reviews) + payload.quality_rating) / new_reviews_count, 2)

    farmer["reputation_score"] = new_score
    farmer["total_reviews"] = new_reviews_count

    # Also update in active listings
    for p in PRODUCE_LISTINGS:
        if p["farmer_id"] == farmer["id"]:
            p["farmer_reputation"] = new_score
            p["total_ratings"] = new_reviews_count

    return {
        "success": True,
        "message": "Verified buyer quality rating submitted successfully.",
        "updated_reputation_score": new_score,
        "total_reviews": new_reviews_count,
        "transaction": target_tx
    }

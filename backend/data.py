"""
AgriMarket Data Store
Pre-seeded datasets for Mandi rates, historical forecasts, Warehouses,
Farmer produce listings, Buyer demands, Transactions, and FPO Circles.
"""

from datetime import datetime, timedelta

# Sample Verified Profiles
SAMPLE_PROFILES = {
    "farmer": {
        "id": "FARMER_4821",
        "name": "Rameshwar Patil",
        "role": "farmer",
        "aadhaar": "XXXX-XXXX-4821",
        "aadhaar_verified": True,
        "phone": "+91 98224 81023",
        "location": "Niphad, Nashik District, Maharashtra",
        "fpo_name": "Sahyadri Agro Farmers Producer Co. Ltd",
        "fpo_id": "FPO_MAHA_2021_88",
        "landholding": "6.5 Acres (Drip Irrigated)",
        "crops_grown": ["Tomato", "Onion", "Green Chilli", "Grapes"],
        "reputation_score": 4.8,
        "total_reviews": 19,
        "successful_deals": 24,
        "total_payout_earned": 485000,
        "bank_account_verified": True
    },
    "buyer": {
        "id": "BUYER_9901",
        "name": "Vikramaditya Singhania",
        "company": "KisanSetu Food Processing & Cold Chain Ltd",
        "role": "buyer",
        "aadhaar": "XXXX-XXXX-9901",
        "gstin": "27AAACK1234F1Z5",
        "aadhaar_verified": True,
        "phone": "+91 91672 34500",
        "location": "APMC Sector 19, Vashi, Navi Mumbai",
        "procurement_focus": ["Tomato (Processing Grade)", "Nashik Red Onion", "Sharbati Wheat", "Potato (Chip Grade)"],
        "total_procured_tonnes": 320.5,
        "total_orders": 42,
        "credit_rating": "AAA Tier-1 Verified",
        "payment_terms": "Instant Escrow Release on Weighbridge Slip"
    }
}

# Live APMC Mandi Rates & AI Forecasting Baselines
MARKET_RATES = {
    "Tomato": {
        "crop": "Tomato",
        "variety": "Hybrid Shivam / S-81",
        "current_price": 32.0,  # ₹/kg
        "mandi_name": "Pimpalgaon Baswant APMC",
        "day_change": "+8.5%",
        "trend_direction": "up",
        "arrival_volume": "1,450 Quintals/day",
        "weather_signal": "Unseasonal heat wave warning in Peninsular belt; lower yield arrivals expected.",
        "predictions": {
            "15_days": {"price": 37.0, "demand": "High Demand", "confidence": "94%"},
            "1_month": {"price": 42.0, "demand": "Surge Expected", "confidence": "89%"},
            "3_months": {"price": 28.0, "demand": "Moderate Supply Flush", "confidence": "81%"}
        },
        "historical_weekly": [22, 24, 25, 27, 29, 30, 32],
        "advisory": "Recommend staging harvest over 2 weeks or placing in cold storage to capitalize on the ₹40+ surge."
    },
    "Onion": {
        "crop": "Onion",
        "variety": "Nashik Red / Garwa",
        "current_price": 24.5,
        "mandi_name": "Lasalgaon Mandi (Asia's Largest)",
        "day_change": "+3.2%",
        "trend_direction": "up",
        "arrival_volume": "4,200 Quintals/day",
        "weather_signal": "Favorable dry weather; storage quality high with low moisture rot.",
        "predictions": {
            "15_days": {"price": 27.0, "demand": "High Demand", "confidence": "92%"},
            "1_month": {"price": 33.5, "demand": "Very High Demand", "confidence": "88%"},
            "3_months": {"price": 38.0, "demand": "Festive Season Peak", "confidence": "85%"}
        },
        "historical_weekly": [19, 20, 21, 21.5, 23, 23.8, 24.5],
        "advisory": "Garwa variety onions have good shelf life (>4 months). Hold stock in ventilated chawl/godown."
    },
    "Potato": {
        "crop": "Potato",
        "variety": "Kufri Chipsona",
        "current_price": 18.0,
        "mandi_name": "Agra / Indore Mandi",
        "day_change": "-1.5%",
        "trend_direction": "stable",
        "arrival_volume": "8,100 Quintals/day",
        "weather_signal": "Normal cold storage despatches underway.",
        "predictions": {
            "15_days": {"price": 18.5, "demand": "Stable Demand", "confidence": "95%"},
            "1_month": {"price": 20.0, "demand": "Moderate Demand", "confidence": "91%"},
            "3_months": {"price": 23.0, "demand": "High Demand", "confidence": "84%"}
        },
        "historical_weekly": [17.5, 18, 17.8, 18.2, 18.0, 18.1, 18.0],
        "advisory": "Processing grade chipsona potatoes command ₹2.5/kg premium directly with snack manufacturers."
    },
    "Wheat": {
        "crop": "Wheat",
        "variety": "Sharbati Premium / MP",
        "current_price": 28.5,
        "mandi_name": "Khanna Mandi / Indore",
        "day_change": "+1.8%",
        "trend_direction": "up",
        "arrival_volume": "6,500 Quintals/day",
        "weather_signal": "Clear skies; procurement at FCI godowns hitting peak targets.",
        "predictions": {
            "15_days": {"price": 29.2, "demand": "Steady Institutional Demand", "confidence": "96%"},
            "1_month": {"price": 31.0, "demand": "High Demand", "confidence": "93%"},
            "3_months": {"price": 34.0, "demand": "Lean Season Peak", "confidence": "89%"}
        },
        "historical_weekly": [26.5, 27, 27.2, 27.8, 28, 28.2, 28.5],
        "advisory": "Millers are offering immediate spot payment for moisture below 11%."
    },
    "Soybean": {
        "crop": "Soybean",
        "variety": "Yellow Gold (JS 9560)",
        "current_price": 46.0,
        "mandi_name": "Latur / Indore APMC",
        "day_change": "+4.1%",
        "trend_direction": "up",
        "arrival_volume": "3,100 Quintals/day",
        "weather_signal": "Global soy meal export cues bullish; domestic solvent plants ramping processing.",
        "predictions": {
            "15_days": {"price": 48.5, "demand": "High Demand", "confidence": "91%"},
            "1_month": {"price": 52.0, "demand": "Surge Expected", "confidence": "87%"},
            "3_months": {"price": 55.0, "demand": "Very High Demand", "confidence": "80%"}
        },
        "historical_weekly": [42, 43, 43.5, 44, 44.8, 45.2, 46.0],
        "advisory": "Hold for bulk oil-mill procurement contracts; avoid selling below MSP of ₹48.9/kg."
    },
    "Green Chilli": {
        "crop": "Green Chilli",
        "variety": "Guntur Teja / Jwala",
        "current_price": 58.0,
        "mandi_name": "Guntur Yard / Nashik",
        "day_change": "+11.0%",
        "trend_direction": "up",
        "arrival_volume": "800 Quintals/day",
        "weather_signal": "Heavy rains in southern belts damaged flowering, crimping wholesale supply.",
        "predictions": {
            "15_days": {"price": 68.0, "demand": "Severe Deficit", "confidence": "93%"},
            "1_month": {"price": 75.0, "demand": "Peak Scarcity", "confidence": "88%"},
            "3_months": {"price": 45.0, "demand": "Harvest Recovery", "confidence": "76%"}
        },
        "historical_weekly": [42, 45, 48, 50, 52, 55, 58],
        "advisory": "High perishable risk! Liquidate fresh green chilli immediately to institutional buyers with reefer logistics."
    }
}

# Nearby Local Storage & FCI Warehouses
WAREHOUSES = [
    {
        "id": "WH_001",
        "name": "Sahyadri Cold Chain & Controlled Atmosphere Facility",
        "type": "Private Cold Storage",
        "location": "Mohadi, Dindori Road, Nashik",
        "distance_km": 4.5,
        "total_capacity_mt": 5000,
        "available_capacity_mt": 850,
        "occupancy_rate": "83%",
        "suitable_crops": ["Tomato", "Grapes", "Pomegranate", "Exotic Greens"],
        "temp_range": "0°C to 4°C (90% RH)",
        "rate_structure": "₹110 / standard crate / month",
        "contact_person": "Pravin Deshmukh (Manager)",
        "contact_phone": "+91 98230 45610",
        "facilities": ["24x7 Nitrogen Flush", "Pre-cooling chambers", "Forklift unloading", "Weighbridge 50MT"],
        "is_govt_subsidized": True
    },
    {
        "id": "WH_002",
        "name": "FCI Central Godown & Buffer Storage Hub",
        "type": "FCI Godown",
        "location": "MIDC Ambad, Nashik",
        "distance_km": 8.2,
        "total_capacity_mt": 12000,
        "available_capacity_mt": 3400,
        "occupancy_rate": "71%",
        "suitable_crops": ["Wheat", "Soybean", "Paddy Rice", "Maize"],
        "temp_range": "Dry Ambient Aerated",
        "rate_structure": "₹45 / quintal / month (FCI standard tariff)",
        "contact_person": "S. K. Verma (Deputy Area Manager)",
        "contact_phone": "+91 94221 00213",
        "facilities": ["Electronic e-NWR Receipts", "Fumigation chambers", "Rail Siding connectivity"],
        "is_govt_subsidized": True
    },
    {
        "id": "WH_003",
        "name": "Kisan Seva Cold Storage & Agro Logistics",
        "type": "Private Cold Storage",
        "location": "Niphad Bypass, Nashik",
        "distance_km": 12.0,
        "total_capacity_mt": 3200,
        "available_capacity_mt": 1100,
        "occupancy_rate": "65%",
        "suitable_crops": ["Onion (Dehumidified)", "Garlic", "Potato"],
        "temp_range": "10°C to 12°C (Ventilated)",
        "rate_structure": "₹85 / bag / season",
        "contact_person": "Balasaheb Kute",
        "contact_phone": "+91 98220 78129",
        "facilities": ["De-humidifier units", "Sorting & grading conveyor", "Solar backup power"],
        "is_govt_subsidized": False
    },
    {
        "id": "WH_004",
        "name": "Maharashtra State Warehousing Corp (MSWC) Godown",
        "type": "MSWC State Godown",
        "location": "Pimpalgaon Baswant",
        "distance_km": 15.4,
        "total_capacity_mt": 8000,
        "available_capacity_mt": 2150,
        "occupancy_rate": "73%",
        "suitable_crops": ["Soybean", "Grain pulses", "Jowar", "Bajra"],
        "temp_range": "Covered dry storage",
        "rate_structure": "₹48 / quintal / month",
        "contact_person": "Anil Jadhav",
        "contact_phone": "+91 94239 88123",
        "facilities": ["WDRA Registered", "Bank Pledge Loan facility on receipt", "Security 24/7"],
        "is_govt_subsidized": True
    }
]

# Active Produce Listings (Farmer Listings)
PRODUCE_LISTINGS = [
    {
        "id": "PROD_101",
        "farmer_id": "FARMER_4821",
        "farmer_name": "Rameshwar Patil",
        "crop_name": "Tomato",
        "variety": "Hybrid Shivam (Grade A)",
        "quantity_quintals": 45,  # 4500 kg
        "min_price_per_kg": 30.0,
        "expiry_deadline": (datetime.now() + timedelta(days=6)).strftime("%Y-%m-%d"),
        "harvest_date": (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d"),
        "pickup_location": "Farm Gate, Niphad Taluka, Nashik, MH",
        "farmer_reputation": 4.8,
        "total_ratings": 19,
        "fpo_affiliation": "Sahyadri Agro Co-op",
        "quality_notes": "Firm, round, deep red colour, brix 4.8. Ideal for modern retail and canning.",
        "status": "active"
    },
    {
        "id": "PROD_102",
        "farmer_id": "FARMER_5102",
        "farmer_name": "Dnyaneshwar Shinde",
        "crop_name": "Onion",
        "variety": "Nashik Garwa Red",
        "quantity_quintals": 120,
        "min_price_per_kg": 23.5,
        "expiry_deadline": (datetime.now() + timedelta(days=45)).strftime("%Y-%m-%d"),
        "harvest_date": (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d"),
        "pickup_location": "Sinnar Shirdi Highway, Nashik, MH",
        "farmer_reputation": 4.9,
        "total_ratings": 31,
        "fpo_affiliation": "Godavari Valley Farmers FPO",
        "quality_notes": "Well cured in ventilated sheds, size 45mm to 60mm, single-center.",
        "status": "active"
    },
    {
        "id": "PROD_103",
        "farmer_id": "FARMER_6234",
        "farmer_name": "Harpreet Singh Brar",
        "crop_name": "Wheat",
        "variety": "Sharbati C-306 Grain",
        "quantity_quintals": 280,
        "min_price_per_kg": 28.0,
        "expiry_deadline": (datetime.now() + timedelta(days=120)).strftime("%Y-%m-%d"),
        "harvest_date": (datetime.now() - timedelta(days=14)).strftime("%Y-%m-%d"),
        "pickup_location": "Khanna Granary Road, Ludhiana, PB",
        "farmer_reputation": 4.7,
        "total_ratings": 14,
        "fpo_affiliation": "Punjab Kisan Progressive Union",
        "quality_notes": "Lustrous golden grain, moisture 10.2%, zero chemical residue test passed.",
        "status": "active"
    },
    {
        "id": "PROD_104",
        "farmer_id": "FARMER_7719",
        "farmer_name": "Venkatesh Rao",
        "crop_name": "Green Chilli",
        "variety": "Guntur Teja (Hot)",
        "quantity_quintals": 25,
        "min_price_per_kg": 54.0,
        "expiry_deadline": (datetime.now() + timedelta(days=4)).strftime("%Y-%m-%d"),
        "harvest_date": (datetime.now()).strftime("%Y-%m-%d"),
        "pickup_location": "Tenali Road, Guntur District, AP",
        "farmer_reputation": 4.6,
        "total_ratings": 9,
        "fpo_affiliation": "Krishna Delta FPO",
        "quality_notes": "Intense pungency, crisp dark green pods, packed in ventilated crates.",
        "status": "active"
    }
]

# Active Buyer Demands (Buyer Listings)
BUYER_DEMANDS = [
    {
        "id": "DEMAND_301",
        "buyer_id": "BUYER_9901",
        "buyer_name": "KisanSetu Food Processing Ltd",
        "buyer_company": "KisanSetu Foods",
        "crop_required": "Tomato",
        "quantity_needed_quintals": 100,
        "target_price_per_kg": 33.0,
        "location": "Processing Plant, Vashi APMC / Bhiwandi Hub",
        "expiry_deadline": (datetime.now() + timedelta(days=5)).strftime("%Y-%m-%d"),
        "urgency": "Immediate (Processing Line Active)",
        "status": "active",
        "notes": "Grade A ripe hybrid tomatoes needed for pureeing line. Daily lot delivery acceptable."
    },
    {
        "id": "DEMAND_302",
        "buyer_id": "BUYER_8842",
        "buyer_name": "Metro Cash & Carry Procurement",
        "buyer_company": "Metro Wholesale India",
        "crop_required": "Onion",
        "quantity_needed_quintals": 250,
        "target_price_per_kg": 25.0,
        "location": "Regional Distribution Centre, Thane West",
        "expiry_deadline": (datetime.now() + timedelta(days=10)).strftime("%Y-%m-%d"),
        "urgency": "High",
        "status": "active",
        "notes": "Red onion 50mm+ uniform grading, clean mesh bags 25kg each."
    },
    {
        "id": "DEMAND_303",
        "buyer_id": "BUYER_7210",
        "buyer_name": "Haldiram Snack Foods Corp",
        "buyer_company": "Haldiram Snacks Ltd",
        "crop_required": "Potato",
        "quantity_needed_quintals": 500,
        "target_price_per_kg": 19.5,
        "location": "Bhiwadi Industrial Estate / Noida",
        "expiry_deadline": (datetime.now() + timedelta(days=14)).strftime("%Y-%m-%d"),
        "urgency": "Contract Buy",
        "status": "active",
        "notes": "Kufri Chipsona low-sugar variety, tested with iodine dip."
    },
    {
        "id": "DEMAND_304",
        "buyer_id": "BUYER_6155",
        "buyer_name": "Adani Wilmar Agri Staples",
        "buyer_company": "Adani Wilmar Ltd",
        "crop_required": "Soybean",
        "quantity_needed_quintals": 400,
        "target_price_per_kg": 47.5,
        "location": "Crushing Plant, Vidisha, MP",
        "expiry_deadline": (datetime.now() + timedelta(days=8)).strftime("%Y-%m-%d"),
        "urgency": "Standard",
        "status": "active",
        "notes": "Clean soybean, oil content >18.5%, moisture <10%."
    }
]

# Transaction & Order History with Mandatory Post-Trade Quality Rating Trigger
TRANSACTIONS = [
    {
        "id": "TXN_78201",
        "buyer_id": "BUYER_9901",
        "buyer_name": "KisanSetu Food Processing Ltd",
        "farmer_id": "FARMER_4821",
        "farmer_name": "Rameshwar Patil",
        "crop": "Tomato",
        "variety": "Hybrid Shivam",
        "quantity_quintals": 30,
        "price_per_kg": 29.5,
        "total_amount": 88500,
        "status": "COMPLETED",
        "order_date": (datetime.now() - timedelta(days=4)).strftime("%Y-%m-%d"),
        "delivery_date": (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d"),
        "payout_status": "Paid to Farmer Escrow",
        "rating_submitted": True,
        "quality_rating": 5,
        "rating_feedback": "Exceptional produce quality! Uniform ripening, zero spoilage in crates. Honest grading."
    },
    {
        "id": "TXN_78202",
        "buyer_id": "BUYER_9901",
        "buyer_name": "KisanSetu Food Processing Ltd",
        "farmer_id": "FARMER_5102",
        "farmer_name": "Dnyaneshwar Shinde",
        "crop": "Onion",
        "variety": "Nashik Garwa Red",
        "quantity_quintals": 80,
        "price_per_kg": 22.0,
        "total_amount": 176000,
        "status": "COMPLETED",
        "order_date": (datetime.now() - timedelta(days=8)).strftime("%Y-%m-%d"),
        "delivery_date": (datetime.now() - timedelta(days=3)).strftime("%Y-%m-%d"),
        "payout_status": "Paid to Farmer Bank",
        "rating_submitted": False,  # Eligible for mandatory rating!
        "quality_rating": None,
        "rating_feedback": None
    },
    {
        "id": "TXN_78203",
        "buyer_id": "BUYER_8842",
        "buyer_name": "Metro Cash & Carry",
        "farmer_id": "FARMER_4821",
        "farmer_name": "Rameshwar Patil",
        "crop": "Tomato",
        "variety": "Hybrid Shivam",
        "quantity_quintals": 20,
        "price_per_kg": 31.0,
        "total_amount": 62000,
        "status": "IN_TRANSIT",
        "order_date": (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d"),
        "delivery_date": "Expected Tomorrow",
        "payout_status": "Held in AgriMarket Escrow",
        "rating_submitted": False,  # Cannot rate yet because IN_TRANSIT
        "quality_rating": None,
        "rating_feedback": None
    },
    {
        "id": "TXN_78204",
        "buyer_id": "BUYER_9901",
        "buyer_name": "KisanSetu Food Processing Ltd",
        "farmer_id": "FARMER_4821",
        "farmer_name": "Rameshwar Patil",
        "crop": "Green Chilli",
        "variety": "Guntur Teja",
        "quantity_quintals": 15,
        "price_per_kg": 52.0,
        "total_amount": 78000,
        "status": "PENDING_CONFIRMATION",
        "order_date": datetime.now().strftime("%Y-%m-%d"),
        "delivery_date": "Pending Farmer Weighing",
        "payout_status": "Buyer Escrow Initiated",
        "rating_submitted": False,
        "quality_rating": None,
        "rating_feedback": None
    }
]

# Circles Screen: Internal FPO Trade Transparency Dashboard
FPO_CIRCLES = {
    "circle_id": "FPO_MAHA_2021_88",
    "name": "Sahyadri Agro Producers Circle (Nashik Cluster)",
    "admin_fpo": "Sahyadri Agro Farmers Producer Co. Ltd",
    "total_members": 142,
    "cluster_area": "Niphad, Dindori & Kalwan Talukas",
    "summary_metrics": {
        "monthly_volume_traded_quintals": 8450,
        "monthly_turnover_inr": 23480000,  # ₹2.34 Cr
        "avg_mandi_premium_percent": 12.4,  # +12.4% better than local broker rates
        "active_collective_contracts": 6,
        "fpo_refrigerated_trucks": 4
    },
    "trade_logs": [
        {
            "id": "CIRC_LOG_01",
            "timestamp": "Today, 11:20 AM",
            "member_id": "MEM_4821 (R. Patil)",
            "crop": "Tomato (Hybrid Shivam)",
            "quantity_quintals": 30,
            "rate_realized": "₹29.50 / kg",
            "mandi_benchmark": "₹26.00 / kg (+13.5% gain)",
            "buyer": "KisanSetu Foods (Direct Contract)",
            "audit_status": "Verified on Weighbridge",
            "payment_route": "Direct DBT to Farmer"
        },
        {
            "id": "CIRC_LOG_02",
            "timestamp": "Today, 09:45 AM",
            "member_id": "MEM_3109 (B. Kadam)",
            "crop": "Onion (Nashik Red)",
            "quantity_quintals": 65,
            "rate_realized": "₹24.00 / kg",
            "mandi_benchmark": "₹21.50 / kg (+11.6% gain)",
            "buyer": "Metro Wholesale Hub",
            "audit_status": "Dispatched in FPO Reefer Truck",
            "payment_route": "Direct DBT to Farmer"
        },
        {
            "id": "CIRC_LOG_03",
            "timestamp": "Yesterday, 04:15 PM",
            "member_id": "MEM_8112 (S. Gaikwad)",
            "crop": "Grapes (Thompson Seedless)",
            "quantity_quintals": 40,
            "rate_realized": "₹78.00 / kg",
            "mandi_benchmark": "₹69.00 / kg (+13.0% gain)",
            "buyer": "FreshPik Export Consortium",
            "audit_status": "Cold Chain Verified (2°C Logged)",
            "payment_route": "Direct DBT to Farmer"
        },
        {
            "id": "CIRC_LOG_04",
            "timestamp": "Yesterday, 01:30 PM",
            "member_id": "MEM_2901 (K. Pawar)",
            "crop": "Pomegranate (Bhagwa)",
            "quantity_quintals": 22,
            "rate_realized": "₹115.00 / kg",
            "mandi_benchmark": "₹102.00 / kg (+12.7% gain)",
            "buyer": "Zomato Hyperpure Procurement",
            "audit_status": "Verified on Weighbridge",
            "payment_route": "Direct DBT to Farmer"
        }
    ]
}

"""
AgriMarket AI Engine
Price and demand prediction logic based on APMC historical data, weather signals,
mandi arrivals, and seasonal patterns.
Conversational assistant logic with voice/text NLP handling and contextual agricultural advice.
"""

from typing import Dict, Any
from datetime import datetime
from data import MARKET_RATES, WAREHOUSES, PRODUCE_LISTINGS, BUYER_DEMANDS

def predict_crop_demand_and_price(crop_name: str) -> Dict[str, Any]:
    """
    Simulates an AI forecasting engine taking into account:
    - 6-month historical mandi arrivals
    - Weather anomalies (IMD weather warnings, heatwaves, monsoon deficits)
    - Macro institutional buying demand
    """
    # Normalize crop name
    matched_key = None
    for key in MARKET_RATES:
        if key.lower() == crop_name.lower():
            matched_key = key
            break

    if not matched_key:
        matched_key = "Tomato"  # default fallback

    data = MARKET_RATES[matched_key]
    
    # Calculate projected margin
    current = data["current_price"]
    one_month_pred = data["predictions"]["1_month"]["price"]
    diff_percent = round(((one_month_pred - current) / current) * 100, 1)

    return {
        "crop": matched_key,
        "variety": data["variety"],
        "current_rate_per_kg": current,
        "mandi_name": data["mandi_name"],
        "day_change": data["day_change"],
        "trend_direction": data["trend_direction"],
        "arrival_volume": data["arrival_volume"],
        "weather_signal": data["weather_signal"],
        "predictions": data["predictions"],
        "projected_one_month_gain_pct": diff_percent,
        "historical_weekly": data["historical_weekly"],
        "advisory": data["advisory"],
        "engine_version": "AgriForecast-v2.4-NeuralBlend",
        "timestamp": datetime.now().isoformat()
    }


def process_ai_assistant_query(query: str, user_role: str = "farmer") -> Dict[str, Any]:
    """
    Contextual NLP assistant handling voice and text queries for farmers and buyers.
    Provides actionable insights, price updates, storage recommendations, and app navigation.
    """
    q = query.lower().strip()

    # Rate inquiries
    for crop in ["tomato", "onion", "potato", "wheat", "soybean", "green chilli", "chilli"]:
        if crop in q:
            key = "Green Chilli" if "chilli" in crop else crop.capitalize()
            forecast = predict_crop_demand_and_price(key)
            return {
                "query": query,
                "reply": f"Live rate for {key} at {forecast['mandi_name']} is ₹{forecast['current_rate_per_kg']}/kg ({forecast['day_change']}). AI Predictor forecasts ₹{forecast['predictions']['1_month']['price']}/kg in 1 month with {forecast['predictions']['1_month']['demand']}. Weather signal: {forecast['weather_signal']}",
                "context_card": "rates",
                "crop_key": key,
                "recommended_action": f"Check {key} in Market Predictor tab or list your harvested lot now.",
                "navigation_target": "Home"
            }

    # Storage / Warehouse inquiries
    if any(term in q for term in ["cold storage", "warehouse", "godown", "storage", "store"]):
        return {
            "query": query,
            "reply": "Found 4 nearby facilities in your district. Closest is Sahyadri Cold Chain (4.5 km away, ₹110/crate/mo, 850 MT available). For grains, FCI Central Godown is 8.2 km away at ₹45/quintal/mo with e-NWR warehouse receipt pledge financing.",
            "context_card": "warehouses",
            "recommended_action": "Tap on the Local Storage directory below to contact the warehouse manager directly.",
            "navigation_target": "Home"
        }

    # FPO Circles / Transparency inquiries
    if any(term in q for term in ["circle", "fpo", "transparency", "members", "group trade"]):
        return {
            "query": query,
            "reply": "In the Circles tab, your FPO 'Sahyadri Agro Producers' has traded 8,450 Quintals this month at an average +12.4% price premium over local private brokers. All weighbridge logs and direct DBT records are audited.",
            "context_card": "circles",
            "recommended_action": "Switch to 'Circles' tab in bottom navigation for real-time audit ledger.",
            "navigation_target": "Circles"
        }

    # Upload Produce / How to sell inquiries
    if any(term in q for term in ["upload", "sell", "list", "post yield", "harvest"]):
        return {
            "query": query,
            "reply": "To list your crop, tap the center (+) 'Upload Produce' button on the navigation bar. Provide crop name, available quantity, minimum price/kg, expiry deadline, and farm pickup address.",
            "context_card": "upload",
            "recommended_action": "Opening Produce Listing Form...",
            "navigation_target": "Upload Produce"
        }

    # Buyer demand inquiries
    if any(term in q for term in ["buyer", "demand", "order", "bulk"]):
        count = len(BUYER_DEMANDS)
        top_buyer = BUYER_DEMANDS[0]
        return {
            "query": query,
            "reply": f"There are currently {count} verified bulk buyers seeking immediate supplies. Top match: {top_buyer['buyer_name']} is procuring {top_buyer['quantity_needed_quintals']} quintals of {top_buyer['crop_required']} at ₹{top_buyer['target_price_per_kg']}/kg.",
            "context_card": "demands",
            "recommended_action": "Tap 'Sell Now' on the buyer demand card to initiate direct escrow agreement.",
            "navigation_target": "Home"
        }

    # Weather / Pest advice inquiries
    if any(term in q for term in ["weather", "rain", "monsoon", "pest", "disease", "fertilizer"]):
        return {
            "query": query,
            "reply": "Weather Advisory for Nashik cluster: Clear skies expected next 48 hours, day peak 34°C. Ideal window for harvesting mature tomato and onion crops. Ensure dry curing before bag packing to avoid fungal rot.",
            "context_card": "advisory",
            "recommended_action": "Check crop advisories in the Market Rates card.",
            "navigation_target": "Home"
        }

    # Default general assistance
    role_hint = "As a verified smallholder farmer" if user_role == "farmer" else "As an institutional bulk buyer"
    return {
        "query": query,
        "reply": f"Namaste! {role_hint}, I can help you check live APMC mandi prices, run AI 30-day price forecasts, find nearby cold storages, browse active buyer demands, or guide you through listing produce.",
        "context_card": "general",
        "recommended_action": "Try asking: 'What will tomato price be in 1 month?' or 'Find cold storages near me'",
        "navigation_target": "Home"
    }

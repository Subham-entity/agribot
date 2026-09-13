/**
 * AgriMarket API Client
 * Connects to FastAPI backend at http://127.0.0.1:8000
 */

const API_BASE = "http://127.0.0.1:8000/api";

export async function fetchMarketRates() {
  try {
    const res = await fetch(`${API_BASE}/rates`);
    if (!res.ok) throw new Error("Failed to fetch rates");
    return await res.json();
  } catch (err) {
    console.warn("Using fallback rates:", err);
    return null;
  }
}

export async function fetchCropPrediction(cropName) {
  try {
    const res = await fetch(`${API_BASE}/predict/${encodeURIComponent(cropName)}`);
    if (!res.ok) throw new Error("Failed to fetch prediction");
    return await res.json();
  } catch (err) {
    console.warn("Prediction fallback error:", err);
    return null;
  }
}

export async function sendAiQuery(query, role = "farmer", isVoice = false) {
  try {
    const res = await fetch(`${API_BASE}/ai-assistant`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, role, is_voice: isVoice }),
    });
    if (!res.ok) throw new Error("AI query failed");
    return await res.json();
  } catch (err) {
    console.warn("AI Assistant fallback error:", err);
    return {
      query,
      reply: "Namaste! AgriMarket AI Assistant is ready. Live rates: Tomato ₹32/kg (surge predicted), Onion ₹24.5/kg. Sahyadri Cold Storage is 4.5km away.",
      context_card: "rates"
    };
  }
}

export async function fetchProduceListings(crop = "") {
  try {
    const url = crop ? `${API_BASE}/produce?crop=${encodeURIComponent(crop)}` : `${API_BASE}/produce`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch produce");
    return await res.json();
  } catch (err) {
    console.warn("Produce fallback:", err);
    return [];
  }
}

export async function createProduceListing(payload) {
  const res = await fetch(`${API_BASE}/produce`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: "Failed to upload produce" }));
    throw new Error(errorData.detail || "Validation error");
  }
  return await res.json();
}

export async function fetchBuyerDemands(crop = "") {
  try {
    const url = crop ? `${API_BASE}/demands?crop=${encodeURIComponent(crop)}` : `${API_BASE}/demands`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch demands");
    return await res.json();
  } catch (err) {
    console.warn("Demands fallback:", err);
    return [];
  }
}

export async function createBuyerDemand(payload) {
  const res = await fetch(`${API_BASE}/demands`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: "Failed to post demand" }));
    throw new Error(errorData.detail || "Validation error");
  }
  return await res.json();
}

export async function fetchWarehouses() {
  try {
    const res = await fetch(`${API_BASE}/warehouses`);
    if (!res.ok) throw new Error("Failed to fetch warehouses");
    return await res.json();
  } catch (err) {
    console.warn("Warehouse fallback:", err);
    return [];
  }
}

export async function fetchCircles() {
  try {
    const res = await fetch(`${API_BASE}/circles`);
    if (!res.ok) throw new Error("Failed to fetch circles");
    return await res.json();
  } catch (err) {
    console.warn("Circles fallback:", err);
    return null;
  }
}

export async function fetchTransactions(role = "") {
  try {
    const url = role ? `${API_BASE}/transactions?role=${role}` : `${API_BASE}/transactions`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch transactions");
    return await res.json();
  } catch (err) {
    console.warn("Transactions fallback:", err);
    return [];
  }
}

export async function createQuickBuy(produceId, quantityQuintals) {
  const res = await fetch(`${API_BASE}/transactions/quick-buy?produce_id=${encodeURIComponent(produceId)}&quantity_quintals=${quantityQuintals}`, {
    method: "POST"
  });
  if (!res.ok) throw new Error("Purchase request failed");
  return await res.json();
}

export async function submitQualityRating(transactionId, qualityRating, feedback) {
  const res = await fetch(`${API_BASE}/transactions/rate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      transaction_id: transactionId,
      quality_rating: qualityRating,
      feedback: feedback
    })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Rating submission failed" }));
    throw new Error(err.detail || "Rating submission failed");
  }
  return await res.json();
}

export async function loginAadhaar(aadhaarNumber, role, otp = "123456") {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      aadhaar_number: aadhaarNumber,
      role: role,
      otp: otp
    })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Aadhaar verification failed" }));
    throw new Error(err.detail || "Aadhaar verification failed");
  }
  return await res.json();
}

export async function createDemandOffer(demandId, payload) {
  const res = await fetch(`${API_BASE}/demands/${encodeURIComponent(demandId)}/offer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to send offer" }));
    throw new Error(err.detail || "Failed to send offer");
  }
  return await res.json();
}

export async function bookWarehouseStorage(payload) {
  const res = await fetch(`${API_BASE}/warehouses/book`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to book storage" }));
    throw new Error(err.detail || "Failed to book storage");
  }
  return await res.json();
}

export async function updateTransactionStatus(transactionId, status) {
  const res = await fetch(`${API_BASE}/transactions/${encodeURIComponent(transactionId)}/status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to update transaction status" }));
    throw new Error(err.detail || "Failed to update transaction status");
  }
  return await res.json();
}

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Star, MapPin, CheckCircle2, ShieldCheck, ArrowRight, Package } from 'lucide-react';
import MarketRatesPredictor from './MarketRatesPredictor';
import AiAssistantBar from './AiAssistantBar';
import { fetchProduceListings, createQuickBuy } from '../api';

export default function BuyerHome({ onNavigate, onPurchaseSuccess }) {
  const [produceList, setProduceList] = useState([]);
  const [selectedProduce, setSelectedProduce] = useState(null);
  const [procureQuantity, setProcureQuantity] = useState('20');
  const [loading, setLoading] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  useEffect(() => {
    fetchProduceListings().then(data => {
      if (data) setProduceList(data);
    });
  }, []);

  const handleOpenPurchase = (item) => {
    setSelectedProduce(item);
    setProcureQuantity(Math.min(20, item.quantity_quintals).toString());
    setPurchaseSuccess(false);
  };

  const handleExecutePurchase = async () => {
    const qty = parseFloat(procureQuantity);
    if (!qty || qty <= 0) return;

    setLoading(true);
    try {
      const res = await createQuickBuy(selectedProduce.id, qty);
      setPurchaseSuccess(true);
      setTimeout(() => {
        if (onPurchaseSuccess) onPurchaseSuccess(res.transaction);
        setSelectedProduce(null);
        setPurchaseSuccess(false);
        // Switch to history tab to show the mandatory rating trigger
        if (onNavigate) onNavigate('History');
      }, 1500);
    } catch (err) {
      alert("Error initiating purchase: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-body">
      {/* 1. Market Rates & AI Demand Predictor Card (Identical) */}
      <MarketRatesPredictor />

      {/* 2. Interactive AI Assistant Bar (Identical) */}
      <AiAssistantBar userRole="buyer" onNavigate={onNavigate} />

      {/* 3. Farmer Produce List */}
      <div className="ui-card">
        <div className="card-header-flex">
          <div className="card-title-badge">
            <div style={{ background: '#ecfdf5', padding: 6, borderRadius: 8 }}>
              <Package size={18} color="#059669" />
            </div>
            <div>
              <h3 className="card-heading">Verified Farmer Produce Lots</h3>
              <p style={{ fontSize: '0.7rem', color: '#64748b' }}>Direct Farm-Gate Procurement with Quality Assurance</p>
            </div>
          </div>
          <span style={{ fontSize: '0.72rem', background: '#ecfdf5', color: '#047857', padding: '3px 8px', borderRadius: 999, fontWeight: 700 }}>
            {produceList.length} Active Lots
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
          {produceList.map((item) => (
            <div key={item.id} className="feed-item-card">
              <div className="feed-header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="feed-crop-title">{item.crop_name}</span>
                    <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>({item.variety})</span>
                  </div>
                  <div className="feed-variety" style={{ marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>Farmer: <strong>{item.farmer_name}</strong></span>
                    {item.fpo_affiliation && (
                      <span style={{ background: '#f1f5f9', color: '#334155', padding: '1px 6px', borderRadius: 4, fontSize: '0.66rem' }}>
                        {item.fpo_affiliation}
                      </span>
                    )}
                  </div>
                </div>

                <div className="feed-price-tag">
                  <div className="feed-price-val">₹{item.min_price_per_kg}</div>
                  <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Min Ask / kg</div>
                </div>
              </div>

              {/* Verified Reputation Score & Anti-Fraud Badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 6, padding: '4px 8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Star size={13} color="#f59e0b" fill="#f59e0b" />
                  <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#92400e' }}>
                    Farmer Reputation: {item.farmer_reputation} / 5.0
                  </span>
                  <span style={{ fontSize: '0.66rem', color: '#78350f' }}>
                    ({item.total_ratings} verified trades)
                  </span>
                </div>
                <span style={{ fontSize: '0.66rem', fontWeight: 700, color: '#047857', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                  <ShieldCheck size={11} />
                  Aadhaar KYC
                </span>
              </div>

              {/* Details grid */}
              <div className="feed-details-grid">
                <div>
                  <span className="detail-label">Available Yield:</span>
                  <div className="detail-val">{item.quantity_quintals} Quintals ({item.quantity_quintals * 100} kg)</div>
                </div>
                <div>
                  <span className="detail-label">Farm Location:</span>
                  <div className="detail-val">{item.pickup_location}</div>
                </div>
                <div>
                  <span className="detail-label">Harvest Date:</span>
                  <div className="detail-val">{item.harvest_date}</div>
                </div>
                <div>
                  <span className="detail-label">Shelf-Life Deadline:</span>
                  <div className="detail-val" style={{ color: '#dc2626' }}>
                    ⏳ {item.expiry_deadline}
                  </div>
                </div>
              </div>

              {item.quality_notes && (
                <div style={{ fontSize: '0.72rem', color: '#475569', fontStyle: 'italic' }}>
                  "{item.quality_notes}"
                </div>
              )}

              {/* Purchase action */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                <button
                  className="btn-primary"
                  style={{ padding: '7px 14px', fontSize: '0.8rem' }}
                  onClick={() => handleOpenPurchase(item)}
                >
                  <ShoppingCart size={14} />
                  <span>Connect / Purchase</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Purchase / Escrow Contract Modal */}
      {selectedProduce && (
        <div className="modal-overlay" onClick={() => setSelectedProduce(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: 6 }}>
              Procurement Agreement: {selectedProduce.crop_name}
            </h3>
            <p style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: 12 }}>
              Connecting directly with <strong>{selectedProduce.farmer_name}</strong> (Reputation: ★ {selectedProduce.farmer_reputation}).
            </p>

            {purchaseSuccess ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <CheckCircle2 size={36} color="#16a34a" style={{ margin: '0 auto 8px' }} />
                <h4 style={{ fontWeight: 800, color: '#064e3b' }}>Order Created & Delivered!</h4>
                <p style={{ fontSize: '0.76rem', color: '#64748b', marginTop: 4 }}>
                  Redirecting to History for mandatory quality rating...
                </p>
              </div>
            ) : (
              <div>
                <div className="form-group">
                  <label className="form-label">Procurement Quantity (Quintals)</label>
                  <input
                    type="number"
                    step="0.5"
                    max={selectedProduce.quantity_quintals}
                    min="1"
                    className="form-input"
                    value={procureQuantity}
                    onChange={(e) => setProcureQuantity(e.target.value)}
                  />
                  <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
                    Max available in this lot: {selectedProduce.quantity_quintals} Quintals
                  </span>
                </div>

                <div style={{ background: '#f8fafc', padding: 10, borderRadius: 8, fontSize: '0.78rem', margin: '10px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span>Rate:</span>
                    <strong>₹{selectedProduce.min_price_per_kg} / kg</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: 6 }}>
                    <span style={{ fontWeight: 800 }}>Total Escrow Commitment:</span>
                    <strong style={{ color: '#059669', fontSize: '1.05rem' }}>
                      ₹{((parseFloat(procureQuantity) || 0) * 100 * selectedProduce.min_price_per_kg).toLocaleString('en-IN')}
                    </strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                  <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setSelectedProduce(null)}>
                    Cancel
                  </button>
                  <button className="btn-primary" style={{ flex: 1.5 }} onClick={handleExecutePurchase} disabled={loading}>
                    {loading ? 'Processing...' : 'Confirm Purchase'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

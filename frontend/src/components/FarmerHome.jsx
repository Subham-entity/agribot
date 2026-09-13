import React, { useState, useEffect } from 'react';
import { ShoppingBag, ArrowUpRight, MapPin, Clock, CheckCircle, PhoneCall } from 'lucide-react';
import MarketRatesPredictor from './MarketRatesPredictor';
import AiAssistantBar from './AiAssistantBar';
import WarehouseDirectory from './WarehouseDirectory';
import { fetchBuyerDemands, createDemandOffer } from '../api';

export default function FarmerHome({ onNavigate, onDirectSell }) {
  const [demands, setDemands] = useState([]);
  const [selectedDemand, setSelectedDemand] = useState(null);
  const [offerQty, setOfferQty] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchBuyerDemands().then(data => {
      if (data) setDemands(data);
    });
  }, []);

  const handleSellClick = (demand) => {
    setSelectedDemand(demand);
    setOfferQty(demand.quantity_needed_quintals.toString());
    setContactSuccess(false);
    setErrorMsg('');
  };

  const handleConfirmSell = async () => {
    if (!selectedDemand) return;
    const qty = parseFloat(offerQty) || selectedDemand.quantity_needed_quintals;
    if (qty <= 0) {
      setErrorMsg('Please enter a valid quantity.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      await createDemandOffer(selectedDemand.id, {
        quantity_quintals: qty,
        offered_price_per_kg: selectedDemand.target_price_per_kg
      });
      setContactSuccess(true);
      setTimeout(() => {
        setSelectedDemand(null);
        setContactSuccess(false);
        if (onNavigate) onNavigate('History');
      }, 1800);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit offer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-body">
      {/* 1. Market Rates & AI Demand Predictor Card */}
      <MarketRatesPredictor />

      {/* 2. Interactive AI Assistant Bar */}
      <AiAssistantBar userRole="farmer" onNavigate={onNavigate} />

      {/* 3. Buyer Demand List Feed */}
      <div className="ui-card">
        <div className="card-header-flex">
          <div className="card-title-badge">
            <div style={{ background: '#eff6ff', padding: 6, borderRadius: 8 }}>
              <ShoppingBag size={18} color="#2563eb" />
            </div>
            <div>
              <h3 className="card-heading">Active Buyer Demands</h3>
              <p style={{ fontSize: '0.7rem', color: '#64748b' }}>Verified Institutional & Processor Contracts</p>
            </div>
          </div>
          <span style={{ fontSize: '0.72rem', background: '#dbeafe', color: '#1e40af', padding: '3px 8px', borderRadius: 999, fontWeight: 700 }}>
            {demands.length} Verified Buyers
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
          {demands.map((demand) => (
            <div key={demand.id} className="feed-item-card">
              <div className="feed-header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="feed-crop-title">{demand.crop_required}</span>
                    <span 
                      style={{ 
                        fontSize: '0.66rem', 
                        fontWeight: 800, 
                        background: '#fef3c7', 
                        color: '#92400e', 
                        padding: '2px 6px', 
                        borderRadius: 4 
                      }}
                    >
                      {demand.urgency}
                    </span>
                  </div>
                  <div className="feed-variety" style={{ marginTop: 2 }}>
                    Buyer: <strong>{demand.buyer_company}</strong> ({demand.buyer_name})
                  </div>
                </div>

                <div className="feed-price-tag">
                  <div className="feed-price-val">₹{demand.target_price_per_kg}</div>
                  <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Target Rate / kg</div>
                </div>
              </div>

              {/* Grid details */}
              <div className="feed-details-grid">
                <div>
                  <span className="detail-label">Required Lot:</span>
                  <div className="detail-val">{demand.quantity_needed_quintals} Quintals ({demand.quantity_needed_quintals * 100} kg)</div>
                </div>
                <div>
                  <span className="detail-label">Delivery Hub:</span>
                  <div className="detail-val">{demand.location}</div>
                </div>
                <div>
                  <span className="detail-label">Total Contract Value:</span>
                  <div className="detail-val" style={{ color: '#059669' }}>
                    ₹{((demand.quantity_needed_quintals * 100 * demand.target_price_per_kg)).toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <span className="detail-label">Procurement Deadline:</span>
                  <div className="detail-val" style={{ color: '#dc2626' }}>
                    ⏳ {demand.expiry_deadline}
                  </div>
                </div>
              </div>

              {demand.notes && (
                <div style={{ fontSize: '0.72rem', color: '#475569', fontStyle: 'italic' }}>
                  "{demand.notes}"
                </div>
              )}

              {/* Action row */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
                <button
                  className="btn-primary"
                  style={{ padding: '7px 14px', fontSize: '0.78rem' }}
                  onClick={() => handleSellClick(demand)}
                >
                  <span>Contact / Sell Lot</span>
                  <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Local Storage & Warehouse Directory */}
      <WarehouseDirectory />

      {/* Direct Contact/Sell Modal */}
      {selectedDemand && (
        <div className="modal-overlay" onClick={() => setSelectedDemand(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: 8 }}>
              Connect with Buyer: {selectedDemand.buyer_company}
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: 14 }}>
              Direct escrow contract for {selectedDemand.quantity_needed_quintals} Quintals of {selectedDemand.crop_required}.
            </p>

            {contactSuccess ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <CheckCircle size={36} color="#16a34a" style={{ margin: '0 auto 8px' }} />
                <h4 style={{ fontWeight: 800, color: '#065f46' }}>Agreement Proposal Sent!</h4>
                <p style={{ fontSize: '0.76rem', color: '#64748b', marginTop: 4 }}>
                  Buyer notified via SMS & AgriMarket Escrow desk.
                </p>
              </div>
            ) : (
              <div>
                {errorMsg && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '6px 10px', borderRadius: 6, fontSize: '0.74rem', marginBottom: 10 }}>
                    {errorMsg}
                  </div>
                )}
                <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, fontSize: '0.78rem', marginBottom: 12 }}>
                  <div><strong>Buyer Representative:</strong> {selectedDemand.buyer_name}</div>
                  <div><strong>Target Rate:</strong> ₹{selectedDemand.target_price_per_kg} / kg</div>
                  <div><strong>Destination:</strong> {selectedDemand.location}</div>
                  <div><strong>Payment Route:</strong> Instant Escrow Release on Weighbridge Slip</div>
                </div>

                <div className="form-group" style={{ marginBottom: 12 }}>
                  <label className="form-label">Offer Quantity (Quintals)</label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    max={selectedDemand.quantity_needed_quintals}
                    className="form-input"
                    value={offerQty}
                    onChange={(e) => setOfferQty(e.target.value)}
                  />
                  <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
                    Total Offer Value: ₹{((parseFloat(offerQty) || 0) * 100 * selectedDemand.target_price_per_kg).toLocaleString('en-IN')}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setSelectedDemand(null)} disabled={loading}>
                    Cancel
                  </button>
                  <button className="btn-primary" style={{ flex: 1.5 }} onClick={handleConfirmSell} disabled={loading}>
                    <PhoneCall size={14} />
                    <span>{loading ? 'Creating Contract...' : 'Confirm & Send Offer'}</span>
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

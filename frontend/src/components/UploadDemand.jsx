import React, { useState } from 'react';
import { PlusCircle, Calendar, MapPin, Package, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { createBuyerDemand } from '../api';

export default function UploadDemand({ onDemandCreated, onNavigate }) {
  const todayStr = new Date().toISOString().split('T')[0];
  const defaultDeadline = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [cropRequired, setCropRequired] = useState('Tomato');
  const [quantityNeeded, setQuantityNeeded] = useState('150');
  const [targetPrice, setTargetPrice] = useState('34.0');
  const [location, setLocation] = useState('Processing Plant, Vashi APMC / Bhiwandi Hub');
  const [expiryDeadline, setExpiryDeadline] = useState(defaultDeadline);
  const [urgency, setUrgency] = useState('Immediate (Processing Line Active)');
  const [notes, setNotes] = useState('Grade A ripe hybrid tomatoes needed for pureeing line. Daily lot delivery acceptable.');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successData, setSuccessData] = useState(null);

  const qty = parseFloat(quantityNeeded) || 0;
  const price = parseFloat(targetPrice) || 0;
  const totalCommitment = qty * 100 * price;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!cropRequired.trim()) {
      setErrorMsg('Please specify the required crop.');
      return;
    }
    if (qty <= 0) {
      setErrorMsg('Quantity needed must be greater than 0 Quintals.');
      return;
    }
    if (price <= 0) {
      setErrorMsg('Target price must be greater than ₹0/kg.');
      return;
    }
    if (expiryDeadline < todayStr) {
      setErrorMsg('Procurement deadline must be in the future.');
      return;
    }
    if (!location.trim()) {
      setErrorMsg('Procurement destination location is required.');
      return;
    }

    setLoading(true);
    try {
      const res = await createBuyerDemand({
        crop_required: cropRequired,
        quantity_needed_quintals: qty,
        target_price_per_kg: price,
        location: location,
        expiry_deadline: expiryDeadline,
        urgency: urgency,
        notes: notes
      });

      setSuccessData(res.demand);
      if (onDemandCreated) onDemandCreated(res.demand);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to post buyer demand');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-body">
      <div className="ui-card">
        <div className="card-header-flex">
          <div className="card-title-badge">
            <div style={{ background: '#eff6ff', padding: 8, borderRadius: 10 }}>
              <PlusCircle size={22} color="#2563eb" />
            </div>
            <div>
              <h3 className="card-heading" style={{ fontSize: '1.05rem' }}>Upload Bulk Demand</h3>
              <p style={{ fontSize: '0.72rem', color: '#64748b' }}>Post institutional crop requirements to farmer networks</p>
            </div>
          </div>
        </div>

        {/* Automated Expiry Logic Notification */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 12px', fontSize: '0.72rem', color: '#334155', display: 'flex', alignItems: 'center', gap: 6, margin: '8px 0 14px' }}>
          <Clock size={16} color="#d97706" style={{ flexShrink: 0 }} />
          <span>
            <strong>Automated Expiry Logic:</strong> Demands automatically cancel and delist when the specified deadline passes without a matching farmer agreement.
          </span>
        </div>

        {errorMsg && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '10px 14px', borderRadius: 8, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successData ? (
          <div style={{ textAlign: 'center', padding: '24px 12px' }}>
            <div style={{ width: 56, height: 56, background: '#dbeafe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <CheckCircle2 size={32} color="#2563eb" />
            </div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e3a8a' }}>
              Bulk Demand Published!
            </h4>
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: 4 }}>
              Your demand for <strong>{successData.quantity_needed_quintals} Quintals of {successData.crop_required}</strong> is now broadcasted to verified smallholder farmers and FPOs.
            </p>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 14, margin: '16px 0', textAlign: 'left', fontSize: '0.8rem' }}>
              <div><strong>Demand ID:</strong> {successData.id}</div>
              <div><strong>Target Price:</strong> ₹{successData.target_price_per_kg} / kg</div>
              <div><strong>Total Budget:</strong> ₹{(successData.quantity_needed_quintals * 100 * successData.target_price_per_kg).toLocaleString('en-IN')}</div>
              <div><strong>Auto-Cancel Deadline:</strong> {successData.expiry_deadline}</div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setSuccessData(null)}>
                Post Another Demand
              </button>
              <button className="btn-primary" style={{ flex: 1, background: '#1e293b' }} onClick={() => onNavigate && onNavigate('Home')}>
                Back to Feed
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Crop Required */}
            <div className="form-group">
              <label className="form-label">
                <Package size={14} />
                <span>Crop Required</span>
              </label>
              <select
                className="form-select"
                value={cropRequired}
                onChange={(e) => setCropRequired(e.target.value)}
              >
                <option value="Tomato">Tomato (Processing / Puree)</option>
                <option value="Onion">Onion (Nashik Garwa Red)</option>
                <option value="Potato">Potato (Chipsona Low Sugar)</option>
                <option value="Wheat">Wheat (Sharbati Flour Mill)</option>
                <option value="Soybean">Soybean (Yellow Gold Oil Mill)</option>
                <option value="Green Chilli">Green Chilli (Pungent Teja)</option>
              </select>
            </div>

            {/* Quantity and Target Price */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Quantity Needed (Quintals)</label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  className="form-input"
                  value={quantityNeeded}
                  onChange={(e) => setQuantityNeeded(e.target.value)}
                  placeholder="e.g. 150"
                  required
                />
                <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
                  = {qty * 100} kg
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Target Price (₹/kg)</label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  className="form-input"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  placeholder="e.g. 34.0"
                  required
                />
                <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
                  = ₹{price * 100} / Quintal
                </span>
              </div>
            </div>

            {/* Total Budget Box */}
            <div style={{ background: '#eff6ff', border: '1px dashed #3b82f6', borderRadius: 8, padding: '10px 12px', margin: '4px 0 14px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: '#1e40af', fontWeight: 600 }}>Total Procurement Budget:</span>
              <strong style={{ fontSize: '1.15rem', color: '#1d4ed8' }}>₹{totalCommitment.toLocaleString('en-IN')}</strong>
            </div>

            {/* Expiry Deadline & Urgency */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">
                  <Calendar size={14} />
                  <span>Expiration Deadline</span>
                </label>
                <input
                  type="date"
                  min={todayStr}
                  className="form-input"
                  value={expiryDeadline}
                  onChange={(e) => setExpiryDeadline(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Urgency Level</label>
                <select
                  className="form-select"
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                >
                  <option value="Immediate (Processing Line Active)">Immediate (Line Active)</option>
                  <option value="High (Within 5 Days)">High (Within 5 Days)</option>
                  <option value="Standard Contract (14 Days)">Standard Contract (14 Days)</option>
                </select>
              </div>
            </div>

            {/* Delivery Destination */}
            <div className="form-group">
              <label className="form-label">
                <MapPin size={14} />
                <span>Delivery Destination / Factory Gate</span>
              </label>
              <input
                type="text"
                className="form-input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Hub, APMC Market Yard, or Processing Facility"
                required
              />
            </div>

            {/* Procurement Specifications */}
            <div className="form-group">
              <label className="form-label">Quality & Delivery Guidelines</label>
              <textarea
                className="form-textarea"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Moisture test below 11%, uniform color, packaging specifications..."
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '0.92rem', background: '#1e293b', marginTop: 6 }}
              disabled={loading}
            >
              {loading ? 'Broadcasting...' : 'Publish Bulk Demand'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

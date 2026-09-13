import React, { useState } from 'react';
import { PlusCircle, Calendar, MapPin, DollarSign, Package, AlertCircle, CheckCircle2 } from 'lucide-react';
import { createProduceListing } from '../api';

export default function UploadProduce({ onListingCreated, onNavigate }) {
  const todayStr = new Date().toISOString().split('T')[0];
  const defaultDeadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [cropName, setCropName] = useState('Tomato');
  const [variety, setVariety] = useState('Hybrid Shivam (Grade A)');
  const [quantityQuintals, setQuantityQuintals] = useState('50');
  const [minPricePerKg, setMinPricePerKg] = useState('32.0');
  const [expiryDeadline, setExpiryDeadline] = useState(defaultDeadline);
  const [harvestDate, setHarvestDate] = useState(todayStr);
  const [pickupLocation, setPickupLocation] = useState('Farm Gate, Niphad Taluka, Nashik, MH');
  const [qualityNotes, setQualityNotes] = useState('Firm, uniform size, graded for export / processing, moisture checked.');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successData, setSuccessData] = useState(null);

  // Live valuation calculation
  const qty = parseFloat(quantityQuintals) || 0;
  const price = parseFloat(minPricePerKg) || 0;
  const totalValuation = qty * 100 * price;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Strict validation
    if (!cropName.trim()) {
      setErrorMsg('Please specify a valid crop name.');
      return;
    }
    if (qty <= 0) {
      setErrorMsg('Available quantity must be greater than 0 Quintals.');
      return;
    }
    if (price <= 0) {
      setErrorMsg('Minimum price must be greater than ₹0/kg.');
      return;
    }
    if (expiryDeadline < todayStr) {
      setErrorMsg('Shelf-life deadline cannot be in the past.');
      return;
    }
    if (!pickupLocation.trim()) {
      setErrorMsg('Pickup location address is required.');
      return;
    }

    setLoading(true);
    try {
      const res = await createProduceListing({
        crop_name: cropName,
        variety: variety,
        quantity_quintals: qty,
        min_price_per_kg: price,
        expiry_deadline: expiryDeadline,
        harvest_date: harvestDate,
        pickup_location: pickupLocation,
        quality_notes: qualityNotes
      });

      setSuccessData(res.listing);
      if (onListingCreated) onListingCreated(res.listing);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to list produce');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-body">
      <div className="ui-card">
        <div className="card-header-flex">
          <div className="card-title-badge">
            <div style={{ background: '#ecfdf5', padding: 8, borderRadius: 10 }}>
              <PlusCircle size={22} color="#059669" />
            </div>
            <div>
              <h3 className="card-heading" style={{ fontSize: '1.05rem' }}>Upload Produce Lot</h3>
              <p style={{ fontSize: '0.72rem', color: '#64748b' }}>Post upcoming or harvested yield to B2B network</p>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '10px 14px', borderRadius: 8, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 6, margin: '10px 0' }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successData ? (
          <div style={{ textAlign: 'center', padding: '24px 12px' }}>
            <div style={{ width: 56, height: 56, background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <CheckCircle2 size={32} color="#16a34a" />
            </div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#064e3b' }}>
              Produce Lot Published!
            </h4>
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: 4 }}>
              Your lot of <strong>{successData.quantity_quintals} Quintals of {successData.crop_name}</strong> is now live across institutional buyers with your verified Aadhaar rating.
            </p>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 14, margin: '16px 0', textAlign: 'left', fontSize: '0.8rem' }}>
              <div><strong>Lot ID:</strong> {successData.id}</div>
              <div><strong>Minimum Price:</strong> ₹{successData.min_price_per_kg} / kg</div>
              <div><strong>Total Lot Value:</strong> ₹{(successData.quantity_quintals * 100 * successData.min_price_per_kg).toLocaleString('en-IN')}</div>
              <div><strong>Shelf-Life Deadline:</strong> {successData.expiry_deadline}</div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setSuccessData(null)}>
                Upload Another Lot
              </button>
              <button className="btn-primary" style={{ flex: 1 }} onClick={() => onNavigate && onNavigate('Home')}>
                Back to Home Feed
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ marginTop: 8 }}>
            {/* Crop Name */}
            <div className="form-group">
              <label className="form-label">
                <Package size={14} />
                <span>Crop Name</span>
              </label>
              <select
                className="form-select"
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
              >
                <option value="Tomato">Tomato (Processing / Table)</option>
                <option value="Onion">Onion (Nashik Garwa Red)</option>
                <option value="Potato">Potato (Chipsona / Low Sugar)</option>
                <option value="Wheat">Wheat (Sharbati Premium)</option>
                <option value="Soybean">Soybean (Yellow Gold JS)</option>
                <option value="Green Chilli">Green Chilli (Guntur Teja)</option>
                <option value="Grapes">Grapes (Thompson Seedless)</option>
                <option value="Pomegranate">Pomegranate (Bhagwa)</option>
              </select>
            </div>

            {/* Variety / Grade */}
            <div className="form-group">
              <label className="form-label">Variety / Quality Specification</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Hybrid Shivam, 50mm+ graded"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
              />
            </div>

            {/* Quantity and Price Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Quantity (Quintals)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  className="form-input"
                  value={quantityQuintals}
                  onChange={(e) => setQuantityQuintals(e.target.value)}
                  placeholder="e.g. 50"
                  required
                />
                <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
                  = {qty * 100} kg
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Min Price (₹/kg)</label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  className="form-input"
                  value={minPricePerKg}
                  onChange={(e) => setMinPricePerKg(e.target.value)}
                  placeholder="e.g. 30.0"
                  required
                />
                <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
                  = ₹{price * 100} / Quintal
                </span>
              </div>
            </div>

            {/* Live Valuation Box */}
            <div style={{ background: '#ecfdf5', border: '1px dashed #059669', borderRadius: 8, padding: '10px 12px', margin: '4px 0 14px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: '#064e3b', fontWeight: 600 }}>Estimated Total Lot Valuation:</span>
              <strong style={{ fontSize: '1.15rem', color: '#047857' }}>₹{totalValuation.toLocaleString('en-IN')}</strong>
            </div>

            {/* Deadlines Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">
                  <Calendar size={14} />
                  <span>Harvest Date</span>
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={harvestDate}
                  onChange={(e) => setHarvestDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Calendar size={14} />
                  <span>Expiry / Shelf-Life</span>
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
            </div>

            {/* Pickup Location */}
            <div className="form-group">
              <label className="form-label">
                <MapPin size={14} />
                <span>Farm Gate / Pickup Location</span>
              </label>
              <input
                type="text"
                className="form-input"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                placeholder="Village / Taluka / APMC proximity"
                required
              />
            </div>

            {/* Quality Notes */}
            <div className="form-group">
              <label className="form-label">Quality Notes & Packaging</label>
              <textarea
                className="form-textarea"
                rows={2}
                value={qualityNotes}
                onChange={(e) => setQualityNotes(e.target.value)}
                placeholder="e.g. Packed in ventilated 20kg plastic crates, pre-cooled at 12°C"
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '0.92rem', marginTop: 6 }}
              disabled={loading}
            >
              {loading ? 'Publishing Lot...' : 'Publish Produce to Market'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

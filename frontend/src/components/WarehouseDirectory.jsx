import React, { useState, useEffect } from 'react';
import { Warehouse, MapPin, Phone, Thermometer, ShieldCheck, Check } from 'lucide-react';
import { fetchWarehouses, bookWarehouseStorage } from '../api';

export default function WarehouseDirectory() {
  const [warehouses, setWarehouses] = useState([]);
  const [bookedMap, setBookedMap] = useState({});
  const [bookingLoading, setBookingLoading] = useState({});

  useEffect(() => {
    fetchWarehouses().then((data) => {
      if (data) setWarehouses(data);
    });
  }, []);

  const handleBook = async (wh) => {
    setBookingLoading(prev => ({ ...prev, [wh.id]: true }));
    try {
      const res = await bookWarehouseStorage({
        warehouse_id: wh.id,
        crop_name: wh.suitable_crops[0] || 'Harvested Crop',
        quantity_mt: 10,
        duration_months: 1
      });
      setBookedMap(prev => ({ ...prev, [wh.id]: res.booking_ref || 'Confirmed' }));
      // Update local available capacity
      setWarehouses(prev => prev.map(item => {
        if (item.id === wh.id) {
          return { ...item, available_capacity_mt: Math.max(0, item.available_capacity_mt - 10) };
        }
        return item;
      }));
    } catch (err) {
      alert("Storage booking error: " + err.message);
    } finally {
      setBookingLoading(prev => ({ ...prev, [wh.id]: false }));
    }
  };

  return (
    <div className="ui-card">
      <div className="card-header-flex">
        <div className="card-title-badge">
          <div style={{ background: '#f0fdf4', padding: 6, borderRadius: 8 }}>
            <Warehouse size={18} color="#059669" />
          </div>
          <div>
            <h3 className="card-heading">Nearby Storages & FCI Godowns</h3>
            <p style={{ fontSize: '0.7rem', color: '#64748b' }}>Capacity & Cold Chain Directory</p>
          </div>
        </div>
        <span style={{ fontSize: '0.72rem', background: '#ecfdf5', color: '#047857', padding: '3px 8px', borderRadius: 999, fontWeight: 700 }}>
          {warehouses.length} Facilities
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 10 }}>
        {warehouses.map((wh) => {
          const isBooked = bookedMap[wh.id];
          const isFci = wh.type.includes('FCI');
          return (
            <div
              key={wh.id}
              style={{
                border: '1px solid var(--surface-border)',
                borderRadius: 12,
                padding: 12,
                background: isFci ? '#f8fafc' : '#ffffff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span
                    style={{
                      fontSize: '0.66rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      padding: '2px 6px',
                      borderRadius: 4,
                      background: isFci ? '#dbeafe' : '#fef3c7',
                      color: isFci ? '#1e40af' : '#92400e',
                      display: 'inline-block',
                      marginBottom: 4
                    }}
                  >
                    {wh.type}
                  </span>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
                    {wh.name}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', color: '#64748b', marginTop: 2 }}>
                    <MapPin size={12} />
                    <span>{wh.location} • <strong>{wh.distance_km} km away</strong></span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#059669' }}>
                    {wh.available_capacity_mt} MT
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#64748b' }}>
                    Available / {wh.total_capacity_mt} MT
                  </div>
                </div>
              </div>

              {/* Specs and tariff */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, margin: '8px 0', fontSize: '0.72rem' }}>
                <span style={{ background: '#f1f5f9', padding: '3px 6px', borderRadius: 4, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                  <Thermometer size={12} color="#059669" />
                  <span>{wh.temp_range}</span>
                </span>
                <span style={{ background: '#f1f5f9', padding: '3px 6px', borderRadius: 4, fontWeight: 600 }}>
                  💰 Tariff: {wh.rate_structure}
                </span>
                {wh.is_govt_subsidized && (
                  <span style={{ background: '#ecfdf5', color: '#065f46', padding: '3px 6px', borderRadius: 4, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                    <ShieldCheck size={12} />
                    <span>e-NWR Pledge Eligible</span>
                  </span>
                )}
              </div>

              {/* Suitable Crops */}
              <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: 8 }}>
                Ideal for: <strong>{wh.suitable_crops.join(", ")}</strong>
              </div>

              {/* Contact / Action row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px dashed #e2e8f0', paddingTop: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.74rem', color: '#334155' }}>
                  <Phone size={13} color="#059669" />
                  <span>{wh.contact_person}: <strong>{wh.contact_phone}</strong></span>
                </div>

                <button
                  className="btn-primary"
                  style={{
                    padding: '5px 10px',
                    fontSize: '0.72rem',
                    background: isBooked ? '#16a34a' : 'var(--primary-600)'
                  }}
                  onClick={() => handleBook(wh)}
                  disabled={Boolean(isBooked || bookingLoading[wh.id])}
                >
                  {bookingLoading[wh.id] ? (
                    <span>Booking...</span>
                  ) : isBooked ? (
                    <>
                      <Check size={12} />
                      <span>Reserved ({isBooked})</span>
                    </>
                  ) : (
                    <span>Book Storage</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import React from 'react';
import { Building2, ShieldCheck, MapPin, CheckCircle2, Lock, PackageCheck, CreditCard, FileSpreadsheet } from 'lucide-react';

export default function BuyerProfile({ profile }) {
  if (!profile) return null;

  return (
    <div className="content-body">
      {/* Identity Card */}
      <div className="ui-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 62, height: 62, borderRadius: '50%', background: 'linear-gradient(135deg, #1e293b, #0f172a)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800 }}>
            {profile.company ? profile.company.charAt(0) : 'B'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{profile.company || profile.name}</h3>
              <ShieldCheck size={18} color="#059669" />
            </div>
            <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: 2 }}>
              Lead Buyer: <strong>{profile.name}</strong>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
              <MapPin size={12} />
              <span>{profile.location}</span>
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#f1f5f9', color: '#0f172a', padding: '2px 8px', borderRadius: 999, fontSize: '0.68rem', fontWeight: 700 }}>
                GSTIN: {profile.gstin}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#ecfdf5', color: '#047857', padding: '2px 8px', borderRadius: 999, fontSize: '0.68rem', fontWeight: 700 }}>
                <Lock size={10} />
                Aadhaar KYC: {profile.aadhaar}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Procurement Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
        <div className="ui-card" style={{ padding: 12, textAlign: 'center' }}>
          <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
            Total Procured Volume
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>
            {profile.total_procured_tonnes} MT
          </div>
          <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 700 }}>
            {profile.total_orders} Fulfilled Contracts
          </div>
        </div>

        <div className="ui-card" style={{ padding: 12, textAlign: 'center' }}>
          <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
            Institutional Credit
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#2563eb', margin: '4px 0' }}>
            {profile.credit_rating}
          </div>
          <div style={{ fontSize: '0.68rem', color: '#1e40af', fontWeight: 700 }}>
            Instant Escrow Liquidity
          </div>
        </div>
      </div>

      {/* Business & Logistics Details */}
      <div className="ui-card">
        <h4 style={{ fontSize: '0.92rem', fontWeight: 800, marginBottom: 10 }}>
          Commercial & Logistics Parameters
        </h4>

        <div className="feed-details-grid" style={{ background: '#ffffff', padding: 0 }}>
          <div style={{ background: 'var(--surface-subtle)', padding: 10, borderRadius: 8 }}>
            <span className="detail-label">Procurement Focus:</span>
            <div className="detail-val">{profile.procurement_focus ? profile.procurement_focus.join(", ") : "Grains, Vegetables"}</div>
          </div>
          <div style={{ background: 'var(--surface-subtle)', padding: 10, borderRadius: 8 }}>
            <span className="detail-label">Payment Terms:</span>
            <div className="detail-val" style={{ color: '#059669' }}>
              {profile.payment_terms}
            </div>
          </div>
          <div style={{ background: 'var(--surface-subtle)', padding: 10, borderRadius: 8 }}>
            <span className="detail-label">Weighbridge Integration:</span>
            <div className="detail-val" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <CheckCircle2 size={13} color="#059669" />
              <span>APMC Electronic Slips</span>
            </div>
          </div>
          <div style={{ background: 'var(--surface-subtle)', padding: 10, borderRadius: 8 }}>
            <span className="detail-label">Verified Escrow Bank:</span>
            <div className="detail-val">ICICI Mandi Settlement A/C</div>
          </div>
        </div>
      </div>

      {/* Institutional Procurement Ledger Summary */}
      <div className="ui-card">
        <div className="card-header-flex">
          <h4 style={{ fontSize: '0.92rem', fontWeight: 800 }}>Recent Procurement Audits</h4>
          <span style={{ fontSize: '0.68rem', color: '#64748b' }}>GST Reconciled</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.74rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #e2e8f0' }}>
            <span>Lot #TXN_78201 (30 Quintals Tomato)</span>
            <strong style={{ color: '#059669' }}>₹88,500 (Completed)</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #e2e8f0' }}>
            <span>Lot #TXN_78202 (80 Quintals Onion)</span>
            <strong style={{ color: '#059669' }}>₹1,76,000 (Completed)</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
            <span>Lot #TXN_78203 (20 Quintals Tomato)</span>
            <strong style={{ color: '#d97706' }}>₹62,000 (In-Transit)</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

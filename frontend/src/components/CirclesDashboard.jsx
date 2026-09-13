import React, { useState, useEffect } from 'react';
import { Users, FileCheck2, TrendingUp, ShieldAlert, Award, ArrowUpRight } from 'lucide-react';
import { fetchCircles } from '../api';

export default function CirclesDashboard() {
  const [circleData, setCircleData] = useState(null);

  useEffect(() => {
    fetchCircles().then((data) => {
      if (data) setCircleData(data);
    });
  }, []);

  if (!circleData) return null;

  return (
    <div className="content-body">
      {/* Circle Header Card */}
      <div className="ui-card" style={{ borderLeft: '4px solid #059669' }}>
        <div className="card-header-flex">
          <div className="card-title-badge">
            <div style={{ background: '#ecfdf5', padding: 8, borderRadius: 10 }}>
              <Users size={20} color="#059669" />
            </div>
            <div>
              <span style={{ fontSize: '0.66rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase' }}>
                FPO Collective Trade Transparency Ledger
              </span>
              <h3 className="card-heading" style={{ fontSize: '1.05rem' }}>
                {circleData.name}
              </h3>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4, fontSize: '0.72rem', color: '#64748b' }}>
          <span>Reg ID: <strong>{circleData.circle_id}</strong></span>
          <span>•</span>
          <span>Members: <strong>{circleData.total_members} Smallholders</strong></span>
          <span>•</span>
          <span>Cluster: <strong>{circleData.cluster_area}</strong></span>
        </div>

        {/* Notice alert */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 10px', fontSize: '0.72rem', color: '#334155', marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
          <FileCheck2 size={16} color="#059669" style={{ flexShrink: 0 }} />
          <span>
            <strong>Read-Only Member Ledger:</strong> Maintained by FPO Nodal Officers to guarantee zero broker cuts and 100% price transparency.
          </span>
        </div>
      </div>

      {/* Aggregate Financial Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
        <div className="ui-card" style={{ padding: 12, textAlign: 'center' }}>
          <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
            Monthly Volume Traded
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>
            {circleData.summary_metrics.monthly_volume_traded_quintals.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 700 }}>
            Quintals (845 MT)
          </div>
        </div>

        <div className="ui-card" style={{ padding: 12, textAlign: 'center' }}>
          <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
            Monthly Turnover
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#059669', margin: '4px 0' }}>
            ₹{(circleData.summary_metrics.monthly_turnover_inr / 10000000).toFixed(2)} Cr
          </div>
          <div style={{ fontSize: '0.68rem', color: '#047857', fontWeight: 700 }}>
            ₹{circleData.summary_metrics.monthly_turnover_inr.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="ui-card" style={{ padding: 12, textAlign: 'center', gridColumn: 'span 2', background: 'linear-gradient(135deg, #ecfdf5, #f0fdf4)', border: '1px solid #a7f3d0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <TrendingUp size={16} color="#047857" />
            <span style={{ fontSize: '0.78rem', color: '#065f46', fontWeight: 800 }}>
              Average Realization vs Local Middlemen: +{circleData.summary_metrics.avg_mandi_premium_percent}% Better Rates
            </span>
          </div>
          <p style={{ fontSize: '0.7rem', color: '#047857', marginTop: 2 }}>
            Members gained ₹28.5 Lakhs additional collective revenue through FPO bulk bargaining.
          </p>
        </div>
      </div>

      {/* Real-time Audited Trade Logs */}
      <div className="ui-card">
        <div className="card-header-flex">
          <div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 800 }}>Real-Time Trade & Sales Log</h4>
            <p style={{ fontSize: '0.68rem', color: '#64748b' }}>Live entries synchronized with APMC weighbridges</p>
          </div>
          <span style={{ fontSize: '0.68rem', background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: 999, fontWeight: 800 }}>
            AUDITED
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
          {circleData.trade_logs.map((log) => (
            <div
              key={log.id}
              style={{
                border: '1px solid var(--surface-border)',
                borderRadius: 10,
                padding: 12,
                background: '#ffffff',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '0.66rem', color: '#64748b', fontWeight: 600 }}>
                    {log.timestamp} • {log.member_id}
                  </span>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', marginTop: 2 }}>
                    {log.crop}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#059669' }}>
                    {log.rate_realized}
                  </div>
                  <span style={{ fontSize: '0.66rem', color: '#15803d', fontWeight: 700 }}>
                    {log.mandi_benchmark}
                  </span>
                </div>
              </div>

              <div style={{ background: '#f8fafc', borderRadius: 6, padding: '6px 10px', marginTop: 8, fontSize: '0.72rem', display: 'flex', justifyContent: 'space-between' }}>
                <span>Volume: <strong>{log.quantity_quintals} Quintals</strong></span>
                <span>Contract: <strong>{log.buyer}</strong></span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, fontSize: '0.68rem', borderTop: '1px dashed #e2e8f0', paddingTop: 6 }}>
                <span style={{ color: '#047857', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <FileCheck2 size={12} />
                  {log.audit_status}
                </span>
                <span style={{ color: '#64748b' }}>
                  Route: <strong>{log.payment_route}</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

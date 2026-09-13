import React, { useState, useEffect } from 'react';
import { History, Star, Award, CheckCircle2, Clock, AlertCircle, FileText } from 'lucide-react';
import RatingModal from './RatingModal';
import { fetchTransactions } from '../api';

export default function BuyerHistory() {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [activeRateTx, setActiveRateTx] = useState(null);

  const loadData = () => {
    fetchTransactions('buyer').then(data => {
      if (data) setTransactions(data);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRatingSuccess = (res) => {
    loadData();
  };

  const filtered = transactions.filter(t => {
    if (filter === 'ALL') return true;
    return t.status === filter;
  });

  const pendingRatingsCount = transactions.filter(t => t.status === 'COMPLETED' && !t.rating_submitted).length;

  return (
    <div className="content-body">
      {/* Action Banner for Mandatory Rating */}
      {pendingRatingsCount > 0 && (
        <div style={{ background: '#fffbeb', border: '1.5px solid #f59e0b', borderRadius: 12, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ background: '#fef3c7', padding: 8, borderRadius: 8 }}>
            <Award size={22} color="#d97706" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#92400e' }}>
              Action Required: {pendingRatingsCount} Order{pendingRatingsCount > 1 ? 's' : ''} Pending Quality Rating
            </div>
            <div style={{ fontSize: '0.72rem', color: '#78350f', marginTop: 1 }}>
              Mandatory post-trade quality ratings ensure authentic farmer reputations and unlock future credit tier benefits.
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
        {['ALL', 'COMPLETED', 'IN_TRANSIT', 'PENDING_CONFIRMATION'].map(tab => (
          <button
            key={tab}
            className={`crop-chip ${filter === tab ? 'selected' : ''}`}
            onClick={() => setFilter(tab)}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Transactions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(tx => {
          const isCompleted = tx.status === 'COMPLETED';
          const canRate = isCompleted && !tx.rating_submitted;

          return (
            <div
              key={tx.id}
              className="feed-item-card"
              style={{
                border: canRate ? '2px solid #f59e0b' : '1px solid var(--surface-border)'
              }}
            >
              <div className="feed-header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="feed-crop-title">{tx.crop}</span>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>({tx.variety})</span>
                  </div>
                  <div className="feed-variety" style={{ marginTop: 2 }}>
                    Farmer: <strong>{tx.farmer_name}</strong>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                    ₹{tx.total_amount.toLocaleString('en-IN')}
                  </div>
                  <span
                    style={{
                      fontSize: '0.66rem',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: 4,
                      background: isCompleted ? '#dcfce7' : '#fef3c7',
                      color: isCompleted ? '#15803d' : '#92400e',
                      display: 'inline-block',
                      marginTop: 3
                    }}
                  >
                    {tx.status}
                  </span>
                </div>
              </div>

              <div className="feed-details-grid">
                <div>
                  <span className="detail-label">Quantity Procured:</span>
                  <div className="detail-val">{tx.quantity_quintals} Quintals ({tx.quantity_quintals * 100} kg)</div>
                </div>
                <div>
                  <span className="detail-label">Price per Unit:</span>
                  <div className="detail-val">₹{tx.price_per_kg} / kg</div>
                </div>
                <div>
                  <span className="detail-label">Order Ref:</span>
                  <div className="detail-val">{tx.id}</div>
                </div>
                <div>
                  <span className="detail-label">Delivery Date:</span>
                  <div className="detail-val">{tx.delivery_date}</div>
                </div>
              </div>

              {/* Mandatory Quality Rating Trigger Area */}
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 10, marginTop: 4 }}>
                {canRate && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.74rem', color: '#b45309', fontWeight: 700 }}>
                      <AlertCircle size={14} />
                      <span>Mandatory Quality Rating Trigger: Unlocked</span>
                    </div>
                    <button
                      className="btn-primary"
                      style={{ background: '#f59e0b', color: '#ffffff', padding: '6px 14px', fontSize: '0.78rem' }}
                      onClick={() => setActiveRateTx(tx)}
                    >
                      <Star size={13} fill="#ffffff" />
                      <span>Rate Produce Quality</span>
                    </button>
                  </div>
                )}

                {tx.rating_submitted && (
                  <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 8, padding: '8px 12px', fontSize: '0.74rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ color: '#047857', fontWeight: 800 }}>
                        ✓ Quality Rating Submitted
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {[...Array(tx.quality_rating || 5)].map((_, i) => (
                          <Star key={i} size={12} color="#f59e0b" fill="#f59e0b" />
                        ))}
                        <strong style={{ marginLeft: 4, color: '#065f46' }}>{tx.quality_rating}/5</strong>
                      </div>
                    </div>
                    {tx.rating_feedback && (
                      <p style={{ color: '#334155', fontStyle: 'italic', marginTop: 4 }}>
                        "{tx.rating_feedback}"
                      </p>
                    )}
                  </div>
                )}

                {!isCompleted && (
                  <div style={{ fontSize: '0.72rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={12} />
                    <span>Quality rating will unlock once order is marked COMPLETED on arrival.</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mandatory Rating Modal */}
      <RatingModal
        isOpen={Boolean(activeRateTx)}
        onClose={() => setActiveRateTx(null)}
        transaction={activeRateTx}
        onRatingSuccess={handleRatingSuccess}
      />
    </div>
  );
}

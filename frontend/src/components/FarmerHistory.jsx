import React, { useState, useEffect } from 'react';
import { History, CheckCircle2, FileText, ShieldCheck, Check } from 'lucide-react';
import { fetchTransactions, updateTransactionStatus } from '../api';

export default function FarmerHistory() {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [selectedTx, setSelectedTx] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const loadData = () => {
    fetchTransactions('farmer').then(data => {
      if (data) setTransactions(data);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMarkCompleted = async (txId) => {
    setUpdatingId(txId);
    try {
      await updateTransactionStatus(txId, 'COMPLETED');
      loadData();
    } catch (err) {
      alert("Error updating order status: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = transactions.filter(t => {
    if (filter === 'ALL') return true;
    return t.status === filter;
  });

  const totalEarnings = transactions
    .filter(t => t.status === 'COMPLETED')
    .reduce((acc, curr) => acc + curr.total_amount, 0);

  return (
    <div className="content-body">
      {/* Earnings Summary Card */}
      <div className="ui-card" style={{ background: 'linear-gradient(135deg, #064e3b, #047857)', color: '#ffffff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#a7f3d0', fontWeight: 700 }}>
              Verified Direct DBT Payouts
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: 2 }}>
              ₹{totalEarnings.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#d1fae5', marginTop: 2 }}>
              Escrow protected across {transactions.length} orders
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.15)', padding: 10, borderRadius: 12 }}>
            <ShieldCheck size={28} color="#a7f3d0" />
          </div>
        </div>
      </div>

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

      {/* Transaction List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(tx => {
          const isDone = tx.status === 'COMPLETED';
          const isTransit = tx.status === 'IN_TRANSIT';

          return (
            <div key={tx.id} className="feed-item-card">
              <div className="feed-header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="feed-crop-title">{tx.crop}</span>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>({tx.variety})</span>
                  </div>
                  <div className="feed-variety" style={{ marginTop: 2 }}>
                    Buyer: <strong>{tx.buyer_name}</strong>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: isDone ? '#059669' : '#0f172a' }}>
                    ₹{tx.total_amount.toLocaleString('en-IN')}
                  </div>
                  <span
                    style={{
                      fontSize: '0.66rem',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: 4,
                      background: isDone ? '#dcfce7' : isTransit ? '#fef3c7' : '#f1f5f9',
                      color: isDone ? '#15803d' : isTransit ? '#92400e' : '#475569',
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
                  <span className="detail-label">Quantity:</span>
                  <div className="detail-val">{tx.quantity_quintals} Quintals ({tx.quantity_quintals * 100} kg)</div>
                </div>
                <div>
                  <span className="detail-label">Agreed Rate:</span>
                  <div className="detail-val">₹{tx.price_per_kg} / kg</div>
                </div>
                <div>
                  <span className="detail-label">Order Date:</span>
                  <div className="detail-val">{tx.order_date}</div>
                </div>
                <div>
                  <span className="detail-label">Payment Status:</span>
                  <div className="detail-val" style={{ color: '#059669' }}>
                    {tx.payout_status}
                  </div>
                </div>
              </div>

              {tx.quality_rating && (
                <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 8, padding: '6px 10px', fontSize: '0.72rem' }}>
                  ⭐ <strong>Buyer Quality Rating:</strong> {tx.quality_rating}/5 Stars
                  {tx.rating_feedback && <span style={{ fontStyle: 'italic', display: 'block', marginTop: 2 }}>"{tx.rating_feedback}"</span>}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginTop: 4 }}>
                {!isDone && (
                  <button
                    className="btn-primary"
                    style={{ padding: '5px 10px', fontSize: '0.72rem', background: '#059669' }}
                    onClick={() => handleMarkCompleted(tx.id)}
                    disabled={updatingId === tx.id}
                  >
                    <Check size={12} />
                    <span>{updatingId === tx.id ? 'Updating...' : 'Mark Delivered (Weighbridge Slip)'}</span>
                  </button>
                )}
                <button
                  className="btn-secondary"
                  style={{ padding: '5px 10px', fontSize: '0.72rem' }}
                  onClick={() => setSelectedTx(tx)}
                >
                  <FileText size={13} />
                  <span>View Trade Receipt</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trade Receipt Modal */}
      {selectedTx && (
        <div className="modal-overlay" onClick={() => setSelectedTx(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div style={{ borderBottom: '2px dashed #e2e8f0', paddingBottom: 12, marginBottom: 12, textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>AgriMarket Mandi Settlement Slip</h3>
              <p style={{ fontSize: '0.72rem', color: '#64748b' }}>Txn Ref: {selectedTx.id}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Crop & Variety:</span>
                <strong>{selectedTx.crop} ({selectedTx.variety})</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Quantity Weighed:</span>
                <strong>{selectedTx.quantity_quintals} Quintals</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Rate per Unit:</span>
                <strong>₹{selectedTx.price_per_kg} / kg</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Buyer Organization:</span>
                <strong>{selectedTx.buyer_name}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: 8 }}>
                <span style={{ fontWeight: 800 }}>Final Payout Amount:</span>
                <strong style={{ fontSize: '1.1rem', color: '#059669' }}>₹{selectedTx.total_amount.toLocaleString('en-IN')}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Settlement Route:</span>
                <span style={{ color: '#047857', fontWeight: 700 }}>{selectedTx.payout_status}</span>
              </div>
            </div>

            <button className="btn-primary" style={{ width: '100%', marginTop: 16 }} onClick={() => setSelectedTx(null)}>
              Close Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

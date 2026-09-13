import React, { useState } from 'react';
import { Star, X, CheckCircle2, ShieldAlert, Award } from 'lucide-react';
import { submitQualityRating } from '../api';

export default function RatingModal({ isOpen, onClose, transaction, onRatingSuccess }) {
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('Excellent produce quality, accurate weighbridge grade, zero spoilage.');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen || !transaction) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      setErrorMsg('Please select a rating between 1 and 5 stars.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await submitQualityRating(transaction.id, rating, feedback);
      setSuccess(true);
      setTimeout(() => {
        if (onRatingSuccess) onRatingSuccess(res);
        onClose();
        setSuccess(false);
      }, 1400);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit rating');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ background: '#fef3c7', padding: 8, borderRadius: 10 }}>
              <Award size={22} color="#d97706" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Rate Produce Quality</h3>
              <p style={{ fontSize: '0.72rem', color: '#64748b' }}>Post-Trade Escrow Verified Review</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={20} />
          </button>
        </div>

        {/* Access Control Notice */}
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 8, padding: '8px 10px', fontSize: '0.72rem', color: '#065f46', marginBottom: 14 }}>
          ✓ <strong>Verified Order Completion:</strong> Order #{transaction.id} is confirmed delivered. Your rating will update farmer <strong>{transaction.farmer_name}</strong>'s public reputation score.
        </div>

        {errorMsg && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '8px 12px', borderRadius: 8, fontSize: '0.76rem', marginBottom: 12 }}>
            {errorMsg}
          </div>
        )}

        {success ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <CheckCircle2 size={40} color="#16a34a" style={{ margin: '0 auto 8px' }} />
            <h4 style={{ fontWeight: 800, color: '#064e3b' }}>Rating Submitted!</h4>
            <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 4 }}>
              Farmer reputation score updated successfully.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ textAlign: 'center', margin: '14px 0' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>
                Select Quality Rating (1–5 Stars)
              </span>
              <div className="star-rating-row">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star-btn ${star <= rating ? 'active' : ''}`}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </button>
                ))}
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#d97706' }}>
                {rating === 5 && "5 Stars - Export / Processing Grade (Exceptional)"}
                {rating === 4 && "4 Stars - Good Table Grade"}
                {rating === 3 && "3 Stars - Acceptable / Fair Quality"}
                {rating === 2 && "2 Stars - Sub-standard / High Moisture"}
                {rating === 1 && "1 Star - Severe Spoilage / Rejected"}
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Produce Feedback (Lot Inspection Notes)</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Detail the produce firmness, moisture, packaging, and uniformity..."
                required
              />
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" style={{ flex: 1.5 }} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Verified Rating'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

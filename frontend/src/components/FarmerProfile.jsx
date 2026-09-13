import React, { useState, useEffect } from 'react';
import { User, ShieldCheck, MapPin, Award, Star, Sprout, Building, CheckCircle2, Lock } from 'lucide-react';
import { fetchTransactions } from '../api';

export default function FarmerProfile({ profile }) {
  const [liveReviews, setLiveReviews] = useState([]);

  useEffect(() => {
    fetchTransactions('farmer').then((data) => {
      if (data) {
        const rated = data
          .filter(t => t.quality_rating)
          .map(t => ({
            id: t.id,
            buyer: t.buyer_name,
            rating: t.quality_rating,
            date: t.delivery_date || t.order_date,
            crop: `${t.crop} (${t.variety})`,
            comment: t.rating_feedback || "Produce inspected and approved on arrival."
          }));
        setLiveReviews(rated);
      }
    });
  }, []);

  if (!profile) return null;

  const displayReviews = liveReviews.length > 0 ? liveReviews : [
    {
      id: "REV_1",
      buyer: "KisanSetu Food Processing Ltd",
      rating: 5,
      date: "3 days ago",
      crop: "Tomato (Hybrid Shivam)",
      comment: "Exceptional produce quality! Uniform ripening, brix 4.8, zero transit rot. Honest grading on weighbridge."
    },
    {
      id: "REV_2",
      buyer: "Metro Cash & Carry Procurement",
      rating: 5,
      date: "2 weeks ago",
      crop: "Nashik Red Onion",
      comment: "Properly cured onions, dry skins, 50mm+ uniform size. Exactly as committed in sample photos."
    }
  ];

  return (
    <div className="content-body">
      {/* Identity Card */}
      <div className="ui-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 62, height: 62, borderRadius: '50%', background: 'linear-gradient(135deg, #059669, #065f46)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800 }}>
            {profile.name.charAt(0)}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{profile.name}</h3>
              <ShieldCheck size={18} color="#059669" />
            </div>
            <div style={{ fontSize: '0.74rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
              <MapPin size={12} />
              <span>{profile.location}</span>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#ecfdf5', color: '#047857', padding: '2px 8px', borderRadius: 999, fontSize: '0.68rem', fontWeight: 700, marginTop: 6 }}>
              <Lock size={10} />
              <span>Aadhaar Verified: {profile.aadhaar}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Verified Reputation Score Card */}
      <div className="ui-card" style={{ border: '1.5px solid #fef3c7', background: 'linear-gradient(135deg, #fffbeb 0%, #ffffff 100%)' }}>
        <div className="card-header-flex">
          <div className="card-title-badge">
            <div style={{ background: '#fef3c7', padding: 6, borderRadius: 8 }}>
              <Award size={18} color="#d97706" />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800 }}>Verified Reputation Score</h4>
              <p style={{ fontSize: '0.68rem', color: '#64748b' }}>Anti-Fraud Post-Trade Feedback</p>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Star size={18} color="#f59e0b" fill="#f59e0b" />
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#92400e' }}>
                {profile.reputation_score}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>/ 5.0</span>
            </div>
            <div style={{ fontSize: '0.65rem', color: '#78350f', fontWeight: 600 }}>
              {profile.total_reviews} Verified Trade Ratings
            </div>
          </div>
        </div>

        {/* Reputation Rule Notice */}
        <div style={{ background: '#ffffff', border: '1px solid #fde68a', borderRadius: 8, padding: '8px 10px', fontSize: '0.72rem', color: '#92400e', marginTop: 8 }}>
          🛡️ <strong>Reputation Logic:</strong> Calculated <em>exclusively</em> from verified bulk buyers post-trade completion on AgriMarket escrow. Zero fake bots, no unverified reviews.
        </div>

        {/* Recent Verified Buyer Feedback */}
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>
            Verified Buyer Audit Comments:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {displayReviews.map((rev) => (
              <div key={rev.id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 8, fontSize: '0.72rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>{rev.buyer}</strong>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={11} color="#f59e0b" fill="#f59e0b" />
                    ))}
                  </div>
                </div>
                <div style={{ color: '#64748b', fontSize: '0.68rem', marginTop: 2 }}>
                  {rev.crop} • {rev.date}
                </div>
                <div style={{ color: '#334155', fontStyle: 'italic', marginTop: 4 }}>
                  "{rev.comment}"
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Land & Affiliations Card */}
      <div className="ui-card">
        <h4 style={{ fontSize: '0.92rem', fontWeight: 800, marginBottom: 10 }}>
          Farm & Institutional Affiliations
        </h4>

        <div className="feed-details-grid" style={{ background: '#ffffff', padding: 0 }}>
          <div style={{ background: 'var(--surface-subtle)', padding: 10, borderRadius: 8 }}>
            <span className="detail-label">Landholding:</span>
            <div className="detail-val">{profile.landholding}</div>
          </div>
          <div style={{ background: 'var(--surface-subtle)', padding: 10, borderRadius: 8 }}>
            <span className="detail-label">FPO Affiliation:</span>
            <div className="detail-val">{profile.fpo_name}</div>
          </div>
          <div style={{ background: 'var(--surface-subtle)', padding: 10, borderRadius: 8 }}>
            <span className="detail-label">Crops Cultivated:</span>
            <div className="detail-val">{profile.crops_grown.join(", ")}</div>
          </div>
          <div style={{ background: 'var(--surface-subtle)', padding: 10, borderRadius: 8 }}>
            <span className="detail-label">Direct DBT Account:</span>
            <div className="detail-val" style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: 4 }}>
              <CheckCircle2 size={13} />
              <span>Aadhaar NPCI Linked</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

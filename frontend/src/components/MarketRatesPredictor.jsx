import React, { useState, useEffect } from 'react';
import { TrendingUp, Sparkles, CloudRain, AlertTriangle, ChevronRight, Activity } from 'lucide-react';
import { fetchCropPrediction } from '../api';

const AVAILABLE_CROPS = ["Tomato", "Onion", "Potato", "Wheat", "Soybean", "Green Chilli"];

export default function MarketRatesPredictor({ onSelectCropForQuery }) {
  const [selectedCrop, setSelectedCrop] = useState("Tomato");
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchCropPrediction(selectedCrop)
      .then((data) => {
        if (isMounted && data) {
          setForecastData(data);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, [selectedCrop]);

  return (
    <div className="ui-card" style={{ border: '1.5px solid #d1fae5' }}>
      {/* Header */}
      <div className="card-header-flex">
        <div className="card-title-badge">
          <div style={{ background: '#ecfdf5', padding: 6, borderRadius: 8 }}>
            <Activity size={18} color="#059669" />
          </div>
          <div>
            <h3 className="card-heading">Live APMC Mandi Rates</h3>
            <p style={{ fontSize: '0.7rem', color: '#64748b' }}>Verified Daily Wholesale Arrivals</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'pulse-mic 2s infinite' }}></span>
          <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#047857' }}>REAL-TIME</span>
        </div>
      </div>

      {/* Crop Selector Chips */}
      <div className="rates-crop-selector">
        {AVAILABLE_CROPS.map((crop) => (
          <button
            key={crop}
            className={`crop-chip ${selectedCrop === crop ? 'selected' : ''}`}
            onClick={() => setSelectedCrop(crop)}
          >
            {crop}
          </button>
        ))}
      </div>

      {/* Live Rate Display */}
      {forecastData && (
        <>
          <div className="live-price-banner">
            <div>
              <div style={{ fontSize: '0.72rem', color: '#047857', fontWeight: 700, textTransform: 'uppercase' }}>
                {forecastData.crop} • {forecastData.variety}
              </div>
              <div className="price-main-display">
                <span className="price-number">₹{forecastData.current_rate_per_kg}</span>
                <span className="price-unit">/ kg</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 2 }}>
                📍 {forecastData.mandi_name} ({forecastData.arrival_volume})
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span className="price-delta-tag">
                <TrendingUp size={14} />
                {forecastData.day_change}
              </span>
              <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: 4 }}>
                vs yesterday
              </div>
            </div>
          </div>

          {/* AI Demand & Price Forecasting Widget */}
          <div className="ai-forecast-widget">
            <div className="forecast-header-row">
              <div className="ai-pill">
                <Sparkles size={12} />
                <span>AI Demand Predictor</span>
              </div>
              <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>
                Projected 1-Mo Gain: <strong style={{ color: '#059669' }}>+{forecastData.projected_one_month_gain_pct}%</strong>
              </span>
            </div>

            {/* 3 Time Horizons Grid */}
            <div className="forecast-grid">
              {/* 15 Days */}
              <div className="forecast-cell">
                <div className="forecast-timeline">15 Days</div>
                <div className="forecast-price">₹{forecastData.predictions["15_days"].price}</div>
                <div className="forecast-demand-badge" style={{ background: '#dbeafe', color: '#1e40af' }}>
                  {forecastData.predictions["15_days"].demand}
                </div>
                <div style={{ fontSize: '0.62rem', color: '#64748b', marginTop: 3 }}>
                  Conf: {forecastData.predictions["15_days"].confidence}
                </div>
              </div>

              {/* 1 Month (Key Highlight) */}
              <div className="forecast-cell highlight">
                <div className="forecast-timeline" style={{ color: '#047857' }}>★ 1 Month</div>
                <div className="forecast-price" style={{ color: '#065f46' }}>
                  ₹{forecastData.predictions["1_month"].price}
                </div>
                <div className="forecast-demand-badge">
                  {forecastData.predictions["1_month"].demand}
                </div>
                <div style={{ fontSize: '0.62rem', color: '#047857', marginTop: 3, fontWeight: 700 }}>
                  Conf: {forecastData.predictions["1_month"].confidence}
                </div>
              </div>

              {/* 3 Months */}
              <div className="forecast-cell">
                <div className="forecast-timeline">3 Months</div>
                <div className="forecast-price">₹{forecastData.predictions["3_months"].price}</div>
                <div className="forecast-demand-badge" style={{ background: '#fef3c7', color: '#92400e' }}>
                  {forecastData.predictions["3_months"].demand}
                </div>
                <div style={{ fontSize: '0.62rem', color: '#64748b', marginTop: 3 }}>
                  Conf: {forecastData.predictions["3_months"].confidence}
                </div>
              </div>
            </div>

            {/* Weather & Market Signals Box */}
            <div className="weather-signal-box">
              <CloudRain size={16} style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <strong>Climate & Signals:</strong> {forecastData.weather_signal}
              </div>
            </div>

            {/* Historical 7-Week APMC Mandi Price Trend */}
            {forecastData.historical_weekly && forecastData.historical_weekly.length > 0 && (
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 12px', marginTop: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#334155' }}>
                    7-Week Wholesale Price Trajectory
                  </span>
                  <span style={{ fontSize: '0.66rem', color: '#059669', fontWeight: 700 }}>
                    Low: ₹{Math.min(...forecastData.historical_weekly)} • Peak: ₹{Math.max(...forecastData.historical_weekly)}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 48, gap: 5 }}>
                  {forecastData.historical_weekly.map((p, idx) => {
                    const min = Math.min(...forecastData.historical_weekly);
                    const max = Math.max(...forecastData.historical_weekly);
                    const heightPct = max === min ? 50 : Math.round(30 + ((p - min) / (max - min)) * 65);
                    const isLatest = idx === forecastData.historical_weekly.length - 1;
                    return (
                      <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                        <span style={{ fontSize: '0.62rem', fontWeight: isLatest ? 800 : 600, color: isLatest ? '#047857' : '#64748b', marginBottom: 2 }}>
                          ₹{p}
                        </span>
                        <div
                          style={{
                            width: '100%',
                            height: `${heightPct}%`,
                            background: isLatest ? 'linear-gradient(180deg, #10b981, #059669)' : '#cbd5e1',
                            borderRadius: '3px 3px 0 0'
                          }}
                          title={`Week ${idx + 1}: ₹${p}/kg`}
                        />
                        <span style={{ fontSize: '0.58rem', color: '#94a3b8', marginTop: 2 }}>
                          {isLatest ? 'Now' : `W${idx + 1}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Agronomist Advisory */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 10px', fontSize: '0.74rem', color: '#334155', marginTop: 8 }}>
              💡 <strong>Agronomist Advisory:</strong> {forecastData.advisory}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

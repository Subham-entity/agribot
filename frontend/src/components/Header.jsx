import React from 'react';
import { Sprout, ShieldCheck, Sun, Moon, UserCheck, RefreshCw } from 'lucide-react';

export default function Header({ 
  currentRole, 
  onRoleChange, 
  outdoorMode, 
  onToggleOutdoor,
  userProfile,
  onOpenAuth
}) {
  return (
    <header className="app-header">
      <div className="header-top-row">
        <div className="brand-wrapper">
          <div className="brand-logo-badge">
            <Sprout size={22} strokeWidth={2.5} />
          </div>
          <div>
            <div className="brand-title">AgriMarket</div>
            <div className="brand-subtitle">B2B Agricultural Network</div>
          </div>
        </div>

        <div className="header-actions">
          {/* Outdoor Sunlight Mode Toggle */}
          <button 
            className={`outdoor-toggle-btn ${outdoorMode ? 'active' : ''}`}
            onClick={onToggleOutdoor}
            title="Toggle High-Contrast Mode for bright outdoor sunlight"
          >
            <Sun size={14} />
            <span>{outdoorMode ? 'Sunlight On' : 'Outdoor'}</span>
          </button>

          {/* Aadhaar Verification Pill */}
          <button 
            className="aadhaar-status-pill"
            onClick={onOpenAuth}
            style={{ cursor: 'pointer', border: 'none' }}
            title="Aadhaar KYC Verification Status"
          >
            <ShieldCheck size={13} color="#059669" />
            <span>{userProfile ? `Aadhaar: ${userProfile.aadhaar}` : 'Verify Aadhaar'}</span>
          </button>
        </div>
      </div>

      {/* Role Switcher */}
      <div className="role-switch-container">
        <button
          className={`role-tab-btn ${currentRole === 'farmer' ? 'active-farmer' : ''}`}
          onClick={() => onRoleChange('farmer')}
        >
          <Sprout size={16} />
          <span>Farmer Interface (5 Tabs)</span>
        </button>
        <button
          className={`role-tab-btn ${currentRole === 'buyer' ? 'active-buyer' : ''}`}
          onClick={() => onRoleChange('buyer')}
        >
          <UserCheck size={16} />
          <span>Buyer Interface (4 Tabs)</span>
        </button>
      </div>
    </header>
  );
}

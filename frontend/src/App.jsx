import React, { useState, useEffect } from 'react';
import { Home, History, Plus, Users, User, Building } from 'lucide-react';

import Header from './components/Header';
import AadhaarModal from './components/AadhaarModal';

// Farmer screens
import FarmerHome from './components/FarmerHome';
import FarmerHistory from './components/FarmerHistory';
import UploadProduce from './components/UploadProduce';
import CirclesDashboard from './components/CirclesDashboard';
import FarmerProfile from './components/FarmerProfile';

// Buyer screens
import BuyerHome from './components/BuyerHome';
import BuyerHistory from './components/BuyerHistory';
import UploadDemand from './components/UploadDemand';
import BuyerProfile from './components/BuyerProfile';

export default function App() {
  const [role, setRole] = useState(() => {
    return localStorage.getItem('agrimarket_role') || 'farmer';
  });
  const [activeTab, setActiveTab] = useState('Home');
  const [outdoorMode, setOutdoorMode] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [feedRefreshKey, setFeedRefreshKey] = useState(0);

  // User state with persistence
  const [farmerProfile, setFarmerProfile] = useState(() => {
    const saved = localStorage.getItem('agrimarket_farmer_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      id: "FARMER_4821",
      name: "Rameshwar Patil",
      role: "farmer",
      aadhaar: "XXXX-4821",
      phone: "+91 98224 81023",
      location: "Niphad, Nashik District, Maharashtra",
      fpo_name: "Sahyadri Agro Farmers Producer Co. Ltd",
      landholding: "6.5 Acres (Drip Irrigated)",
      crops_grown: ["Tomato", "Onion", "Green Chilli", "Grapes"],
      reputation_score: 4.8,
      total_reviews: 19
    };
  });

  const [buyerProfile, setBuyerProfile] = useState(() => {
    const saved = localStorage.getItem('agrimarket_buyer_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      id: "BUYER_9901",
      name: "Vikramaditya Singhania",
      company: "KisanSetu Food Processing & Cold Chain Ltd",
      role: "buyer",
      aadhaar: "XXXX-9901",
      gstin: "27AAACK1234F1Z5",
      phone: "+91 91672 34500",
      location: "APMC Sector 19, Vashi, Navi Mumbai",
      procurement_focus: ["Tomato", "Onion", "Wheat", "Potato"],
      total_procured_tonnes: 320.5,
      total_orders: 42,
      credit_rating: "AAA Tier-1 Verified",
      payment_terms: "Instant Escrow Release on Weighbridge Slip"
    };
  });

  useEffect(() => {
    localStorage.setItem('agrimarket_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('agrimarket_farmer_profile', JSON.stringify(farmerProfile));
  }, [farmerProfile]);

  useEffect(() => {
    localStorage.setItem('agrimarket_buyer_profile', JSON.stringify(buyerProfile));
  }, [buyerProfile]);

  // Toggle outdoor high-contrast mode
  const handleToggleOutdoor = () => {
    setOutdoorMode(prev => {
      const next = !prev;
      if (next) {
        document.body.classList.add('outdoor-contrast');
      } else {
        document.body.classList.remove('outdoor-contrast');
      }
      return next;
    });
  };

  // Switch role cleanly and reset active tab to Home
  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setActiveTab('Home');
  };

  // Handle successful Aadhaar login from modal
  const handleAuthSuccess = (profile, authenticatedRole) => {
    if (authenticatedRole === 'farmer') {
      setFarmerProfile(profile);
      setRole('farmer');
    } else {
      setBuyerProfile(profile);
      setRole('buyer');
    }
    setActiveTab('Home');
    setFeedRefreshKey(k => k + 1);
  };

  const handleListingCreated = () => {
    setFeedRefreshKey(k => k + 1);
    setActiveTab('Home');
  };

  const currentProfile = role === 'farmer' ? farmerProfile : buyerProfile;

  return (
    <div className="app-container">
      <div className="mobile-frame-wrapper">
        <main className="screen-canvas">
          {/* Top Header */}
          <Header
            currentRole={role}
            onRoleChange={handleRoleChange}
            outdoorMode={outdoorMode}
            onToggleOutdoor={handleToggleOutdoor}
            userProfile={currentProfile}
            onOpenAuth={() => setAuthModalOpen(true)}
          />

          {/* Screen Content Based on Active Tab & Role */}
          {role === 'farmer' ? (
            <>
              {activeTab === 'Home' && (
                <FarmerHome key={feedRefreshKey} onNavigate={(tab) => setActiveTab(tab)} />
              )}
              {activeTab === 'History' && <FarmerHistory key={feedRefreshKey} />}
              {activeTab === 'Upload' && (
                <UploadProduce onListingCreated={handleListingCreated} onNavigate={(tab) => setActiveTab(tab)} />
              )}
              {activeTab === 'Circles' && <CirclesDashboard />}
              {activeTab === 'Profile' && <FarmerProfile profile={farmerProfile} />}
            </>
          ) : (
            <>
              {activeTab === 'Home' && (
                <BuyerHome key={feedRefreshKey} onNavigate={(tab) => setActiveTab(tab)} />
              )}
              {activeTab === 'History' && <BuyerHistory key={feedRefreshKey} />}
              {activeTab === 'Upload' && (
                <UploadDemand onDemandCreated={handleListingCreated} onNavigate={(tab) => setActiveTab(tab)} />
              )}
              {activeTab === 'Profile' && <BuyerProfile profile={buyerProfile} />}
            </>
          )}

          {/* Bottom Navigation Bar */}
          <nav className="bottom-nav-bar" aria-label="Bottom Navigation">
            <div className="bottom-nav-inner">
              {role === 'farmer' ? (
                /* Farmer 5-Tab Navigation: [Home | History | (+) Upload Produce | Circles | Profile] */
                <>
                  <button
                    id="farmer-nav-home"
                    className={`nav-item ${activeTab === 'Home' ? 'active' : ''}`}
                    onClick={() => setActiveTab('Home')}
                  >
                    <Home size={20} />
                    <span>Home</span>
                  </button>

                  <button
                    id="farmer-nav-history"
                    className={`nav-item ${activeTab === 'History' ? 'active' : ''}`}
                    onClick={() => setActiveTab('History')}
                  >
                    <History size={20} />
                    <span>History</span>
                  </button>

                  {/* Center (+) Upload Produce */}
                  <button
                    id="farmer-nav-upload"
                    className="center-plus-btn"
                    onClick={() => setActiveTab('Upload')}
                    title="Upload Produce Lot"
                    aria-label="Upload Produce"
                  >
                    <Plus size={28} strokeWidth={2.5} />
                  </button>

                  <button
                    id="farmer-nav-circles"
                    className={`nav-item ${activeTab === 'Circles' ? 'active' : ''}`}
                    onClick={() => setActiveTab('Circles')}
                  >
                    <Users size={20} />
                    <span>Circles</span>
                  </button>

                  <button
                    id="farmer-nav-profile"
                    className={`nav-item ${activeTab === 'Profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('Profile')}
                  >
                    <User size={20} />
                    <span>Profile</span>
                  </button>
                </>
              ) : (
                /* Buyer 4-Tab Navigation: [Home | History | (+) Upload Demand | Profile] */
                <>
                  <button
                    id="buyer-nav-home"
                    className={`nav-item ${activeTab === 'Home' ? 'active' : ''}`}
                    onClick={() => setActiveTab('Home')}
                  >
                    <Home size={20} />
                    <span>Home</span>
                  </button>

                  <button
                    id="buyer-nav-history"
                    className={`nav-item ${activeTab === 'History' ? 'active' : ''}`}
                    onClick={() => setActiveTab('History')}
                  >
                    <History size={20} />
                    <span>History</span>
                  </button>

                  {/* Center (+) Upload Demand */}
                  <button
                    id="buyer-nav-upload"
                    className="center-plus-btn"
                    style={{ background: 'linear-gradient(135deg, #2563eb, #1e293b)' }}
                    onClick={() => setActiveTab('Upload')}
                    title="Upload Bulk Demand"
                    aria-label="Upload Demand"
                  >
                    <Plus size={28} strokeWidth={2.5} />
                  </button>

                  <button
                    id="buyer-nav-profile"
                    className={`nav-item ${activeTab === 'Profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('Profile')}
                  >
                    <Building size={20} />
                    <span>Profile</span>
                  </button>
                </>
              )}
            </div>
          </nav>

          {/* Aadhaar Auth Modal */}
          <AadhaarModal
            isOpen={authModalOpen}
            onClose={() => setAuthModalOpen(false)}
            currentRole={role}
            onAuthSuccess={handleAuthSuccess}
          />
        </main>
      </div>
    </div>
  );
}

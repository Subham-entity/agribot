import React, { useState } from 'react';
import { Shield, CheckCircle2, Lock, X, AlertCircle } from 'lucide-react';
import { loginAadhaar } from '../api';

export default function AadhaarModal({ isOpen, onClose, currentRole, onAuthSuccess }) {
  const [role, setRole] = useState(currentRole || 'farmer');
  const [aadhaarInput, setAadhaarInput] = useState(
    role === 'farmer' ? '8421-9876-4821' : '9167-2345-9901'
  );
  const [otpInput, setOtpInput] = useState('123456');
  const [step, setStep] = useState('input'); // 'input' | 'otp' | 'success'
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setAadhaarInput(newRole === 'farmer' ? '8421-9876-4821' : '9167-2345-9901');
    setErrorMsg('');
  };

  const handleSendOtp = () => {
    const clean = aadhaarInput.replace(/[^0-9]/g, '');
    if (clean.length !== 12) {
      setErrorMsg('Please enter a valid 12-digit Aadhaar number.');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 600);
  };

  const handleVerifyOtp = async () => {
    if (otpInput.length !== 6) {
      setErrorMsg('Enter the 6-digit OTP received.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await loginAadhaar(aadhaarInput, role, otpInput);
      setStep('success');
      setTimeout(() => {
        onAuthSuccess(res.profile, role);
        onClose();
        setStep('input');
      }, 900);
    } catch (err) {
      setErrorMsg(err.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ background: '#ecfdf5', padding: 8, borderRadius: 10 }}>
              <Shield size={22} color="#059669" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Aadhaar Identity Verification</h3>
              <p style={{ fontSize: '0.72rem', color: '#64748b' }}>Direct DBT & Verified B2B Escrow</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Role Toggle in Modal */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <button
            style={{
              flex: 1,
              padding: '10px 12px',
              borderRadius: 8,
              border: role === 'farmer' ? '2px solid #059669' : '1px solid #e2e8f0',
              background: role === 'farmer' ? '#ecfdf5' : '#f8fafc',
              fontWeight: 700,
              fontSize: '0.82rem',
              color: role === 'farmer' ? '#065f46' : '#64748b',
              cursor: 'pointer'
            }}
            onClick={() => handleRoleChange('farmer')}
          >
            🌾 Smallholder Farmer
          </button>
          <button
            style={{
              flex: 1,
              padding: '10px 12px',
              borderRadius: 8,
              border: role === 'buyer' ? '2px solid #1e293b' : '1px solid #e2e8f0',
              background: role === 'buyer' ? '#f1f5f9' : '#f8fafc',
              fontWeight: 700,
              fontSize: '0.82rem',
              color: role === 'buyer' ? '#0f172a' : '#64748b',
              cursor: 'pointer'
            }}
            onClick={() => handleRoleChange('buyer')}
          >
            🏢 Bulk Institutional Buyer
          </button>
        </div>

        {errorMsg && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '8px 12px', borderRadius: 8, fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {step === 'input' && (
          <div>
            <div className="form-group">
              <label className="form-label">
                <Lock size={14} />
                <span>12-Digit Aadhaar / VID Number</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="XXXX-XXXX-XXXX"
                value={aadhaarInput}
                onChange={(e) => setAadhaarInput(e.target.value)}
              />
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                Encrypted via 256-bit UIDAI Aadhaar Vault. Only tokenized hash stored.
              </span>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button 
                className="btn-secondary" 
                style={{ flex: 1 }}
                onClick={() => handleRoleChange(role === 'farmer' ? 'buyer' : 'farmer')}
              >
                Autofill Demo {role === 'farmer' ? 'Buyer' : 'Farmer'}
              </button>
              <button 
                className="btn-primary" 
                style={{ flex: 1.2 }}
                onClick={handleSendOtp}
                disabled={loading}
              >
                {loading ? 'Sending OTP...' : 'Send Aadhaar OTP'}
              </button>
            </div>
          </div>
        )}

        {step === 'otp' && (
          <div>
            <div className="form-group">
              <label className="form-label">
                <CheckCircle2 size={14} color="#059669" />
                <span>Enter 6-Digit OTP sent to linked mobile</span>
              </label>
              <input
                type="text"
                maxLength={6}
                className="form-input"
                style={{ textAlign: 'center', fontSize: '1.3rem', letterSpacing: '0.3em', fontWeight: 800 }}
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
              />
              <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600 }}>
                Demo OTP: 123456 (Pre-filled for rapid evaluation)
              </span>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button className="btn-secondary" onClick={() => setStep('input')}>
                Back
              </button>
              <button 
                className="btn-primary" 
                style={{ flex: 1 }}
                onClick={handleVerifyOtp}
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify & Log In'}
              </button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ width: 54, height: 54, background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <CheckCircle2 size={32} color="#16a34a" />
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#064e3b' }}>
              Aadhaar Verified!
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 4 }}>
              Switching session to {role.toUpperCase()} mode...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

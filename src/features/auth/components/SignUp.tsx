import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRegister, useConfirmOtp } from '../hooks/useAuth';
import type { CreateUserCommand } from '../types/auth.types';

export const SignUp: React.FC = () => {
  const { mutate: register, isPending: isRegistering } = useRegister();
  const { mutate: verifyOtp, isPending: isVerifying } = useConfirmOtp();

  const [formData, setFormData] = useState({
    ownerName: '', email: '', organizationName: '', password: ''
  });

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [otp, setOtp] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const command: CreateUserCommand = {
      organizationName: formData.organizationName,
      ownerName: formData.ownerName,
      email: formData.email,
      password: formData.password
    };
    register(command, {
      onSuccess: (response) => {
        if (response.isSuccess || response.message) {
          setRegisteredEmail(formData.email);
          setShowOtpModal(true);
        }
      }
    });
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyOtp({ email: registeredEmail, otp });
  };

  return (
    <div className="container-fluid p-0" style={{ minHeight: '100vh', backgroundColor: '#0f172a' }}>
      <style>{`
        .lts-input::placeholder { color: #64748b; }
        .lts-input:focus {
          border-color: #fbbf24 !important;
          box-shadow: 0 0 0 3px rgba(251,191,36,0.2) !important;
          background-color: #0f172a !important;
          color: white !important;
        }
        .lts-signup-btn:hover:not(:disabled) {
          background-color: #f59e0b !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(251,191,36,0.35) !important;
        }
        .lts-modal-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.7);
          display: flex; align-items: center; justify-content: center;
          z-index: 9999;
          backdrop-filter: blur(4px);
        }
        .lts-modal-box {
          background: #1e293b;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 36px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }
      `}</style>

      <div className="row g-0" style={{ minHeight: '100vh' }}>

        {/* LEFT PANEL */}
        <div className="col-lg-5 d-none d-lg-flex flex-column justify-content-between p-5"
          style={{ background: 'linear-gradient(135deg, #0a1128 0%, #162447 100%)', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: 0, right: 0, width: '100%', height: '100%',
            background: 'radial-gradient(circle at top right, rgba(96,165,250,0.15), transparent 60%)',
            pointerEvents: 'none'
          }} />
          <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none">
            <div className="d-flex align-items-center justify-content-center rounded-2"
              style={{ background: '#fbbf24', width: 40, height: 40, fontSize: 20 }}>⚖</div>
            <span className="fw-bold text-white fs-4" style={{ letterSpacing: 2 }}>LTS</span>
          </Link>
          <div>
            <h1 className="fw-bold text-white" style={{ fontSize: '2.8rem', lineHeight: 1.1, letterSpacing: '-1.5px' }}>
              Join your department{' '}
              <span style={{ color: '#fbbf24', fontStyle: 'italic' }}>today.</span>
            </h1>
            <p className="mt-3" style={{ color: '#94a3b8', fontSize: 17, lineHeight: 1.7 }}>
              Professional legal tracking and department coordination.
            </p>
          </div>
          <div className="d-flex gap-4 pt-4 border-top border-white border-opacity-10">
            <div><p className="fw-bold text-white mb-0">8</p><p className="small mb-0" style={{ color: '#64748b' }}>Modules</p></div>
            <div><p className="fw-bold text-white mb-0">ISO</p><p className="small mb-0" style={{ color: '#64748b' }}>Certified</p></div>
            <div><p className="fw-bold text-white mb-0">24/7</p><p className="small mb-0" style={{ color: '#64748b' }}>Support</p></div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="col-lg-7 d-flex align-items-center justify-content-center p-4" style={{ backgroundColor: '#0f172a' }}>
          <div className="w-100 p-4 rounded-3"
            style={{ maxWidth: 440, backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.25)' }}>
            <h2 className="fw-bold text-white mb-1" style={{ fontSize: 28, letterSpacing: '-1px' }}>Create your account</h2>
            <p className="mb-4" style={{ color: '#94a3b8', fontSize: 14 }}>
              Already have an account?{' '}
              <Link to="/login" className="fw-bold text-decoration-none" style={{ color: '#fbbf24' }}>Sign in</Link>
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-uppercase mb-1" style={{ color: '#94a3b8', letterSpacing: '0.5px' }}>Owner Name</label>
                <input type="text" className="form-control lts-input" placeholder="e.g. Ahmad Raza" required
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  style={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: 8, padding: '12px 14px' }} />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-uppercase mb-1" style={{ color: '#94a3b8', letterSpacing: '0.5px' }}>Work Email</label>
                <input type="email" className="form-control lts-input" placeholder="you@lts.gov.pk" required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: 8, padding: '12px 14px' }} />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-uppercase mb-1" style={{ color: '#94a3b8', letterSpacing: '0.5px' }}>Organization Name</label>
                <input type="text" className="form-control lts-input" placeholder="e.g. High Court" required
                  value={formData.organizationName}
                  onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                  style={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: 8, padding: '12px 14px' }} />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-uppercase mb-1" style={{ color: '#94a3b8', letterSpacing: '0.5px' }}>Password</label>
                <input type="password" className="form-control lts-input" placeholder="Min. 8 characters" required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  style={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: 8, padding: '12px 14px' }} />
              </div>

              <button type="submit" disabled={isRegistering} className="btn w-100 fw-bold lts-signup-btn"
                style={{ background: '#fbbf24', color: '#0f172a', borderRadius: 8, padding: '13px', fontSize: 15, border: 'none', transition: 'all 0.2s ease' }}>
                {isRegistering ? 'Creating Account...' : 'Create Account →'}
              </button>
            </form>

            <p className="text-center small mt-4" style={{ color: '#64748b' }}>
              By registering, you agree to our{' '}
              <a href="#" className="text-decoration-none fw-semibold" style={{ color: '#94a3b8' }}>Terms</a> and{' '}
              <a href="#" className="text-decoration-none fw-semibold" style={{ color: '#94a3b8' }}>Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>

      {/* ── OTP MODAL ── */}
      {showOtpModal && (
        <div className="lts-modal-overlay">
          <div className="lts-modal-box">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h4 className="fw-bold text-white mb-1">Verify Your Email</h4>
                <p className="small mb-0" style={{ color: '#94a3b8' }}>
                  OTP sent to <span style={{ color: '#fbbf24' }}>{registeredEmail}</span>
                </p>
              </div>
              <button type="button" className="btn btn-link p-0 text-decoration-none"
                style={{ color: '#64748b', fontSize: 20 }}
                onClick={() => setShowOtpModal(false)}>✕</button>
            </div>

            <form onSubmit={handleOtpSubmit}>
              <div className="mb-4">
                <label className="form-label small fw-bold text-uppercase mb-1" style={{ color: '#94a3b8', letterSpacing: '0.5px' }}>
                  OTP Code
                </label>
                <input
                  type="text"
                  className="form-control lts-input text-center"
                  placeholder="_ _ _ _ _ _"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  style={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: 8, padding: '14px', letterSpacing: 8, fontSize: 22 }}
                />
                <p className="small mt-2 mb-0" style={{ color: '#64748b' }}>
                  OTP 10 minutes mein expire hoga
                </p>
              </div>

              <button type="submit" disabled={isVerifying} className="btn w-100 fw-bold lts-signup-btn"
                style={{ background: '#fbbf24', color: '#0f172a', borderRadius: 8, padding: '12px', fontSize: 15, border: 'none', transition: 'all 0.2s ease' }}>
                {isVerifying ? 'Verifying...' : 'Verify Email →'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
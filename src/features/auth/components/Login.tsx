import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLogin, useForgetPassword, useVerifyEmail } from '../hooks/useAuth';

export const LoginForm: React.FC = () => {
  const { mutate: login, isPending: isLogging } = useLogin();
  const { mutate: sendOtp, isPending: isSending } = useForgetPassword();
  const { mutate: resetPassword, isPending: isResetting } = useVerifyEmail();

  const [formData, setFormData] = useState({ email: '', password: '' });

  // Modal states
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetData, setResetData] = useState({ otp: '', newPassword: '', confirmPassword: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email: formData.email, password: formData.password });
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendOtp({ email: forgotEmail }, {
      onSuccess: (response) => {
        if (response.isSuccess) {
          setShowForgotModal(false);
          setShowResetModal(true);
        } else {
          alert(response.message || 'Failed to send OTP');
        }
      }
    });
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (resetData.newPassword !== resetData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    resetPassword({
      email: forgotEmail,
      otp: resetData.otp,
      newPassword: resetData.newPassword
    }, {
      onSuccess: (response) => {
        if (response.isSuccess) {
          setShowResetModal(false);
        } else {
          alert(response.message || 'Reset failed');
        }
      }
    });
  };

  return (
    <div className="container-fluid p-0" style={{ minHeight: '100vh', backgroundColor: '#0f172a', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        .lts-input::placeholder { color: #64748b; }
        .lts-input:focus {
          border-color: #fbbf24 !important;
          box-shadow: 0 0 0 3px rgba(251,191,36,0.2) !important;
          background-color: #0f172a !important;
          color: white !important;
        }
        .lts-login-btn:hover:not(:disabled) {
          background-color: #f59e0b !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(251,191,36,0.3) !important;
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
          max-width: 420px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }
      `}</style>

      <div className="row g-0" style={{ minHeight: '100vh' }}>

        {/* LEFT PANEL */}
        <div className="col-lg-5 d-none d-lg-flex flex-column justify-content-between p-5 text-white"
          style={{ background: 'linear-gradient(135deg, #0a1128 0%, #162447 100%)', position: 'relative' }}>
          <div style={{
            position: 'absolute', top: '-5%', right: '-5%', width: '400px', height: '400px',
            background: 'radial-gradient(circle, rgba(0,86,247,0.12) 0%, transparent 70%)',
            borderRadius: '50%'
          }} />
          <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none">
            <div style={{ background: '#fbbf24', width: '38px', height: '38px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>⚖</div>
            <span className="fw-bold fs-4 text-white" style={{ letterSpacing: '2px' }}>LTS</span>
          </Link>
          <div>
            <h1 className="display-3 fw-bold lh-sm mb-3" style={{ letterSpacing: '-2px' }}>
              Legal case management, <span style={{ color: '#fbbf24', fontStyle: 'italic' }}>simplified.</span>
            </h1>
            <p className="fs-5 fw-light" style={{ maxWidth: '420px', color: '#94a3b8' }}>
              Coordinated legal tracking for elite teams.
            </p>
          </div>
          <div className="d-flex gap-5 border-top border-white border-opacity-10 pt-4">
            <div><h5 className="fw-bold mb-0">12k+</h5><p className="small text-white-50 mb-0">Cases Tracked</p></div>
            <div><h5 className="fw-bold mb-0">98%</h5><p className="small text-white-50 mb-0">Uptime SLA</p></div>
            <div><h5 className="fw-bold mb-0">4 sec</h5><p className="small text-white-50 mb-0">Avg Load Time</p></div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="col-lg-7 d-flex align-items-center justify-content-center p-4" style={{ backgroundColor: '#0f172a' }}>
          <div className="w-100 p-4 rounded-3"
            style={{ maxWidth: '420px', backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h2 className="fw-bold mb-1 text-white" style={{ fontSize: '32px', letterSpacing: '-1px' }}>Welcome back</h2>
            <p className="mb-4" style={{ color: '#94a3b8' }}>
              Don't have an account?{' '}
              <Link to="/register" className="text-decoration-none fw-bold" style={{ color: '#fbbf24' }}>Sign up</Link>
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-uppercase mb-1" style={{ color: '#94a3b8', letterSpacing: '0.5px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-control lts-input"
                  placeholder="you@lts.gov.pk"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: 8, padding: '12px 14px' }}
                />
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label small fw-bold text-uppercase mb-0" style={{ color: '#94a3b8', letterSpacing: '0.5px' }}>
                    Password
                  </label>
                  <button
                    type="button"
                    className="btn btn-link p-0 small text-decoration-none"
                    style={{ color: '#64748b', fontSize: 13 }}
                    onClick={() => setShowForgotModal(true)}
                  >
                    Forgot?
                  </button>
                </div>
                <input
                  type="password"
                  className="form-control lts-input"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  style={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: 8, padding: '12px 14px' }}
                />
              </div>

              <button
                type="submit"
                disabled={isLogging}
                className="btn w-100 fw-bold lts-login-btn"
                style={{ background: '#fbbf24', color: '#0f172a', borderRadius: 8, padding: '13px', fontSize: 15, border: 'none', transition: 'all 0.2s ease' }}
              >
                {isLogging ? 'Signing in...' : 'Sign in to LTS →'}
              </button>
            </form>

            <p className="text-center small mt-4" style={{ color: '#64748b' }}>
              By signing in you agree to our{' '}
              <a href="#" className="fw-medium text-decoration-none" style={{ color: '#94a3b8' }}>Terms</a> and{' '}
              <a href="#" className="fw-medium text-decoration-none" style={{ color: '#94a3b8' }}>Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>

      {/* ── FORGOT PASSWORD MODAL ── */}
      {showForgotModal && (
        <div className="lts-modal-overlay" onClick={() => setShowForgotModal(false)}>
          <div className="lts-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h4 className="fw-bold text-white mb-1">Forgot Password?</h4>
                <p className="small mb-0" style={{ color: '#94a3b8' }}>Enter your email — we'll send an OTP</p>
              </div>
              <button
                type="button"
                className="btn btn-link p-0 text-decoration-none"
                style={{ color: '#64748b', fontSize: 20 }}
                onClick={() => setShowForgotModal(false)}
              >✕</button>
            </div>

            <form onSubmit={handleForgotSubmit}>
              <div className="mb-4">
                <label className="form-label small fw-bold text-uppercase mb-1" style={{ color: '#94a3b8', letterSpacing: '0.5px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-control lts-input"
                  placeholder="you@lts.gov.pk"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  style={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: 8, padding: '12px 14px' }}
                />
              </div>
              <button
                type="submit"
                disabled={isSending}
                className="btn w-100 fw-bold lts-login-btn"
                style={{ background: '#fbbf24', color: '#0f172a', borderRadius: 8, padding: '12px', fontSize: 15, border: 'none', transition: 'all 0.2s ease' }}
              >
                {isSending ? 'Sending OTP...' : 'Send OTP →'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── RESET PASSWORD MODAL ── */}
      {showResetModal && (
        <div className="lts-modal-overlay" onClick={() => setShowResetModal(false)}>
          <div className="lts-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h4 className="fw-bold text-white mb-1">Reset Password</h4>
                <p className="small mb-0" style={{ color: '#94a3b8' }}>Enter OTP sent to <span style={{ color: '#fbbf24' }}>{forgotEmail}</span></p>
              </div>
              <button
                type="button"
                className="btn btn-link p-0 text-decoration-none"
                style={{ color: '#64748b', fontSize: 20 }}
                onClick={() => setShowResetModal(false)}
              >✕</button>
            </div>

            <form onSubmit={handleResetSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-uppercase mb-1" style={{ color: '#94a3b8', letterSpacing: '0.5px' }}>
                  OTP Code
                </label>
                <input
                  type="text"
                  className="form-control lts-input"
                  placeholder="6-digit OTP"
                  required
                  maxLength={6}
                  value={resetData.otp}
                  onChange={(e) => setResetData({ ...resetData, otp: e.target.value })}
                  style={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: 8, padding: '12px 14px', letterSpacing: 4, fontSize: 18 }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-uppercase mb-1" style={{ color: '#94a3b8', letterSpacing: '0.5px' }}>
                  New Password
                </label>
                <input
                  type="password"
                  className="form-control lts-input"
                  placeholder="Min. 8 characters"
                  required
                  value={resetData.newPassword}
                  onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })}
                  style={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: 8, padding: '12px 14px' }}
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-uppercase mb-1" style={{ color: '#94a3b8', letterSpacing: '0.5px' }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="form-control lts-input"
                  placeholder="Re-enter password"
                  required
                  value={resetData.confirmPassword}
                  onChange={(e) => setResetData({ ...resetData, confirmPassword: e.target.value })}
                  style={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: 8, padding: '12px 14px' }}
                />
              </div>

              <button
                type="submit"
                disabled={isResetting}
                className="btn w-100 fw-bold lts-login-btn"
                style={{ background: '#fbbf24', color: '#0f172a', borderRadius: 8, padding: '12px', fontSize: 15, border: 'none', transition: 'all 0.2s ease' }}
              >
                {isResetting ? 'Resetting...' : 'Reset Password →'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
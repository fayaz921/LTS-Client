import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRegister } from '../hooks/useAuth';
import type { CreateUserCommand } from '../types/auth.types';

export const RegisterForm: React.FC = () => {
  const { mutate, isPending } = useRegister();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    organizationName: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const command: CreateUserCommand = {
      organizationName: formData.organizationName,
      ownerName: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      password: formData.password
    };
    mutate(command);
  };

  return (
    <div className="register-root" style={{ minHeight: '100vh', fontFamily: "'Inter', sans-serif", backgroundColor: '#fff' }}>
      <div className="row g-0" style={{ minHeight: '100vh' }}>
        
        {/* LEFT PANEL - Exact Gradient & Hero Text */}
        <div className="col-lg-5 d-none d-lg-flex info-panel" style={{
          background: 'linear-gradient(135deg, #0a1128 0%, #162447 100%)',
          width: '40%',
          padding: '60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Premium Radial Glow Effect */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at top right, rgba(96, 165, 250, 0.15), transparent 60%)',
            pointerEvents: 'none'
          }}></div>

          <div>
            <div className="d-flex align-items-center gap-2">
              <div style={{ background: '#0056f7', padding: '8px', borderRadius: '8px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
              <span className="fw-bold fs-4">LTS</span>
            </div>

            <div className="hero-text" style={{ marginTop: '40px' }}>
              <h1 style={{ fontWeight: 700, fontSize: '3.5rem', lineHeight: 1.1, letterSpacing: '-1.5px' }}>
                Join your department <span style={{ color: '#60a5fa', fontStyle: 'italic' }}>today.</span>
              </h1>
              <p style={{ maxWidth: '440px', lineHeight: 1.7, color: 'rgba(255,255,255,0.6)', marginTop: '24px', fontSize: '18px' }}>
                Professional legal tracking and department coordination. Built for elite legal teams.
              </p>
            </div>
          </div>

          <div className="stats-row" style={{ display: 'flex', gap: '30px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
            <div><h5 className="fw-bold mb-0">8</h5><p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Modules</p></div>
            <div><h5 className="fw-bold mb-0">ISO</h5><p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Certified</p></div>
            <div><h5 className="fw-bold mb-0">24/7</h5><p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Support</p></div>
          </div>
        </div>

        {/* RIGHT PANEL - The Form Container */}
        <div className="col-lg-7 form-panel" style={{ background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
          <div className="form-container" style={{ width: '100%', maxWidth: '480px' }}>
            <h2 style={{ fontWeight: 700, fontSize: '34px', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '8px', color: '#0f172a' }}>Create your account</h2>
            <p className="text-muted mb-5" style={{ fontSize: '16px' }}>
              Start managing cases efficiently. <Link to="/login" style={{ color: '#0056f7', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
            </p>

            <form onSubmit={handleSubmit}>
              <div className="row mb-4">
                <div className="col">
                  <label style={labelStyle}>First Name</label>
                  <input type="text" className="form-control custom-input" placeholder="Ali" required 
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})} style={inputStyle} />
                </div>
                <div className="col">
                  <label style={labelStyle}>Last Name</label>
                  <input type="text" className="form-control custom-input" placeholder="Khan" required 
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})} style={inputStyle} />
                </div>
              </div>

              <div className="mb-4">
                <label style={labelStyle}>Work Email Address</label>
                <input type="email" className="form-control" placeholder="you@lts.gov.pk" required 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} style={inputStyle} />
              </div>

              <div className="mb-4">
                <label style={labelStyle}>Department</label>
                <select className="form-select" required 
                  onChange={(e) => setFormData({...formData, organizationName: e.target.value})} style={inputStyle}>
                  <option selected disabled value="">Select Department</option>
                  <option value="High Court">High Court</option>
                  <option value="Supreme Court">Supreme Court</option>
                </select>
              </div>

              <div className="mb-5">
                <label style={labelStyle}>Password</label>
                <input type="password" className="form-control" placeholder="Min. 8 characters" required 
                  onChange={(e) => setFormData({...formData, password: e.target.value})} style={inputStyle} />
              </div>

              <button type="submit" disabled={isPending} className="btn-lts shadow-sm" style={buttonStyle}>
                {isPending ? 'Creating Account...' : 'Sign up for account →'}
              </button>
            </form>

            <p className="text-center text-muted small mt-4">
              By registering, you agree to our <a href="#" className="text-dark fw-medium">Terms</a> and <a href="#" className="text-dark fw-medium">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Custom Styles Objects (Matching your CSS exactly) ---

const labelStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 700,
  color: '#475569',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginBottom: '6px',
  display: 'block'
};

const inputStyle: React.CSSProperties = {
  padding: '12px 14px',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
  fontSize: '14px',
  backgroundColor: '#fff',
  boxShadow: 'none'
};

const buttonStyle: React.CSSProperties = {
  background: '#0a1128',
  color: 'white',
  padding: '12px',
  borderRadius: '8px',
  fontWeight: 700,
  width: '100%',
  border: 'none',
  marginTop: '12px',
  fontSize: '16px',
  transition: 'all 0.2s ease'
};
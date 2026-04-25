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
    <div className="register-root" style={{ minHeight: '100vh', fontFamily: "'Inter', sans-serif", backgroundColor: '#0f172a' }}>
      <style>{`
        .custom-input::placeholder { color: #64748b; }
        .custom-input:focus { 
          border-color: #fbbf24 !important; 
          box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.2) !important; 
          background-color: #0f172a !important;
          color: white !important;
        }
        .btn-lts:hover {
          background-color: #f59e0b !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3) !important;
        }
      `}</style>

      <div className="row g-0" style={{ minHeight: '100vh' }}>
        
        {/* LEFT PANEL */}
        <div className="col-lg-5 d-none d-lg-flex info-panel" style={{
          background: 'linear-gradient(135deg, #0a1128 0%, #162447 100%)',
          width: '40%',
          padding: '40px',
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
              <div style={{ background: '#fbbf24', width: '38px', height: '38px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                ⚖
              </div>
              <span className="fw-bold fs-4 text-white" style={{ letterSpacing: '2px' }}>LTS</span>
            </div>

            <div className="hero-text" style={{ marginTop: '25px' }}>
              <h1 style={{ fontWeight: 800, fontSize: '3.5rem', lineHeight: 1.1, letterSpacing: '-1.5px', color: 'white' }}>
                Join your department <span style={{ color: '#fbbf24', fontStyle: 'italic' }}>today.</span>
              </h1>
              <p style={{ maxWidth: '440px', lineHeight: 1.7, color: '#94a3b8', marginTop: '24px', fontSize: '18px' }}>
                Professional legal tracking and department coordination. Built for elite legal teams.
              </p>
            </div>
          </div>

          <div className="stats-row" style={{ display: 'flex', gap: '30px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
            <div><h5 className="fw-bold mb-0 text-white">8</h5><p style={{ fontSize: '12px', color: '#64748b' }}>Modules</p></div>
            <div><h5 className="fw-bold mb-0 text-white">ISO</h5><p style={{ fontSize: '12px', color: '#64748b' }}>Certified</p></div>
            <div><h5 className="fw-bold mb-0 text-white">24/7</h5><p style={{ fontSize: '12px', color: '#64748b' }}>Support</p></div>
          </div>
        </div>

        {/* RIGHT PANEL - The Form Container */}
        <div className="col-lg-7 form-panel" style={{ background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="form-container" style={{ width: '100%', maxWidth: '480px', backgroundColor: '#1e293b', padding: '32px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontWeight: 700, fontSize: '30px', letterSpacing: '-1px', lineHeight: 1.1, marginBottom: '4px', color: '#ffffff' }}>Create your account</h2>
            <p className="mb-4" style={{ fontSize: '15px', color: '#94a3b8' }}>
              Start managing cases efficiently. <Link to="/login" style={{ color: '#fbbf24', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
            </p>

            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col">
                  <label style={labelStyle}>First Name</label>
                  <input type="text" className="form-control custom-input" placeholder="First Name" required 
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})} style={inputStyle} />
                </div>
                <div className="col">
                  <label style={labelStyle}>Last Name</label>
                  <input type="text" className="form-control custom-input" placeholder="Last Name" required 
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})} style={inputStyle} />
                </div>
              </div>

              <div className="mb-3">
                <label style={labelStyle}>Work Email Address</label>
                <input type="email" className="form-control custom-input" placeholder="you@lts.gov.pk" required 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} style={inputStyle} />
              </div>

              <div className="mb-3">
                <label style={labelStyle}>Department</label>
                <select className="form-select" required 
                  onChange={(e) => setFormData({...formData, organizationName: e.target.value})} style={inputStyle}>
                  <option selected disabled value="">Select Department</option>
                  <option value="High Court">High Court</option>
                  <option value="Supreme Court">Supreme Court</option>
                </select>
              </div>

              <div className="mb-4">
                <label style={labelStyle}>Password</label>
                <input type="password" className="form-control custom-input" placeholder="Min. 8 characters" required 
                  onChange={(e) => setFormData({...formData, password: e.target.value})} style={inputStyle} />
              </div>

              <button type="submit" disabled={isPending} className="btn-lts shadow-sm" style={buttonStyle}>
                {isPending ? 'Creating Account...' : 'Sign up for account →'}
              </button>
            </form>

            <p className="text-center small mt-4" style={{ color: '#64748b' }}>
              By registering, you agree to our <a href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 600 }}>Terms</a> and <a href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 600 }}>Privacy Policy</a>.
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
  color: '#94a3b8',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginBottom: '6px',
  display: 'block'
};

const inputStyle: React.CSSProperties = {
  padding: '12px 14px',
  borderRadius: '8px',
  border: '1px solid #334155',
  fontSize: '14px',
  backgroundColor: '#0f172a',
  color: '#ffffff',
  boxShadow: 'none'
};

const buttonStyle: React.CSSProperties = {
  background: '#fbbf24',
  color: '#0f172a',
  padding: '12px',
  borderRadius: '8px',
  fontWeight: 800,
  width: '100%',
  border: 'none',
  marginTop: '8px',
  fontSize: '16px',
  transition: 'all 0.2s ease'
};
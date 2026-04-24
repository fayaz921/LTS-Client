import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });

  return (
    <div className="container-fluid p-0" style={{ minHeight: '100vh', overflow: 'hidden' }}>
      <div className="row g-0" style={{ minHeight: '100vh' }}>
        
        {/* Left Side - Info Panel */}
        <div className="col-lg-5 d-none d-lg-flex flex-column justify-content-between p-5 text-white" 
             style={{ 
               background: 'linear-gradient(135deg, #0a1128 0%, #162447 100%)',
               position: 'relative' 
             }}>
          
          {/* Custom Glow Effect (Radial Gradient) */}
          <div style={{
            position: 'absolute', top: '-5%', right: '-5%', width: '400px', height: '400px',
            background: 'radial-gradient(circle, rgba(0, 86, 247, 0.12) 0%, transparent 70%)',
            borderRadius: '50%'
          }}></div>

          <div className="z-1">
            <div className="d-flex align-items-center gap-2 mb-5">
              <div style={{ background: '#0056f7', padding: '8px', borderRadius: '8px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
              </div>
              <span className="fw-bold fs-4" style={{ letterSpacing: '-0.5px' }}>LTS</span>
            </div>

            <div className="mt-5">
              <h1 className="display-3 fw-bold lh-sm mb-3" style={{ letterSpacing: '-2px' }}>
                Legal case management, <span style={{ color: '#60a5fa', fontStyle: 'italic' }}>simplified.</span>
              </h1>
              <p className="text-white-50 fs-5 fw-light" style={{ maxWidth: '420px' }}>
                Coordinated legal tracking for elite teams.
              </p>
            </div>
          </div>

          <div className="d-flex gap-5 border-top border-white border-opacity-10 pt-4 z-1">
            <div><h5 className="fw-bold mb-0">12k+</h5><p className="small text-white-50 mb-0">Cases Tracked</p></div>
            <div><h5 className="fw-bold mb-0">98%</h5><p className="small text-white-50 mb-0">Uptime SLA</p></div>
            <div><h5 className="fw-bold mb-0">4 sec</h5><p className="small text-white-50 mb-0">Avg Load Time</p></div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="col-lg-7 d-flex align-items-center justify-content-center bg-white p-4">
          <div style={{ width: '100%', maxWidth: '420px' }}>
            <h2 className="fw-bold mb-1" style={{ fontSize: '32px', letterSpacing: '-1px' }}>Welcome back</h2>
            <p className="text-muted mb-5">
              Don't have an account? <Link to="/register" className="text-decoration-none fw-bold" style={{ color: '#0056f7' }}>Sign up</Link>
            </p>
            
            <form>
              <div className="mb-4">
                <label className="form-label small fw-bold text-muted text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>
                  Email Address
                </label>
                <input 
                  type="email" 
                  className="form-control border-secondary border-opacity-25" 
                  placeholder="you@lts.gov.pk"
                  style={{ padding: '12px', borderRadius: '10px', fontSize: '15px' }}
                />
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label small fw-bold text-muted text-uppercase mb-0" style={{ letterSpacing: '0.5px' }}>
                    Password
                  </label>
                  <a href="#" className="small text-muted text-decoration-none">Forgot?</a>
                </div>
                <input 
                  type="password" 
                  className="form-control border-secondary border-opacity-25" 
                  placeholder="••••••••"
                  style={{ padding: '12px', borderRadius: '10px', fontSize: '15px' }}
                />
              </div>

              <button 
                type="submit" 
                className="btn w-100 py-3 fw-bold text-white shadow-sm mt-2" 
                style={{ background: '#0a1128', borderRadius: '10px', fontSize: '16px' }}
              >
                Sign in to LTS &rarr;
              </button>
            </form>

            <p className="text-center text-muted small mt-5">
              By signing in you agree to our <a href="#" className="text-dark fw-medium text-decoration-none">Terms</a> and <a href="#" className="text-dark fw-medium text-decoration-none">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
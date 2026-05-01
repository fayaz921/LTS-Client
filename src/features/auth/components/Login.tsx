import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '../hooks/useAuth';

export const LoginForm: React.FC = () => {
  const { mutate, isPending } = useLogin();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ email: formData.email, password: formData.password });
  };
  return (
    <div className="container-fluid p-0" style={{ minHeight: '100vh', overflow: 'hidden', backgroundColor: '#0f172a', fontFamily: "'Inter', sans-serif" }}>
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
              <div style={{ background: '#fbbf24', width: '38px', height: '38px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                ⚖
              </div>
              <span className="fw-bold fs-4" style={{ letterSpacing: '2px' }}>LTS</span>
            </div>

            <div className="mt-5">
              <h1 className="display-3 fw-bold lh-sm mb-3" style={{ letterSpacing: '-2px' }}>
                Legal case management, <span style={{ color: '#fbbf24', fontStyle: 'italic' }}>simplified.</span>
              </h1>
              <p className="fs-5 fw-light" style={{ maxWidth: '420px', color: '#94a3b8' }}>
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
        <div className="col-lg-7 d-flex align-items-center justify-content-center p-4" style={{ backgroundColor: '#0f172a' }}>
          <div style={{ width: '100%', maxWidth: '420px', backgroundColor: '#1e293b', padding: '40px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h2 className="fw-bold mb-1 text-white" style={{ fontSize: '32px', letterSpacing: '-1px' }}>Welcome back</h2>
            <p className="mb-5" style={{ color: '#94a3b8' }}>
              Don't have an account? <Link to="/register" className="text-decoration-none fw-bold" style={{ color: '#fbbf24' }}>Sign up</Link>
            </p>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label small fw-bold text-uppercase mb-2" style={{ color: '#94a3b8', letterSpacing: '0.5px' }}>
                  Email Address
                </label>
                <input 
                  type="email" 
                  value={formData.email}
                  className="form-control custom-input" 
                  placeholder="you@lts.gov.pk"
                   onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ padding: '12px', borderRadius: '10px', fontSize: '15px', backgroundColor: '#0f172a', border: '1px solid #334155', color: 'white' }}
                />
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label small fw-bold text-uppercase mb-0" style={{ color: '#94a3b8', letterSpacing: '0.5px' }}>
                    Password
                  </label>
                  <a href="#" className="small text-decoration-none" style={{ color: '#64748b' }}>Forgot?</a>
                </div>
                <input 
                   type="password" 
                  className="form-control custom-input" 
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  style={{ padding: '12px', borderRadius: '10px', fontSize: '15px', backgroundColor: '#0f172a', border: '1px solid #334155', color: 'white' }}
                />
              </div>

              <button 
                type="submit" 
                disabled={isPending}
                className="btn btn-lts w-100 py-3 fw-bold shadow-sm mt-2" 
                style={{ background: '#fbbf24', color: '#0f172a', borderRadius: '10px', fontSize: '16px', border: 'none' }}
              >
                {isPending ? 'Signing in...' : 'Sign in to LTS →'}
              </button>
            </form>

            <p className="text-center small mt-5" style={{ color: '#64748b' }}>
              By signing in you agree to our <a href="#" className="fw-medium text-decoration-none" style={{ color: '#94a3b8' }}>Terms</a> and <a href="#" className="fw-medium text-decoration-none" style={{ color: '#94a3b8' }}>Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
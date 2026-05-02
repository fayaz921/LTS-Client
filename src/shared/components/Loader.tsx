// src/shared/components/Loader.tsx

export const Loader: React.FC = () => {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.85)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 99999,
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{ textAlign: 'center' }}>
        
        {/* Spinner */}
        <div style={{
          width: 52, height: 52,
          border: '3px solid rgba(251,191,36,0.15)',
          borderTop: '3px solid #fbbf24',
          borderRadius: '50%',
          animation: 'lts-spin 0.8s linear infinite',
          margin: '0 auto 16px'
        }} />

        {/* Logo */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: 8
        }}>
          <div style={{
            background: '#fbbf24', width: 28, height: 28,
            borderRadius: 6, display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: 14
          }}>⚖</div>
          <span style={{ color: 'white', fontWeight: 700, fontSize: 16, letterSpacing: 2 }}>LTS</span>
        </div>

        <p style={{ color: '#64748b', fontSize: 13, marginTop: 10 }}>Please wait...</p>

        <style>{`
          @keyframes lts-spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};
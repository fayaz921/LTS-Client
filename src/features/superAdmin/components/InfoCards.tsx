import type { DashboardStats } from '../types/superAdmin.types';

interface Props {
  stats: DashboardStats;
}

const ProgressBar = ({ value, color, label }: { value: number; color: string; label: string }) => (
  <div className="mt-3">
    <div className="d-flex justify-content-between mb-1" style={{ fontSize: '0.68rem', color: '#7a8599' }}>
      <span>{label}</span>
      <span className="fw-bold" style={{ color }}>{value}%</span>
    </div>
    <div className="rounded-pill overflow-hidden" style={{ background: '#e9ecef', height: 6 }}>
      <div className="h-100 rounded-pill" style={{ width: `${value}%`, background: color }} />
    </div>
  </div>
);

const InfoRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div
    className="d-flex justify-content-between align-items-center py-2"
    style={{ borderBottom: '1px solid #e8ecf0', fontSize: '0.8rem' }}
  >
    <span style={{ color: '#7a8599', fontSize: '0.75rem' }}>{label}</span>
    <span className="fw-semibold">{children}</span>
  </div>
);

const Pill = ({ label, bg, color }: { label: string; bg: string; color: string }) => (
  <span
    className="px-2 py-1 rounded-pill fw-bold"
    style={{ background: bg, color, fontSize: '0.62rem' }}
  >
    {label}
  </span>
);

export const InfoCards = ({ stats }: Props) => {
  return (
    <div className="row g-3 mb-4">

      {/* Trial Status */}
      <div className="col-12 col-lg-4">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body">
            <div className="d-flex align-items-center gap-2 mb-3 pb-2" style={{ borderBottom: '1px solid #e8ecf0' }}>
              <div className="rounded-circle" style={{ width: 8, height: 8, background: '#c89b2a' }} />
              <span className="fw-bold text-uppercase" style={{ fontSize: '0.62rem', letterSpacing: '0.08em', color: '#7a8599' }}>
                Trial Status Overview
              </span>
            </div>
            <InfoRow label="Active Trials">{stats.activeTrials}</InfoRow>
            <InfoRow label="Expiring in 3 days">
              <span style={{ color: '#e53e3e' }}>{stats.expiringIn3Days}</span>
            </InfoRow>
            <InfoRow label="Expired (not converted)">
              <span style={{ color: '#7a8599' }}>{stats.expiredNotConverted}</span>
            </InfoRow>
            <InfoRow label="Converted to Paid">
              <span style={{ color: '#2f9e44' }}>{stats.convertedToPaid}</span>
            </InfoRow>
            <ProgressBar value={stats.trialConversionRate} color="#2f9e44" label="Conversion Rate" />
          </div>
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="col-12 col-lg-4">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body">
            <div className="d-flex align-items-center gap-2 mb-3 pb-2" style={{ borderBottom: '1px solid #e8ecf0' }}>
              <div className="rounded-circle" style={{ width: 8, height: 8, background: '#3b5bdb' }} />
              <span className="fw-bold text-uppercase" style={{ fontSize: '0.62rem', letterSpacing: '0.08em', color: '#7a8599' }}>
                Subscription Plans
              </span>
            </div>
            <InfoRow label="Basic Plan">
              <div className="d-flex align-items-center gap-2">
                <span>{stats.basicCount} orgs</span>
                <Pill label="Free" bg="#f1f3f5" color="#7a8599" />
              </div>
            </InfoRow>
            <InfoRow label="Professional Plan">
              <div className="d-flex align-items-center gap-2">
                <span>{stats.professionalCount} orgs</span>
                <Pill label="PKR 5k/mo" bg="#eef2ff" color="#3b5bdb" />
              </div>
            </InfoRow>
            <InfoRow label="Enterprise Plan">
              <div className="d-flex align-items-center gap-2">
                <span>{stats.enterpriseCount} orgs</span>
                <Pill label="PKR 15k/mo" bg="#f3f0ff" color="#7048e8" />
              </div>
            </InfoRow>
            <InfoRow label="Expired / Inactive">
              <span style={{ color: '#e53e3e' }}>{stats.inactiveCount} orgs</span>
            </InfoRow>
            <ProgressBar value={stats.activeRate} color="#3b5bdb" label="Active Rate" />
          </div>
        </div>
      </div>

      {/* User Limits */}
      <div className="col-12 col-lg-4">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body">
            <div className="d-flex align-items-center gap-2 mb-3 pb-2" style={{ borderBottom: '1px solid #e8ecf0' }}>
              <div className="rounded-circle" style={{ width: 8, height: 8, background: '#2f9e44' }} />
              <span className="fw-bold text-uppercase" style={{ fontSize: '0.62rem', letterSpacing: '0.08em', color: '#7a8599' }}>
                User Limits Overview
              </span>
            </div>
            <InfoRow label="Total Max Users">{stats.totalMaxUsers.toLocaleString()}</InfoRow>
            <InfoRow label="Currently Active Users">
              <span style={{ color: '#3b5bdb' }}>{stats.totalActiveUsers}</span>
            </InfoRow>
            <InfoRow label="Max Clients">{stats.totalMaxClients.toLocaleString()}</InfoRow>
            <InfoRow label="Orgs Near User Limit">
              <span style={{ color: '#e53e3e' }}>{stats.orgsNearLimit} orgs</span>
            </InfoRow>
            <ProgressBar value={stats.userCapacityUsed} color="#f76707" label="User Capacity Used" />
          </div>
        </div>
      </div>

    </div>
  );
};
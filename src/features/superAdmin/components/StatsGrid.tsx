import type { DashboardStats } from '../types/superAdmin.types';

interface Props {
  stats: DashboardStats;
}

export const StatsGrid = ({ stats }: Props) => {
  const items = [
    { label: 'Total Organizations', value: stats.totalOrganizations,                        sub: '+3 this month',               color: '#3b5bdb' },
    { label: 'Active Trials',       value: stats.activeTrials,                               sub: `Expiring soon: ${stats.expiringIn3Days}`, color: '#c89b2a' },
    { label: 'Paid Subscriptions',  value: stats.paidSubscriptions,                          sub: '+5 renewed this month',       color: '#2f9e44' },
    { label: 'Total Revenue', value: `PKR ${(stats.totalRevenue ?? 0).toLocaleString()}`,     sub: '+18.2% vs last month',        color: '#e53e3e' },
  ];

  return (
    <div className="row g-3 mb-4">
      {items.map((stat, i) => (
        <div className="col-6 col-lg-3" key={i}>
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span
                  className="fw-bold text-uppercase text-muted"
                  style={{ fontSize: '0.62rem', letterSpacing: '0.08em' }}
                >
                  {stat.label}
                </span>
                <div className="rounded-circle" style={{ width: 9, height: 9, background: stat.color }} />
              </div>
              <div className="fw-bold" style={{ fontSize: '1.8rem', lineHeight: 1 }}>
                {stat.value}
              </div>
              <div className="text-muted mt-1" style={{ fontSize: '0.7rem' }}>
                {stat.sub}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
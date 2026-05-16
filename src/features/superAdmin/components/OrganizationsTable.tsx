import { useMemo, useState } from 'react';
import type { Organization, SubscriptionPlan } from '../types/superAdmin.types';

interface Props {
  organizations: Organization[];
}

const PlanPill = ({ plan }: { plan: SubscriptionPlan }) => {
  const config = {
    Basic:        { bg: '#f1f3f5', color: '#7a8599' },
    Professional: { bg: '#eef2ff', color: '#3b5bdb' },
    Enterprise:   { bg: '#f3f0ff', color: '#7048e8' },
  }[plan] ?? { bg: '#f1f3f5', color: '#7a8599' };
  return (
    <span className="px-2 py-1 rounded-pill fw-bold"
      style={{ background: config.bg, color: config.color, fontSize: '0.62rem' }}>
      {plan}
    </span>
  );
};

const StatusPill = ({ org }: { org: Organization }) => {
  if (org.isTrialActive)
    return <span className="px-2 py-1 rounded-pill fw-bold" style={{ background: '#fef9e7', color: '#c89b2a', fontSize: '0.62rem' }}>⏳ Trial</span>;
  if (org.isSubscriptionActive && org.isActive)
    return <span className="px-2 py-1 rounded-pill fw-bold" style={{ background: '#f0fff4', color: '#2f9e44', fontSize: '0.62rem' }}>● Active</span>;
  return <span className="px-2 py-1 rounded-pill fw-bold" style={{ background: '#fff5f5', color: '#e53e3e', fontSize: '0.62rem' }}>✕ Expired</span>;
};

const EndDate = ({ org }: { org: Organization }) => {
  const date = org.isTrialActive ? org.trialEndDate : org.subscriptionEndDate;
  const isExpiringSoon = useMemo(() => {
    return !!date && org.isTrialActive &&
      new Date(date).getTime() <= new Date().setHours(0, 0, 0, 0) + 3 * 24 * 60 * 60 * 1000;
  }, [org.isTrialActive, date]);
  if (!date) return <span style={{ color: '#7a8599' }}>—</span>;
  return (
    <span style={{ fontSize: '0.78rem', color: isExpiringSoon ? '#e53e3e' : 'inherit' }}>
      {new Date(date).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })}
    </span>
  );
};

const UserCount = ({ org }: { org: Organization }) => {
  const pct = (org.activeUserCount / org.maxUsers) * 100;
  const isNearLimit = pct >= 80;
  return (
    <div>
      <span className="fw-semibold" style={{ fontSize: '0.82rem', color: isNearLimit ? '#e53e3e' : 'inherit' }}>
        {org.activeUserCount} / {org.maxUsers}
      </span>
      {isNearLimit && <div style={{ fontSize: '0.62rem', color: '#e53e3e' }}>Near limit!</div>}
    </div>
  );
};

export const OrganizationsTable = ({ organizations }: Props) => {
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const totalPages = Math.ceil(organizations.length / pageSize);
  const paginated = organizations.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3 pb-2"
          style={{ borderBottom: '1px solid #e8ecf0' }}>
          <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
            <span className="rounded-circle d-inline-block" style={{ width: 8, height: 8, background: '#3b5bdb' }} />
            Organizations
            <span style={{ color: '#7a8599', fontWeight: 400, fontSize: '0.78rem' }}>
              ({organizations.length} total)
            </span>
          </h6>
          <a href="#" className="text-decoration-none fw-bold" style={{ color: '#c89b2a', fontSize: '0.78rem' }}>View all →</a>
        </div>

        <div className="table-responsive">
          <table className="table table-hover mb-0" style={{ fontSize: '0.82rem' }}>
            <thead>
              <tr>
                {['Organization', 'Plan', 'Status', 'Trial / Sub Ends', 'Users', 'Clients'].map(h => (
                  <th key={h} className="fw-bold text-uppercase text-muted"
                    style={{ fontSize: '0.62rem', letterSpacing: '0.06em', padding: '8px 12px', background: 'transparent', borderBottom: '1px solid #e8ecf0' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map(org => (
                <tr key={org.id} style={{ borderBottom: '1px solid #f0f2f5', verticalAlign: 'middle' }}>
                  <td style={{ padding: '12px' }}>
                    <div className="fw-semibold" style={{ fontSize: '0.83rem' }}>{org.organizationName}</div>
                    <div style={{ fontSize: '0.7rem', color: '#7a8599' }}>{org.slug}</div>
                  </td>
                  <td style={{ padding: '12px' }}><PlanPill plan={org.plan} /></td>
                  <td style={{ padding: '12px' }}><StatusPill org={org} /></td>
                  <td style={{ padding: '12px' }}><EndDate org={org} /></td>
                  <td style={{ padding: '12px' }}><UserCount org={org} /></td>
                  <td style={{ padding: '12px' }}>
                    <span className="fw-semibold">{org.maxClients.toLocaleString()}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {organizations.length === 0 && (
          <div className="text-center py-5 text-muted" style={{ fontSize: '0.85rem' }}>🏢 No organizations found</div>
        )}

          {totalPages > 1 && (
          <div className="d-flex justify-content-center align-items-center gap-2 py-3">
            <button className="btn btn-sm"
              style={{ background: page === 1 ? '#e2e8f0' : '#1e2d45', color: page === 1 ? '#94a3b8' : 'white', border: 'none', borderRadius: 6, padding: '6px 14px', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
              onClick={() => setPage(p => p - 1)} disabled={page === 1}>
              ← Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} className="btn btn-sm"
                style={{ background: page === p ? '#c89b2a' : 'white', color: page === p ? '#1e2d45' : '#64748b', border: '1px solid #e2e8f0', borderRadius: 6, padding: '6px 12px', fontWeight: page === p ? 700 : 400, cursor: 'pointer' }}
                onClick={() => setPage(p)}>
                {p}
              </button>
            ))}

            <button className="btn btn-sm"
              style={{ background: page === totalPages ? '#e2e8f0' : '#1e2d45', color: page === totalPages ? '#94a3b8' : 'white', border: 'none', borderRadius: 6, padding: '6px 14px', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
              onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>
              Next →
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
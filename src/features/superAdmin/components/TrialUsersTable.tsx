import { useMemo } from 'react';
import type { TrailUser } from '../types/superAdmin.types';

interface Props {
  trialUsers: TrailUser[];
}

const DaysRemaining = ({ endDate }: { endDate: string }) => {
  const days = useMemo(() => {
    const now = new Date().setHours(0, 0, 0, 0);
    return Math.ceil((new Date(endDate).getTime() - now) / (1000 * 60 * 60 * 24));
  }, [endDate]);

  if (days < 0)
    return <span style={{ color: '#e53e3e', fontWeight: 600 }}>Expired</span>;
  if (days <= 3)
    return <span style={{ color: '#e53e3e', fontWeight: 600 }}>{days} days left ⚠️</span>;
  return <span style={{ color: '#2f9e44', fontWeight: 600 }}>{days} days left</span>;
};

const StatusPill = ({ isActive }: { isActive: boolean }) =>
  isActive ? (
    <span className="px-2 py-1 rounded-pill fw-bold"
      style={{ background: '#fef9e7', color: '#c89b2a', fontSize: '0.62rem' }}>
      ⏳ Trial Active
    </span>
  ) : (
    <span className="px-2 py-1 rounded-pill fw-bold"
      style={{ background: '#fff5f5', color: '#e53e3e', fontSize: '0.62rem' }}>
      ✕ Trial Ended
    </span>
  );

export const TrialUsersTable = ({ trialUsers }: Props) => {
  const expiringSoon = useMemo(() => {
    const now = new Date().setHours(0, 0, 0, 0);
    return trialUsers.filter((u) => {
      const days = Math.ceil((new Date(u.trialEndDate).getTime() - now) / (1000 * 60 * 60 * 24));
      return days >= 0 && days <= 3;
    }).length;
  }, [trialUsers]);

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3 pb-2"
          style={{ borderBottom: '1px solid #e8ecf0' }}>
          <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
            <span className="rounded-circle d-inline-block"
              style={{ width: 8, height: 8, background: '#c89b2a' }} />
            Trial Users
          </h6>
          <div className="d-flex align-items-center gap-3">
            <span className="px-2 py-1 rounded-pill fw-bold"
              style={{ background: '#fff5f5', color: '#e53e3e', fontSize: '0.68rem' }}>
              ⚠️ {expiringSoon} expiring soon
            </span>
            <a href="#" className="text-decoration-none fw-bold"
              style={{ color: '#c89b2a', fontSize: '0.78rem' }}>
              View all →
            </a>
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-hover mb-0" style={{ fontSize: '0.82rem' }}>
            <thead>
              <tr>
                {['Organization', 'Email', 'Trial Start', 'Trial End', 'Remaining', 'Status'].map(h => (
                  <th key={h} className="fw-bold text-uppercase text-muted"
                    style={{ fontSize: '0.62rem', letterSpacing: '0.06em', padding: '8px 12px', background: 'transparent', borderBottom: '1px solid #e8ecf0' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trialUsers.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid #f0f2f5', verticalAlign: 'middle' }}>
                  <td style={{ padding: '12px' }}>
                    <div className="fw-semibold">{user.organizationName}</div>
                  </td>
                  <td style={{ padding: '12px', color: '#7a8599' }}>
                    {user.email}
                  </td>
                  <td style={{ padding: '12px', fontSize: '0.78rem' }}>
                    {new Date(user.trialStartDate).toLocaleDateString('en-PK', {
                      day: '2-digit', month: 'short', year: 'numeric',
                    })}
                  </td>
                  <td style={{ padding: '12px', fontSize: '0.78rem' }}>
                    {new Date(user.trialEndDate).toLocaleDateString('en-PK', {
                      day: '2-digit', month: 'short', year: 'numeric',
                    })}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <DaysRemaining endDate={user.trialEndDate} />
                  </td>
                  <td style={{ padding: '12px' }}>
                    <StatusPill isActive={user.isTrialActive} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {trialUsers.length === 0 && (
          <div className="text-center py-5 text-muted" style={{ fontSize: '0.85rem' }}>
            ⏳ No trial users found
          </div>
        )}

      </div>
    </div>
  );
};
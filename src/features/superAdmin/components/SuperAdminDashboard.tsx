import type { DashboardStats, Organization, Payment, TrailUser } from '../types/superAdmin.types';
import { useDashboardStats, useOrganizations, usePayments, useTrialUsers } from '../hooks/useSuperAdmin';
import { StatsGrid } from './StatsGrid';
import { InfoCards } from './InfoCards';
import { OrganizationsTable } from './OrganizationsTable';
import { TrialUsersTable } from './TrialUsersTable';
import { PaymentsTable } from './PaymentsTable';

const RevenueWallet = ({ stats }: { stats: DashboardStats }) => (
  <div className="card border-0 shadow-sm">
    <div className="card-body">
      <div className="d-flex justify-content-between align-items-center mb-3 pb-2"
        style={{ borderBottom: '1px solid #e8ecf0' }}>
        <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
          <span className="rounded-circle d-inline-block"
            style={{ width: 8, height: 8, background: '#7048e8' }} />
          Revenue Wallet
        </h6>
        <a href="#" className="text-decoration-none fw-bold"
          style={{ color: '#c89b2a', fontSize: '0.78rem' }}>Export →</a>
      </div>
      <div className="rounded-3 p-3 mb-3 text-white"
        style={{ background: 'linear-gradient(135deg, #1e2d45 0%, #3b5bdb 100%)' }}>
        <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)' }}>
          Total Collected
        </div>
        <div className="fw-bold" style={{ fontSize: '2rem' }}>
          PKR {stats.totalRevenue.toLocaleString()}
        </div>
        <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>
          Across all active organizations
        </div>
      </div>
      <div className="row g-2 mb-3">
        {[
          { label: 'This Month', value: stats.thisMonthRevenue, color: '#2f9e44' },
          { label: 'Pending',    value: stats.pendingRevenue,   color: '#f76707' },
          { label: 'Overdue',    value: stats.overdueRevenue,   color: '#e53e3e' },
          { label: 'Refunded',   value: stats.refundedRevenue,  color: '#7a8599' },
        ].map((item) => (
          <div className="col-6" key={item.label}>
            <div className="rounded-3 p-2" style={{ background: '#f8fafc', border: '1px solid #e8ecf0' }}>
              <div style={{ fontSize: '0.6rem', color: '#7a8599', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {item.label}
              </div>
              <div className="fw-bold mt-1" style={{ fontSize: '0.95rem', color: item.color }}>
                PKR {item.value.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div>
        <div className="d-flex justify-content-between mb-1"
          style={{ fontSize: '0.68rem', color: '#7a8599' }}>
          <span>Collection Rate</span>
          <span className="fw-bold" style={{ color: '#2f9e44' }}>{stats.collectionRate}%</span>
        </div>
        <div className="rounded-pill overflow-hidden" style={{ background: '#e9ecef', height: 6 }}>
          <div className="h-100 rounded-pill"
            style={{ width: `${stats.collectionRate}%`, background: 'linear-gradient(90deg,#3b5bdb,#2f9e44)' }} />
        </div>
      </div>
    </div>
  </div>
);

const RecentActivity = () => {
  const activities = [
    { id: '1', icon: '🏢', bg: '#ebf0ff', text: 'New org <strong>Siddiqui Advocates</strong> registered on Trial plan', time: '2 hours ago' },
    { id: '2', icon: '💳', bg: '#f0fff4', text: 'Payment received from <strong>Al-Noor Law</strong> — PKR 15,000',        time: 'Yesterday, 3:20 PM' },
    { id: '3', icon: '⏳', bg: '#fff8e1', text: 'Trial expiring in 3 days — <strong>Justice First Chambers</strong>',       time: '2 days ago' },
    { id: '4', icon: '🚫', bg: '#fff5f5', text: 'Subscription expired — <strong>Qadir Legal</strong> deactivated',          time: '3 days ago' },
    { id: '5', icon: '⬆️', bg: '#f3f0ff', text: '<strong>Rehman & Partners</strong> upgraded Trial → Professional',         time: '4 days ago' },
    { id: '6', icon: '👤', bg: '#f0fff4', text: '5 new users added in <strong>Punjab Bar Council</strong>',                  time: '5 days ago' },
  ];

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3 pb-2"
          style={{ borderBottom: '1px solid #e8ecf0' }}>
          <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
            <span className="rounded-circle d-inline-block"
              style={{ width: 8, height: 8, background: '#2f9e44' }} />
            Recent Activity
          </h6>
          <a href="#" className="text-decoration-none fw-bold"
            style={{ color: '#c89b2a', fontSize: '0.78rem' }}>View all →</a>
        </div>
        {activities.map((item) => (
          <div key={item.id} className="d-flex gap-3 align-items-start py-2"
            style={{ borderBottom: '1px solid #f0f2f5' }}>
            <div className="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0"
              style={{ width: 32, height: 32, background: item.bg, fontSize: '0.85rem' }}>
              {item.icon}
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', lineHeight: 1.4 }}
                dangerouslySetInnerHTML={{ __html: item.text }} />
              <div className="text-muted mt-1" style={{ fontSize: '0.7rem' }}>{item.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const dummyStats: DashboardStats = {
  totalOrganizations: 47, activeTrials: 12, paidSubscriptions: 28,
  totalRevenue: 240000, totalActiveUsers: 312, expiringIn3Days: 4,
  expiredNotConverted: 7, convertedToPaid: 18, trialConversionRate: 72,
  basicCount: 14, professionalCount: 20, enterpriseCount: 8, inactiveCount: 5,
  activeRate: 89, totalMaxUsers: 1240, totalMaxClients: 8600, orgsNearLimit: 3,
  userCapacityUsed: 25, thisMonthRevenue: 85000, pendingRevenue: 10000,
  overdueRevenue: 0, refundedRevenue: 5000, collectionRate: 89,
};

const dummyOrgs: Organization[] = [
  { id: '1', organizationName: 'Al-Noor Law Associates',  slug: 'al-noor-law',      plan: 'Enterprise',   isTrialActive: false, isSubscriptionActive: true,  isActive: true,  maxUsers: 50, maxClients: 500, activeUserCount: 18, subscriptionEndDate: '2025-12-31', createdAt: '2024-01-01' },
  { id: '2', organizationName: 'Justice First Chambers',  slug: 'justice-first',    plan: 'Professional', isTrialActive: true,  isSubscriptionActive: false, isActive: true,  maxUsers: 20, maxClients: 200, activeUserCount: 6,  trialStartDate: '2026-04-15', trialEndDate: '2026-05-15', createdAt: '2024-02-01' },
  { id: '3', organizationName: 'Rehman & Partners',       slug: 'rehman-partners',  plan: 'Professional', isTrialActive: false, isSubscriptionActive: true,  isActive: true,  maxUsers: 20, maxClients: 200, activeUserCount: 12, subscriptionEndDate: '2026-06-30', createdAt: '2024-03-01' },
  { id: '4', organizationName: 'Qadir Legal Services',    slug: 'qadir-legal',      plan: 'Basic',        isTrialActive: false, isSubscriptionActive: false, isActive: false, maxUsers: 5,  maxClients: 50,  activeUserCount: 3,  subscriptionEndDate: '2026-04-01', createdAt: '2024-04-01' },
];

const dummyPayments: Payment[] = [
  { id: '1', invoiceNo: 'INV-2026-041', organizationName: 'Al-Noor Law',   plan: 'Enterprise',   amount: 15000, date: '2026-05-05', status: 'Paid'    },
  { id: '2', invoiceNo: 'INV-2026-040', organizationName: 'Punjab Bar',    plan: 'Enterprise',   amount: 15000, date: '2026-05-01', status: 'Paid'    },
  { id: '3', invoiceNo: 'INV-2026-039', organizationName: 'Rehman & Co',   plan: 'Professional', amount: 5000,  date: '2026-04-28', status: 'Paid'    },
  { id: '4', invoiceNo: 'INV-2026-038', organizationName: 'Qadir Legal',   plan: 'Basic',        amount: 0,     date: '2026-04-01', status: 'Overdue' },
  { id: '5', invoiceNo: 'INV-2026-037', organizationName: 'Justice First', plan: 'Professional', amount: 5000,  date: '2026-04-20', status: 'Pending' },
];

const dummyTrialUsers: TrailUser[] = [
  { id: '1', organizationName: 'Justice First Chambers', email: 'admin@justicefirst.pk', trialStartDate: '2026-04-15', trialEndDate: '2026-05-15', isTrialActive: true  },
  { id: '2', organizationName: 'Siddiqui Advocates',     email: 'info@siddiqui.pk',      trialStartDate: '2026-04-18', trialEndDate: '2026-05-10', isTrialActive: true  },
  { id: '3', organizationName: 'City Law Firm',          email: 'hello@citylaw.pk',      trialStartDate: '2026-03-01', trialEndDate: '2026-04-01', isTrialActive: false },
];

export const SuperAdminDashboard = () => {
  const { data: stats }         = useDashboardStats();
  const { data: organizations } = useOrganizations();
  const { data: payments }      = usePayments();
  const { data: trialUsers }    = useTrialUsers();

  const finalStats      = stats         ?? dummyStats;
  const finalOrgs       = organizations ?? dummyOrgs;
  const finalPayments   = payments      ?? dummyPayments;
  const finalTrialUsers = trialUsers    ?? dummyTrialUsers;

  return (
    <div className="container-fluid py-4">

      {/* HERO */}
      <div className="rounded-3 p-4 mb-4 text-white"
        style={{ background: 'linear-gradient(135deg, #1e2d45 0%, #263550 100%)' }}>
        <div className="small fw-bold text-uppercase mb-3"
          style={{ color: '#c89b2a', letterSpacing: '0.1em' }}>
          ⚡ Super Admin Control Panel
        </div>
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div>
            <h1 className="fw-bold mb-1" style={{ fontSize: '1.8rem' }}>Admin Dashboard</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: 0 }}>
              Manage organizations, subscriptions, trials, and payments.
            </p>
          </div>
          <div className="d-flex gap-4">
            {[
              { val: `PKR ${finalStats.totalRevenue.toLocaleString()}`, lbl: 'Total Revenue' },
              { val: finalStats.totalOrganizations,                      lbl: 'Total Orgs'    },
              { val: finalStats.totalActiveUsers,                        lbl: 'Active Users'  },
            ].map((m) => (
              <div key={m.lbl} className="text-end">
                <div className="fw-bold" style={{ fontSize: '1.4rem' }}>{m.val}</div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {m.lbl}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <StatsGrid stats={finalStats} />
      <InfoCards stats={finalStats} />

      <div className="mb-4">
        <OrganizationsTable organizations={finalOrgs} />
      </div>

      <div className="mb-4">
        <TrialUsersTable trialUsers={finalTrialUsers} />
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <PaymentsTable payments={finalPayments} />
        </div>
        <div className="col-12 col-lg-6 d-flex flex-column gap-4">
          <RevenueWallet stats={finalStats} />
          <RecentActivity />
        </div>
      </div>

    </div>
  );
};
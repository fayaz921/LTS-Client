import { useState } from 'react'
import type { DashboardStats, Organization, Payment, TrailUser } from '../types/superAdmin.types'
import { useDashboardStats, useOrganizations, usePayments, useTrialUsers } from '../hooks/useSuperAdmin'
import { StatsGrid } from './StatsGrid'
import { InfoCards } from './InfoCards'
import { OrganizationsTable } from './OrganizationsTable'
import { TrialUsersTable } from './TrialUsersTable'
import { PaymentsTable } from './PaymentsTable'
import { SuperAdminLayout } from '../../../shared/components/SuperAdminLayout'

type SidebarSection = 'overview' | 'organizations' | 'trials' | 'subscriptions' | 'payments' | 'revenue'

// ── Dummy Data ─────────────────────────────────────────────
const dummyStats: DashboardStats = {
  totalOrganizations: 47, activeTrials: 12, paidSubscriptions: 28,
  totalRevenue: 240000, totalActiveUsers: 312, expiringIn3Days: 4,
  expiredNotConverted: 7, convertedToPaid: 18, trialConversionRate: 72,
  basicCount: 14, professionalCount: 20, enterpriseCount: 8, inactiveCount: 5,
  activeRate: 89, totalMaxUsers: 1240, totalMaxClients: 8600, orgsNearLimit: 3,
  userCapacityUsed: 25, thisMonthRevenue: 85000, pendingRevenue: 10000,
  overdueRevenue: 0, refundedRevenue: 5000, collectionRate: 89,
}

const dummyOrgs: Organization[] = [
  { id: '1', organizationName: 'Al-Noor Law Associates', slug: 'al-noor-law', plan: 'Enterprise', isTrialActive: false, isSubscriptionActive: true, isActive: true, maxUsers: 50, maxClients: 500, activeUserCount: 18, subscriptionEndDate: '2025-12-31', createdAt: '2024-01-01' },
  { id: '2', organizationName: 'Justice First Chambers', slug: 'justice-first', plan: 'Professional', isTrialActive: true, isSubscriptionActive: false, isActive: true, maxUsers: 20, maxClients: 200, activeUserCount: 6, trialStartDate: '2026-04-15', trialEndDate: '2026-05-15', createdAt: '2024-02-01' },
  { id: '3', organizationName: 'Rehman & Partners', slug: 'rehman-partners', plan: 'Professional', isTrialActive: false, isSubscriptionActive: true, isActive: true, maxUsers: 20, maxClients: 200, activeUserCount: 12, subscriptionEndDate: '2026-06-30', createdAt: '2024-03-01' },
  { id: '4', organizationName: 'Qadir Legal Services', slug: 'qadir-legal', plan: 'Basic', isTrialActive: false, isSubscriptionActive: false, isActive: false, maxUsers: 5, maxClients: 50, activeUserCount: 3, subscriptionEndDate: '2026-04-01', createdAt: '2024-04-01' },
]

const dummyPayments: Payment[] = [
  { id: '1', invoiceNo: 'INV-2026-041', organizationName: 'Al-Noor Law', plan: 'Enterprise', amount: 15000, date: '2026-05-05', status: 'Paid' },
  { id: '2', invoiceNo: 'INV-2026-040', organizationName: 'Punjab Bar', plan: 'Enterprise', amount: 15000, date: '2026-05-01', status: 'Paid' },
  { id: '3', invoiceNo: 'INV-2026-039', organizationName: 'Rehman & Co', plan: 'Professional', amount: 5000, date: '2026-04-28', status: 'Paid' },
  { id: '4', invoiceNo: 'INV-2026-038', organizationName: 'Qadir Legal', plan: 'Basic', amount: 0, date: '2026-04-01', status: 'Overdue' },
  { id: '5', invoiceNo: 'INV-2026-037', organizationName: 'Justice First', plan: 'Professional', amount: 5000, date: '2026-04-20', status: 'Pending' },
]

const dummyTrialUsers: TrailUser[] = [
  { id: '1', organizationName: 'Justice First Chambers', email: 'admin@justicefirst.pk', trialStartDate: '2026-04-15', trialEndDate: '2026-05-15', isTrialActive: true },
  { id: '2', organizationName: 'Siddiqui Advocates', email: 'info@siddiqui.pk', trialStartDate: '2026-04-18', trialEndDate: '2026-05-10', isTrialActive: true },
  { id: '3', organizationName: 'City Law Firm', email: 'hello@citylaw.pk', trialStartDate: '2026-03-01', trialEndDate: '2026-04-01', isTrialActive: false },
]

// ── Subscriptions Section ──────────────────────────────────
const SubscriptionsSection = ({ stats }: { stats: DashboardStats }) => (
  <div>
    <div className="row g-3 mb-4">
      {[
        { plan: 'Basic',        count: stats.basicCount,        price: 'Free',       bg: '#f1f3f5', color: '#7a8599' },
        { plan: 'Professional', count: stats.professionalCount, price: 'PKR 5k/mo',  bg: '#eef2ff', color: '#3b5bdb' },
        { plan: 'Enterprise',   count: stats.enterpriseCount,   price: 'PKR 15k/mo', bg: '#f3f0ff', color: '#7048e8' },
        { plan: 'Inactive',     count: stats.inactiveCount,     price: 'Expired',    bg: '#fff5f5', color: '#e53e3e' },
      ].map(item => (
        <div className="col-6 col-lg-3" key={item.plan}>
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="fw-bold text-uppercase mb-2" style={{ fontSize: '0.62rem', letterSpacing: '0.08em', color: '#7a8599' }}>{item.plan}</div>
              <div className="fw-bold mb-2" style={{ fontSize: '2rem', color: item.color }}>{item.count}</div>
              <span className="px-2 py-1 rounded-pill fw-bold" style={{ background: item.bg, color: item.color, fontSize: '0.65rem' }}>{item.price}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between mb-2" style={{ fontSize: '0.8rem' }}>
          <span>Active Rate</span>
          <span className="fw-bold" style={{ color: '#3b5bdb' }}>{stats.activeRate}%</span>
        </div>
        <div className="rounded-pill overflow-hidden" style={{ background: '#e9ecef', height: 10 }}>
          <div className="h-100 rounded-pill" style={{ width: `${stats.activeRate}%`, background: '#3b5bdb' }} />
        </div>
      </div>
    </div>
  </div>
)

// ── Revenue Section ────────────────────────────────────────
const RevenueSection = ({ stats }: { stats: DashboardStats }) => (
  <div>
    <div className="row g-3 mb-4">
      {[
        { label: 'Total Collected', value: `PKR ${stats.totalRevenue.toLocaleString()}`,     color: '#3b5bdb' },
        { label: 'This Month',      value: `PKR ${stats.thisMonthRevenue.toLocaleString()}`, color: '#2f9e44' },
        { label: 'Pending',         value: `PKR ${stats.pendingRevenue.toLocaleString()}`,   color: '#f76707' },
        { label: 'Refunded',        value: `PKR ${stats.refundedRevenue.toLocaleString()}`,  color: '#7a8599' },
      ].map(item => (
        <div className="col-6 col-lg-3" key={item.label}>
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="fw-bold text-uppercase text-muted mb-2" style={{ fontSize: '0.62rem', letterSpacing: '0.08em' }}>{item.label}</div>
              <div className="fw-bold" style={{ fontSize: '1.5rem', color: item.color }}>{item.value}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <div className="rounded-3 p-4 text-white mb-4" style={{ background: 'linear-gradient(135deg, #1e2d45 0%, #3b5bdb 100%)' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)' }}>Total Collected</div>
          <div className="fw-bold" style={{ fontSize: '2.5rem' }}>PKR {stats.totalRevenue.toLocaleString()}</div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>Across all active organizations</div>
        </div>
        <div className="d-flex justify-content-between mb-2" style={{ fontSize: '0.8rem' }}>
          <span>Collection Rate</span>
          <span className="fw-bold" style={{ color: '#2f9e44' }}>{stats.collectionRate}%</span>
        </div>
        <div className="rounded-pill overflow-hidden" style={{ background: '#e9ecef', height: 8 }}>
          <div className="h-100 rounded-pill" style={{ width: `${stats.collectionRate}%`, background: 'linear-gradient(90deg,#3b5bdb,#2f9e44)' }} />
        </div>
      </div>
    </div>
  </div>
)

// ── Main Dashboard ─────────────────────────────────────────
export const SuperAdminDashboard = () => {
  const [activeSection, setActiveSection] = useState<SidebarSection>('overview')

  const { data: stats }         = useDashboardStats()
  const { data: organizations } = useOrganizations()
  const { data: payments }      = usePayments()
  const { data: trialUsers }    = useTrialUsers()

  const finalStats      = stats         ?? dummyStats
  const finalOrgs       = organizations ?? dummyOrgs
  const finalPayments   = payments      ?? dummyPayments
  const finalTrialUsers = trialUsers    ?? dummyTrialUsers

  return (
    <SuperAdminLayout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      stats={{
        totalOrganizations: finalStats.totalOrganizations,
        totalActiveUsers:   finalStats.totalActiveUsers,
        activeTrials:       finalStats.activeTrials,
        totalRevenue:       finalStats.totalRevenue,
      }}
    >
      {activeSection === 'overview' && (
        <>
          <StatsGrid stats={finalStats} />
          <InfoCards stats={finalStats} />
        </>
      )}

      {activeSection === 'organizations' && (
        <OrganizationsTable organizations={finalOrgs} />
      )}

      {activeSection === 'trials' && (
        <TrialUsersTable trialUsers={finalTrialUsers} />
      )}

      {activeSection === 'subscriptions' && (
        <SubscriptionsSection stats={finalStats} />
      )}

      {activeSection === 'payments' && (
        <PaymentsTable payments={finalPayments} />
      )}

      {activeSection === 'revenue' && (
        <RevenueSection stats={finalStats} />
      )}
    </SuperAdminLayout>
  )
}
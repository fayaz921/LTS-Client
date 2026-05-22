import { useState } from 'react'
import type { DashboardStats } from '../types/superAdmin.types'
import { useDashboardStats, useOrganizations, usePayments, useTrialUsers } from '../hooks/useSuperAdmin'
import { StatsGrid } from './StatsGrid'
import { InfoCards } from './InfoCards'
import { OrganizationsTable } from './OrganizationsTable'
import { TrialUsersTable } from './TrialUsersTable'
import { PaymentsTable } from './PaymentsTable'
import { SuperAdminLayout } from '../../../shared/components/SuperAdminLayout'

type SidebarSection = 'overview' | 'organizations' | 'trials' | 'subscriptions' | 'payments' | 'revenue'

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
              <div className="fw-bold mb-2" style={{ fontSize: '2rem', color: item.color }}>{item.count ?? 0}</div>
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
          <span className="fw-bold" style={{ color: '#3b5bdb' }}>{stats.activeRate ?? 0}%</span>
        </div>
        <div className="rounded-pill overflow-hidden" style={{ background: '#e9ecef', height: 10 }}>
          <div className="h-100 rounded-pill" style={{ width: `${stats.activeRate ?? 0}%`, background: '#3b5bdb' }} />
        </div>
      </div>
    </div>
  </div>
)

const RevenueSection = ({ stats }: { stats: DashboardStats }) => (
  <div>
    <div className="row g-3 mb-4">
      {[
        { label: 'Total Collected', value: `PKR ${(stats.totalRevenue ?? 0).toLocaleString()}`,     color: '#3b5bdb' },
        { label: 'This Month',      value: `PKR ${(stats.thisMonthRevenue ?? 0).toLocaleString()}`, color: '#2f9e44' },
        { label: 'Pending',         value: `PKR ${(stats.pendingRevenue ?? 0).toLocaleString()}`,   color: '#f76707' },
        { label: 'Refunded',        value: `PKR ${(stats.refundedRevenue ?? 0).toLocaleString()}`,  color: '#7a8599' },
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
          <div className="fw-bold" style={{ fontSize: '2.5rem' }}>PKR {(stats.totalRevenue ?? 0).toLocaleString()}</div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>Across all active organizations</div>
        </div>
        <div className="d-flex justify-content-between mb-2" style={{ fontSize: '0.8rem' }}>
          <span>Collection Rate</span>
          <span className="fw-bold" style={{ color: '#2f9e44' }}>{stats.collectionRate ?? 0}%</span>
        </div>
        <div className="rounded-pill overflow-hidden" style={{ background: '#e9ecef', height: 8 }}>
          <div className="h-100 rounded-pill" style={{ width: `${stats.collectionRate ?? 0}%`, background: 'linear-gradient(90deg,#3b5bdb,#2f9e44)' }} />
        </div>
      </div>
    </div>
  </div>
)

export const SuperAdminDashboard = () => {
  const [activeSection, setActiveSection] = useState<SidebarSection>('overview')
  const [orgsPage, setOrgsPage]     = useState(1)
  const [trialPage, setTrialPage]   = useState(1)  // ← NEW

  const { data: stats }     = useDashboardStats()
  const { data: orgsData }  = useOrganizations(orgsPage, 8)
  const { data: trialData } = useTrialUsers(trialPage, 8)   // ← FIXED
  const { data: payments }  = usePayments()

  const finalPayments = payments ?? []

  return (
    <SuperAdminLayout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      stats={{
        totalOrganizations: stats?.totalOrganizations ?? 0,
        totalActiveUsers:   stats?.totalActiveUsers   ?? 0,
        activeTrials:       stats?.activeTrials       ?? 0,
        totalRevenue:       stats?.totalRevenue       ?? 0,
      }}
    >
      {activeSection === 'overview' && (
        stats ? (
          <>
            <StatsGrid stats={stats} />
            <InfoCards stats={stats} />
          </>
        ) : (
          <div className="text-center py-5 text-muted" style={{ fontSize: '0.85rem' }}>
            Loading...
          </div>
        )
      )}

      {activeSection === 'organizations' && (
        <OrganizationsTable
          data={orgsData}
          page={orgsPage}
          onPageChange={setOrgsPage}
        />
      )}

      {activeSection === 'trials' && trialData && (   // ← FIXED
        <TrialUsersTable
          data={trialData}
          page={trialPage}
          onPageChange={setTrialPage}
        />
      )}

      {activeSection === 'subscriptions' && stats && (
        <SubscriptionsSection stats={stats} />
      )}

      {activeSection === 'payments' && (
        <PaymentsTable payments={finalPayments} />
      )}

      {activeSection === 'revenue' && stats && (
        <RevenueSection stats={stats} />
      )}
    </SuperAdminLayout>
  )
}
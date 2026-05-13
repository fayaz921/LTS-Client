import { useState, useEffect, type CSSProperties } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

type SidebarSection = 'overview' | 'organizations' | 'trials' | 'subscriptions' | 'payments' | 'revenue'

const navItems: { key: SidebarSection; label: string; icon: string; badge?: number }[] = [
  { key: 'overview',      label: 'Overview',      icon: '▦' },
  { key: 'organizations', label: 'Organizations', icon: '🏢', badge: 47 },
  { key: 'trials',        label: 'Trial Users',   icon: '⏳', badge: 12 },
  { key: 'subscriptions', label: 'Subscriptions', icon: '💳', badge: 28 },
  { key: 'payments',      label: 'Payments',      icon: '💰' },
  { key: 'revenue',       label: 'Revenue',       icon: '📊' },
]

const EXPANDED_WIDTH = 240
const COLLAPSED_WIDTH = 72

interface SuperAdminLayoutProps {
  activeSection: SidebarSection
  onSectionChange: (section: SidebarSection) => void
  stats: {
    totalOrganizations: number
    totalActiveUsers: number
    activeTrials: number
    totalRevenue: number
  }
  children: React.ReactNode
}

const sectionTitles: Record<SidebarSection, { title: string; desc: string }> = {
  overview:      { title: 'Overview',      desc: 'High-level stats across all organizations.' },
  organizations: { title: 'Organizations', desc: 'All registered organizations and their status.' },
  trials:        { title: 'Trial Users',   desc: 'Active and expired trial accounts.' },
  subscriptions: { title: 'Subscriptions', desc: 'Plan distribution and subscription health.' },
  payments:      { title: 'Payments',      desc: 'Recent invoices and payment status.' },
  revenue:       { title: 'Revenue',       desc: 'Total collected, pending, and refunded amounts.' },
}

export const SuperAdminLayout = ({
  activeSection,
  onSectionChange,
  children,
}: SuperAdminLayoutProps) => {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')

  useEffect(() => {
    const tabletQ = window.matchMedia('(max-width: 1024px)')
    const mobileQ = window.matchMedia('(max-width: 768px)')

    const sync = () => {
      const vp = mobileQ.matches ? 'mobile' : tabletQ.matches ? 'tablet' : 'desktop'
      setViewport(vp)
      setCollapsed(vp === 'mobile')
    }

    sync()
    tabletQ.addEventListener('change', sync)
    mobileQ.addEventListener('change', sync)
    return () => {
      tabletQ.removeEventListener('change', sync)
      mobileQ.removeEventListener('change', sync)
    }
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const sidebarWidth = collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH

  const layoutStyle = {
    '--sidebar-width': `${sidebarWidth}px`,
  } as CSSProperties

  const { title, desc } = sectionTitles[activeSection]

  return (
    <div
      style={{
        ...layoutStyle,
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        overflowX: 'hidden',
        background: '#f4f6f9',
      }}
    >
      {/* ── SIDEBAR ─────────────────────────────────────────── */}
      <motion.aside
        animate={{ width: sidebarWidth }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        style={{
          width: sidebarWidth,
          minWidth: 0,
          background: '#1e2d45',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          flexShrink: 0,
          zIndex: 100,
        }}
      >
        {/* Logo */}
        <div style={{
          padding: '20px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <motion.div
            whileHover={{ rotate: -6, scale: 1.04 }}
            transition={{ type: 'spring', stiffness: 320, damping: 18 }}
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'rgba(200,155,42,0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#c89b2a',
              fontWeight: 700,
              fontSize: '1rem',
              flexShrink: 0,
            }}
          >
            ⚡
          </motion.div>

          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
              >
                <div style={{ color: '#c89b2a', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                  Super Admin
                </div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>Control Panel</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.16 }}
                style={{ padding: '8px 16px 4px', color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}
              >
                Navigation
              </motion.div>
            )}
          </AnimatePresence>

          {navItems.map((item, i) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.035 + 0.1, duration: 0.28, ease: 'easeOut' }}
            >
              <button
                onClick={() => onSectionChange(item.key)}
                title={collapsed ? item.label : undefined}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: collapsed ? 'center' : 'space-between',
                  padding: collapsed ? '12px 0' : '10px 16px',
                  background: activeSection === item.key ? 'rgba(200,155,42,0.15)' : 'transparent',
                  borderLeft: activeSection === item.key ? '3px solid #c89b2a' : '3px solid transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  textAlign: 'left',
                  position: 'relative',
                }}
              >
                {activeSection === item.key && (
                  <motion.span
                    layoutId="sa-active-pill"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(200,155,42,0.08)',
                      pointerEvents: 'none',
                    }}
                    transition={{ type: 'spring', stiffness: 460, damping: 34 }}
                  />
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 10 }}>
                  <motion.span
                    whileHover={{ scale: 1.1, y: -1 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 18 }}
                    style={{ fontSize: '1.05rem' }}
                  >
                    {item.icon}
                  </motion.span>

                  <AnimatePresence initial={false}>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.16 }}
                        style={{
                          color: activeSection === item.key ? '#c89b2a' : 'rgba(255,255,255,0.65)',
                          fontSize: '0.85rem',
                          fontWeight: activeSection === item.key ? 600 : 400,
                        }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                <AnimatePresence initial={false}>
                  {!collapsed && item.badge !== undefined && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{
                        background: activeSection === item.key ? '#c89b2a' : 'rgba(255,255,255,0.12)',
                        color: activeSection === item.key ? '#1e2d45' : 'rgba(255,255,255,0.6)',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        padding: '2px 7px',
                        borderRadius: 999,
                      }}
                    >
                      {item.badge}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </nav>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'rgba(200,155,42,0.2)',
              color: '#c89b2a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem',
              flexShrink: 0,
            }}>
              {user?.name?.charAt(0).toUpperCase() ?? 'A'}
            </div>

            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.16 }}
                >
                  <div style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 600 }}>{user?.name ?? 'Admin'}</div>
                  <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.68rem' }}>Super Admin</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.97 }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start',
              gap: 8,
              padding: '8px 10px',
              background: 'rgba(229,62,62,0.12)',
              border: '1px solid rgba(229,62,62,0.2)',
              borderRadius: 8,
              color: '#fc8181',
              fontSize: '0.82rem',
              cursor: 'pointer',
            }}
          >
            <span>↗</span>
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.16 }}
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      </motion.aside>

      {/* ── MAIN CONTENT ────────────────────────────────────── */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>

        {/* Topbar */}
        <motion.header
          initial={{ y: -72, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 24 }}
          style={{
            height: 60,
            background: '#fff',
            borderBottom: '1px solid #e8ecf0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            position: 'sticky',
            top: 0,
            zIndex: 99,
          }}
        >
         
          {/* Page Title */}
          <div style={{ flex: 1, marginLeft: 16 }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1e2d45' }}>{title}</div>
            <div style={{ fontSize: '0.72rem', color: '#7a8599' }}>{desc}</div>
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ position: 'relative' }}>
              <span style={{ fontSize: '1.2rem' }}>🔔</span>
              <span style={{
                position: 'absolute',
                top: -4,
                right: -4,
                background: '#e53e3e',
                color: '#fff',
                fontSize: '0.55rem',
                fontWeight: 700,
                width: 14,
                height: 14,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>3</span>
            </div>
            <div style={{ width: 1, height: 24, background: '#e8ecf0' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: '#1e2d45',
                color: '#c89b2a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}>
                {user?.name?.charAt(0).toUpperCase() ?? 'A'}
              </div>
              {viewport !== 'mobile' && (
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1e2d45' }}>{user?.name ?? 'Admin'}</div>
                  <div style={{ fontSize: '0.68rem', color: '#7a8599' }}>Super Admin</div>
                </div>
              )}
            </div>
          </div>
        </motion.header>

        {/* Page Content */}
        <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: 'clamp(16px, 3vw, 28px) clamp(16px, 4vw, 32px)' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
import { useState, useEffect, useRef, type CSSProperties } from 'react'
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
  stats,
  children,
}: SuperAdminLayoutProps) => {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setShowDropdown(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const sidebarWidth = collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH
  const layoutStyle = { '--sidebar-width': `${sidebarWidth}px` } as CSSProperties
  const { title, desc } = sectionTitles[activeSection]
  const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() ?? 'SA'

  // Dynamic badges from real stats
  const badgeMap: Partial<Record<SidebarSection, number>> = {
    organizations: stats.totalOrganizations,
    trials:        stats.activeTrials,
    subscriptions: stats.totalOrganizations,
  }

  return (
    <div style={{
      ...layoutStyle,
      display: 'flex',
      height: '100vh',
      width: '100%',
      overflow: 'hidden',
      background: '#f0f2f5',
    }}>

      {/* ── SIDEBAR ── */}
      <motion.aside
        animate={{ width: sidebarWidth }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        style={{
          width: sidebarWidth,
          minWidth: 0,
          flexShrink: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(180deg, #0f1c2e 0%, #1a2d45 60%, #162438 100%)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          overflowY: 'auto',
          overflowX: 'hidden',
          zIndex: 100,
          boxShadow: '4px 0 24px rgba(0,0,0,0.18)',
        }}
      >
        {/* Logo */}
        <div style={{
          padding: collapsed ? '20px 0' : '20px 18px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          gap: 10,
          minHeight: 68,
        }}>
          <motion.div
            whileHover={{ rotate: -8, scale: 1.08 }}
            transition={{ type: 'spring', stiffness: 320, damping: 18 }}
            style={{
              width: 38, height: 38, borderRadius: 10,
              background: 'linear-gradient(135deg, rgba(200,155,42,0.25), rgba(200,155,42,0.1))',
              border: '1px solid rgba(200,155,42,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#c89b2a', fontWeight: 700, fontSize: '1.1rem', flexShrink: 0,
            }}
          >⚡</motion.div>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.18 }}
              >
                <div style={{ color: '#c89b2a', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 1 }}>
                  Super Admin
                </div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.92rem', letterSpacing: '-0.01em' }}>
                  Control Panel
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav Label */}
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ padding: '14px 18px 6px', color: 'rgba(255,255,255,0.25)', fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}
            >
              Navigation
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: '4px 0', overflowY: 'auto' }}>
          {navItems.map((item, i) => {
            const isActive = activeSection === item.key
            const badge = badgeMap[item.key]
            return (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 + 0.08, duration: 0.26, ease: 'easeOut' }}
              >
                <button
                  onClick={() => onSectionChange(item.key)}
                  title={collapsed ? item.label : undefined}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'space-between',
                    padding: collapsed ? '13px 0' : '10px 18px',
                    background: isActive ? 'rgba(200,155,42,0.12)' : 'transparent',
                    borderLeft: isActive ? '3px solid #c89b2a' : '3px solid transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    textAlign: 'left',
                    position: 'relative',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                >
                  {isActive && (
                    <motion.span
                      layoutId="sa-active-pill"
                      style={{ position: 'absolute', inset: 0, background: 'rgba(200,155,42,0.07)', pointerEvents: 'none' }}
                      transition={{ type: 'spring', stiffness: 460, damping: 34 }}
                    />
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 11 }}>
                    <motion.span
                      whileHover={{ scale: 1.12, y: -1 }}
                      transition={{ type: 'spring', stiffness: 380, damping: 18 }}
                      style={{ fontSize: '1rem', lineHeight: 1, filter: isActive ? 'none' : 'grayscale(0.3)' }}
                    >
                      {item.icon}
                    </motion.span>
                    <AnimatePresence initial={false}>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.16 }}
                          style={{
                            color: isActive ? '#c89b2a' : 'rgba(255,255,255,0.6)',
                            fontSize: '0.84rem',
                            fontWeight: isActive ? 600 : 400,
                            letterSpacing: isActive ? '-0.01em' : 'normal',
                          }}
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                  <AnimatePresence initial={false}>
                    {!collapsed && badge !== undefined && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }}
                        style={{
                          background: isActive ? '#c89b2a' : 'rgba(255,255,255,0.1)',
                          color: isActive ? '#1e2d45' : 'rgba(255,255,255,0.55)',
                          fontSize: '0.62rem', fontWeight: 700,
                          padding: '2px 7px', borderRadius: 999,
                          minWidth: 22, textAlign: 'center',
                        }}
                      >
                        {badge}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          display: 'flex',
          justifyContent: collapsed ? 'center' : 'flex-end',
        }}>
          <button
            onClick={() => setCollapsed(c => !c)}
            title={collapsed ? 'Expand' : 'Collapse'}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              color: 'rgba(255,255,255,0.4)',
              padding: '6px 10px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}
          >
            {collapsed ? '→' : '←'}
          </button>
        </div>
      </motion.aside>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

        {/* Topbar */}
        <motion.header
          initial={{ y: -64, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 24 }}
          style={{
            height: 62,
            background: '#fff',
            borderBottom: '1px solid #e8ecf0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 28px',
            flexShrink: 0,
            zIndex: 99,
            boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
          }}
        >
          {/* Page Title */}
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f1c2e', letterSpacing: '-0.01em' }}>{title}</div>
            <div style={{ fontSize: '0.71rem', color: '#9aa5b4', marginTop: 1 }}>{desc}</div>
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>

            {/* Bell */}
            <motion.div whileHover={{ scale: 1.08 }} style={{ position: 'relative', cursor: 'pointer' }}>
              <span style={{ fontSize: '1.15rem' }}>🔔</span>
              <span style={{
                position: 'absolute', top: -4, right: -4,
                background: 'linear-gradient(135deg, #e53e3e, #c53030)',
                color: '#fff', fontSize: '0.52rem', fontWeight: 700,
                width: 15, height: 15, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1.5px solid #fff',
              }}>3</span>
            </motion.div>

            <div style={{ width: 1, height: 26, background: '#e8ecf0' }} />

            {/* Profile Dropdown */}
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <motion.button
                whileHover={{ scale: 1.01 }}
                onClick={() => setShowDropdown(d => !d)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 9,
                  background: showDropdown ? '#f8fafc' : 'none',
                  border: '1px solid',
                  borderColor: showDropdown ? '#e2e8f0' : 'transparent',
                  cursor: 'pointer', padding: '5px 10px',
                  borderRadius: 10, transition: 'all 0.15s',
                }}
              >
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="avatar" style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', border: '2px solid #c89b2a' }} />
                ) : (
                  <div style={{
                    width: 34, height: 34, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1e2d45, #2d4a6e)',
                    color: '#c89b2a', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem',
                    border: '2px solid rgba(200,155,42,0.3)',
                  }}>
                    {initials}
                  </div>
                )}
                {viewport !== 'mobile' && (
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0f1c2e' }}>{user?.name ?? 'Super Admin'}</div>
                    <div style={{ fontSize: '0.67rem', color: '#9aa5b4' }}>Super Admin</div>
                  </div>
                )}
                <span style={{ color: '#9aa5b4', fontSize: '0.65rem', marginLeft: 2 }}>▾</span>
              </motion.button>

              {/* Dropdown */}
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.96 }}
                    transition={{ duration: 0.14 }}
                    style={{
                      position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                      width: 248, background: '#fff', borderRadius: 14,
                      boxShadow: '0 12px 40px rgba(0,0,0,0.13), 0 2px 8px rgba(0,0,0,0.06)',
                      border: '1px solid #e8ecf0', zIndex: 999, overflow: 'hidden',
                    }}
                  >
                    {/* Dropdown Header */}
                    <div style={{ padding: '16px', background: 'linear-gradient(135deg, #0f1c2e 0%, #1e3a5f 100%)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                        {user?.profileImage ? (
                          <img src={user.profileImage} alt="avatar" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '2px solid #c89b2a' }} />
                        ) : (
                          <div style={{
                            width: 40, height: 40, borderRadius: '50%',
                            background: 'rgba(200,155,42,0.18)', color: '#c89b2a',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem',
                          }}>
                            {initials}
                          </div>
                        )}
                        <div>
                          <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.88rem' }}>{user?.name ?? 'Super Admin'}</div>
                          <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.68rem', marginBottom: 4 }}>{user?.email ?? ''}</div>
                          <span style={{ background: 'linear-gradient(90deg,#c89b2a,#e8b84b)', color: '#1e2d45', fontSize: '0.58rem', fontWeight: 700, padding: '2px 9px', borderRadius: 99 }}>
                            ⚡ Super Admin
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div style={{ padding: '6px 0' }}>
                      {[
                       { icon: '👤', label: 'My Profile', onClick: () => { navigate('/super-admin/profile'); setShowDropdown(false) } },
                        { icon: '⚙️', label: 'Settings',      sub: 'App preferences',      onClick: () => setShowDropdown(false) },
                        { icon: '🔔', label: 'Notifications', sub: 'Manage alerts',        onClick: () => setShowDropdown(false) },
                      ].map(item => (
                        <button
                          key={item.label} onClick={item.onClick}
                          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.12s' }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                        >
                          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#f1f3f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', flexShrink: 0 }}>
                            {item.icon}
                          </div>
                          <div>
                            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0f1c2e' }}>{item.label}</div>
                            <div style={{ fontSize: '0.67rem', color: '#9aa5b4' }}>{item.sub}</div>
                          </div>
                        </button>
                      ))}

                      <div style={{ margin: '4px 16px', borderTop: '1px solid #f1f3f5' }} />

                      <button
                        onClick={handleLogout}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.12s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#fff5f5')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                      >
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#fff5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', flexShrink: 0 }}>
                          🚪
                        </div>
                        <div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#e53e3e' }}>Logout</div>
                          <div style={{ fontSize: '0.67rem', color: '#9aa5b4' }}>Sign out of account</div>
                        </div>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.header>

        {/* Page Content — sirf yeh scroll karega */}
        <main style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: 'clamp(16px, 3vw, 28px) clamp(16px, 4vw, 32px)',
        }}>
          {children}
        </main>
      </div>
    </div>
  )
}
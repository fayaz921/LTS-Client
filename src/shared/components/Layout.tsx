import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useAuthStore } from '../../store/authStore'

const DESKTOP_SIDEBAR_WIDTH = 260
const TABLET_SIDEBAR_WIDTH = 220
const COLLAPSED_SIDEBAR_WIDTH = 84
const MOBILE_SIDEBAR_WIDTH = 76

const navItems = [
    { path: '/app/dashboard', label: 'Dashboard', icon: '⊞' },
    { path: '/app/cases', label: 'Cases', icon: '⚖' },
    // { path: '/app/followup',    label: 'Follow',      icon: '📅' },
    { path: '/app/petitioners', label: 'Petitioners', icon: '👥' },
    { path: '/app/courts', label: 'Courts', icon: '🏛' },
    { path: '/app/departments', label: 'Departments', icon: '⊞' },
    { path: '/app/documents/3b7a40ff-13a6-45b0-b694-de99624d4f28', label: 'Documents', icon: '📄' },
    { path: '/app/alerts', label: 'Alerts', icon: '🔔' },
    { path: '/app/Benches', label: 'Benches', icon: '👨‍⚖️' },
    { path: '/app/reports', label: 'Reports', icon: '📊' },
]

const Layout = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const { user, logout } = useAuthStore()
    const navigate = useNavigate()
    const [searchValue, setSearchValue] = useState('')
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
    const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')

    useEffect(() => {
        const tabletQuery = window.matchMedia('(max-width: 1024px)')
        const mobileQuery = window.matchMedia('(max-width: 768px)')

        const syncSidebarWithViewport = () => {
            const nextViewport = mobileQuery.matches
                ? 'mobile'
                : tabletQuery.matches
                    ? 'tablet'
                    : 'desktop'

            setViewport(nextViewport)
            setIsSidebarCollapsed(nextViewport === 'mobile')
        }

        syncSidebarWithViewport()
        tabletQuery.addEventListener('change', syncSidebarWithViewport)
        mobileQuery.addEventListener('change', syncSidebarWithViewport)

        return () => {
            tabletQuery.removeEventListener('change', syncSidebarWithViewport)
            mobileQuery.removeEventListener('change', syncSidebarWithViewport)
        }
    }, [])

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const toggleSidebar = () => {
        setIsSidebarCollapsed((value) => !value)
    }

    const expandedSidebarWidth = viewport === 'desktop'
        ? DESKTOP_SIDEBAR_WIDTH
        : TABLET_SIDEBAR_WIDTH

    const sidebarWidth = isSidebarCollapsed
        ? viewport === 'mobile'
            ? MOBILE_SIDEBAR_WIDTH
            : COLLAPSED_SIDEBAR_WIDTH
        : expandedSidebarWidth

    const layoutStyle = {
        '--sidebar-width': `${sidebarWidth}px`,
    } as CSSProperties

    return (
        <div
            className={`lts-layout ${isSidebarCollapsed ? 'lts-layout--sidebar-collapsed' : ''}`}
            style={layoutStyle}
        >
            <motion.aside
                className="lts-sidebar"
                initial={{ x: -280, opacity: 0.7 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 210, damping: 26 }}
                aria-label="Application sidebar"
                data-collapsed={isSidebarCollapsed}
            >
                <motion.div
                    className="lts-sidebar__ambient"
                    animate={{ opacity: isSidebarCollapsed ? 0.42 : 0.65 }}
                    transition={{ duration: 0.3 }}
                />

                <div className="lts-sidebar__logo">
                    <div className="lts-sidebar__logo-brand">
                        <motion.div
                            className="lts-sidebar__logo-icon"
                            whileHover={{ rotate: -6, scale: 1.04 }}
                            transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                        >
                            ⚖
                        </motion.div>

                        <AnimatePresence initial={false}>
                            {!isSidebarCollapsed && (
                                <motion.div
                                    className="lts-sidebar__logo-copy"
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -8 }}
                                    transition={{ duration: 0.18 }}
                                >
                                    <div className="lts-sidebar__logo-title">LTS</div>
                                    <div className="lts-sidebar__logo-subtitle">Litigation Tracking System</div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>

                <nav className="lts-sidebar__nav">
                    <AnimatePresence initial={false}>
                        {!isSidebarCollapsed && (
                            <motion.div
                                className="lts-sidebar__nav-label"
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.16 }}
                            >
                                MAIN MENU
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {navItems.map((item, i) => (
                        <motion.div
                            key={item.path}
                            className="lts-sidebar__nav-row"
                            initial={{ opacity: 0, x: -18 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.035 + 0.14, duration: 0.32, ease: 'easeOut' }}
                        >
                            <NavLink
                                to={item.path}
                                title={isSidebarCollapsed ? item.label : undefined}
                                className={({ isActive }) =>
                                    `lts-sidebar__nav-item ${isActive ? 'lts-sidebar__nav-item--active' : ''}`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        {isActive && (
                                            <motion.span
                                                layoutId="lts-sidebar-active-pill"
                                                className="lts-sidebar__active-pill"
                                                transition={{ type: 'spring', stiffness: 460, damping: 34 }}
                                            />
                                        )}

                                        <motion.span
                                            className="lts-sidebar__nav-icon"
                                            whileHover={{ scale: 1.08, y: -1 }}
                                            transition={{ type: 'spring', stiffness: 380, damping: 18 }}
                                        >
                                            {item.icon}
                                        </motion.span>

                                        <AnimatePresence initial={false}>
                                            {!isSidebarCollapsed && (
                                                <motion.span
                                                    className="lts-sidebar__nav-label-text"
                                                    initial={{ opacity: 0, x: -8 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -8 }}
                                                    transition={{ duration: 0.16 }}
                                                >
                                                    {item.label}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </>
                                )}
                            </NavLink>
                        </motion.div>
                    ))}
                </nav>

                <motion.div
                    className="lts-sidebar__footer"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.35 }}
                >


                </motion.div>
            </motion.aside>
            <motion.div
                className="lts-main"
            >
                <motion.header
                    className="lts-topbar"
                    initial={{ y: -72, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 24 }}
                >
                    <motion.button
                        type="button"
                        className="lts-topbar__menu"
                        aria-label={isSidebarCollapsed ? 'Open sidebar' : 'Close sidebar'}
                        onClick={toggleSidebar}
                        whileHover={{ scale: 1.04, y: -1 }}
                        whileTap={{ scale: 0.96 }}
                    >
                        ☰
                    </motion.button>

                    <motion.div
                        className="lts-topbar__search"
                        whileHover={{ y: -1 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                    >
                        <span className="lts-topbar__search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search cases, petitioners..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className="lts-topbar__search-input"
                        />
                    </motion.div>

                    <div className="lts-topbar__right">
                        <motion.div
                            className="lts-topbar__bell"
                            whileHover={{ scale: 1.08, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="lts-topbar__bell-icon">🔔</span>
                            <span className="lts-topbar__bell-badge">3</span>
                        </motion.div>

                        <div className="lts-topbar__divider" />

                        <div ref={dropdownRef} style={{ position: 'relative' }}>
                            <motion.div
                                className="lts-topbar__user"
                                onClick={() => setDropdownOpen(v => !v)}
                                whileHover={{ y: -1 }}
                                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                                style={{ cursor: 'pointer', userSelect: 'none' }}
                            >
                                {/* Avatar */}
                                <div style={{
                                    width: 30, height: 30, borderRadius: '50%',
                                    overflow: 'hidden', flexShrink: 0,
                                    background: user?.profileImage ? 'transparent' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'white', fontWeight: 700, fontSize: 12,
                                    boxShadow: '0 2px 8px rgba(102,126,234,0.4)',
                                    border: '2px solid rgba(255,255,255,0.8)',
                                }}>
                                    {user?.profileImage ? (
                                        <img
                                            src={user.profileImage}
                                            alt={user?.name ?? 'U'}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                            onError={(e) => { e.currentTarget.style.display = 'none' }}
                                        />
                                    ) : (
                                        user?.name?.charAt(0).toUpperCase() ?? 'U'
                                    )}
                                </div>

                                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-dark)', marginLeft: 7 }}>
                                    {user?.name ?? 'User'}
                                </span>

                                <span style={{
                                    marginLeft: 3,
                                    color: 'var(--text-gray)',
                                    fontSize: 10,
                                    transition: 'transform 0.2s',
                                    display: 'inline-block',
                                    transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                }}>▾</span>
                            </motion.div>

                            {/* Dropdown */}
                            <AnimatePresence>
                                {dropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                                        transition={{ duration: 0.15 }}
                                        style={{
                                            position: 'absolute',
                                            top: 'calc(100% + 8px)',
                                            right: 0,
                                            minWidth: 210,
                                            background: '#ffffff',
                                            borderRadius: 12,
                                            boxShadow: '0 16px 48px rgba(15,23,42,0.16), 0 4px 12px rgba(15,23,42,0.06)',
                                            zIndex: 999,
                                            overflow: 'hidden',
                                            border: '1px solid rgba(226,232,240,0.8)',
                                        }}
                                    >
                                        {/* Header */}
                                        <div style={{
                                            padding: '12px',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 10,
                                        }}>
                                            <div style={{
                                                width: 36, height: 36, borderRadius: '50%',
                                                overflow: 'hidden', flexShrink: 0,
                                                background: 'rgba(255,255,255,0.2)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: 'white', fontWeight: 700, fontSize: 15,
                                                border: '2px solid rgba(255,255,255,0.4)',
                                            }}>
                                                {user?.profileImage ? (
                                                    <img
                                                        src={user.profileImage}
                                                        alt={user?.name ?? 'U'}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                                        onError={(e) => { e.currentTarget.style.display = 'none' }}
                                                    />
                                                ) : (
                                                    user?.name?.charAt(0).toUpperCase() ?? 'U'
                                                )}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: 12, color: '#ffffff' }}>
                                                    {user?.name ?? 'User'}
                                                </div>
                                                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.75)', marginTop: 1 }}>
                                                    {user?.email ?? ''}
                                                </div>
                                                <div style={{
                                                    marginTop: 3,
                                                    display: 'inline-block',
                                                    background: 'rgba(255,255,255,0.2)',
                                                    borderRadius: 20,
                                                    padding: '1px 7px',
                                                    fontSize: 9,
                                                    color: 'white',
                                                    fontWeight: 600,
                                                    letterSpacing: 0.4,
                                                }}>
                                                    {user?.organizationName ?? ''}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Menu Items */}
                                        <div style={{ padding: '4px 0' }}>
                                            {[
                                                { icon: '👤', label: 'My Profile', path: '/app/profile', desc: 'View & edit profile' },
                                                { icon: '⚙️', label: 'Settings', path: '/app/settings', desc: 'App preferences' },
                                                { icon: '🔔', label: 'Notifications', path: '/app/alerts', desc: 'Manage alerts' },
                                            ].map(item => (
                                                <button
                                                    key={item.label}
                                                    onClick={() => { setDropdownOpen(false); navigate(item.path) }}
                                                    style={{
                                                        width: '100%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 10,
                                                        padding: '8px 12px',
                                                        background: 'transparent',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        textAlign: 'left',
                                                        transition: 'background 0.15s',
                                                    }}
                                                    onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                                                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                                >
                                                    <div style={{
                                                        width: 28, height: 28, borderRadius: 7,
                                                        background: '#f1f5f9',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontSize: 13, flexShrink: 0,
                                                    }}>
                                                        {item.icon}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: 12, fontWeight: 600, color: '#1e293b' }}>
                                                            {item.label}
                                                        </div>
                                                        <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 1 }}>
                                                            {item.desc}
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>

                                        {/* Logout */}
                                        <div style={{ padding: '4px 6px 6px', borderTop: '1px solid #f1f5f9' }}>
                                            <button
                                                onClick={() => { setDropdownOpen(false); handleLogout() }}
                                                style={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 10,
                                                    padding: '8px 12px',
                                                    background: 'transparent',
                                                    border: 'none',
                                                    borderRadius: 7,
                                                    cursor: 'pointer',
                                                    textAlign: 'left',
                                                    transition: 'background 0.15s',
                                                }}
                                                onMouseEnter={e => (e.currentTarget.style.background = '#fff5f5')}
                                                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                            >
                                                <div style={{
                                                    width: 28, height: 28, borderRadius: 7,
                                                    background: '#fff1f2',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: 13, flexShrink: 0,
                                                }}>
                                                    🚪
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: 12, fontWeight: 600, color: '#dc2626' }}>
                                                        Logout
                                                    </div>
                                                    <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 1 }}>
                                                        Sign out of account
                                                    </div>
                                                </div>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.header>

                <main className="lts-content">
                    <Outlet />
                </main>
            </motion.div>
        </div>
    )
}

export default Layout

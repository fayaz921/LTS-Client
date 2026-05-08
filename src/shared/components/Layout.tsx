import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, type CSSProperties } from 'react'
import { useAuthStore } from '../../store/authStore'

const DESKTOP_SIDEBAR_WIDTH = 260
const TABLET_SIDEBAR_WIDTH = 220
const COLLAPSED_SIDEBAR_WIDTH = 84
const MOBILE_SIDEBAR_WIDTH = 76

const navItems = [
    { path: '/app/dashboard',   label: 'Dashboard',   icon: '⊞' },
    { path: '/app/cases',       label: 'Cases',       icon: '⚖' },
    { path: '/app/hearings',    label: 'Hearings',    icon: '📅' },
    { path: '/app/petitioners', label: 'Petitioners', icon: '👥' },
    { path: '/app/courts',      label: 'Courts',      icon: '🏛' },
    { path: '/app/departments', label: 'Departments', icon: '⊞' },
    { path: '/app/documents/123e4567-e89b-12d3-a456-426614174000', label: 'Documents', icon: '📄' },
    { path: '/app/alerts',      label: 'Alerts',      icon: '🔔' },
    { path: '/app/Benches',     label: 'Benches',     icon: '👨‍⚖️' },
    { path: '/app/reports',     label: 'Reports',     icon: '📊' },
    { path: '/app/profile',     label: 'Profile',     icon: '🧑' },
]

const Layout = () => {
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
                    <div className="lts-sidebar__user">
                        <div className="lts-sidebar__user-avatar">
                            {user?.name?.charAt(0).toUpperCase() ?? 'U'}
                        </div>

                        <AnimatePresence initial={false}>
                            {!isSidebarCollapsed && (
                                <motion.div
                                    className="lts-sidebar__user-info"
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -8 }}
                                      transition={{ duration: 0.16 }}
                                >
                                    <div className="lts-sidebar__user-name">{user?.name ?? 'User'}</div>
                                    <div className="lts-sidebar__user-role">{user?.role ?? ''}</div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <motion.button
                        className="lts-sidebar__logout"
                        onClick={handleLogout}
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.97 }}
                        title={isSidebarCollapsed ? 'Logout' : undefined}
                    >
                        <span className="lts-sidebar__logout-icon">↗</span>
                        <AnimatePresence initial={false}>
                            {!isSidebarCollapsed && (
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

                        <motion.div
                            className="lts-topbar__user"
                            whileHover={{ y: -1 }}
                            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                        >
                            <div className="lts-topbar__user-avatar">
                                {user?.name?.charAt(0).toUpperCase() ?? 'U'}
                            </div>
                            <div className="lts-topbar__user-info">
                                <div className="lts-topbar__user-name">{user?.name ?? 'User'}</div>
                                <div className="lts-topbar__user-org">{user?.organizationName ?? ''}</div>
                            </div>
                        </motion.div>
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

import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

const Layout = () => {
    const { user, logout } = useAuthStore()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const navItems = [
        { path: '/app/dashboard', label: 'Dashboard', icon: '⊞' },
        { path: '/app/cases',     label: 'Cases',     icon: '⚖' },
        { path: '/app/hearings',  label: 'Hearings',  icon: '📅' },
        { path: '/app/petitioners', label: 'Petitioners', icon: '👥' },
        { path: '/app/courts',    label: 'Courts',    icon: '🏛' },
        { path: '/app/departments', label: 'Departments', icon: '⊞' },
        { path: '/app/documents', label: 'Documents', icon: '📄' },
        { path: '/app/alerts',    label: 'Alerts',    icon: '🔔' },
        { path: '/app/reports',   label: 'Reports',   icon: '📊' },
    ]

    return (
        <div className="d-flex" style={{ minHeight: '100vh' }}>

            {/* ── Sidebar ── */}
            <div
                className="d-flex flex-column"
                style={{
                    width: '250px',
                    minHeight: '100vh',
                    backgroundColor: '#1B2A4A',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    zIndex: 200,
                }}
            >
                {/* Logo */}
                <div style={{
                    padding: '24px 20px',
                    borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <h4 style={{ color: '#D4A843', margin: 0, fontWeight: 'bold', letterSpacing: '2px' }}>
                        LTS
                    </h4>
                    <small style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px' }}>
                        Litigation Tracking System
                    </small>
                </div>

                {/* Nav Items */}
                <nav className="flex-grow-1" style={{ padding: '16px 0', overflowY: 'auto' }}>
                    <p style={{
                        color: 'rgba(255,255,255,0.3)',
                        fontSize: '10px',
                        padding: '0 20px',
                        marginBottom: '8px',
                        letterSpacing: '1px'
                    }}>
                        MAIN MENU
                    </p>

                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '10px 20px',
                                color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.55)',
                                textDecoration: 'none',
                                backgroundColor: isActive ? 'rgba(37,99,235,0.2)' : 'transparent',
                                borderLeft: isActive ? '3px solid #D4A843' : '3px solid transparent',
                                fontSize: '14px',
                                transition: 'all 0.2s',
                            })}
                        >
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Bottom — User + Logout */}
                <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    padding: '16px 20px',
                }}>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', marginBottom: '12px' }}>
                        <div style={{ color: '#FFFFFF', fontWeight: '600' }}>{user?.name ?? 'User'}</div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{user?.role ?? ''}</div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="btn btn-sm w-100"
                        style={{
                            backgroundColor: 'rgba(220,38,38,0.15)',
                            color: '#FCA5A5',
                            border: '1px solid rgba(220,38,38,0.3)',
                            fontSize: '13px',
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* ── Main Area ── */}
            <div
                className="d-flex flex-column flex-grow-1"
                style={{ marginLeft: '250px', backgroundColor: '#F8FAFC' }}
            >
                {/* Top Navbar */}
                <div
                    className="d-flex align-items-center justify-content-between"
                    style={{
                        height: '64px',
                        backgroundColor: '#FFFFFF',
                        borderBottom: '1px solid #E2E8F0',
                        padding: '0 24px',
                        position: 'sticky',
                        top: 0,
                        zIndex: 100,
                    }}
                >
                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Search cases, petitioners..."
                        className="form-control"
                        style={{
                            maxWidth: '320px',
                            backgroundColor: '#F8FAFC',
                            border: '1px solid #E2E8F0',
                            fontSize: '13px',
                        }}
                    />

                    {/* Right Side */}
                    <div className="d-flex align-items-center gap-3">
                        {/* Notification Bell */}
                        <div style={{ position: 'relative', cursor: 'pointer' }}>
                            <span style={{ fontSize: '20px' }}>🔔</span>
                            <span style={{
                                position: 'absolute',
                                top: '-4px',
                                right: '-4px',
                                backgroundColor: '#DC2626',
                                color: 'white',
                                borderRadius: '50%',
                                width: '16px',
                                height: '16px',
                                fontSize: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>3</span>
                        </div>

                        {/* User Info */}
                        <div className="d-flex align-items-center gap-2">
                            <div style={{
                                width: '34px',
                                height: '34px',
                                borderRadius: '50%',
                                backgroundColor: '#2563EB',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '600',
                                fontSize: '13px',
                            }}>
                                {user?.name?.charAt(0).toUpperCase() ?? 'U'}
                            </div>
                            <div>
                                <div style={{ fontSize: '13px', fontWeight: '600', color: '#0F172A' }}>
                                    {user?.name ?? 'User'}
                                </div>
                                <div style={{ fontSize: '11px', color: '#64748B' }}>
                                    {user?.organizationName ?? ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page Content*/} 
                <div style={{ padding: '24px', flex: 1 }}>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Layout
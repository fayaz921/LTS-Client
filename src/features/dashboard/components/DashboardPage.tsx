import { Link } from 'react-router-dom'
import { useAuthStore } from '../../../store/authStore'

const stats = [
    { label: 'Active Cases', value: '128', trend: '+12 this month', tone: 'blue' },
    { label: 'Upcoming Hearings', value: '24', trend: 'Next 7 days', tone: 'gold' },
    { label: 'Pending Documents', value: '36', trend: 'Needs review', tone: 'danger' },
    { label: 'Resolved Matters', value: '412', trend: '+8.4% closure rate', tone: 'success' },
]

const upcomingHearings = [
    { caseNo: 'LTS-2026-014', title: 'State vs. Meridian Holdings', court: 'High Court', date: '06 May 2026', status: 'Urgent' },
    { caseNo: 'LTS-2026-031', title: 'Rizvi Industries Petition', court: 'Civil Court', date: '08 May 2026', status: 'Scheduled' },
    { caseNo: 'LTS-2026-044', title: 'Public Works Contract Review', court: 'Tribunal', date: '11 May 2026', status: 'Prep' },
]

const caseFlow = [
    { label: 'Filed', value: 42 },
    { label: 'In Hearing', value: 58 },
    { label: 'Evidence', value: 18 },
    { label: 'Decision', value: 10 },
]

const activities = [
    'Document bundle uploaded for LTS-2026-014',
    'Hearing alert queued for 12 petitioners',
    'New court department assigned to 3 cases',
    'Weekly report draft is ready for review',
]

const DashboardPage = () => {
    const { user } = useAuthStore()

    return (
        <section className="dashboard-page">
            <div className="dashboard-hero">
                <div>
                    <span className="dashboard-hero__eyebrow">Litigation Command Center</span>
                    <h1 className="dashboard-hero__title">
                        {user?.organizationName ?? 'LTS'} Dashboard
                    </h1>
                    <p className="dashboard-hero__copy">
                        Track case movement, hearings, documents, and alerts from one focused workspace.
                    </p>
                </div>

                <div className="dashboard-hero__actions">
                    <Link to="/app/documents/123e4567-e89b-12d3-a456-426614174000" className="dashboard-button dashboard-button--primary">
                        Review Documents
                    </Link>
                    <Link to="/app/alerts" className="dashboard-button dashboard-button--ghost">
                        View Alerts
                    </Link>
                </div>
            </div>

            <div className="dashboard-stats">
                {stats.map((item) => (
                    <article className={`dashboard-stat dashboard-stat--${item.tone}`} key={item.label}>
                        <div className="dashboard-stat__top">
                            <span>{item.label}</span>
                            <span className="dashboard-stat__dot" />
                        </div>
                        <strong>{item.value}</strong>
                        <small>{item.trend}</small>
                    </article>
                ))}
            </div>

            <div className="dashboard-grid">
                <section className="dashboard-panel dashboard-panel--wide">
                    <div className="dashboard-panel__header">
                        <div>
                            <h2>Upcoming Hearings</h2>
                            <p>Priority dates that need attention</p>
                        </div>
                        <Link to="/app/hearings">Open schedule</Link>
                    </div>

                    <div className="dashboard-hearings">
                        {upcomingHearings.map((hearing) => (
                            <div className="dashboard-hearing" key={hearing.caseNo}>
                                <div>
                                    <span className="dashboard-hearing__case">{hearing.caseNo}</span>
                                    <h3>{hearing.title}</h3>
                                    <p>{hearing.court}</p>
                                </div>
                                <div className="dashboard-hearing__meta">
                                    <strong>{hearing.date}</strong>
                                    <span>{hearing.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="dashboard-panel">
                    <div className="dashboard-panel__header">
                        <div>
                            <h2>Case Flow</h2>
                            <p>Current work distribution</p>
                        </div>
                    </div>

                    <div className="dashboard-flow">
                        {caseFlow.map((item) => (
                            <div className="dashboard-flow__row" key={item.label}>
                                <div>
                                    <span>{item.label}</span>
                                    <strong>{item.value}</strong>
                                </div>
                                <div className="dashboard-flow__track">
                                    <span style={{ width: `${Math.min(item.value, 70)}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="dashboard-panel">
                    <div className="dashboard-panel__header">
                        <div>
                            <h2>Recent Activity</h2>
                            <p>Latest workspace signals</p>
                        </div>
                    </div>

                    <ul className="dashboard-activity">
                        {activities.map((activity) => (
                            <li key={activity}>
                                <span />
                                {activity}
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </section>
    )
}

export default DashboardPage

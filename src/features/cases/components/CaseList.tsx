import React, { useState } from 'react';
import CreateCaseModal from '../components/CreateCaseModal';
import '../styles/case-list.css'; // Import the CSS file for styling

export default function CasesList() {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="cases-list-page" style={{ backgroundColor: 'var(--lts-bg)', minHeight: '100vh', fontFamily: 'var(--lts-font)' }}>
            {/* PAGE TITLE ROW */}
            <div style={{ background: 'var(--lts-white)', borderBottom: '1px solid var(--lts-border)', padding: '1.5rem 0', marginBottom: '0' }}>
                <div className="container-xl">
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb mb-1" style={{ fontSize: '13px' }}>
                                    <li className="breadcrumb-item">
                                        <a href="#" style={{ color: 'var(--lts-gold)', textDecoration: 'none' }}>Dashboard</a>
                                    </li>
                                    <li className="breadcrumb-item active text-muted">Cases</li>
                                </ol>
                            </nav>
                            <h1 style={{ fontFamily: 'var(--lts-font)', fontSize: '28px', fontWeight: '800', color: 'var(--lts-navy)', margin: '0' }}>
                                Cases
                            </h1>
                        </div>
                        {/* THIS BUTTON OPENS THE MODAL */}
                        <button
                            onClick={() => setShowModal(true)}
                            style={{
                                background: 'var(--lts-navy)', color: 'white', border: 'none',
                                borderRadius: 'var(--lts-radius)', padding: '10px 24px',
                                fontSize: '15px', fontWeight: '600', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '8px',
                                transition: 'all 0.25s ease'
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'var(--lts-gold)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'var(--lts-navy)')}
                        >
                            <i className="bi bi-plus-circle"></i> File New Case
                        </button>
                    </div>
                </div>
            </div>

            <div className="container-xl py-4">
                {/* SECTION 3: STATS CARDS */}
                <div className="row mb-4">
                    <div className="col-lg-4">
                        <div className="stats-card">
                            <div className="stats-header">
                                <span className="stats-number">5</span>
                                <span className="stats-badge badge bg-primary">All</span>
                            </div>
                            <p className="stats-label">Total Cases</p>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="stats-card">
                            <div className="stats-header">
                                <span className="stats-number pending-color">3</span>
                                <span className="stats-badge badge bg-warning text-dark">Pending</span>
                            </div>
                            <p className="stats-label">Active Cases</p>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="stats-card">
                            <div className="stats-header">
                                <span className="stats-number success-color">2</span>
                                <span className="stats-badge badge bg-success">Finalized</span>
                            </div>
                            <p className="stats-label">Completed</p>
                        </div>
                    </div>
                </div>

                {/* SECTION 4: STATUS FILTER TABS */}
                <div className="filter-tabs mb-4">
                    <button className="filter-tab active">All Cases</button>
                    <button className="filter-tab">
                        Pending
                        <span className="badge badge-warning-custom">3</span>
                    </button>
                    <button className="filter-tab">
                        Finalized
                        <span className="badge badge-success-custom">2</span>
                    </button>
                </div>

                {/* SECTION 5: SEARCH BAR */}
                <div className="search-card mb-4">
                    <div className="row g-3 align-items-end">
                        <div className="col-lg-3">
                            <label className="form-label">Case No.</label>
                            <input
                                type="text"
                                className="form-control search-input"
                                placeholder="e.g. LTS-2024-0001"
                            />
                        </div>
                        <div className="col-lg-3">
                            <label className="form-label">Petitioner</label>
                            <input
                                type="text"
                                className="form-control search-input"
                                placeholder="e.g. Muhammad Ali"
                            />
                        </div>
                        <div className="col-lg-3">
                            <label className="form-label">CNIC</label>
                            <input
                                type="text"
                                className="form-control search-input"
                                placeholder="e.g. 12345-1234567-1"
                            />
                        </div>
                        <div className="col-lg-3 d-flex gap-2">
                            <button className="btn btn-search flex-fill">
                                <i className="bi bi-search"></i> Search
                            </button>
                            <button className="btn btn-clear">Clear</button>
                        </div>
                    </div>
                    <small className="search-hint">
                        Search by one field at a time. Press Enter to search.
                    </small>
                </div>

                {/* SECTION 6: CASES TABLE */}
                <div className="cases-table-card">
                    <div className="table-header">
                        <span className="table-title">📋 Case Registry</span>
                        <span className="table-badge">5 cases</span>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover cases-table">
                            <thead>
                                <tr>
                                    <th>Case No.</th>
                                    <th>Title & Subject</th>
                                    <th>Court & Dept</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* ROW 1 */}
                                <tr>
                                    <td>
                                        <span className="case-badge">LTS-2024-0001</span>
                                    </td>
                                    <td>
                                        <div className="cell-title">Muhammad Ali Khan vs Province of KPK</div>
                                        <div className="cell-subject">Constitutional</div>
                                    </td>
                                    <td>
                                        <div className="cell-court">Peshawar High Court</div>
                                        <div className="cell-dept">Constitutional</div>
                                    </td>
                                    <td>
                                        <span className="status-badge status-pending">Pending</span>
                                    </td>
                                    <td>
                                        <span className="cell-date">15 Jan 2024</span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="action-btn btn-view" title="View">
                                                <i className="bi bi-eye"></i>
                                            </button>
                                            <button className="action-btn btn-edit" title="Edit">
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            <button className="action-btn btn-documents" title="Documents">
                                                <i className="bi bi-file-earmark-text"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>

                                {/* ROW 2 */}
                                <tr>
                                    <td>
                                        <span className="case-badge">LTS-2024-0002</span>
                                    </td>
                                    <td>
                                        <div className="cell-title">Fatima Bibi vs Land Revenue Dept</div>
                                        <div className="cell-subject">Civil</div>
                                    </td>
                                    <td>
                                        <div className="cell-court">District Court</div>
                                        <div className="cell-dept">Civil</div>
                                    </td>
                                    <td>
                                        <span className="status-badge status-finalized">Finalized</span>
                                    </td>
                                    <td>
                                        <span className="cell-date">10 Feb 2024</span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="action-btn btn-view" title="View">
                                                <i className="bi bi-eye"></i>
                                            </button>
                                            <button className="action-btn btn-edit" title="Edit">
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            <button className="action-btn btn-documents" title="Documents">
                                                <i className="bi bi-file-earmark-text"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>

                                {/* ROW 3 */}
                                <tr>
                                    <td>
                                        <span className="case-badge">LTS-2024-0003</span>
                                    </td>
                                    <td>
                                        <div className="cell-title">Ahmed Enterprises vs FBR</div>
                                        <div className="cell-subject">Corporate</div>
                                    </td>
                                    <td>
                                        <div className="cell-court">Peshawar High Court</div>
                                        <div className="cell-dept">Corporate</div>
                                    </td>
                                    <td>
                                        <span className="status-badge status-pending">Pending</span>
                                    </td>
                                    <td>
                                        <span className="cell-date">05 Mar 2024</span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="action-btn btn-view" title="View">
                                                <i className="bi bi-eye"></i>
                                            </button>
                                            <button className="action-btn btn-edit" title="Edit">
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            <button className="action-btn btn-documents" title="Documents">
                                                <i className="bi bi-file-earmark-text"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>

                                {/* ROW 4 */}
                                <tr>
                                    <td>
                                        <span className="case-badge">LTS-2024-0004</span>
                                    </td>
                                    <td>
                                        <div className="cell-title">Noor-ul-Haq vs State</div>
                                        <div className="cell-subject">Criminal</div>
                                    </td>
                                    <td>
                                        <div className="cell-court">Anti-Terrorism Court</div>
                                        <div className="cell-dept">Criminal</div>
                                    </td>
                                    <td>
                                        <span className="status-badge status-finalized">Finalized</span>
                                    </td>
                                    <td>
                                        <span className="cell-date">20 Mar 2024</span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="action-btn btn-view" title="View">
                                                <i className="bi bi-eye"></i>
                                            </button>
                                            <button className="action-btn btn-edit" title="Edit">
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            <button className="action-btn btn-documents" title="Documents">
                                                <i className="bi bi-file-earmark-text"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>

                                {/* ROW 5 */}
                                <tr>
                                    <td>
                                        <span className="case-badge">LTS-2024-0005</span>
                                    </td>
                                    <td>
                                        <div className="cell-title">Zainab Sultana vs Khalid Mehmood</div>
                                        <div className="cell-subject">Family</div>
                                    </td>
                                    <td>
                                        <div className="cell-court">Family Court Peshawar</div>
                                        <div className="cell-dept">Family</div>
                                    </td>
                                    <td>
                                        <span className="status-badge status-pending">Pending</span>
                                    </td>
                                    <td>
                                        <span className="cell-date">01 Apr 2024</span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="action-btn btn-view" title="View">
                                                <i className="bi bi-eye"></i>
                                            </button>
                                            <button className="action-btn btn-edit" title="Edit">
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            <button className="action-btn btn-documents" title="Documents">
                                                <i className="bi bi-file-earmark-text"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MODAL — render at bottom */}
            {showModal && <CreateCaseModal onClose={() => setShowModal(false)} />}
        </div>
    );
}

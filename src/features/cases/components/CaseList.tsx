import { useState } from 'react';
import CreateCaseModal from '../components/CreateCaseModal';
import { HandleGetAllCases } from '../hooks/useCases';
import '../styles/case-list.css';

export default function CasesList() {
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const { data: response, isLoading, isError } = HandleGetAllCases(currentPage, pageSize);
    const cases = response?.data.items ?? [];
    const totalCasesCount = response?.data.totalCount ?? 0;
    const totalPages: number = response?.data?.totalPages ?? 0;


    return (
        <div className="cases-list-page" style={{ backgroundColor: 'var(--lts-bg)', minHeight: '100vh', fontFamily: 'var(--lts-font)' }}>

            {/* PAGE TITLE ROW — with icon before heading */}
            <div style={{ background: 'var(--lts-white)', borderBottom: '1px solid var(--lts-border)', padding: '1.5rem 0' }}>
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
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: '44px', height: '44px', borderRadius: '12px',
                                    background: 'linear-gradient(135deg,#1B2A4A 0%,#2A3F70 100%)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '24px'
                                }}>📋</div>
                                <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--lts-navy)', margin: '0' }}>
                                    Cases
                                </h1>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            style={{ 
                                background: 'var(--lts-gold)', 
                                color: 'var(--lts-navy)', 
                                border: 'none', 
                                borderRadius: '10px', 
                                padding: '11px 22px', 
                                fontSize: '13px', 
                                fontWeight: '700', 
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 2px 8px rgba(212,168,67,0.3)'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = '#C49830'
                                e.currentTarget.style.transform = 'translateY(-1px)'
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(212,168,67,0.35)'
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'var(--lts-gold)'
                                e.currentTarget.style.transform = 'translateY(0)'
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(212,168,67,0.3)'
                            }}
                        >
                            <span style={{ fontSize: '16px' }}>+</span> File New Case
                        </button>
                    </div>
                </div>
            </div>

            <div className="container-xl py-4">

                {/* STATS — baad mein real data lagana */}
                <div className="row mb-4">
                    <div className="col-lg-4">
                        <div className="stats-card">
                            <div className="stats-header">
                                <span className="stats-number">{totalCasesCount}</span>
                                <span className="stats-badge badge bg-primary">All</span>
                            </div>
                            <p className="stats-label">Total Cases</p>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="stats-card">
                            <div className="stats-header">
                                <span className="stats-number pending-color">
                                    {cases.filter(c => c.status === 'Pending').length}
                                </span>
                                <span className="stats-badge badge bg-warning text-dark">Pending</span>
                            </div>
                            <p className="stats-label">Active Cases</p>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="stats-card">
                            <div className="stats-header">
                                <span className="stats-number success-color">
                                    {cases.filter(c => c.status === 'Finalized').length}
                                </span>
                                <span className="stats-badge badge bg-success">Finalized</span>
                            </div>
                            <p className="stats-label">Completed</p>
                        </div>
                    </div>
                </div>

                {/* FILTER TABS */}
                <div className="filter-tabs mb-4">
                    <button className="filter-tab active">All Cases</button>
                    <button className="filter-tab">Pending </button>
                    <button className="filter-tab">Finalized</button>
                </div>

                {/* SEARCH BAR — same rakha */}
                <div className="search-card mb-4">
                    <div className="row g-3 align-items-end">
                        <div className="col-lg-3">
                            <label className="form-label">Case No.</label>
                            <input type="text" className="form-control search-input" placeholder="e.g. LTS-2024-0001" />
                        </div>
                        <div className="col-lg-3">
                            <label className="form-label">Petitioner</label>
                            <input type="text" className="form-control search-input" placeholder="e.g. Muhammad Ali" />
                        </div>
                        <div className="col-lg-3">
                            <label className="form-label">CNIC</label>
                            <input type="text" className="form-control search-input" placeholder="e.g. 12345-1234567-1" />
                        </div>
                        <div className="col-lg-3 d-flex gap-2">
                            <button className="btn btn-search flex-fill">
                                <i className="bi bi-search"></i> Search
                            </button>
                            <button className="btn btn-clear">Clear</button>
                        </div>
                    </div>
                    <small className="search-hint">Search by one field at a time.</small>
                </div>

                {/* TABLE */}
                <div className="cases-table-card">

                    {/* Loading */}
                    {isLoading && (
                        <div className="text-center py-5">
                            <div className="spinner-border" style={{ color: 'var(--lts-gold)' }} />
                            <p className="mt-2 text-muted">Loading cases...</p>
                        </div>
                    )}

                    {/* Error */}
                    {isError && (
                        <div className="alert alert-danger m-3">
                            Failed to load cases. Please try again.
                        </div>
                    )}

                    {/* Data */}
                    {!isLoading && !isError && (
                        <>
                            <div className="table-header">
                                <span className="table-title">📋 Case Registry</span>
                                <span className="table-badge">{cases.length} cases</span>
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
                                        {cases.length > 0 ? (
                                            cases.map((caseItem) => (
                                                <tr key={caseItem.id}>
                                                    <td>
                                                        <span className="case-badge">{caseItem.caseNo}</span>
                                                    </td>
                                                    <td>
                                                        <div className="cell-title">{caseItem.title}</div>
                                                        <div className="cell-subject">{caseItem.subject}</div>
                                                    </td>
                                                    <td>
                                                        <div className="cell-court">{caseItem.courtName}</div>
                                                        <div className="cell-dept">{caseItem.departmentName}</div>
                                                    </td>
                                                    <td>
                                                        <span className={`status-badge status-${caseItem.status.toLowerCase()}`}>
                                                            {caseItem.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="cell-date">
                                                            {new Date(caseItem.dateInstitution).toLocaleDateString('en-PK')}
                                                        </span>
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
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="text-center py-4 text-muted">
                                                    No cases found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                    {/* PAGINATION */}
                    {!isLoading && !isError && totalPages > 1 && (
                        <div className="d-flex justify-content-center align-items-center gap-2 py-3">

                            {/* Prev Button */}
                            <button
                                className="btn btn-sm"
                                style={{
                                    background: currentPage === 1 ? '#e2e8f0' : 'var(--lts-navy)',
                                    color: currentPage === 1 ? '#94a3b8' : 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '6px 14px',
                                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                                }}
                                onClick={() => setCurrentPage(p => p - 1)}
                                disabled={currentPage === 1}
                            >
                                ← Prev
                            </button>

                            {/* Page Numbers */}
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    className="btn btn-sm"
                                    style={{
                                        background: currentPage === page ? 'var(--lts-gold)' : 'white',
                                        color: currentPage === page ? 'var(--lts-navy)' : '#64748b',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '6px',
                                        padding: '6px 12px',
                                        fontWeight: currentPage === page ? '700' : '400',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </button>
                            ))}

                            {/* Next Button */}
                            <button
                                className="btn btn-sm"
                                style={{
                                    background: currentPage === totalPages ? '#e2e8f0' : 'var(--lts-navy)',
                                    color: currentPage === totalPages ? '#94a3b8' : 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '6px 14px',
                                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                                }}
                                onClick={() => setCurrentPage(p => p + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {showModal && <CreateCaseModal onClose={() => setShowModal(false)} />}
        </div>
    );
}
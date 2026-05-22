import { useState, useCallback } from 'react';

import CasePageHeader from './CasePageHeader';
import CaseStatsBar from './CaseStatsBar';
import CaseFilterTabs from './CaseFilterTabs';
import type { CaseFilterTab } from './CaseFilterTabs';
import CaseTable from './CaseTable';
import CaseDrawer from './CaseDrawer';
import CreateCaseModal from '../create-case/CreateCaseModal';
import CaseDetailsModal from '../CaseDetailsModal';

import { HandleGetAllCases, useDeleteCase } from '../../hooks/useCases';
import { useCaseModal } from '../../hooks/useCaseModal';
import type { GetCaseDto } from '../../types/case.types';

import '../../styles/case-list.css';

type DrawerState =
    | { open: false }
    | { open: true; caseItem: GetCaseDto; tab: 'followups' | 'documents' };

export default function CasesList() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState<CaseFilterTab>('All');
    const [drawer, setDrawer] = useState<DrawerState>({ open: false });
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
    const deleteCaseMutation = useDeleteCase();

    const handleDeleteClick = (caseItem: string) => {
        setSelectedCaseId(caseItem);
        setDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        if (deleteCaseMutation.isPending) return;

        setDeleteModalOpen(false);
        setSelectedCaseId(null);
    };
    const handleConfirmDelete = async () => {
        if (!selectedCaseId) return;

        try {
            await deleteCaseMutation.mutateAsync(selectedCaseId);

            setDeleteModalOpen(false);
            setSelectedCaseId(null);
        } catch {
            alert("Failed to delete case");
        }
    };
    const pageSize = 10;

    const { data: response, isLoading, isError } = HandleGetAllCases(currentPage, pageSize);
    const cases = response?.data?.items ?? [];
    const totalCasesCount = response?.data?.totalCount ?? 0;
    const totalPages = response?.data?.totalPages ?? 0;

    const { modal, openDetails, switchToEdit, close } = useCaseModal();
    const handleCloseCreate = useCallback(() => setShowCreateModal(false), []);

    // ── Filter (client-side) ─────────────────────────────────
    const filteredCases = activeTab === 'All'
        ? cases
        : cases.filter(c => c.status === activeTab);

    const handleTabChange = (tab: CaseFilterTab) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    // ── Drawer handlers ──────────────────────────────────────
    const handleDocuments = (caseId: string) => {
        const caseItem = cases.find(c => c.id === caseId);
        if (!caseItem) return;
        setDrawer({ open: true, caseItem, tab: 'documents' });
    };

    const handleFollowups = (caseId: string) => {
        const caseItem = cases.find(c => c.id === caseId);
        if (!caseItem) return;
        setDrawer({ open: true, caseItem, tab: 'followups' });
    };

    const closeDrawer = () => setDrawer({ open: false });

    const selectedCase =
        cases.find(c => modal.mode !== 'closed' && c.id === modal.caseId) ?? null;

    return (
        <div className="cl__page">

            {/* ── HEADER ── */}
            <CasePageHeader onNewCase={() => setShowCreateModal(true)} />

            <div className="container-xl py-4">

                {/* ── STATS ── */}
                <CaseStatsBar totalCount={totalCasesCount} cases={cases} />

                {/* ── FILTER TABS ── */}
                <CaseFilterTabs activeTab={activeTab} onChange={handleTabChange} />

                {/* ── SEARCH ── */}
                <div className="cl__search-card">
                    <div className="row g-3 align-items-end">
                        <div className="col-lg-3">
                            <label className="cl__search-label">Case No.</label>
                            <input
                                type="text"
                                className="cl__search-input"
                                placeholder="e.g. LTS-2024-0001"
                            />
                        </div>
                        <div className="col-lg-3">
                            <label className="cl__search-label">Petitioner</label>
                            <input
                                type="text"
                                className="cl__search-input"
                                placeholder="e.g. Muhammad Ali"
                            />
                        </div>
                        <div className="col-lg-3">
                            <label className="cl__search-label">CNIC</label>
                            <input
                                type="text"
                                className="cl__search-input"
                                placeholder="e.g. 12345-1234567-1"
                            />
                        </div>
                        <div className="col-lg-3 d-flex gap-2">
                            <button className="cl__btn-search">
                                <i className="bi bi-search" /> Search
                            </button>
                            <button className="cl__btn-clear">Clear</button>
                        </div>
                    </div>
                    <small className="cl__search-hint">Search by one field at a time.</small>
                </div>

                {/* ── TABLE CARD ── */}
                <div className="cl__table-card">

                    {isLoading && (
                        <div className="cl__loading">
                            <div className="spinner-border cl__spinner" />
                            <p className="cl__loading-text">Loading cases...</p>
                        </div>
                    )}

                    {isError && (
                        <div className="alert alert-danger cl__error">
                            Failed to load cases. Please try again.
                        </div>
                    )}

                    {!isLoading && !isError && (
                        <>
                            <div className="cl__table-header">
                                <span className="cl__table-title">📋 Case Registry</span>
                                <span className="cl__table-count">
                                    {activeTab === 'All'
                                        ? `${cases.length} cases`
                                        : `${filteredCases.length} ${activeTab}`}
                                </span>
                            </div>

                            <CaseTable
                                cases={filteredCases}
                                onDetails={openDetails}
                                onEdit={switchToEdit}
                                onDocuments={handleDocuments}
                                onFollowups={handleFollowups}
                                onDelete={handleDeleteClick}
                            />
                        </>
                    )}

                    {/* ── PAGINATION ── */}
                    {!isLoading && !isError && totalPages > 1 && (
                        <div className="cl__pagination">
                            <button
                                className="cl__page-btn cl__page-btn--nav"
                                onClick={() => setCurrentPage(p => p - 1)}
                                disabled={currentPage === 1}
                            >
                                ← Prev
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    className={`cl__page-btn cl__page-btn--number ${currentPage === page ? 'cl__page-btn--active' : ''}`}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                className="cl__page-btn cl__page-btn--nav"
                                onClick={() => setCurrentPage(p => p + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next →
                            </button>
                        </div>
                    )}

                </div>
            </div>

            {/* ── MODALS ── */}
            {showCreateModal && (
                <CreateCaseModal onClose={handleCloseCreate} />
            )}

            {modal.mode === 'details' && selectedCase && (
                <CaseDetailsModal
                    caseItem={selectedCase}
                    onEdit={() => switchToEdit(modal.caseId)}
                    onClose={close}
                />
            )}

            {/* ── CASE DRAWER ── */}
            {drawer.open && (
                <CaseDrawer
                    caseItem={drawer.caseItem}
                    defaultTab={drawer.tab}
                    onClose={closeDrawer}
                />
            )}

            {/* DELETE CONFIRM MODAL */}
            {deleteModalOpen && (
                <div className="cl__modal-overlay">
                    <div className="cl__modal">
                        <div className="cl__modal-header">
                            <h3 className="cl__modal-title">Delete Case?</h3>
                        </div>

                        <div className="cl__modal-body">
                            <p>
                                Case <strong>{selectedCase?.caseNo}</strong> will be
                                permanently deleted. This cannot be undone.
                            </p>
                        </div>

                        <div className="cl__modal-actions">
                            <button
                                className="cl__modal-btn cl__modal-btn--cancel"
                                onClick={handleCloseDeleteModal}
                                disabled={deleteCaseMutation.isPending}
                            >
                                Cancel
                            </button>

                            <button
                                className="cl__modal-btn cl__modal-btn--delete"
                                onClick={handleConfirmDelete}
                                disabled={deleteCaseMutation.isPending}
                            >
                                {deleteCaseMutation.isPending
                                    ? "Deleting..."
                                    : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
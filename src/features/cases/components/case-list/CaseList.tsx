import { useState, useCallback } from 'react';

import CasePageHeader from './CasePageHeader';
import CaseStatsBar from './CaseStatsBar';
import CaseFilterTabs from './CaseFilterTabs';
import type { CaseFilterTab } from './CaseFilterTabs';
import CaseTable from './CaseTable';
import CaseDrawer from './CaseDrawer';
import CreateCaseModal from '../create-case/CreateCaseModal';
import CaseDetailsModal from '../CaseDetailsModal';

import { useGetAllCases, useSearchCases, useDeleteCase } from '../../hooks/useCases';
import { useCaseModal } from '../../hooks/useCaseModal';
import type { CaseDto, SearchParams } from '../../types/case.types';  // ✅ CaseDto only, no GetCaseDto

import '../../styles/case-list.css';

// ── DrawerState — discriminated union ─────────────────────────────
type DrawerState =
    | { open: false }
    | { open: true; caseItem: CaseDto; tab: 'followups' | 'documents' };

// ── Component ─────────────────────────────────────────────────────

export default function CasesList() {

    // ── Pagination & tab state ────────────────────────────────
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState<CaseFilterTab>('All');

    // ── Search field state ────────────────────────────────────
    // Single query field — user types here, hits Search, triggers API call
    const [searchInput, setSearchInput] = useState('');
    const [activeSearch, setActiveSearch] = useState<SearchParams>({});  // committed params
    const isSearching = !!activeSearch.query || !!activeSearch.status;

    // ── Drawer / modal state ──────────────────────────────────
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [drawer, setDrawer] = useState<DrawerState>({ open: false });
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

    const pageSize = 10;
    const deleteCaseMutation = useDeleteCase();

    // ── Data fetching ─────────────────────────────────────────
    // Uses search endpoint when any filter is active, list endpoint otherwise
    const {
        data: listResponse,
        isLoading: listLoading,
        isError: listError,
    } = useGetAllCases(currentPage, pageSize);      // ✅ renamed from HandleGetAllCases

    const {
        data: searchResponse,
        isLoading: searchLoading,
        isError: searchError,
        isFetching: searchFetching,
    } = useSearchCases({                            // ✅ server-side filter — no more client filter
        ...activeSearch,
        status: activeTab !== 'All' ? activeTab : undefined,  // tab drives status filter
        pageNumber: currentPage,
        pageSize,
    });

    // Pick the right data source
    const response = isSearching || activeTab !== 'All' ? searchResponse : listResponse;
    const isLoading = isSearching || activeTab !== 'All' ? searchLoading : listLoading;
    const isError = isSearching || activeTab !== 'All' ? searchError : listError;
    const isFetching = searchFetching;

    const cases = (response?.data?.items ?? []) as CaseDto[];
    const totalCasesCount = response?.data?.totalCount ?? 0;
    const totalPages = response?.data?.totalPages ?? 0;

    // ── Modal helpers ─────────────────────────────────────────
    const { modal, openDetails, switchToEdit, close } = useCaseModal();
    const handleCloseCreate = useCallback(() => setShowCreateModal(false), []);

    const selectedCase = cases.find(
        c => modal.mode !== 'closed' && c.id === modal.caseId
    ) ?? null;

    // ── Search handlers ───────────────────────────────────────
    const handleSearch = () => {
        const trimmed = searchInput.trim();
        setActiveSearch(trimmed ? { query: trimmed } : {});
        setCurrentPage(1);  // reset to page 1 on new search
    };

    const handleClear = () => {
        setSearchInput('');
        setActiveSearch({});
        setCurrentPage(1);
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSearch();
    };

    // ── Tab handler ───────────────────────────────────────────
    // Tab now drives server-side status filter, not client-side filter
    const handleTabChange = (tab: CaseFilterTab) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    // ── Delete handlers ───────────────────────────────────────
    const handleDeleteClick = (id: string) => {
        setSelectedCaseId(id);
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
            alert('Failed to delete case');
        }
    };

    // ── Drawer handlers ───────────────────────────────────────
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

    // ---- Active Tab -----------------
    const counts: Record<CaseFilterTab, number> = {
        All: cases.length,
        Pending: cases.filter(c => c.status === 'Pending').length,
        Finalized: cases.filter(c => c.status === 'Finalized').length,
    };

    // ── Render ────────────────────────────────────────────────

    return (
        <div className="cl__page">

            {/* ── HEADER ── */}
            <CasePageHeader onNewCase={() => setShowCreateModal(true)} />

            <div className="container-xl py-4">

                {/* ── STATS ── */}
                <CaseStatsBar totalCount={totalCasesCount} cases={cases} />

                {/* ── FILTER TABS ── */}
                <CaseFilterTabs activeTab={activeTab} onChange={handleTabChange} counts={counts} />

                {/* ── SEARCH — now fully wired ── */}
                <div className="cl__search-card">
                    <div className="row g-3 align-items-end">

                        {/* Single search field — CaseNo, Title, or CNIC */}
                        <div className="col-lg-9">
                            <label className="cl__search-label">
                                Search by Case No., Title, or Petitioner CNIC
                            </label>
                            <input
                                type="text"
                                className="cl__search-input"
                                placeholder="e.g.  LTS-2024-0001  |  Land Dispute  |  35202-1234567-9"
                                value={searchInput}
                                onChange={e => setSearchInput(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                            />
                        </div>

                        <div className="col-lg-3 d-flex gap-2">
                            <button
                                className="cl__btn-search"
                                onClick={handleSearch}
                                disabled={isFetching}
                            >
                                {isFetching
                                    ? <><i className="bi bi-hourglass-split" /> Searching…</>
                                    : <><i className="bi bi-search" /> Search</>
                                }
                            </button>
                            <button
                                className="cl__btn-clear"
                                onClick={handleClear}
                                disabled={!isSearching && !searchInput}
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                    <small className="cl__search-hint">
                        Searches case number, title, and petitioner CNIC simultaneously.
                        Press Enter to search.
                    </small>
                </div>

                {/* ── TABLE CARD ── */}
                <div className="cl__table-card">

                    {isLoading && (
                        <div className="cl__loading">
                            <div className="spinner-border cl__spinner" />
                            <p className="cl__loading-text">Loading cases…</p>
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
                                    {isSearching
                                        ? `${totalCasesCount} result${totalCasesCount !== 1 ? 's' : ''}`
                                        : activeTab === 'All'
                                            ? `${totalCasesCount} cases`
                                            : `${totalCasesCount} ${activeTab}`}
                                </span>
                            </div>

                            <CaseTable
                                cases={cases}
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
                    onClose={() => setDrawer({ open: false })}
                />
            )}

            {/* ── DELETE CONFIRM MODAL ── */}
            {deleteModalOpen && (
                <div className="cl__modal-overlay">
                    <div className="cl__modal">
                        <div className="cl__modal-header">
                            <h3 className="cl__modal-title">Delete Case?</h3>
                        </div>

                        <div className="cl__modal-body">
                            <p>
                                Case <strong>{selectedCase?.caseNo ?? '—'}</strong> will be
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
                                {deleteCaseMutation.isPending ? 'Deleting…' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
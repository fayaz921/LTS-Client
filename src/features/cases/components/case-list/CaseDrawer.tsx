import { useState, useEffect } from 'react'
import { useGetFollowUps, useDeleteFollowUp } from '../../../followup/hooks/useFollowups';
// import { useCreateFollowUp, useUpdateFollowUp } from '../../../followup/hooks/useFollowups';
import { useGetDocumentsByCase, useDeleteDocument } from '../../../documents/hooks/useDocuments'
import UploadDocumentModal from '../../../documents/components/uploadDocument'
import FollowUpForm from '../../../followup/components/FollowupForm'
import type { GetCaseDto } from '../../types/case.types'
import type { FollowUp } from '../../../followup/types/followup.types'
import '../../styles/case-drawer.css'

// ── Types ─────────────────────────────────────────────────────

type DrawerTab = 'followups' | 'documents'

interface Props {
    caseItem: GetCaseDto
    defaultTab?: DrawerTab
    onClose: () => void
}

// ── Helpers ───────────────────────────────────────────────────

const fmtDate = (iso?: string | null) =>
    iso ? new Date(iso).toLocaleDateString('en-PK', {
        day: '2-digit', month: 'short', year: 'numeric',
    }) : '—'

const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄'
    if (fileType.includes('image')) return '🖼️'
    if (fileType.includes('word') || fileType.includes('doc')) return '📝'
    return '📎'
}

const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const getHearingStatus = (hearingDate: string, nextHearingDate?: string | null) => {
    const today = new Date()
    const hearing = new Date(hearingDate)
    if (hearing < today) return { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA', text: 'Past' }
    if (nextHearingDate) return { bg: '#FEF3C7', color: '#D97706', border: '#FDE68A', text: 'Adjourned' }
    return { bg: '#F0FDF4', color: '#15803D', border: '#BBF7D0', text: 'Scheduled' }
}

// ── Main Component ────────────────────────────────────────────

export default function CaseDrawer({ caseItem, defaultTab = 'followups', onClose }: Props) {
    const [activeTab, setActiveTab] = useState<DrawerTab>(defaultTab)
    const [visible, setVisible] = useState(false)

    // Smooth open animation
    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 10)
        return () => clearTimeout(t)
    }, [])

    const handleClose = () => {
        setVisible(false)
        setTimeout(onClose, 300) // animation complete hone do
    }

    // ESC key se close
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [])

    return (
        <>
            {/* Overlay — click karo to close */}
            <div
                className={`cdr__overlay ${visible ? 'cdr__overlay--visible' : ''}`}
                onClick={handleClose}
            />

            {/* Drawer Panel */}
            <div className={`cdr__panel ${visible ? 'cdr__panel--open' : ''}`}>

                {/* ── HEADER ── */}
                <div className="cdr__header">
                    <div className="cdr__header-left">
                        <div className="cdr__header-icon">📋</div>
                        <div>
                            <div className="cdr__header-title">{caseItem.title}</div>
                            <div className="cdr__header-sub">
                                <span className="cdr__case-no">{caseItem.caseNo}</span>
                                <span className="cdr__dot">·</span>
                                <span>{caseItem.courtName}</span>
                            </div>
                        </div>
                    </div>
                    <button className="cdr__close-btn" onClick={handleClose} title="Close (Esc)">
                        <i className="bi bi-x-lg" />
                    </button>
                </div>

                {/* ── TABS ── */}
                <div className="cdr__tabs">
                    <button
                        className={`cdr__tab ${activeTab === 'followups' ? 'cdr__tab--active' : ''}`}
                        onClick={() => setActiveTab('followups')}
                    >
                        <i className="bi bi-calendar-check" /> Follow-ups
                    </button>
                    <button
                        className={`cdr__tab ${activeTab === 'documents' ? 'cdr__tab--active' : ''}`}
                        onClick={() => setActiveTab('documents')}
                    >
                        <i className="bi bi-file-earmark-text" /> Documents
                    </button>
                </div>

                {/* ── CONTENT ── */}
                <div className="cdr__body">
                    {activeTab === 'followups' && (
                        <FollowUpsTab caseId={caseItem.id} />
                    )}
                    {activeTab === 'documents' && (
                        <DocumentsTab caseId={caseItem.id} />
                    )}
                </div>

            </div>
        </>
    )
}

// ── Follow-ups Tab ────────────────────────────────────────────

function FollowUpsTab({ caseId }: { caseId: string }) {
    const [showForm, setShowForm] = useState(false)
    const [selected, setSelected] = useState<FollowUp | undefined>()

    const { data, isLoading, isError, refetch } = useGetFollowUps({ pageNumber: 1, pageSize: 50, caseId })
    const { mutate: deleteFollowUp, isPending: isDeleting } = useDeleteFollowUp()

    const followups = data?.items ?? []

    const handleEdit = (f: FollowUp) => {
        setSelected(f)
        setShowForm(true)
    }

    const handleClose = () => {
        setSelected(undefined)
        setShowForm(false)
    }

    if (isLoading) return <DrawerLoader text="Loading follow-ups..." />

    if (isError) return (
        <div className="cdr__error">
            <span>⚠️</span> Could not load follow-ups.
            <button className="cdr__retry-btn" onClick={() => refetch()}>Retry</button>
        </div>
    )

    return (
        <div className="cdr__tab-content">

            {/* Add button */}
            <div className="cdr__tab-toolbar">
                <span className="cdr__tab-count">{followups.length} follow-up{followups.length !== 1 ? 's' : ''}</span>
                <button className="cdr__add-btn" onClick={() => { setSelected(undefined); setShowForm(true) }}>
                    <i className="bi bi-plus" /> Add Follow-up
                </button>
            </div>

            {/* List */}
            {followups.length === 0 ? (
                <DrawerEmpty
                    icon="📋"
                    text="No follow-ups yet for this case"
                    btnText="+ Add First Follow-up"
                    onAdd={() => setShowForm(true)}
                />
            ) : (
                <div className="cdr__list">
                    {followups.map((f, i) => {
                        const st = getHearingStatus(f.hearingDate, f.nextHearingDate)
                        return (
                            <div key={f.id} className="cdr__fu-card" style={{ animationDelay: `${i * 0.05}s` }}>
                                <div className="cdr__fu-card-top">
                                    <span className="cdr__fu-date">{fmtDate(f.hearingDate)}</span>
                                    <span className="cdr__fu-status" style={{
                                        background: st.bg, color: st.color, border: `1px solid ${st.border}`
                                    }}>{st.text}</span>
                                </div>

                                {f.nextHearingDate && (
                                    <div className="cdr__fu-row">
                                        <span className="cdr__fu-label">Next Hearing</span>
                                        <span className="cdr__fu-val">{fmtDate(f.nextHearingDate)}</span>
                                    </div>
                                )}
                                {f.interimOrder && (
                                    <div className="cdr__fu-row">
                                        <span className="cdr__fu-label">Interim Order</span>
                                        <span className="cdr__fu-val">{f.interimOrder}</span>
                                    </div>
                                )}
                                {f.decision && (
                                    <div className="cdr__fu-row">
                                        <span className="cdr__fu-label">Decision</span>
                                        <span className="cdr__fu-val">{f.decision}</span>
                                    </div>
                                )}
                                {f.remarks && (
                                    <div className="cdr__fu-row">
                                        <span className="cdr__fu-label">Remarks</span>
                                        <span className="cdr__fu-val cdr__fu-val--muted">{f.remarks}</span>
                                    </div>
                                )}

                                <div className="cdr__fu-actions">
                                    <button className="cdr__fu-btn cdr__fu-btn--edit" onClick={() => handleEdit(f)}>
                                        <i className="bi bi-pencil" /> Edit
                                    </button>
                                    <button
                                        className="cdr__fu-btn cdr__fu-btn--del"
                                        onClick={() => deleteFollowUp(f.id)}
                                        disabled={isDeleting}
                                    >
                                        <i className="bi bi-trash" /> Delete
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* FollowUp Form Modal */}
            {showForm && (
                <FollowUpForm
                    caseId={caseId}
                    selected={selected}
                    onClose={handleClose}
                />
            )}
        </div>
    )
}

// ── Documents Tab ─────────────────────────────────────────────

function DocumentsTab({ caseId }: { caseId: string }) {
    const [showUpload, setShowUpload] = useState(false)
    const [search, setSearch] = useState('')

    const { data: documents, isLoading, isError, refetch } = useGetDocumentsByCase(caseId)
    const { mutate: deleteDoc, isPending: isDeleting } = useDeleteDocument(caseId)

    const filtered = (documents ?? []).filter(d =>
        d.fileName.toLowerCase().includes(search.toLowerCase()) ||
        (d.remarks ?? '').toLowerCase().includes(search.toLowerCase())
    )

    if (isLoading) return <DrawerLoader text="Loading documents..." />

    if (isError) return (
        <div className="cdr__error">
            <span>⚠️</span> Could not load documents.
            <button className="cdr__retry-btn" onClick={() => refetch()}>Retry</button>
        </div>
    )

    return (
        <div className="cdr__tab-content">

            {/* Toolbar */}
            <div className="cdr__tab-toolbar">
                <span className="cdr__tab-count">{(documents ?? []).length} document{(documents ?? []).length !== 1 ? 's' : ''}</span>
                <button className="cdr__add-btn" onClick={() => setShowUpload(true)}>
                    <i className="bi bi-upload" /> Upload
                </button>
            </div>

            {/* Search */}
            {(documents ?? []).length > 0 && (
                <div className="cdr__search-wrap">
                    <i className="bi bi-search cdr__search-icon" />
                    <input
                        className="cdr__search-input"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search documents..."
                    />
                </div>
            )}

            {/* List */}
            {filtered.length === 0 ? (
                <DrawerEmpty
                    icon="📁"
                    text={(documents ?? []).length === 0 ? "No documents uploaded yet" : "No documents match your search"}
                    btnText="+ Upload Document"
                    onAdd={() => setShowUpload(true)}
                    showBtn={(documents ?? []).length === 0}
                />
            ) : (
                <div className="cdr__list">
                    {filtered.map((doc, i) => (
                        <div key={doc.id} className="cdr__doc-card" style={{ animationDelay: `${i * 0.05}s` }}>
                            <div className="cdr__doc-icon">{getFileIcon(doc.fileType)}</div>
                            <div className="cdr__doc-info">
                                <div className="cdr__doc-name">{doc.fileName}</div>
                                <div className="cdr__doc-meta">
                                    <span>{formatFileSize(doc.fileSize)}</span>
                                    <span className="cdr__dot">·</span>
                                    <span>{fmtDate(doc.createdAt)}</span>
                                </div>
                                {doc.remarks && (
                                    <div className="cdr__doc-remarks">{doc.remarks}</div>
                                )}
                            </div>
                            <div className="cdr__doc-actions">
                                <a
                                    href={doc.filePath}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="cdr__doc-btn cdr__doc-btn--view"
                                    title="View"
                                >
                                    <i className="bi bi-eye" />
                                </a>
                                <button
                                    className="cdr__doc-btn cdr__doc-btn--del"
                                    onClick={() => deleteDoc(doc.id)}
                                    disabled={isDeleting}
                                    title="Delete"
                                >
                                    <i className="bi bi-trash" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Modal */}
            {showUpload && (
                <UploadDocumentModal
                    caseId={caseId}
                    onClose={() => setShowUpload(false)}
                />
            )}
        </div>
    )
}

// ── Small Helpers ─────────────────────────────────────────────

function DrawerLoader({ text }: { text: string }) {
    return (
        <div className="cdr__loader">
            <div className="cdr__spinner" />
            <p>{text}</p>
        </div>
    )
}

function DrawerEmpty({ icon, text, btnText, onAdd, showBtn = true }: {
    icon: string; text: string; btnText: string; onAdd: () => void; showBtn?: boolean
}) {
    return (
        <div className="cdr__empty">
            <div className="cdr__empty-icon">{icon}</div>
            <p className="cdr__empty-text">{text}</p>
            {showBtn && (
                <button className="cdr__add-btn" onClick={onAdd}>{btnText}</button>
            )}
        </div>
    )
}
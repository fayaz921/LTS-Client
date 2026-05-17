import { useState } from 'react'
import { useGetDocumentsByCase, useDeleteDocument } from '../hooks/useDocuments'
import UploadDocumentModal from './uploadDocument'

// ─────────────────────────────────────────────────────────────
// DocumentsList — Case Documents Table
// Design matches Courts / Departments / Follow-ups pattern
// ─────────────────────────────────────────────────────────────

interface Props {
    caseId: string
}

const getInlineUrl = (url: string) => {
    if (url.toLowerCase().includes('.pdf')) {
        return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=false`
    }
    return url
}

const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄'
    if (fileType.includes('image')) return '🖼️'
    if (fileType.includes('word') || fileType.includes('doc')) return '📝'
    if (fileType.includes('excel') || fileType.includes('sheet')) return '📊'
    return '📎'
}

const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const DocumentsList = ({ caseId }: Props) => {
    const [showModal, setShowModal] = useState(false)
    const [search, setSearch] = useState('')
    const { data: documents, isLoading, isError, error } = useGetDocumentsByCase(caseId)
    const { mutate: deleteDoc, isPending: isDeleting } = useDeleteDocument(caseId)

    // Client-side search
    const filtered = (documents ?? []).filter(d =>
        d.fileName.toLowerCase().includes(search.toLowerCase()) ||
        (d.remarks ?? '').toLowerCase().includes(search.toLowerCase()) ||
        d.fileType.toLowerCase().includes(search.toLowerCase())
    )

    // Loading
    if (isLoading) return (
        <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '80px 0', gap: '16px',
        }}>
            <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                border: '3px solid #F0E8D0', borderTop: '3px solid #D4A843',
                animation: 'spin 0.8s linear infinite',
            }} />
            <p style={{ color: '#8A9BBE', fontSize: '14px', margin: 0 }}>Loading documents...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )

    return (
        <div style={{ padding: '32px', minHeight: '100vh', background: '#ffffff' }}>
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes spin { to { transform: rotate(360deg); } }
                .doc-row { animation: fadeInUp 0.3s ease forwards; transition: background 0.15s ease; }
                .doc-row:hover { background: #F8F6F0 !important; }
                .doc-row:hover .doc-action-btn { opacity: 1 !important; transform: translateY(0) !important; }
                .doc-action-btn { opacity: 0; transform: translateY(4px); transition: all 0.2s ease; }
                .doc-view-btn:hover { background: #1B2A4A !important; color: #fff !important; }
                .doc-del-btn:hover { background: #DC2626 !important; color: #fff !important; }
                .doc-add-btn:hover { background: #C49830 !important; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(212,168,67,0.35) !important; }
                .doc-search:focus { border-color: #D4A843 !important; box-shadow: 0 0 0 3px rgba(212,168,67,0.1) !important; }
            `}</style>

            {/* ── Page Header ── */}
            <div style={{ marginBottom: '24px' }}>
                <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', marginBottom: '20px',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '44px', height: '44px', borderRadius: '12px',
                            background: 'linear-gradient(135deg,#1B2A4A 0%,#2A3F70 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '20px',
                        }}>📁</div>
                        <div>
                            <h5 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#1B2A4A' }}>
                                Documents
                            </h5>
                            <p style={{ margin: 0, fontSize: '13px', color: '#8A9BBE' }}>
                                {documents?.length ?? 0} document{(documents?.length ?? 0) !== 1 ? 's' : ''} · Case {caseId.slice(0, 8)}...
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="doc-add-btn"
                        style={{
                            background: '#D4A843', color: '#1B2A4A', border: 'none',
                            borderRadius: '10px', padding: '11px 22px', fontSize: '13px',
                            fontWeight: 700, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '6px',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 2px 8px rgba(212,168,67,0.3)',
                        }}
                    >
                        <span style={{ fontSize: '16px' }}>+</span> Upload Document
                    </button>
                </div>

                {/* Search */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                        <span style={{
                            position: 'absolute', left: '12px', top: '50%',
                            transform: 'translateY(-50%)', fontSize: '15px', pointerEvents: 'none',
                        }}>🔍</span>
                        <input
                            className="doc-search"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search by file name, type, or remarks..."
                            style={{
                                width: '100%', padding: '10px 12px 10px 36px',
                                border: '1.5px solid #E2DECE', borderRadius: '10px',
                                fontSize: '13px', color: '#1B2A4A', background: '#FDFCF9',
                                outline: 'none', transition: 'all 0.2s ease',
                                boxSizing: 'border-box', fontFamily: 'inherit',
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Error */}
            {isError && (
                <div style={{
                    background: 'linear-gradient(135deg,#FFF5F5 0%,#FFF0F0 100%)',
                    border: '1px solid #FECACA', borderRadius: '12px',
                    padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '12px',
                    color: '#DC2626', fontSize: '14px', marginBottom: '20px',
                }}>
                    <span style={{ fontSize: '20px' }}>⚠️</span>
                    {(error as Error)?.message || 'Documents could not be loaded.'}
                </div>
            )}

            {/* Table Card */}
            {!isError && (
                <div style={{
                    background: '#fff', borderRadius: '16px',
                    border: '1px solid #EEE9DC', overflow: 'hidden',
                    boxShadow: '0 4px 24px rgba(27,42,74,0.06)',
                }}>
                    {filtered.length === 0 ? (
                        <div style={{
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center',
                            padding: '80px 0', gap: '16px',
                        }}>
                            <div style={{
                                width: '72px', height: '72px', borderRadius: '20px',
                                background: 'linear-gradient(135deg,#F5F0E8 0%,#EDE5D0 100%)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '32px',
                            }}>📄</div>
                            <p style={{ color: '#8A9BBE', fontSize: '15px', margin: 0 }}>
                                {search ? 'No documents found matching your search' : 'No documents uploaded yet'}
                            </p>
                            {!search && (
                                <button onClick={() => setShowModal(true)} className="doc-add-btn" style={{
                                    background: '#D4A843', color: '#1B2A4A', border: 'none',
                                    borderRadius: '10px', padding: '10px 24px', fontSize: '13px',
                                    fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s ease',
                                    boxShadow: '0 2px 8px rgba(212,168,67,0.25)',
                                }}>
                                    + Upload First Document
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: 'linear-gradient(135deg,#1B2A4A 0%,#243560 100%)' }}>
                                            {['#', 'File Name', 'Type', 'Size', 'Remarks', 'Uploaded', 'Actions'].map((h, i) => (
                                                <th key={i} style={{
                                                    padding: i === 0 ? '14px 16px 14px 20px' : '14px 16px',
                                                    textAlign: 'left', fontSize: '11px', fontWeight: 700,
                                                    letterSpacing: '0.08em', color: '#D4A843',
                                                    textTransform: 'uppercase', whiteSpace: 'nowrap',
                                                    borderBottom: '2px solid #D4A843',
                                                }}>
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map((doc, index) => (
                                            <tr
                                                key={doc.id}
                                                className="doc-row"
                                                style={{
                                                    background: index % 2 === 0 ? '#FDFCF9' : '#fff',
                                                    borderBottom: '1px solid #F0EBE0',
                                                    animationDelay: `${index * 0.04}s`,
                                                }}
                                            >
                                                <td style={{ padding: '14px 16px 14px 20px' }}>
                                                    <div style={{
                                                        width: '28px', height: '28px', borderRadius: '8px',
                                                        background: 'linear-gradient(135deg,#EDE5CF 0%,#E0D4B8 100%)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontSize: '12px', fontWeight: 700, color: '#8A7040',
                                                    }}>
                                                        {index + 1}
                                                    </div>
                                                </td>
                                                <td style={{ padding: '14px 16px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <div style={{
                                                            width: '36px', height: '36px', borderRadius: '10px',
                                                            background: 'linear-gradient(135deg,#1B2A4A 0%,#2A3F70 100%)',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            fontSize: '16px', flexShrink: 0,
                                                        }}>{getFileIcon(doc.fileType)}</div>
                                                        <a
                                                            href={getInlineUrl(doc.filePath)}
                                                            target="_blank" rel="noreferrer"
                                                            style={{
                                                                margin: 0, fontSize: '13px', fontWeight: 600,
                                                                color: '#1B2A4A', textDecoration: 'none',
                                                                maxWidth: '180px', overflow: 'hidden',
                                                                textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                                                display: 'block',
                                                            }}
                                                        >
                                                            {doc.fileName}
                                                        </a>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '14px 16px' }}>
                                                    <span style={{
                                                        display: 'inline-block', padding: '3px 10px',
                                                        borderRadius: '12px', fontSize: '11px', fontWeight: 700,
                                                        background: '#EEF2FF', color: '#1B2A4A', border: '1px solid #C7D2FE',
                                                        textTransform: 'uppercase',
                                                    }}>
                                                        {doc.fileType.split('/')[1]?.toUpperCase() ?? doc.fileType}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '14px 16px', fontSize: '13px', color: '#64748B' }}>
                                                    {formatFileSize(doc.fileSize)}
                                                </td>
                                                <td style={{ padding: '14px 16px' }}>
                                                    <span style={{ fontSize: '12px', color: doc.remarks ? '#4A5568' : '#C0CADB' }}>
                                                        {doc.remarks ?? '— No remarks —'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '14px 16px' }}>
                                                    <span style={{ fontSize: '13px', color: '#64748B' }}>
                                                        {new Date(doc.createdAt).toLocaleDateString('en-PK', {
                                                            day: '2-digit', month: 'short', year: 'numeric',
                                                        })}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '14px 16px' }}>
                                                    <div style={{ display: 'flex', gap: '6px' }}>
                                                        <a
                                                            href={getInlineUrl(doc.filePath)}
                                                            target="_blank" rel="noreferrer"
                                                            className="doc-action-btn doc-view-btn"
                                                            style={{
                                                                background: '#EEF2FF', color: '#1B2A4A',
                                                                border: '1px solid #C7D2FE', borderRadius: '8px',
                                                                padding: '6px 14px', fontSize: '12px',
                                                                fontWeight: 600, cursor: 'pointer',
                                                                transition: 'all 0.2s ease',
                                                                textDecoration: 'none', display: 'inline-block',
                                                            }}
                                                        >
                                                            👁️ View
                                                        </a>
                                                        <button
                                                            className="doc-action-btn doc-del-btn"
                                                            onClick={() => deleteDoc(doc.id)}
                                                            disabled={isDeleting}
                                                            style={{
                                                                background: '#FEF2F2', color: '#DC2626',
                                                                border: '1px solid #FECACA', borderRadius: '8px',
                                                                padding: '6px 14px', fontSize: '12px',
                                                                fontWeight: 600, cursor: 'pointer',
                                                                transition: 'all 0.2s ease',
                                                            }}
                                                        >
                                                            🗑️ Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Footer */}
                            <div style={{
                                padding: '12px 20px',
                                background: 'linear-gradient(135deg,#FDFCF9 0%,#F8F4EC 100%)',
                                borderTop: '1px solid #EEE9DC',
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            }}>
                                <span style={{ fontSize: '12px', color: '#A0ABBE' }}>
                                    Showing <strong style={{ color: '#1B2A4A' }}>{filtered.length}</strong> of{' '}
                                    <strong style={{ color: '#D4A843' }}>{documents?.length ?? 0}</strong> documents
                                </span>
                            </div>
                        </>
                    )}
                </div>
            )}

            {showModal && (
                <UploadDocumentModal
                    caseId={caseId}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    )
}

export default DocumentsList
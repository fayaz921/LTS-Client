import { useState } from 'react'
import { useGetDocumentsByCase, useDeleteDocument } from '../../../../../documents/hooks/useDocuments'
import UploadDocumentModal from '../../../../../documents/components/uploadDocument'
import DrawerLoader from '../shared/DrawerLoader'
import DrawerEmpty from '../shared/DrawerEmpty'
import { fmtDate, getFileIcon, formatFileSize } from '../shared/case-drawer.helpers'

export default function DocumentsTab({ caseId }: { caseId: string }) {
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
                <span className="cdr__tab-count">
                    {(documents ?? []).length} document{(documents ?? []).length !== 1 ? 's' : ''}
                </span>
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
                    text={(documents ?? []).length === 0 ? 'No documents uploaded yet' : 'No documents match your search'}
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

            {showUpload && (
                <UploadDocumentModal
                    caseId={caseId}
                    onClose={() => setShowUpload(false)}
                />
            )}
        </div>
    )
}
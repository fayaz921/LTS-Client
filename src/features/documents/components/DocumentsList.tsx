import { useState } from 'react'
import { useGetDocumentsByCase, useDeleteDocument } from '../hooks/useDocuments'
import UploadDocumentModal from './uploadDocument'

interface Props {
    caseId: string
}

const DocumentsList = ({ caseId }: Props) => {
    const [showModal, setShowModal] = useState(false)
    const { data: documents, isLoading, isError } = useGetDocumentsByCase(caseId)
    const { mutate: deleteDoc, isPending: isDeleting } = useDeleteDocument(caseId)

    if (isLoading) return (
        <div className="text-center py-5">
            <div className="spinner-border text-primary" />
        </div>
    )

   if (isError) return (
    <div>
        <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 style={{ color: '#1B2A4A', fontWeight: 700 }}>
                Documents
            </h5>
            <button
                className="btn btn-sm"
                style={{ backgroundColor: '#D4A843', color: '#0F172A', fontWeight: 600 }}
                onClick={() => setShowModal(true)}
            >
                + Upload Document
            </button>
        </div>

        <div className="alert alert-danger">
            Documents load nahi ho sake!
        </div>

        {showModal && (
            <UploadDocumentModal
                caseId={caseId}
                onClose={() => setShowModal(false)}
            />
        )}
    </div>
)

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 style={{ color: '#1B2A4A', fontWeight: 700 }}>
                    Documents ({documents?.length ?? 0})
                </h5>
                <button
                    className="btn btn-sm"
                    style={{ backgroundColor: '#D4A843', color: '#0F172A', fontWeight: 600 }}
                    onClick={() => setShowModal(true)}
                >
                    + Upload Document
                </button>
            </div>

            {documents?.length === 0 && (
                <div className="text-center py-5" style={{ color: '#64748B' }}>
                    <div style={{ fontSize: '40px' }}>📄</div>
                    <p className="mt-2">Koi document nahi mila</p>
                </div>
            )}

            {documents && documents.length > 0 && (
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead style={{ backgroundColor: '#F8FAFC' }}>
                            <tr>
                                <th style={{ color: '#64748B', fontSize: '12px' }}>FILE NAME</th>
                                <th style={{ color: '#64748B', fontSize: '12px' }}>TYPE</th>
                                <th style={{ color: '#64748B', fontSize: '12px' }}>SIZE</th>
                                <th style={{ color: '#64748B', fontSize: '12px' }}>REMARKS</th>
                                <th style={{ color: '#64748B', fontSize: '12px' }}>UPLOADED</th>
                                <th style={{ color: '#64748B', fontSize: '12px' }}>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documents.map(doc => (
                                <tr key={doc.id}>
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            <span style={{ fontSize: '20px' }}>
                                                {doc.fileType.includes('pdf') ? '📄' :
                                                 doc.fileType.includes('image') ? '🖼' : '📎'}
                                            </span>
                                            <a href={doc.filePath}
                                                target="_blank"
                                                rel="noreferrer"
                                                style={{ color: '#2563EB', fontSize: '13px', fontWeight: 500 }}>
                                                {doc.fileName}
                                            </a>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge" style={{ backgroundColor: '#EFF6FF', color: '#2563EB', fontSize: '11px' }}>
                                            {doc.fileType.split('/')[1]?.toUpperCase() ?? doc.fileType}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: '13px', color: '#64748B' }}>
                                        {doc.fileSize < 1024
                                            ? `${doc.fileSize} B`
                                            : doc.fileSize < 1024 * 1024
                                            ? `${(doc.fileSize / 1024).toFixed(1)} KB`
                                            : `${(doc.fileSize / (1024 * 1024)).toFixed(1)} MB`}
                                    </td>
                                    <td style={{ fontSize: '13px', color: '#64748B' }}>
                                        {doc.remarks ?? '—'}
                                    </td>
                                    <td style={{ fontSize: '13px', color: '#64748B' }}>
                                        {new Date(doc.createdAt).toLocaleDateString('en-PK', {
                                            day: '2-digit', month: 'short', year: 'numeric'
                                        })}
                                    </td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <a href={doc.filePath}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="btn btn-sm"
                                                style={{ backgroundColor: '#EFF6FF', color: '#2563EB', fontSize: '12px' }}>
                                                View
                                            </a>
                                            <button
                                                className="btn btn-sm"
                                                style={{ backgroundColor: '#FEF2F2', color: '#DC2626', fontSize: '12px' }}
                                                onClick={() => deleteDoc(doc.id)}
                                                disabled={isDeleting}>
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
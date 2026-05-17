import { useParams } from 'react-router-dom'
import DocumentsList from './DocumentsList'

const DocumentsPage = () => {
    const { caseId } = useParams<{ caseId: string }>()

    if (!caseId) return (
        <div style={{
            padding: '32px', minHeight: '100vh', background: '#ffffff',
        }}>
            <div style={{
                background: 'linear-gradient(135deg,#FFF5F5 0%,#FFF0F0 100%)',
                border: '1px solid #FECACA', borderRadius: '12px',
                padding: '20px 24px', display: 'flex',
                alignItems: 'center', gap: '12px',
                color: '#DC2626', fontSize: '14px',
            }}>
                <span style={{ fontSize: '20px' }}>⚠️</span>
                Case ID not found. Please navigate from the Cases page.
            </div>
        </div>
    )

    return <DocumentsList caseId={caseId} />
}

export default DocumentsPage
import { useParams } from 'react-router-dom'
import DocumentsList from './DocumentsList'

const DocumentsPage = () => {
    const { caseId } = useParams<{ caseId: string }>()

    if (!caseId) return (
        <div className="alert alert-danger">
            Case ID nahi mila!
        </div>
    )

    return (
        <div>
            <DocumentsList caseId={caseId} />
        </div>
    )
}

export default DocumentsPage
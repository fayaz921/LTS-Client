// pages/FollowUpsPage.tsx

import { useState } from 'react'
import FollowUpList from '../components/FollowUpList'
import FollowUpForm from '../components/FollowupForm'
import type { FollowUp } from '../types/followup.types'

// ─────────────────────────────────────────────────────────────
// Props — caseId parent (CaseDetailPage) se aata hai
// Ya useParams() se URL se liya ja sakta hai
// ─────────────────────────────────────────────────────────────

interface Props {
    caseId: string
}

const FollowUpsPage = ({ caseId }: Props) => {
    const [showModal, setShowModal] = useState(false)
    const [selected,  setSelected]  = useState<FollowUp | undefined>()

    const handleEdit = (followup: FollowUp) => {
        setSelected(followup)
        setShowModal(true)
    }

    const handleClose = () => {
        setSelected(undefined)
        setShowModal(false)
    }

    return (
        <div style={{
            padding: 'clamp(16px, 4vw, 32px)',   // ✅ mobile mein kam, desktop mein zyada
            minHeight: '100vh',
            background: '#ffffff',
        }}>
            <FollowUpList
                caseId={caseId}
                onEdit={handleEdit}
                onAdd={() => setShowModal(true)}
            />

            {showModal && (
                <FollowUpForm
                    caseId={caseId}          // ✅ automatically pass — user nahi bharega
                    selected={selected}
                    onClose={handleClose}
                />
            )}
        </div>
    )
}

export default FollowUpsPage
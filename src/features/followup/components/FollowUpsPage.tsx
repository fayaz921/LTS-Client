// pages/FollowUpsPage.tsx

import { useState } from 'react'
import FollowUpList from '../components/FollowUpList'
import FollowUpForm from '../components/FollowUpForm'
import type { FollowUp } from '../types/followup.types'

const FollowUpsPage = () => {
    const [showModal, setShowModal] = useState(false)
    const [selected, setSelected] = useState<FollowUp | undefined>()

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
            padding: '32px',
            minHeight: '100vh',
            background: '#ffffff',
        }}>
            <FollowUpList
                onEdit={handleEdit}
                onAdd={() => setShowModal(true)}
            />

            {showModal && (
                <FollowUpForm
                    selected={selected}
                    onClose={handleClose}
                />
            )}
        </div>
    )
}

export default FollowUpsPage
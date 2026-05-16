import { useState } from 'react'
import CourtList from './CourtList'
import CourtForm from './CourtForm'
import type { Court } from '../types/court.types'

// ─────────────────────────────────────────────────────────────
// CourtsPage — main container
// Mirrors DepartmentsPage exactly
// ─────────────────────────────────────────────────────────────

const CourtsPage = () => {
    const [showModal, setShowModal] = useState(false)
    const [selected, setSelected] = useState<Court | undefined>()

    const handleEdit = (court: Court) => {
        setSelected(court)
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
            <CourtList
                onEdit={handleEdit}
                onAdd={() => setShowModal(true)}
            />

            {showModal && (
                <CourtForm
                    selected={selected}
                    onClose={handleClose}
                />
            )}
        </div>
    )
}

export default CourtsPage
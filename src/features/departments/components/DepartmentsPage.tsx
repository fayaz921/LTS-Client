import { useState } from 'react'
import DepartmentList from './DepartmentList'
import DepartmentForm from './DepartmentForm'
import type { Department } from '../types/department.types'

const DepartmentsPage = () => {
    const [showModal, setShowModal] = useState(false)
    const [selected, setSelected] = useState<Department | undefined>()

    const handleEdit = (dep: Department) => {
        setSelected(dep)
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
            background: 'linear-gradient(160deg, #F8F6F0 0%, #F2EDE0 100%)'
        }}>
            <DepartmentList
                onEdit={handleEdit}
                onAdd={() => setShowModal(true)}
            />

            {showModal && (
                <DepartmentForm
                    selected={selected}
                    onClose={handleClose}
                />
            )}
        </div>
    )
}

export default DepartmentsPage

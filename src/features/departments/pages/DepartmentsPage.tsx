import { useState } from 'react'
import DepartmentList from '../components/DepartmentList'
import DepartmentForm from '../components/DepartmentForm'
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
        <div className="p-4">
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
import { useState, useEffect } from 'react'
import type { Department } from '../types/department.types'
import { useCreateDepartment, useUpdateDepartment } from '../hooks/useDepartments'

interface Props {
    selected?: Department
    onClose: () => void
}

const DepartmentForm = ({ selected, onClose }: Props) => {
    const [form, setForm] = useState({
        departmentName: '',
        addressContact: '',
        isActive: true,
    })
    const [error, setError] = useState('')

    const { mutate: createDep, isPending: creating } = useCreateDepartment()
    const { mutate: updateDep, isPending: updating } = useUpdateDepartment()
    const isPending = creating || updating

    useEffect(() => {
        if (selected) {
            setForm({
                departmentName: selected.departmentName,
                addressContact: selected.addressContact ?? '',
                isActive: selected.isActive,
            })
        } else {
            setForm({ departmentName: '', addressContact: '', isActive: true })
            setError('')
        }
    }, [selected])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target
        setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (selected) {
            updateDep(
                { id: selected.id, ...form },
                {
                    onSuccess: () => onClose(),
                    onError: (err: any) =>
                        setError(err.response?.data?.message || 'Update failed'),
                }
            )
        } else {
            createDep(form, {
                onSuccess: () => onClose(),
                onError: (err: any) =>
                    setError(err.response?.data?.message || 'Create failed'),
            })
        }
    }

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                zIndex: 999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
            onClick={onClose}
        >
            <div
                style={{
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    padding: '32px',
                    width: '100%',
                    maxWidth: '480px',
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 style={{ color: '#1B2A4A', fontWeight: 700, margin: 0 }}>
                        {selected ? 'Update Department' : 'Add Department'}
                    </h5>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '20px',
                            cursor: 'pointer',
                            color: '#64748B',
                        }}
                    >
                        ×
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div className="alert alert-danger py-2" style={{ fontSize: '13px' }}>
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>

                    {/* Department Name */}
                    <div className="mb-3">
                        <label style={{ fontSize: '13px', fontWeight: 600, color: '#1B2A4A' }}>
                            Department Name <span style={{ color: '#DC2626' }}>*</span>
                        </label>
                        <input
                            name="departmentName"
                            value={form.departmentName}
                            onChange={handleChange}
                            placeholder="Department name likhein..."
                            required
                            className="form-control mt-1"
                            style={{ fontSize: '13px' }}
                        />
                    </div>

                    {/* Address / Contact */}
                    <div className="mb-3">
                        <label style={{ fontSize: '13px', fontWeight: 600, color: '#1B2A4A' }}>
                            Address / Contact (Optional)
                        </label>
                        <input
                            name="addressContact"
                            value={form.addressContact}
                            onChange={handleChange}
                            placeholder="Address ya contact likhein..."
                            className="form-control mt-1"
                            style={{ fontSize: '13px' }}
                        />
                    </div>

                    {/* Is Active */}
                    <div className="mb-4 d-flex align-items-center gap-2">
                        <input
                            type="checkbox"
                            name="isActive"
                            id="isActive"
                            checked={form.isActive}
                            onChange={handleChange}
                        />
                        <label
                            htmlFor="isActive"
                            style={{ fontSize: '13px', fontWeight: 600, color: '#1B2A4A', margin: 0 }}
                        >
                            Active
                        </label>
                    </div>

                    {/* Buttons */}
                    <div className="d-flex gap-2 justify-content-end">
                        <button
                            type="button"
                            className="btn btn-sm"
                            style={{
                                backgroundColor: '#F1F5F9',
                                color: '#64748B',
                                fontWeight: 600,
                                padding: '8px 20px',
                            }}
                            onClick={onClose}
                            disabled={isPending}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-sm"
                            style={{
                                backgroundColor: '#D4A843',
                                color: '#0F172A',
                                fontWeight: 700,
                                padding: '8px 20px',
                            }}
                            disabled={isPending}
                        >
                            {isPending ? 'Saving...' : selected ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default DepartmentForm
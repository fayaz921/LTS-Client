import { useGetDepartments, useDeleteDepartment } from '../hooks/useDepartments'
import type { Department } from '../types/department.types'

interface Props {
    onEdit: (dep: Department) => void
    onAdd: () => void
}

const DepartmentList = ({ onEdit, onAdd }: Props) => {
    const { data: departments, isLoading, isError } = useGetDepartments()
    const { mutate: deleteDep, isPending: isDeleting } = useDeleteDepartment()

    if (isLoading) return (
        <div className="text-center py-5">
            <div className="spinner-border text-primary" />
        </div>
    )

    if (isError) return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 style={{ color: '#1B2A4A', fontWeight: 700 }}>
                    Departments
                </h5>
                <button
                    className="btn btn-sm"
                    style={{ backgroundColor: '#D4A843', color: '#0F172A', fontWeight: 600 }}
                    onClick={onAdd}
                >
                    + Add Department
                </button>
            </div>
            <div className="alert alert-danger">
                Departments load nahi ho sake!
            </div>
        </div>
    )

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 style={{ color: '#1B2A4A', fontWeight: 700 }}>
                    Departments ({departments?.length ?? 0})
                </h5>
                <button
                    className="btn btn-sm"
                    style={{ backgroundColor: '#D4A843', color: '#0F172A', fontWeight: 600 }}
                    onClick={onAdd}
                >
                    + Add Department
                </button>
            </div>

            {departments?.length === 0 && (
                <div className="text-center py-5" style={{ color: '#64748B' }}>
                    <div style={{ fontSize: '40px' }}>🏢</div>
                    <p className="mt-2">Koi department nahi mila</p>
                </div>
            )}

            {departments && departments.length > 0 && (
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead style={{ backgroundColor: '#F8FAFC' }}>
                            <tr>
                                <th style={{ color: '#64748B', fontSize: '12px' }}>#</th>
                                <th style={{ color: '#64748B', fontSize: '12px' }}>DEPARTMENT NAME</th>
                                <th style={{ color: '#64748B', fontSize: '12px' }}>ADDRESS / CONTACT</th>
                                <th style={{ color: '#64748B', fontSize: '12px' }}>STATUS</th>
                                <th style={{ color: '#64748B', fontSize: '12px' }}>CREATED</th>
                                <th style={{ color: '#64748B', fontSize: '12px' }}>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {departments.map((dep, index) => (
                                <tr key={dep.id}>
                                    <td style={{ fontSize: '13px', color: '#64748B' }}>
                                        {index + 1}
                                    </td>
                                    <td style={{ fontSize: '13px', fontWeight: 500, color: '#1B2A4A' }}>
                                        🏢 {dep.departmentName}
                                    </td>
                                    <td style={{ fontSize: '13px', color: '#64748B' }}>
                                        {dep.addressContact ?? '—'}
                                    </td>
                                    <td>
                                        <span
                                            className="badge"
                                            style={{
                                                backgroundColor: dep.isActive ? '#F0FDF4' : '#FEF2F2',
                                                color: dep.isActive ? '#16A34A' : '#DC2626',
                                                fontSize: '11px',
                                            }}
                                        >
                                            {dep.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: '13px', color: '#64748B' }}>
                                        {dep.createdAt
                                            ? new Date(dep.createdAt).toLocaleDateString('en-PK', {
                                                day: '2-digit', month: 'short', year: 'numeric',
                                            })
                                            : '—'}
                                    </td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-sm"
                                                style={{ backgroundColor: '#EFF6FF', color: '#2563EB', fontSize: '12px' }}
                                                onClick={() => onEdit(dep)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-sm"
                                                style={{ backgroundColor: '#FEF2F2', color: '#DC2626', fontSize: '12px' }}
                                                onClick={() => deleteDep(dep.id)}
                                                disabled={isDeleting}
                                            >
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
        </div>
    )
}

export default DepartmentList
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: '16px' }}>
            <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                border: '3px solid #F0E8D0',
                borderTop: '3px solid #D4A843',
                animation: 'spin 0.8s linear infinite'
            }} />
            <p style={{ color: '#8A9BBE', fontSize: '14px', margin: 0 }}>Loading departments...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )

    if (isError) return (
        <div>
            <PageHeader count={0} onAdd={onAdd} />
            <div style={{
                background: 'linear-gradient(135deg, #FFF5F5 0%, #FFF0F0 100%)',
                border: '1px solid #FECACA',
                borderRadius: '12px',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: '#DC2626',
                fontSize: '14px'
            }}>
                <span style={{ fontSize: '20px' }}>⚠️</span>
                Departments load nahi ho sake. Please refresh karein.
            </div>
        </div>
    )

    return (
        <div>
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .dep-row {
                    animation: fadeInUp 0.3s ease forwards;
                    transition: background 0.15s ease;
                }
                .dep-row:hover {
                    background: #F8F6F0 !important;
                }
                .dep-row:hover .action-btn {
                    opacity: 1 !important;
                    transform: translateY(0) !important;
                }
                .action-btn {
                    opacity: 0;
                    transform: translateY(4px);
                    transition: all 0.2s ease;
                }
                .edit-btn:hover { background: #1B2A4A !important; color: #fff !important; }
                .del-btn:hover { background: #DC2626 !important; color: #fff !important; }
                .add-btn:hover { background: #C49830 !important; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(212,168,67,0.35) !important; }
                .add-btn:active { transform: translateY(0); }
            `}</style>

            <PageHeader count={departments?.length ?? 0} onAdd={onAdd} />

            {(!departments || departments.length === 0) ? (
                <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', padding: '80px 0', gap: '16px'
                }}>
                    <div style={{
                        width: '72px', height: '72px', borderRadius: '20px',
                        background: 'linear-gradient(135deg, #F5F0E8 0%, #EDE5D0 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '32px'
                    }}>🏢</div>
                    <p style={{ color: '#8A9BBE', fontSize: '15px', margin: 0 }}>Koi department nahi mila</p>
                    <button
                        onClick={onAdd}
                        className="add-btn"
                        style={{
                            background: '#D4A843', color: '#1B2A4A', border: 'none',
                            borderRadius: '10px', padding: '10px 24px',
                            fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                            transition: 'all 0.2s ease', boxShadow: '0 2px 8px rgba(212,168,67,0.25)'
                        }}
                    >
                        + Pehla Department Add Karein
                    </button>
                </div>
            ) : (
                <div style={{
                    background: '#fff',
                    borderRadius: '16px',
                    border: '1px solid #EEE9DC',
                    overflow: 'hidden',
                    boxShadow: '0 4px 24px rgba(27,42,74,0.06)'
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'linear-gradient(135deg, #1B2A4A 0%, #243560 100%)' }}>
                                {['#', 'Department Name', 'Address / Contact', 'Status', 'Created', 'Actions'].map((h, i) => (
                                    <th key={i} style={{
                                        padding: i === 0 ? '14px 16px 14px 20px' : '14px 16px',
                                        textAlign: 'left',
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        letterSpacing: '0.08em',
                                        color: '#D4A843',
                                        textTransform: 'uppercase',
                                        whiteSpace: 'nowrap',
                                        borderBottom: '2px solid #D4A843'
                                    }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {departments.map((dep, index) => (
                                <tr
                                    key={dep.id}
                                    className="dep-row"
                                    style={{
                                        background: index % 2 === 0 ? '#FDFCF9' : '#fff',
                                        borderBottom: '1px solid #F0EBE0',
                                        animationDelay: `${index * 0.04}s`
                                    }}
                                >
                                    <td style={{ padding: '14px 16px 14px 20px' }}>
                                        <div style={{
                                            width: '28px', height: '28px', borderRadius: '8px',
                                            background: 'linear-gradient(135deg, #EDE5CF 0%, #E0D4B8 100%)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '12px', fontWeight: 700, color: '#8A7040'
                                        }}>
                                            {index + 1}
                                        </div>
                                    </td>

                                    <td style={{ padding: '14px 16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{
                                                width: '36px', height: '36px', borderRadius: '10px',
                                                background: 'linear-gradient(135deg, #1B2A4A 0%, #2A3F70 100%)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '16px', flexShrink: 0
                                            }}>
                                                🏢
                                            </div>
                                            <div>
                                                <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#1B2A4A' }}>
                                                    {dep.departmentName}
                                                </p>
                                                <p style={{ margin: 0, fontSize: '11px', color: '#A0ABBE' }}>
                                                    ID: {dep.id.toString().slice(0, 8)}...
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    <td style={{ padding: '14px 16px' }}>
                                        <span style={{ fontSize: '13px', color: dep.addressContact ? '#4A5568' : '#C0CADB' }}>
                                            {dep.addressContact ?? '— Not provided —'}
                                        </span>
                                    </td>

                                    <td style={{ padding: '14px 16px' }}>
                                        <span style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '5px',
                                            padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                                            background: dep.isActive ? '#F0FDF4' : '#FEF2F2',
                                            color: dep.isActive ? '#15803D' : '#DC2626',
                                            border: `1px solid ${dep.isActive ? '#BBF7D0' : '#FECACA'}`
                                        }}>
                                            <span style={{
                                                width: '6px', height: '6px', borderRadius: '50%',
                                                background: dep.isActive ? '#22C55E' : '#EF4444',
                                                display: 'inline-block'
                                            }} />
                                            {dep.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>

                                    <td style={{ padding: '14px 16px' }}>
                                        <span style={{ fontSize: '13px', color: '#64748B' }}>
                                            {dep.createdAt
                                                ? new Date(dep.createdAt).toLocaleDateString('en-PK', {
                                                    day: '2-digit', month: 'short', year: 'numeric',
                                                })
                                                : '—'}
                                        </span>
                                    </td>

                                    <td style={{ padding: '14px 16px' }}>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            <button
                                                className="action-btn edit-btn"
                                                onClick={() => onEdit(dep)}
                                                style={{
                                                    background: '#EEF2FF', color: '#1B2A4A',
                                                    border: '1px solid #C7D2FE',
                                                    borderRadius: '8px', padding: '6px 14px',
                                                    fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button
                                                className="action-btn del-btn"
                                                onClick={() => deleteDep(dep.id)}
                                                disabled={isDeleting}
                                                style={{
                                                    background: '#FEF2F2', color: '#DC2626',
                                                    border: '1px solid #FECACA',
                                                    borderRadius: '8px', padding: '6px 14px',
                                                    fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div style={{
                        padding: '12px 20px',
                        background: 'linear-gradient(135deg, #FDFCF9 0%, #F8F4EC 100%)',
                        borderTop: '1px solid #EEE9DC',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                    }}>
                        <span style={{ fontSize: '12px', color: '#A0ABBE' }}>
                            Total {departments.length} department{departments.length !== 1 ? 's' : ''}
                        </span>
                        <span style={{ fontSize: '12px', color: '#A0ABBE' }}>
                            {departments.filter(d => d.isActive).length} active · {departments.filter(d => !d.isActive).length} inactive
                        </span>
                    </div>
                </div>
            )}
        </div>
    )
}

const PageHeader = ({ count, onAdd }: { count: number; onAdd: () => void }) => (
    <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '24px'
    }}>
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, #1B2A4A 0%, #2A3F70 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '20px'
                }}>🏢</div>
                <div>
                    <h5 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#1B2A4A' }}>
                        Departments
                    </h5>
                    <p style={{ margin: 0, fontSize: '13px', color: '#8A9BBE' }}>
                        {count} department{count !== 1 ? 's' : ''} registered
                    </p>
                </div>
            </div>
        </div>
        <button
            onClick={onAdd}
            className="add-btn"
            style={{
                background: '#D4A843', color: '#1B2A4A',
                border: 'none', borderRadius: '10px',
                padding: '11px 22px', fontSize: '13px',
                fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(212,168,67,0.3)'
            }}
        >
            <span style={{ fontSize: '16px' }}>+</span> Add Department
        </button>
    </div>
)

export default DepartmentList

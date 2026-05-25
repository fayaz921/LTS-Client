import { useState } from 'react'
import { useCreateBench } from '../hooks/useCreateBench'
import { useDeleteBench } from '../hooks/useDeleteBench'
import type { CreateBenchDto } from '../types/bench.types'
import { CaseList } from '../hooks/CaseList';
import { useBenchList } from '../hooks/useBenchList'

// ─────────────────────────────────────────────────────────────
// BenchPage — Bench / Judge Management
// Design matches Courts / Departments / Follow-ups pattern
// ─────────────────────────────────────────────────────────────

const BenchPage = () => {
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState<CreateBenchDto>({
        caseId: '',
        judgeName: '',
        judgeContactNo: '',
        judgeEmail: '',
    })

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState('');

    const { data, isLoading, isError } = useBenchList(
        page,
        pageSize,
        search
    );

    const benchList = data?.items || [];
    const total = data?.total || 0;
    const { mutate: createBench, isPending: isCreating } = useCreateBench()
    const { mutate: deleteBench, isPending: isDeleting } = useDeleteBench()
    const { data: casesList } = CaseList();

    const handleSearch = () => {
        setPage(1)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        createBench(formData, {
            onSuccess: () => {
                setShowForm(false)
                setFormData({ caseId: '', judgeName: '', judgeContactNo: '', judgeEmail: '' })
            },
        })
    }

    const handleDelete = (id: string) => {
        const confirmed = window.confirm('Are you sure you want to delete this judge?')
        if (confirmed) deleteBench(id)
    }

    return (
        <div style={{ padding: '32px', minHeight: '100vh', background: '#ffffff' }}>
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes spin { to { transform: rotate(360deg); } }
                .bench-row { animation: fadeInUp 0.3s ease forwards; transition: background 0.15s ease; }
                .bench-row:hover { background: #F8F6F0 !important; }
                .bench-row:hover .bench-action-btn { opacity: 1 !important; transform: translateY(0) !important; }
                .bench-action-btn { opacity: 0; transform: translateY(4px); transition: all 0.2s ease; }
                .bench-del-btn:hover { background: #DC2626 !important; color: #fff !important; }
                .bench-add-btn:hover { background: #C49830 !important; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(212,168,67,0.35) !important; }
                .bench-search:focus { border-color: #D4A843 !important; box-shadow: 0 0 0 3px rgba(212,168,67,0.1) !important; }
                .bench-search-btn:hover { background: #1B2A4A !important; color: #fff !important; border-color: #1B2A4A !important; }
                .bench-form-input:focus { border-color: #D4A843 !important; box-shadow: 0 0 0 3px rgba(212,168,67,0.1) !important; outline: none; }
            `}</style>

            {/* ── Page Header ── */}
            <div style={{ marginBottom: '24px' }}>
                <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', marginBottom: '20px',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '44px', height: '44px', borderRadius: '12px',
                            background: 'linear-gradient(135deg,#1B2A4A 0%,#2A3F70 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '20px',
                        }}>⚖️</div>
                        <div>
                            <h5 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#1B2A4A' }}>
                                Bench Management
                            </h5>
                            <p style={{ margin: 0, fontSize: '13px', color: '#8A9BBE' }}>
                                Search by Case No to view and manage judges
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bench-add-btn"
                        style={{
                            background: showForm ? '#FEF2F2' : '#D4A843',
                            color: showForm ? '#DC2626' : '#1B2A4A',
                            border: showForm ? '1px solid #FECACA' : 'none',
                            borderRadius: '10px', padding: '11px 22px', fontSize: '13px',
                            fontWeight: 700, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '6px',
                            transition: 'all 0.2s ease',
                            boxShadow: showForm ? 'none' : '0 2px 8px rgba(212,168,67,0.3)',
                        }}
                    >
                        {showForm ? '✕ Cancel' : <><span style={{ fontSize: '16px' }}>+</span> Add Judge</>}
                    </button>
                </div>

                {/* ── Search Bar ── */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                        <span style={{
                            position: 'absolute', left: '12px', top: '50%',
                            transform: 'translateY(-50%)', fontSize: '15px', pointerEvents: 'none',
                        }}>🔍</span>
                        <input
                            className="bench-search"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSearch()}
                            placeholder=""
                            style={{
                                width: '100%', padding: '10px 12px 10px 36px',
                                border: '1.5px solid #E2DECE', borderRadius: '10px',
                                fontSize: '13px', color: '#1B2A4A', background: '#FDFCF9',
                                outline: 'none', transition: 'all 0.2s ease',
                                boxSizing: 'border-box', fontFamily: 'inherit',
                            }}
                        />
                    </div>
                    <button
                        onClick={handleSearch}
                        className="bench-search-btn"
                        style={{
                            padding: '10px 24px', border: '1.5px solid #E2DECE',
                            borderRadius: '10px', background: '#FDFCF9',
                            color: '#1B2A4A', fontSize: '13px', fontWeight: 600,
                            cursor: 'pointer', transition: 'all 0.2s ease',
                            fontFamily: 'inherit',
                        }}
                    >
                        Search
                    </button>
                </div>
            </div>

            {/* ── Add Judge Form ── */}
            {showForm && (
                <div style={{
                    background: '#fff', borderRadius: '16px',
                    border: '1px solid #EEE9DC', overflow: 'hidden',
                    boxShadow: '0 4px 24px rgba(27,42,74,0.06)',
                    marginBottom: '24px', animation: 'fadeInUp 0.3s ease forwards',
                }}>
                    <div style={{
                        padding: '16px 20px',
                        background: 'linear-gradient(135deg,#1B2A4A 0%,#243560 100%)',
                        borderBottom: '2px solid #D4A843',
                    }}>
                        <h6 style={{ margin: 0, color: '#D4A843', fontSize: '13px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                            Add New Judge
                        </h6>
                    </div>
                    <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '20px' }}>
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 700, color: '#1B2A4A', marginBottom: '6px', display: 'block' }}>
                                    Case ID <span style={{ color: '#DC2626' }}>*</span>
                                </label>
                                
                                <select
                                    className="form-select"
                                    name="caseId"
                                    value={formData.caseId}
                                    onChange={(e) =>
                                        setFormData(prev => ({ ...prev, caseId: e.target.value }))
                                    }
                                    required
                                >
                                    <option value="">-- Case Select Karo --</option>
                                    {casesList?.map((c: any) => (
                                        <option key={c.id} value={c.id}>
                                            {c.caseNo} — {c.title}
                                        </option>
                                    ))}
                                </select>



                            </div>
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 700, color: '#1B2A4A', marginBottom: '6px', display: 'block' }}>
                                    Judge Name <span style={{ color: '#DC2626' }}>*</span>
                                </label>
                                <input
                                    className="bench-form-input"
                                    name="judgeName" value={formData.judgeName} onChange={handleInputChange}
                                    placeholder="e.g. Justice Muhammad Ali" required
                                    style={{
                                        width: '100%', padding: '10px 13px',
                                        border: '1.5px solid #E2DECE', borderRadius: '10px',
                                        fontSize: '13px', color: '#1B2A4A', background: '#FDFCF9',
                                        outline: 'none', transition: 'all 0.2s ease',
                                        boxSizing: 'border-box', fontFamily: 'inherit',
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 700, color: '#1B2A4A', marginBottom: '6px', display: 'block' }}>
                                    Contact Number (Optional)
                                </label>
                                <input
                                    className="bench-form-input"
                                    name="judgeContactNo" value={formData.judgeContactNo || ''} onChange={handleInputChange}
                                    placeholder="e.g. 0300-1234567"
                                    style={{
                                        width: '100%', padding: '10px 13px',
                                        border: '1.5px solid #E2DECE', borderRadius: '10px',
                                        fontSize: '13px', color: '#1B2A4A', background: '#FDFCF9',
                                        outline: 'none', transition: 'all 0.2s ease',
                                        boxSizing: 'border-box', fontFamily: 'inherit',
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 700, color: '#1B2A4A', marginBottom: '6px', display: 'block' }}>
                                    Email (Optional)
                                </label>
                                <input
                                    className="bench-form-input"
                                    name="judgeEmail" value={formData.judgeEmail || ''} onChange={handleInputChange}
                                    placeholder="judge@court.gov.pk" type="email"
                                    style={{
                                        width: '100%', padding: '10px 13px',
                                        border: '1.5px solid #E2DECE', borderRadius: '10px',
                                        fontSize: '13px', color: '#1B2A4A', background: '#FDFCF9',
                                        outline: 'none', transition: 'all 0.2s ease',
                                        boxSizing: 'border-box', fontFamily: 'inherit',
                                    }}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="submit" disabled={isCreating} className="bench-add-btn" style={{
                                background: '#D4A843', color: '#1B2A4A', border: 'none',
                                borderRadius: '10px', padding: '10px 24px', fontSize: '13px',
                                fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s ease',
                                boxShadow: '0 2px 8px rgba(212,168,67,0.25)',
                                display: 'flex', alignItems: 'center', gap: '6px',
                            }}>
                                {isCreating ? (
                                    <><div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '2px solid rgba(27,42,74,0.2)', borderTop: '2px solid #1B2A4A', animation: 'spin 0.6s linear infinite' }} /> Saving...</>
                                ) : 'Save Judge'}
                            </button>
                            <button type="button" onClick={() => setShowForm(false)} style={{
                                padding: '10px 20px', border: '1.5px solid #E2DECE',
                                borderRadius: '10px', background: '#FDFCF9',
                                color: '#64748B', fontSize: '13px', fontWeight: 600,
                                cursor: 'pointer', transition: 'all 0.2s ease', fontFamily: 'inherit',
                            }}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* ── Table Card ── */}
            <div style={{
                background: '#fff', borderRadius: '16px',
                border: '1px solid #EEE9DC', overflow: 'hidden',
                boxShadow: '0 4px 24px rgba(27,42,74,0.06)',
                position: 'relative',
            }}>
                {/* Loading */}
                {isLoading && (
                    <div style={{
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        padding: '80px 0', gap: '16px',
                    }}>
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '50%',
                            border: '3px solid #F0E8D0', borderTop: '3px solid #D4A843',
                            animation: 'spin 0.8s linear infinite',
                        }} />
                        <p style={{ color: '#8A9BBE', fontSize: '14px', margin: 0 }}>Loading judges...</p>
                    </div>
                )}

                {/* Error */}
                {isError && (
                    <div style={{
                        margin: '20px', background: 'linear-gradient(135deg,#FFF5F5 0%,#FFF0F0 100%)',
                        border: '1px solid #FECACA', borderRadius: '12px',
                        padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '12px',
                        color: '#DC2626', fontSize: '14px',
                    }}>
                        <span style={{ fontSize: '20px' }}>⚠️</span>
                        Data could not be loaded. Please check backend connection.
                    </div>
                )}

              

                {/* Empty state with active case */}
                {benchList && benchList.length === 0 && !isLoading && (
                    <div style={{
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        padding: '80px 0', gap: '16px',
                    }}>
                        <div style={{
                            width: '72px', height: '72px', borderRadius: '20px',
                            background: 'linear-gradient(135deg,#F5F0E8 0%,#EDE5D0 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '32px',
                        }}>📭</div>
                        <p style={{ color: '#8A9BBE', fontSize: '15px', margin: 0 }}>
                            No judges assigned to this case yet
                        </p>
                        {/* <button onClick={() => setShowForm(true)} className="bench-add-btn" style={{
                            background: '#D4A843', color: '#1B2A4A', border: 'none',
                            borderRadius: '10px', padding: '10px 24px', fontSize: '13px',
                            fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s ease',
                            boxShadow: '0 2px 8px rgba(212,168,67,0.25)',
                        }}>
                            + Add First Judge 
                        </button>*/}
                    </div>
                )}

                {/* Data Table */}
                {benchList && benchList.length > 0 && (
                    <>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: 'linear-gradient(135deg,#1B2A4A 0%,#243560 100%)' }}>
                                        {['#', 'Case No', 'Judge Name', 'Contact Number', 'Email', 'Date Added', 'Actions'].map((h, i) => (
                                            <th key={i} style={{
                                                padding: i === 0 ? '14px 16px 14px 20px' : '14px 16px',
                                                textAlign: 'left', fontSize: '11px', fontWeight: 700,
                                                letterSpacing: '0.08em', color: '#D4A843',
                                                textTransform: 'uppercase', whiteSpace: 'nowrap',
                                                borderBottom: '2px solid #D4A843',
                                            }}>
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {benchList.map((bench: any, index: number) => (
                                        <tr
                                            key={bench.id}
                                            className="bench-row"
                                            style={{
                                                background: index % 2 === 0 ? '#FDFCF9' : '#fff',
                                                borderBottom: '1px solid #F0EBE0',
                                                animationDelay: `${index * 0.04}s`,
                                            }}
                                        >
                                            <td style={{ padding: '14px 16px 14px 20px' }}>
                                                <div style={{
                                                    width: '28px', height: '28px', borderRadius: '8px',
                                                    background: 'linear-gradient(135deg,#EDE5CF 0%,#E0D4B8 100%)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '12px', fontWeight: 700, color: '#8A7040',
                                                }}>
                                                    {index + 1}
                                                </div>
                                            </td>
                                            <td style={{ padding: '14px 16px' }}>
                                                <span style={{ fontSize: '13px', fontWeight: 600 }}>
                                                    {bench.caseNo}
                                                </span>
                                            </td>
                                            <td style={{ padding: '14px 16px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div style={{
                                                        width: '36px', height: '36px', borderRadius: '10px',
                                                        background: 'linear-gradient(135deg,#1B2A4A 0%,#2A3F70 100%)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontSize: '16px', flexShrink: 0,
                                                    }}>👨‍⚖️</div>
                                                    <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#1B2A4A' }}>
                                                        {bench.judgeName}
                                                    </p>
                                                </div>
                                            </td>
                                            <td style={{ padding: '14px 16px' }}>
                                                <span style={{ fontSize: '13px', color: bench.judgeContactNo ? '#4A5568' : '#C0CADB' }}>
                                                    {bench.judgeContactNo || '— Not provided —'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '14px 16px' }}>
                                                <span style={{ fontSize: '13px', color: bench.judgeEmail ? '#4A5568' : '#C0CADB' }}>
                                                    {bench.judgeEmail || '— Not provided —'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '14px 16px' }}>
                                                <span style={{ fontSize: '13px', color: '#64748B' }}>
                                                    {new Date(bench.createdAt).toLocaleDateString('en-PK', {
                                                        day: '2-digit', month: 'short', year: 'numeric',
                                                    })}
                                                </span>
                                            </td>
                                            <td style={{ padding: '14px 16px' }}>
                                                <button
                                                    className="bench-action-btn bench-del-btn"
                                                    onClick={() => handleDelete(bench.id)}
                                                    disabled={isDeleting}
                                                    style={{
                                                        background: '#FEF2F2', color: '#DC2626',
                                                        border: '1px solid #FECACA', borderRadius: '8px',
                                                        padding: '6px 14px', fontSize: '12px',
                                                        fontWeight: 600, cursor: 'pointer',
                                                        transition: 'all 0.2s ease',
                                                    }}
                                                >
                                                    🗑️ Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div
                            style={{
                                padding: '16px 20px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                borderTop: '1px solid #EEE9DC',
                            }}
                        >
                            <div>
                                Showing {(page - 1) * pageSize + 1} –
                                {Math.min(page * pageSize, total)} of {total}
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage(prev => prev - 1)}
                                >
                                    Prev
                                </button>

                                <button>{page}</button>

                                <button
                                    disabled={page * pageSize >= total}
                                    onClick={() => setPage(prev => prev + 1)}
                                >
                                    Next
                                </button>
                            </div>
                        </div>

                        <select
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                setPage(1);
                            }}
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>



                        {/* Footer */}
                        <div style={{
                            padding: '12px 20px',
                            background: 'linear-gradient(135deg,#FDFCF9 0%,#F8F4EC 100%)',
                            borderTop: '1px solid #EEE9DC',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        }}>
                            <span style={{ fontSize: '12px', color: '#A0ABBE' }}>
                                Total <strong style={{ color: '#D4A843' }}>{benchList.length}</strong> judge{benchList.length !== 1 ? 's' : ''} assigned
                            </span>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default BenchPage

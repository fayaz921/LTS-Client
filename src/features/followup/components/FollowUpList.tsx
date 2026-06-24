// // components/FollowUpList.tsx - Fully Responsive

// import { useState } from 'react'
// import { useGetFollowUps, useDeleteFollowUp } from '../hooks/useFollowups'
// import type { FollowUp, FollowUpPageParams } from '../types/followup.types'

// interface Props {
//     onEdit:  (followup: FollowUp) => void
//     onAdd:   () => void
//     caseId:  string     // ✅ required — parent se aata hai
// }

// const PAGE_SIZE_OPTIONS = [5, 10, 25, 50]

// // ── Helpers ──────────────────────────────────────────────────

// const fmtDate = (iso?: string | null) =>
//     iso
//         ? new Date(iso).toLocaleDateString('en-PK', {
//               day: '2-digit', month: 'short', year: 'numeric',
//           })
//         : '—'

// const getStatus = (hearingDate: string, nextHearingDate?: string | null) => {
//     const today   = new Date()
//     const hearing = new Date(hearingDate)
//     if (hearing < today)   return { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA', text: 'Past' }
//     if (nextHearingDate)   return { bg: '#FEF3C7', color: '#D97706', border: '#FDE68A', text: 'Adjourned' }
//     return                        { bg: '#F0FDF4', color: '#15803D', border: '#BBF7D0', text: 'Scheduled' }
// }

// function getPageNumbers(current: number, total: number): (number | string)[] {
//     if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)
//     const pages: (number | string)[] = []
//     if (current <= 3)            pages.push(1, 2, 3, 4, '...', total)
//     else if (current >= total-2) pages.push(1, '...', total-3, total-2, total-1, total)
//     else                         pages.push(1, '...', current-1, current, current+1, '...', total)
//     return pages
// }

// // ─────────────────────────────────────────────────────────────
// // FollowUpList
// // ─────────────────────────────────────────────────────────────

// const FollowUpList = ({ onEdit, onAdd, caseId }: Props) => {
//     const [pageNumber, setPageNumber] = useState(1)
//     const [pageSize,   setPageSize]   = useState(10)
//     const [search,     setSearch]     = useState('')

//     const params: FollowUpPageParams = { pageNumber, pageSize, caseId }

//     const { data, isLoading, isFetching, isError, error, refetch } = useGetFollowUps(params)
//     const { mutate: deleteFollowUp, isPending: isDeleting } = useDeleteFollowUp()

//     const filtered = (data?.items ?? []).filter(f =>
//         (f.interimOrder ?? '').toLowerCase().includes(search.toLowerCase()) ||
//         (f.decision     ?? '').toLowerCase().includes(search.toLowerCase()) ||
//         (f.remarks      ?? '').toLowerCase().includes(search.toLowerCase())
//     )

//     const totalCount  = data?.totalCount  ?? 0
//     const totalPages  = data?.totalPages  ?? 1
//     const hasPrevious = data?.hasPrevious ?? false
//     const hasNext     = data?.hasNext     ?? false

//     const handlePageSizeChange = (size: number) => {
//         setPageSize(size)
//         setPageNumber(1)
//     }

//     // ── Loading ───────────────────────────────────────────────
//     if (isLoading) return (
//         <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'80px 0', gap:'16px' }}>
//             <div style={{
//                 width:'48px', height:'48px', borderRadius:'50%',
//                 border:'3px solid #F0E8D0', borderTop:'3px solid #D4A843',
//                 animation:'spin 0.8s linear infinite',
//             }} />
//             <p style={{ color:'#8A9BBE', fontSize:'14px', margin:0 }}>Loading follow-ups...</p>
//             <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
//         </div>
//     )

//     // ── Error ─────────────────────────────────────────────────
//     if (isError) {
//         const msg = (error as any)?.response?.data?.message || 'Follow-ups load nahi ho sake.'
//         return (
//             <div>
//                 <PageHeader totalCount={0} search={search} onSearchChange={setSearch} onAdd={onAdd} />
//                 <div style={{
//                     background:'linear-gradient(135deg,#FFF5F5,#FFF0F0)',
//                     border:'1px solid #FECACA', borderRadius:'12px', padding:'20px 24px',
//                 }}>
//                     <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'12px' }}>
//                         <span style={{ fontSize:'20px' }}>⚠️</span>
//                         <span style={{ color:'#DC2626', fontSize:'13px', fontWeight:600 }}>{msg}</span>
//                     </div>
//                     <button onClick={() => refetch()} style={{
//                         background:'#D4A843', color:'#1B2A4A', border:'none',
//                         borderRadius:'8px', padding:'8px 16px',
//                         fontSize:'12px', fontWeight:600, cursor:'pointer',
//                     }}>🔄 Retry</button>
//                 </div>
//             </div>
//         )
//     }

//     return (
//         <div>
//             <style>{`
//                 @keyframes fadeInUp {
//                     from { opacity:0; transform:translateY(12px); }
//                     to   { opacity:1; transform:translateY(0); }
//                 }
//                 @keyframes spin    { to { transform: rotate(360deg); } }
//                 @keyframes shimmer {
//                     0%   { background-position: 200% 0; }
//                     100% { background-position: -200% 0; }
//                 }

//                 .fu-row { animation: fadeInUp 0.3s ease forwards; transition: background 0.15s; }
//                 .fu-row:hover { background: #F8F6F0 !important; }
//                 .fu-row:hover .fu-act { opacity:1 !important; transform:translateY(0) !important; }
//                 .fu-act  { opacity:0; transform:translateY(4px); transition:all 0.2s; }
//                 .fu-edit:hover { background:#1B2A4A !important; color:#fff !important; }
//                 .fu-del:hover  { background:#DC2626 !important; color:#fff !important; }
//                 .fu-add:hover  { background:#C49830 !important; transform:translateY(-1px); }
//                 .fu-srch:focus { border-color:#D4A843 !important; box-shadow:0 0 0 3px rgba(212,168,67,0.1) !important; }
//                 .pg-btn:hover:not(:disabled) { background:#1B2A4A !important; color:#fff !important; border-color:#1B2A4A !important; }
//                 .pg-btn:disabled { opacity:0.4; cursor:not-allowed; }
//                 .pg-num:hover { background:#FDF6E3 !important; border-color:#D4A843 !important; color:#8A6020 !important; }
//                 .pg-num.active { background:#D4A843 !important; color:#1B2A4A !important; border-color:#D4A843 !important; font-weight:700 !important; }
//                 .sz-sel:focus { border-color:#D4A843 !important; outline:none; }
//                 .fetching-bar {
//                     position:absolute; top:0; left:0; right:0; height:3px;
//                     background:linear-gradient(90deg,#D4A843,#E8C05A,#D4A843);
//                     background-size:200% 100%; animation:shimmer 1.2s infinite;
//                 }

//                 /* ── Mobile card view — show cards instead of table on small screens ── */
//                 .fu-table-wrap  { display: block; }
//                 .fu-cards-wrap  { display: none; }

//                 @media (max-width: 768px) {
//                     .fu-table-wrap { display: none; }
//                     .fu-cards-wrap { display: flex; flex-direction: column; gap: 12px; padding: 16px; }
//                 }

//                 /* ── Pagination responsive ── */
//                 .pg-footer {
//                     display: flex;
//                     align-items: center;
//                     justify-content: space-between;
//                     flex-wrap: wrap;
//                     gap: 12px;
//                     padding: 14px 20px;
//                 }
//                 @media (max-width: 600px) {
//                     .pg-footer { justify-content: center; }
//                 }

//                 /* ── Page numbers: hide middle ones on very small screens ── */
//                 .pg-num-hide-sm { display: inline-flex; }
//                 @media (max-width: 400px) {
//                     .pg-num-hide-sm { display: none; }
//                 }
//             `}</style>

//             <PageHeader
//                 totalCount={totalCount}
//                 search={search}
//                 onSearchChange={setSearch}
//                 onAdd={onAdd}
//             />

//             <div style={{
//                 background:'#fff', borderRadius:'16px',
//                 border:'1px solid #EEE9DC', overflow:'hidden',
//                 boxShadow:'0 4px 24px rgba(27,42,74,0.06)',
//                 position:'relative',
//             }}>
//                 {isFetching && !isLoading && <div className="fetching-bar" />}

//                 {filtered.length === 0 ? (
//                     /* ── Empty ── */
//                     <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'60px 20px', gap:'16px' }}>
//                         <div style={{
//                             width:'72px', height:'72px', borderRadius:'20px',
//                             background:'linear-gradient(135deg,#F5F0E8,#EDE5D0)',
//                             display:'flex', alignItems:'center', justifyContent:'center', fontSize:'32px',
//                         }}>📋</div>
//                         <p style={{ color:'#8A9BBE', fontSize:'15px', margin:0, textAlign:'center' }}>
//                             {search ? 'No follow-up found in search results' : 'No follow-ups yet for this case'}
//                         </p>
//                         {!search && (
//                             <button onClick={onAdd} className="fu-add" style={{
//                                 background:'#D4A843', color:'#1B2A4A', border:'none',
//                                 borderRadius:'10px', padding:'10px 24px',
//                                 fontSize:'13px', fontWeight:700, cursor:'pointer',
//                                 transition:'all 0.2s', boxShadow:'0 2px 8px rgba(212,168,67,0.25)',
//                             }}>+ Add First FollowUp</button>
//                         )}
//                     </div>
//                 ) : (
//                     <>
//                         {/* ── DESKTOP TABLE ── */}
//                         <div className="fu-table-wrap" style={{ overflowX:'auto' }}>
//                             <table style={{ width:'100%', borderCollapse:'collapse' }}>
//                                 <thead>
//                                     <tr style={{ background:'linear-gradient(135deg,#1B2A4A 0%,#243560 100%)' }}>
//                                         {['#','Hearing Date','Next Hearing','Interim Order','Decision','Remarks','Actions'].map((h,i) => (
//                                             <th key={i} style={{
//                                                 padding: i===0 ? '14px 16px 14px 20px' : '14px 16px',
//                                                 textAlign:'left', fontSize:'11px', fontWeight:700,
//                                                 letterSpacing:'0.08em', color:'#D4A843',
//                                                 textTransform:'uppercase', whiteSpace:'nowrap',
//                                                 borderBottom:'2px solid #D4A843',
//                                             }}>{h}</th>
//                                         ))}
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {filtered.map((f, i) => {
//                                         const st = getStatus(f.hearingDate, f.nextHearingDate)
//                                         return (
//                                             <tr key={f.id} className="fu-row" style={{
//                                                 background: i%2===0 ? '#FDFCF9' : '#fff',
//                                                 borderBottom:'1px solid #F0EBE0',
//                                                 animationDelay:`${i*0.04}s`,
//                                             }}>
//                                                 {/* # */}
//                                                 <td style={{ padding:'14px 16px 14px 20px' }}>
//                                                     <div style={{
//                                                         width:'28px', height:'28px', borderRadius:'8px',
//                                                         background:'linear-gradient(135deg,#EDE5CF,#E0D4B8)',
//                                                         display:'flex', alignItems:'center', justifyContent:'center',
//                                                         fontSize:'12px', fontWeight:700, color:'#8A7040',
//                                                     }}>
//                                                         {(pageNumber-1)*pageSize + i + 1}
//                                                     </div>
//                                                 </td>

//                                                 {/* Hearing Date */}
//                                                 <td style={{ padding:'14px 16px' }}>
//                                                     <span style={{
//                                                         display:'inline-flex', alignItems:'center', gap:'5px',
//                                                         padding:'4px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:600,
//                                                         background:st.bg, color:st.color, border:`1px solid ${st.border}`,
//                                                     }}>
//                                                         {fmtDate(f.hearingDate)}
//                                                     </span>
//                                                     <div style={{ fontSize:'10px', color:'#A0ABBE', marginTop:'3px' }}>{st.text}</div>
//                                                 </td>

//                                                 {/* Next Hearing */}
//                                                 <td style={{ padding:'14px 16px' }}>
//                                                     <span style={{ fontSize:'13px', color: f.nextHearingDate ? '#64748B' : '#C0CADB' }}>
//                                                         {fmtDate(f.nextHearingDate)}
//                                                     </span>
//                                                 </td>

//                                                 {/* Interim Order */}
//                                                 <td style={{ padding:'14px 16px', maxWidth:'140px' }}>
//                                                     <span style={{
//                                                         fontSize:'12px', color: f.interimOrder ? '#4A5568' : '#C0CADB',
//                                                         display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
//                                                     }}>
//                                                         {f.interimOrder ?? '—'}
//                                                     </span>
//                                                 </td>

//                                                 {/* Decision */}
//                                                 <td style={{ padding:'14px 16px', maxWidth:'140px' }}>
//                                                     <span style={{
//                                                         fontSize:'12px', color: f.decision ? '#4A5568' : '#C0CADB',
//                                                         display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
//                                                     }}>
//                                                         {f.decision ?? '—'}
//                                                     </span>
//                                                 </td>

//                                                 {/* Remarks */}
//                                                 <td style={{ padding:'14px 16px', maxWidth:'120px' }}>
//                                                     <span style={{
//                                                         fontSize:'12px', color: f.remarks ? '#64748B' : '#C0CADB',
//                                                         display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
//                                                     }}>
//                                                         {f.remarks ?? '—'}
//                                                     </span>
//                                                 </td>

//                                                 {/* Actions */}
//                                                 <td style={{ padding:'14px 16px' }}>
//                                                     <div style={{ display:'flex', gap:'6px' }}>
//                                                         <button className="fu-act fu-edit" onClick={() => onEdit(f)} style={{
//                                                             background:'#EEF2FF', color:'#1B2A4A',
//                                                             border:'1px solid #C7D2FE', borderRadius:'8px',
//                                                             padding:'6px 12px', fontSize:'12px', fontWeight:600,
//                                                             cursor:'pointer', transition:'all 0.2s',
//                                                         }}>✏️ Edit</button>
//                                                         <button className="fu-act fu-del" onClick={() => deleteFollowUp(f.id)} disabled={isDeleting} style={{
//                                                             background:'#FEF2F2', color:'#DC2626',
//                                                             border:'1px solid #FECACA', borderRadius:'8px',
//                                                             padding:'6px 12px', fontSize:'12px', fontWeight:600,
//                                                             cursor:'pointer', transition:'all 0.2s',
//                                                         }}>🗑️ Delete</button>
//                                                     </div>
//                                                 </td>
//                                             </tr>
//                                         )
//                                     })}
//                                 </tbody>
//                             </table>
//                         </div>

//                         {/* ── MOBILE CARDS ── */}
//                         <div className="fu-cards-wrap">
//                             {filtered.map((f, i) => {
//                                 const st = getStatus(f.hearingDate, f.nextHearingDate)
//                                 return (
//                                     <div key={f.id} style={{
//                                         background:'#fff', borderRadius:'12px',
//                                         border:'1px solid #EEE9DC',
//                                         boxShadow:'0 2px 12px rgba(27,42,74,0.06)',
//                                         overflow:'hidden',
//                                         animation:`fadeInUp 0.3s ease ${i*0.04}s both`,
//                                     }}>
//                                         {/* Card Header */}
//                                         <div style={{
//                                             background:'linear-gradient(135deg,#1B2A4A,#243560)',
//                                             padding:'12px 16px',
//                                             display:'flex', alignItems:'center', justifyContent:'space-between',
//                                         }}>
//                                             <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
//                                                 <div style={{
//                                                     width:'24px', height:'24px', borderRadius:'6px',
//                                                     background:'linear-gradient(135deg,#EDE5CF,#E0D4B8)',
//                                                     display:'flex', alignItems:'center', justifyContent:'center',
//                                                     fontSize:'10px', fontWeight:700, color:'#8A7040',
//                                                 }}>{(pageNumber-1)*pageSize + i + 1}</div>
//                                                 <span style={{ color:'#D4A843', fontSize:'12px', fontWeight:600 }}>
//                                                     FollowUp Record
//                                                 </span>
//                                             </div>
//                                             <span style={{
//                                                 padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:600,
//                                                 background:st.bg, color:st.color, border:`1px solid ${st.border}`,
//                                             }}>{st.text}</span>
//                                         </div>

//                                         {/* Card Body */}
//                                         <div style={{ padding:'14px 16px', display:'flex', flexDirection:'column', gap:'10px' }}>

//                                             {/* Dates row */}
//                                             <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
//                                                 <CardField label="Hearing Date" value={fmtDate(f.hearingDate)} highlight />
//                                                 <CardField label="Next Hearing"  value={fmtDate(f.nextHearingDate)} />
//                                             </div>

//                                             {f.interimOrder && <CardField label="Interim Order" value={f.interimOrder} />}
//                                             {f.decision     && <CardField label="Decision"      value={f.decision} />}
//                                             {f.remarks      && <CardField label="Remarks"       value={f.remarks} muted />}

//                                             {/* Action buttons */}
//                                             <div style={{ display:'flex', gap:'8px', paddingTop:'4px', borderTop:'1px solid #F0EBE0' }}>
//                                                 <button onClick={() => onEdit(f)} style={{
//                                                     flex:1, padding:'8px',
//                                                     background:'#EEF2FF', color:'#1B2A4A',
//                                                     border:'1px solid #C7D2FE', borderRadius:'8px',
//                                                     fontSize:'12px', fontWeight:600, cursor:'pointer',
//                                                     transition:'all 0.2s',
//                                                 }}>✏️ Edit</button>
//                                                 <button onClick={() => deleteFollowUp(f.id)} disabled={isDeleting} style={{
//                                                     flex:1, padding:'8px',
//                                                     background:'#FEF2F2', color:'#DC2626',
//                                                     border:'1px solid #FECACA', borderRadius:'8px',
//                                                     fontSize:'12px', fontWeight:600, cursor:'pointer',
//                                                     transition:'all 0.2s',
//                                                 }}>🗑️ Delete</button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 )
//                             })}
//                         </div>

//                         {/* ── Pagination Footer ── */}
//                         <div className="pg-footer" style={{
//                             background:'linear-gradient(135deg,#FDFCF9,#F8F4EC)',
//                             borderTop:'1px solid #EEE9DC',
//                         }}>
//                             {/* Left: count + per page */}
//                             <div style={{ display:'flex', alignItems:'center', gap:'12px', flexWrap:'wrap' }}>
//                                 <span style={{ fontSize:'12px', color:'#64748B' }}>
//                                     Showing{' '}
//                                     <strong style={{ color:'#1B2A4A' }}>{(pageNumber-1)*pageSize+1}</strong>
//                                     {' '}–{' '}
//                                     <strong style={{ color:'#1B2A4A' }}>{Math.min(pageNumber*pageSize, totalCount)}</strong>
//                                     {' '}of{' '}
//                                     <strong style={{ color:'#D4A843' }}>{totalCount}</strong>
//                                 </span>
//                                 <div style={{ display:'flex', alignItems:'center', gap:'5px' }}>
//                                     <span style={{ fontSize:'11px', color:'#A0ABBE' }}>Per page:</span>
//                                     <select
//                                         className="sz-sel"
//                                         value={pageSize}
//                                         onChange={e => handlePageSizeChange(Number(e.target.value))}
//                                         style={{
//                                             padding:'4px 8px', border:'1.5px solid #E2DECE',
//                                             borderRadius:'7px', fontSize:'12px', color:'#1B2A4A',
//                                             background:'#fff', cursor:'pointer', fontFamily:'inherit',
//                                         }}
//                                     >
//                                         {PAGE_SIZE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
//                                     </select>
//                                 </div>
//                             </div>

//                             {/* Right: page buttons */}
//                             <div style={{ display:'flex', alignItems:'center', gap:'5px' }}>
//                                 <button className="pg-btn" onClick={() => setPageNumber(p=>p-1)}
//                                     disabled={!hasPrevious || isFetching}
//                                     style={{
//                                         padding:'6px 12px', border:'1.5px solid #E2DECE',
//                                         borderRadius:'8px', background:'#fff', color:'#1B2A4A',
//                                         fontSize:'12px', fontWeight:600, cursor:'pointer',
//                                         transition:'all 0.2s', display:'flex', alignItems:'center', gap:'3px',
//                                     }}>← Prev</button>

//                                 <div style={{ display:'flex', gap:'3px' }}>
//                                     {getPageNumbers(pageNumber, totalPages).map((p, i) =>
//                                         p === '...' ? (
//                                             <span key={`e${i}`} className="pg-num-hide-sm"
//                                                 style={{ padding:'6px 3px', fontSize:'12px', color:'#A0ABBE' }}>…</span>
//                                         ) : (
//                                             <button key={p}
//                                                 className={`pg-num pg-num-hide-sm ${pageNumber===p?'active':''}`}
//                                                 onClick={() => setPageNumber(Number(p))}
//                                                 disabled={isFetching}
//                                                 style={{
//                                                     width:'30px', height:'30px',
//                                                     border:'1.5px solid #E2DECE', borderRadius:'7px',
//                                                     background: pageNumber===p ? '#D4A843' : '#fff',
//                                                     color: pageNumber===p ? '#1B2A4A' : '#64748B',
//                                                     fontSize:'12px', cursor:'pointer', transition:'all 0.2s',
//                                                 }}
//                                             >{p}</button>
//                                         )
//                                     )}
//                                 </div>

//                                 <button className="pg-btn" onClick={() => setPageNumber(p=>p+1)}
//                                     disabled={!hasNext || isFetching}
//                                     style={{
//                                         padding:'6px 12px', border:'1.5px solid #E2DECE',
//                                         borderRadius:'8px', background:'#fff', color:'#1B2A4A',
//                                         fontSize:'12px', fontWeight:600, cursor:'pointer',
//                                         transition:'all 0.2s', display:'flex', alignItems:'center', gap:'3px',
//                                     }}>Next →</button>
//                             </div>
//                         </div>
//                     </>
//                 )}
//             </div>
//         </div>
//     )
// }

// // ── Card Field Helper ────────────────────────────────────────
// const CardField = ({
//     label, value, highlight, muted,
// }: { label: string; value: string; highlight?: boolean; muted?: boolean }) => (
//     <div>
//         <p style={{ margin:'0 0 2px', fontSize:'10px', fontWeight:700, color:'#A0ABBE', textTransform:'uppercase', letterSpacing:'0.06em' }}>
//             {label}
//         </p>
//         <p style={{ margin:0, fontSize:'13px', fontWeight: highlight ? 600 : 400, color: muted ? '#94A3B8' : '#1B2A4A' }}>
//             {value}
//         </p>
//     </div>
// )

// // ── Page Header ──────────────────────────────────────────────
// const PageHeader = ({
//     totalCount, search, onSearchChange, onAdd,
// }: {
//     totalCount: number
//     search: string
//     onSearchChange: (v: string) => void
//     onAdd: () => void
// }) => (
//     <div style={{ marginBottom:'24px' }}>
//         <div style={{
//             display:'flex', justifyContent:'space-between',
//             alignItems:'flex-start', marginBottom:'16px',
//             gap:'12px', flexWrap:'wrap',
//         }}>
//             <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
//                 <div style={{
//                     width:'44px', height:'44px', borderRadius:'12px',
//                     background:'linear-gradient(135deg,#1B2A4A,#2A3F70)',
//                     display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px',
//                 }}>📋</div>
//                 <div>
//                     <h5 style={{ margin:0, fontSize:'20px', fontWeight:700, color:'#1B2A4A' }}>
//                         Follow-Ups
//                     </h5>
//                     <p style={{ margin:0, fontSize:'13px', color:'#8A9BBE' }}>
//                         {totalCount} follow-up{totalCount!==1?'s':''} recorded
//                     </p>
//                 </div>
//             </div>
//             <button onClick={onAdd} className="fu-add" style={{
//                 background:'#D4A843', color:'#1B2A4A', border:'none',
//                 borderRadius:'10px', padding:'11px 20px', fontSize:'13px',
//                 fontWeight:700, cursor:'pointer',
//                 display:'flex', alignItems:'center', gap:'6px',
//                 transition:'all 0.2s', boxShadow:'0 2px 8px rgba(212,168,67,0.3)',
//                 flexShrink:0,
//             }}>
//                 <span style={{ fontSize:'16px' }}>+</span> Add FollowUp
//             </button>
//         </div>

//         {/* Search */}
//         <div style={{ position:'relative' }}>
//             <span style={{
//                 position:'absolute', left:'12px', top:'50%',
//                 transform:'translateY(-50%)', fontSize:'15px', pointerEvents:'none',
//             }}>🔍</span>
//             <input
//                 className="fu-srch"
//                 value={search}
//                 onChange={e => onSearchChange(e.target.value)}
//                 placeholder="Search by interim order, decision, remarks..."
//                 style={{
//                     width:'100%', padding:'10px 12px 10px 36px',
//                     border:'1.5px solid #E2DECE', borderRadius:'10px',
//                     fontSize:'13px', color:'#1B2A4A', background:'#FDFCF9',
//                     outline:'none', transition:'all 0.2s',
//                     boxSizing:'border-box', fontFamily:'inherit',
//                 }}
//             />
//         </div>
//     </div>
// )

// export default FollowUpList
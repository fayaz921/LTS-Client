import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useUploadDocument } from '../hooks/useDocuments'

// ─────────────────────────────────────────────────────────────
// UploadDocumentModal — Themed to match LTS design
// ─────────────────────────────────────────────────────────────

const schema = z.object({
    fileName: z.string().optional(),
    remarks: z.string().optional(),
    file: z.instanceof(File, { message: 'Please select a file' }),
})

type FormData = z.infer<typeof schema>

interface Props {
    caseId: string
    onClose: () => void
}

const UploadDocumentModal = ({ caseId, onClose }: Props) => {
    const { mutate: upload, isPending } = useUploadDocument(caseId)

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    })

    const onSubmit = (data: FormData) => {
        upload(
            {
                caseId,
                file: data.file,
                fileName: data.fileName,
                remarks: data.remarks,
            },
            { onSuccess: () => onClose() }
        )
    }

    const inputStyle = {
        width: '100%', padding: '10px 13px',
        border: '1.5px solid #E2DECE', borderRadius: '10px',
        fontSize: '13px', color: '#1B2A4A', background: '#FDFCF9',
        outline: 'none', transition: 'all 0.2s ease',
        boxSizing: 'border-box' as const, fontFamily: 'inherit',
    }

    return (
        <div
            style={{
                position: 'fixed', inset: 0, zIndex: 1000,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '22px',
                background: 'rgba(27,42,74,0.76)',
                backdropFilter: 'blur(10px)',
                animation: 'lts-overlay-fade 0.22s ease both',
            }}
            onClick={onClose}
        >
            <style>{`
                @keyframes lts-overlay-fade { from { opacity: 0; } to { opacity: 1; } }
                @keyframes lts-modal-scale-in {
                    from { opacity: 0; transform: scale(0.96) translateY(12px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .upload-input:focus { border-color: #D4A843 !important; box-shadow: 0 0 0 3px rgba(212,168,67,0.1) !important; }
                .upload-submit:hover:not(:disabled) { background: #C49830 !important; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(212,168,67,0.35) !important; }
                .upload-cancel:hover { border-color: #1B2A4A !important; color: #1B2A4A !important; background: #F8F6F0 !important; }
                .upload-close:hover { border-color: rgba(220,38,38,0.3) !important; background: rgba(220,38,38,0.06) !important; color: #DC2626 !important; }
            `}</style>
            <div
                style={{
                    width: 'min(100%, 500px)',
                    borderRadius: '16px', overflow: 'hidden',
                    background: '#fff',
                    border: '1px solid rgba(255,255,255,0.7)',
                    boxShadow: '0 24px 60px rgba(27,42,74,0.24)',
                    animation: 'lts-modal-scale-in 0.28s ease both',
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    gap: '16px', padding: '20px 24px',
                    borderBottom: '1px solid #EEE9DC',
                    background: 'linear-gradient(135deg,#FDFCF9 0%,#F8F4EC 100%)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: '36px', height: '36px', borderRadius: '10px',
                            background: 'linear-gradient(135deg,#1B2A4A 0%,#2A3F70 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '16px',
                        }}>📁</div>
                        <h2 style={{ margin: 0, color: '#1B2A4A', fontSize: '18px', fontWeight: 800 }}>
                            Upload Document
                        </h2>
                    </div>
                    <button
                        className="upload-close"
                        onClick={onClose}
                        style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: '34px', height: '34px',
                            border: '1px solid #E2DECE', borderRadius: '8px',
                            background: '#fff', color: '#64748B', cursor: 'pointer',
                            fontSize: '13px', transition: 'all 0.2s ease',
                        }}
                    >
                        ✕
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '24px' }}>
                    {/* File Input */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: '#1B2A4A', marginBottom: '6px', display: 'block' }}>
                            File <span style={{ color: '#DC2626' }}>*</span>
                        </label>
                        <input
                            type="file"
                            className="upload-input"
                            style={inputStyle}
                            onChange={e => {
                                const file = e.target.files?.[0]
                                if (file) setValue('file', file)
                            }}
                        />
                        {errors.file && (
                            <small style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                                {errors.file.message}
                            </small>
                        )}
                    </div>

                    {/* File Name */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: '#1B2A4A', marginBottom: '6px', display: 'block' }}>
                            File Name (Optional)
                        </label>
                        <input
                            type="text"
                            className="upload-input"
                            placeholder="Custom file name..."
                            style={inputStyle}
                            {...register('fileName')}
                        />
                    </div>

                    {/* Remarks */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: '#1B2A4A', marginBottom: '6px', display: 'block' }}>
                            Remarks (Optional)
                        </label>
                        <textarea
                            className="upload-input"
                            placeholder="Add a note..."
                            rows={3}
                            style={{ ...inputStyle, resize: 'none' as const, minHeight: '80px' }}
                            {...register('remarks')}
                        />
                    </div>

                    {/* Footer Buttons */}
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                        gap: '10px', paddingTop: '16px', borderTop: '1px solid #EEE9DC',
                    }}>
                        <button
                            type="button"
                            className="upload-cancel"
                            onClick={onClose}
                            disabled={isPending}
                            style={{
                                padding: '10px 20px', border: '1.5px solid #E2DECE',
                                borderRadius: '10px', background: '#fff',
                                color: '#64748B', fontSize: '13px', fontWeight: 600,
                                cursor: 'pointer', transition: 'all 0.2s ease', fontFamily: 'inherit',
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="upload-submit"
                            disabled={isPending}
                            style={{
                                background: '#D4A843', color: '#1B2A4A', border: 'none',
                                borderRadius: '10px', padding: '10px 24px', fontSize: '13px',
                                fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s ease',
                                boxShadow: '0 2px 8px rgba(212,168,67,0.25)',
                                display: 'flex', alignItems: 'center', gap: '6px',
                                fontFamily: 'inherit',
                            }}
                        >
                            {isPending ? (
                                <>
                                    <div style={{
                                        width: '14px', height: '14px', borderRadius: '50%',
                                        border: '2px solid rgba(27,42,74,0.2)',
                                        borderTop: '2px solid #1B2A4A',
                                        animation: 'spin 0.6s linear infinite',
                                    }} />
                                    Uploading...
                                </>
                            ) : 'Upload'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UploadDocumentModal
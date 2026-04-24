import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useUploadDocument } from '../hooks/useDocuments'

const schema = z.object({
    fileName: z.string().optional(),
    remarks: z.string().optional(),
    file: z.instanceof(File, { message: 'File select karein' }),
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
                        Upload Document
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

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)}>

                    {/* File */}
                    <div className="mb-3">
                        <label style={{ fontSize: '13px', fontWeight: 600, color: '#1B2A4A' }}>
                            File <span style={{ color: '#DC2626' }}>*</span>
                        </label>
                        <input
                            type="file"
                            className="form-control mt-1"
                            style={{ fontSize: '13px' }}
                            onChange={e => {
                                const file = e.target.files?.[0]
                                if (file) setValue('file', file)
                            }}
                        />
                        {errors.file && (
                            <small style={{ color: '#DC2626' }}>{errors.file.message}</small>
                        )}
                    </div>

                    {/* File Name */}
                    <div className="mb-3">
                        <label style={{ fontSize: '13px', fontWeight: 600, color: '#1B2A4A' }}>
                            File Name (Optional)
                        </label>
                        <input
                            type="text"
                            className="form-control mt-1"
                            placeholder="Custom file name..."
                            style={{ fontSize: '13px' }}
                            {...register('fileName')}
                        />
                    </div>

                    {/* Remarks */}
                    <div className="mb-4">
                        <label style={{ fontSize: '13px', fontWeight: 600, color: '#1B2A4A' }}>
                            Remarks (Optional)
                        </label>
                        <textarea
                            className="form-control mt-1"
                            placeholder="Koi note likhein..."
                            rows={3}
                            style={{ fontSize: '13px', resize: 'none' }}
                            {...register('remarks')}
                        />
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
                            {isPending ? 'Uploading...' : 'Upload'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UploadDocumentModal
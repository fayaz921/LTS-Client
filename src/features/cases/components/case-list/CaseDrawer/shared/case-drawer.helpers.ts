// ── Shared helpers for CaseDrawer tabs ───────────────────────

export const fmtDate = (iso?: string | null) =>
    iso
        ? new Date(iso).toLocaleDateString('en-PK', {
            day: '2-digit', month: 'short', year: 'numeric',
        })
        : '—'

export const getHearingStatus = (hearingDate: string, nextHearingDate?: string | null) => {
    const today = new Date()
    const hearing = new Date(hearingDate)
    if (hearing < today) return { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA', text: 'Past' }
    if (nextHearingDate) return { bg: '#FEF3C7', color: '#D97706', border: '#FDE68A', text: 'Adjourned' }
    return { bg: '#F0FDF4', color: '#15803D', border: '#BBF7D0', text: 'Scheduled' }
}

export const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄'
    if (fileType.includes('image')) return '🖼️'
    if (fileType.includes('word') || fileType.includes('doc')) return '📝'
    if (fileType.includes('excel') || fileType.includes('sheet')) return '📊'
    return '📎'
}

export const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
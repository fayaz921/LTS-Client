export const formatDate = (date: string | Date | null | undefined): string => {
    if (!date) return '—'
    return new Date(date).toLocaleDateString('en-PK', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    })
}

export const formatDateTime = (date: string | Date | null | undefined): string => {
    if (!date) return '—'
    return new Date(date).toLocaleString('en-PK', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

export const formatHearingDate = (date: string | Date | null | undefined): string => {
    if (!date) return 'No hearing scheduled'
    const d = new Date(date)
    const today = new Date()
    const diffDays = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return `${formatDate(date)} (Past)`
    if (diffDays === 0) return `Today — ${formatDate(date)}`
    if (diffDays <= 3) return `${diffDays} days — ${formatDate(date)} ⚠`
    if (diffDays <= 7) return `${diffDays} days — ${formatDate(date)}`
    return formatDate(date)
}
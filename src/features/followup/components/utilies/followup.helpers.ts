export const PAGE_SIZE_OPTIONS = [5, 10, 25, 50];

export const fmtDate = (iso?: string | null): string => {
    return iso
        ? new Date(iso).toLocaleDateString('en-PK', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })
        : '—';
};

export interface StatusStyle {
    bg: string;
    color: string;
    border: string;
    text: string;
}

export const getStatus = (hearingDate: string, nextHearingDate?: string | null): StatusStyle => {
    const today = new Date();
    const hearing = new Date(hearingDate);
    if (hearing < today) return { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA', text: 'Past' };
    if (nextHearingDate) return { bg: '#FEF3C7', color: '#D97706', border: '#FDE68A', text: 'Adjourned' };
    return { bg: '#F0FDF4', color: '#15803D', border: '#BBF7D0', text: 'Scheduled' };
};

export const getPageNumbers = (current: number, total: number): (number | string)[] => {
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | string)[] = [];
    if (current <= 3) pages.push(1, 2, 3, 4, '...', total);
    else if (current >= total - 2) pages.push(1, '...', total - 3, total - 2, total - 1, total);
    else pages.push(1, '...', current - 1, current, current + 1, '...', total);
    return pages;
};
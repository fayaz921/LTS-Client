import { useState } from 'react';

type ModalState =
    | { mode: 'closed' }
    | { mode: 'details'; caseId: string }
    | { mode: 'edit'; caseId: string };

export function useCaseModal() {
    const [modal, setModal] = useState<ModalState>({ mode: 'closed' });

    return {
        modal,
        openDetails: (id: string) => setModal({ mode: 'details', caseId: id }),
        openEdit: (id: string) => setModal({ mode: 'edit', caseId: id }),
        switchToEdit: (id: string) => setModal({ mode: 'edit', caseId: id }),
        backToDetails: (id: string) => setModal({ mode: 'details', caseId: id }),
        close: () => setModal({ mode: 'closed' }),
    };
}
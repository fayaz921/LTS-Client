import { useState, useEffect } from 'react'
import type { CaseDto } from '../../../types/case.types'
import FollowUpsTab from './tabs/FollowUpsTab'
import DocumentsTab from './tabs/DocumentsTab'
import '../../../styles/case-drawer.css'

type DrawerTab = 'followups' | 'documents'

interface Props {
    caseItem: CaseDto
    defaultTab?: DrawerTab
    onClose: () => void
}

export default function CaseDrawer({ caseItem, defaultTab = 'followups', onClose }: Props) {
    const [activeTab, setActiveTab] = useState<DrawerTab>(defaultTab)
    const [visible, setVisible] = useState(false)

    // Smooth open animation
    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 10)
        return () => clearTimeout(t)
    }, [])

    const handleClose = () => {
        setVisible(false)
        setTimeout(onClose, 300)
    }

    // ESC key se close
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [])

    return (
        <>
            {/* Overlay */}
            <div
                className={`cdr__overlay ${visible ? 'cdr__overlay--visible' : ''}`}
                onClick={handleClose}
            />

            {/* Drawer Panel */}
            <div className={`cdr__panel ${visible ? 'cdr__panel--open' : ''}`}>

                {/* HEADER */}
                <div className="cdr__header">
                    <div className="cdr__header-left">
                        <div className="cdr__header-icon">📋</div>
                        <div>
                            <div className="cdr__header-title">{caseItem.title}</div>
                            <div className="cdr__header-sub">
                                <span className="cdr__case-no">{caseItem.caseNo}</span>
                                <span className="cdr__dot">·</span>
                                <span>{caseItem.courtName}</span>
                            </div>
                        </div>
                    </div>
                    <button className="cdr__close-btn" onClick={handleClose} title="Close (Esc)">
                        <i className="bi bi-x-lg" />
                    </button>
                </div>

                {/* TABS */}
                <div className="cdr__tabs">
                    <button
                        className={`cdr__tab ${activeTab === 'followups' ? 'cdr__tab--active' : ''}`}
                        onClick={() => setActiveTab('followups')}
                    >
                        <i className="bi bi-calendar-check" /> Follow-ups
                    </button>
                    <button
                        className={`cdr__tab ${activeTab === 'documents' ? 'cdr__tab--active' : ''}`}
                        onClick={() => setActiveTab('documents')}
                    >
                        <i className="bi bi-file-earmark-text" /> Documents
                    </button>
                </div>

                {/* CONTENT */}
                <div className="cdr__body">
                    {activeTab === 'followups' && <FollowUpsTab caseId={caseItem.id} />}
                    {activeTab === 'documents' && <DocumentsTab caseId={caseItem.id} />}
                </div>

            </div>
        </>
    )
}
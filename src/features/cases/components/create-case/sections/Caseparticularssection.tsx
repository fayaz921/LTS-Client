interface CaseParticularsSectionProps {
    title: string
    setTitle: (v: string) => void
    titleError?: string

    subject: string
    setSubject: (v: string) => void
    subjectError?: string

    detail: string
    setDetail: (v: string) => void
    detailError?: string
}

const MAX_DETAIL = 2000;

export default function CaseParticularsSection({
    title, setTitle, titleError,
    subject, setSubject, subjectError,
    detail, setDetail, detailError,
}: CaseParticularsSectionProps) {
    return (
        <div className="ccm__section">
            <div className="ccm__section-header">
                <div className="ccm__section-badge">III</div>
                <div className="ccm__section-title">CASE PARTICULARS</div>
            </div>
            <div className="ccm__section-body">

                <div className="ccm__field">
                    <label className="ccm__label">
                        Case Title <span className="ccm__required">*</span>
                    </label>
                    <input
                        type="text"
                        className={`ccm__input ${titleError ? 'ccm__input--error' : ''}`}
                        placeholder="e.g. Muhammad Ali Khan vs. Province of KPK"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    {titleError && <div className="ccm__field-error">{titleError}</div>}
                </div>

                <div className="ccm__field">
                    <label className="ccm__label">
                        Subject Matter <span className="ccm__required">*</span>
                    </label>
                    <input
                        type="text"
                        className={`ccm__input ${subjectError ? 'ccm__input--error' : ''}`}
                        placeholder="e.g. Wrongful termination / Property dispute"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    />
                    {subjectError && <div className="ccm__field-error">{subjectError}</div>}
                </div>

                <div className="ccm__field">
                    <label className="ccm__label">
                        Case Detail &amp; Background <span className="ccm__required">*</span>
                    </label>
                    <textarea
                        className={`ccm__textarea ${detailError ? 'ccm__input--error' : ''}`}
                        placeholder="Describe the facts, legal grounds, and reliefs sought..."
                        rows={4}
                        maxLength={MAX_DETAIL}
                        value={detail}
                        onChange={(e) => setDetail(e.target.value)}
                    />
                    <div className="ccm__char-count">{detail.length} / {MAX_DETAIL}</div>
                    {detailError && <div className="ccm__field-error">{detailError}</div>}
                </div>

            </div>
        </div>
    );
}
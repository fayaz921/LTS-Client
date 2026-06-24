interface DateSectionProps {
    selectedDate: string
    setSelectedDate: (v: string) => void
    dateError?: string
}

export default function DateSection({ selectedDate, setSelectedDate, dateError }: DateSectionProps) {

    const today = new Date().toISOString().split('T')[0]

    return (
        <div className="ccm__section">
            <div className="ccm__section-header">
                <div className="ccm__section-badge">IV</div>
                <div className="ccm__section-title">DATE OF INSTITUTION</div>
            </div>
            <div className="ccm__section-body">
                <div className="row g-3">

                    <div className="col-md-4">
                        <label className="ccm__label">
                            Date Instituted <span className="ccm__required">*</span>
                        </label>
                        <input
                            type="date"
                            className={`ccm__input ${dateError ? 'ccm__input--error' : ''}`}
                            value={selectedDate}
                            max={today}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                        {dateError && <div className="ccm__field-error">{dateError}</div>}
                    </div>

                    <div className="col-md-8">
                        <label className="ccm__label">Full Date Reference</label>
                        <div className="ccm__date-display">
                            <i className="bi bi-calendar3 me-2 text-muted" />
                            {selectedDate
                                ? new Date(selectedDate).toLocaleDateString('en-US', {
                                    weekday: 'long', year: 'numeric',
                                    month: 'long', day: 'numeric',
                                })
                                : 'Select a date above'}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
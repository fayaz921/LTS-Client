interface DropdownFieldProps {
    id: string
    label: string
    required?: boolean
    value: string
    onChange: (v: string) => void
    onFocus: () => void
    onRefresh: () => void
    isLoading: boolean
    isError: boolean
    enabled: boolean
    items: { id: string; label: string }[]
    placeholder: string
    emptyMsg: string
    errorMsg: string
    validationError?: string
}

export default function DropdownField({
    id, label, required,
    value, onChange, onFocus, onRefresh,
    isLoading, isError, enabled,
    items, placeholder, emptyMsg, errorMsg,
    validationError,
}: DropdownFieldProps) {
    return (
        <div>
            <label className="ccm__label" htmlFor={id}>
                {label} {required && <span className="ccm__required">*</span>}
            </label>

            <div className="ccm__select-wrapper">
                <select
                    id={id}
                    className={`ccm__select ${validationError ? 'ccm__input--error' : ''}`}
                    value={value}
                    onFocus={onFocus}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <option>Loading…</option>
                    ) : isError ? (
                        <option>Error — refresh it</option>
                    ) : items.length === 0 && enabled ? (
                        <option disabled value="">{emptyMsg}</option>
                    ) : (
                        <>
                            <option value="">{placeholder}</option>
                            {items.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.label}
                                </option>
                            ))}
                        </>
                    )}
                </select>

                <button
                    type="button"
                    className={`ccm__refresh-btn ${isLoading ? 'ccm__refresh-btn--spinning' : ''}`}
                    onClick={onRefresh}
                    title="Refresh"
                    disabled={isLoading}
                >
                    <i className="bi bi-arrow-clockwise" />
                </button>
            </div>

            {validationError && (
                <div className="ccm__field-error">{validationError}</div>
            )}

            {isError && !isLoading && (
                <div className="ccm__select-error">
                    <i className="bi bi-exclamation-triangle me-1" />
                    {errorMsg}
                </div>
            )}
        </div>
    );
}
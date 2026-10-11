import type { KeyboardEvent } from 'react';

interface EmailSectionProps {
    emailInput: string;
    setEmailInput: (v: string) => void;
    emailTags: string[];
    setEmailTags: (tags: string[]) => void;
}

export default function EmailSection({
    emailInput, setEmailInput,
    emailTags, setEmailTags,
}: EmailSectionProps) {

    const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

    const addEmailTag = () => {
        const trimmed = emailInput.trim();
        if (!trimmed || !isValidEmail(trimmed) || emailTags.includes(trimmed)) return;
        setEmailTags([...emailTags, trimmed]);
        setEmailInput('');
    };

    const handleEmailKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addEmailTag();
        }
        if (e.key === 'Backspace' && emailInput === '' && emailTags.length > 0) {
            setEmailTags(emailTags.slice(0, -1));
        }
    };

    const removeEmailTag = (tag: string) => {
        setEmailTags(emailTags.filter(t => t !== tag));
    };

    return (
        <div className="ccm__section">
            <div className="ccm__section-header">
                <div className="ccm__section-badge">V</div>
                <div className="ccm__section-title">EMAIL NOTIFICATION LIST</div>
            </div>
            <div className="ccm__section-body">
                <label className="ccm__label">Notify Recipients</label>

                <div
                    className="ccm__tag-input"
                    onClick={() => document.getElementById('ccm-email-input')?.focus()}
                >
                    {emailTags.map((tag) => (
                        <span key={tag} className="ccm__email-tag">
                            <i className="bi bi-envelope-fill me-1" style={{ fontSize: '10px' }} />
                            {tag}
                            <button
                                type="button"
                                className="ccm__email-tag-remove"
                                onClick={(e) => { e.stopPropagation(); removeEmailTag(tag); }}
                                title="Remove"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                    <input
                        id="ccm-email-input"
                        type="email"
                        className="ccm__tag-input-field"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        onKeyDown={handleEmailKeyDown}
                        onBlur={addEmailTag}
                        placeholder={emailTags.length === 0 ? 'Type email and press Enter or comma…' : ''}
                    />
                </div>

                {emailInput && !isValidEmail(emailInput) && (
                    <div className="ccm__email-invalid">
                        <i className="bi bi-exclamation-circle me-1" />
                        Valid email address درج کریں
                    </div>
                )}

                <small className="ccm__notify-hint">
                    <i className="bi bi-info-circle me-1" />
                    Enter dabao ya comma lagao tag banane ke liye · Backspace se last tag hata sakte hain
                </small>
            </div>
        </div>
    );
}
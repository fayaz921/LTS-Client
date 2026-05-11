import { useState, useEffect } from "react";
import type { CourtDto, CourtFormValues, CourtFormErrors } from "../types/Court.types";

// ─── Props ────────────────────────────────────────────────────────────────────
interface CourtFormProps {
  initial?: CourtDto | null;
  isEdit?: boolean;
  loading: boolean;
  onSubmit: (values: CourtFormValues) => Promise<void>;
  onCancel: () => void;
}

// ─── Validation — FluentValidation rules mirror ───────────────────────────────
function validate(values: CourtFormValues): CourtFormErrors {
  const errors: CourtFormErrors = {};
  if (!values.courtName.trim()) {
    errors.courtName = "Court name is required";
  } else if (values.courtName.length > 100) {
    errors.courtName = "Maximum 100 characters allowed";
  }
  if (values.addressContact && values.addressContact.length > 500) {
    errors.addressContact = "Maximum 500 characters allowed";
  }
  return errors;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function CourtForm({
  initial,
  isEdit,
  loading,
  onSubmit,
  onCancel,
}: CourtFormProps) {
  const [values, setValues] = useState<CourtFormValues>({
    courtName: initial?.courtName ?? "",
    addressContact: initial?.addressContact ?? "",
    isActive: initial?.isActive ?? true,
  });
  const [errors, setErrors] = useState<CourtFormErrors>({});
  const [touched, setTouched] = useState(false);

  // ✅ Fix: saari relevant fields dependency mein hain
  useEffect(() => {
    setValues({
      courtName: initial?.courtName ?? "",
      addressContact: initial?.addressContact ?? "",
      isActive: initial?.isActive ?? true,
    });
    setErrors({});
    setTouched(false);
  }, [
    initial?.id,
    initial?.courtName,
    initial?.addressContact,
    initial?.isActive,
  ]);

  const set = <K extends keyof CourtFormValues>(
    key: K,
    value: CourtFormValues[K]
  ) => {
    const next = { ...values, [key]: value };
    setValues(next);
    if (touched) setErrors(validate(next));
  };

  const handleSubmit = async () => {
    setTouched(true);
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    await onSubmit(values);
  };

  return (
    <div style={s.form}>
      {/* Court Name */}
      <div style={s.field}>
        <label style={s.label}>
          Court Name <span style={{ color: "#ef4444" }}>*</span>
        </label>
        <input
          style={{ ...s.input, ...(errors.courtName ? s.inputErr : {}) }}
          value={values.courtName}
          onChange={(e) => set("courtName", e.target.value)}
          placeholder="e.g. High Court Islamabad"
          maxLength={100}
          disabled={loading}
        />
        {errors.courtName && (
          <span style={s.errText}>{errors.courtName}</span>
        )}
        <span style={s.hint}>{values.courtName.length}/100</span>
      </div>

      {/* Address */}
      <div style={s.field}>
        <label style={s.label}>Address / Contact</label>
        <textarea
          style={{
            ...s.textarea,
            ...(errors.addressContact ? s.inputErr : {}),
          }}
          value={values.addressContact}
          onChange={(e) => set("addressContact", e.target.value)}
          placeholder="Full address or contact info..."
          rows={3}
          maxLength={500}
          disabled={loading}
        />
        {errors.addressContact && (
          <span style={s.errText}>{errors.addressContact}</span>
        )}
        <span style={s.hint}>{values.addressContact.length}/500</span>
      </div>

      {/* Status toggle — sirf edit mode mein */}
      {isEdit && (
        <div style={s.field}>
          <label style={s.label}>Status</label>
          <div style={s.toggleRow}>
            <div
              style={{
                ...s.toggle,
                background: values.isActive ? "#10b981" : "#475569",
                opacity: loading ? 0.6 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
              onClick={() => !loading && set("isActive", !values.isActive)}
            >
              <div
                style={{
                  ...s.knob,
                  transform: values.isActive
                    ? "translateX(22px)"
                    : "translateX(2px)",
                }}
              />
            </div>
            <span
              style={{
                ...s.toggleLabel,
                color: values.isActive ? "#10b981" : "#94a3b8",
              }}
            >
              {values.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div style={s.actions}>
        <button
          style={s.cancelBtn}
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          style={{ ...s.submitBtn, opacity: loading ? 0.7 : 1 }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Saving..." : isEdit ? "Update Court" : "Create Court"}
        </button>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
  form: {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  field: { display: "flex", flexDirection: "column", gap: 5 },
  label: {
    fontSize: 11,
    fontWeight: 600,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
  },
  input: {
    background: "#0b0f1a",
    border: "1px solid #1e293b",
    borderRadius: 8,
    padding: "10px 14px",
    color: "#f1f5f9",
    fontSize: 14,
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color 0.15s",
  },
  inputErr: { borderColor: "#ef4444" },
  textarea: {
    background: "#0b0f1a",
    border: "1px solid #1e293b",
    borderRadius: 8,
    padding: "10px 14px",
    color: "#f1f5f9",
    fontSize: 14,
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
  },
  errText: { fontSize: 12, color: "#ef4444" },
  hint: { fontSize: 11, color: "#475569", textAlign: "right" },
  toggleRow: { display: "flex", alignItems: "center", gap: 12 },
  toggle: {
    width: 44,
    height: 22,
    borderRadius: 11,
    position: "relative",
    transition: "background 0.2s",
    flexShrink: 0,
  },
  knob: {
    position: "absolute",
    top: 3,
    width: 16,
    height: 16,
    borderRadius: "50%",
    background: "#fff",
    transition: "transform 0.2s",
  },
  toggleLabel: { fontSize: 13, fontWeight: 500, transition: "color 0.2s" },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    paddingTop: 4,
  },
  cancelBtn: {
    padding: "9px 18px",
    background: "transparent",
    border: "1px solid #1e293b",
    borderRadius: 8,
    color: "#94a3b8",
    fontSize: 14,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  submitBtn: {
    padding: "9px 22px",
    background: "linear-gradient(135deg,#6366f1,#818cf8)",
    border: "none",
    borderRadius: 8,
    color: "#fff",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "opacity 0.15s",
  },
};
// ─── Court Domain Types ────────────────────────────────────────────────────────

export interface CourtDto {
  id: string;
  courtName: string;
  addressContact: string | null;
  isActive: boolean;
  createdAt: string; // ISO date string from backend
}

export interface CreateCourtPayload {
  courtName: string;
  addressContact?: string;
}

export interface UpdateCourtPayload {
  courtName: string;
  addressContact?: string;
  isActive: boolean;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  status: number;
}

// Form modes
export type ModalMode = "create" | "edit" | "delete" | null;

// Form state used inside CourtForm
export interface CourtFormValues {
  courtName: string;
  addressContact: string;
  isActive: boolean;
}

// Validation errors
export interface CourtFormErrors {
  courtName?: string;
  addressContact?: string;
}
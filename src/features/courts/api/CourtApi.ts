import type {
  CourtDto,
  CreateCourtPayload,
  UpdateCourtPayload,
  ApiResponse,
} from "../types/Court.types";
// ── Base URL — apna actual backend URL yahan lagao ────────────────────────────
const BASE = "/api/Courts";

const headers = { "Content-Type": "application/json" };

// ─── GET all courts (optional isActive filter) ────────────────────────────────
// isActive = true  → sirf active
// isActive = false → sirf inactive
// isActive = undefined → sab (active + inactive)
export async function getAllCourts(
  isActive?: boolean
): Promise<ApiResponse<CourtDto[]>> {
  const url =
    isActive !== undefined ? `${BASE}?isActive=${isActive}` : BASE;
  const res = await fetch(url);
  // ✅ hamesha json parse karo — throw mat karo
  // Backend ApiResponse<T> return karta hai, status field mein status hoti hai
  return res.json();
}

// ─── GET court by id ──────────────────────────────────────────────────────────
export async function getCourtById(
  id: string
): Promise<ApiResponse<CourtDto>> {
  const res = await fetch(`${BASE}/${id}`);
  return res.json();
}

// ─── POST create court ────────────────────────────────────────────────────────
export async function createCourt(
  payload: CreateCourtPayload
): Promise<ApiResponse<string>> {
  const res = await fetch(BASE, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  return res.json();
}

// ─── PUT update court  →  PUT /api/Courts/{id} ────────────────────────────────
export async function updateCourt(
  id: string,
  payload: UpdateCourtPayload
): Promise<ApiResponse<string>> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(payload),
  });
  return res.json();
}

// ─── DELETE (soft-delete) court ───────────────────────────────────────────────
export async function deleteCourt(
  id: string
): Promise<ApiResponse<string>> {
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
  return res.json();
}
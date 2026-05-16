// ============================================================
// REPORTS TYPES FILE
// Reports feature ke liye TypeScript interfaces
// Yeh sab read-only data hai — sirf dekhna hai, kuch create/delete nahi
// ============================================================

// SummaryReportDto = Dashboard pe 4 bade numbers
// Total cases, pending, finalized, aur upcoming hearings
export interface SummaryReportDto {
  totalCases: number;        // System mein total kitne cases hain
  pendingCases: number;      // Abhi tak resolve nahi hue cases
  finalizedCases: number;    // Jo cases close ho gaye
  upcomingHearings: number;  // Aane wale hearings ki ginti
}

// DepartmentReportDto = Har department ke cases ki breakdown
// Ek array aata hai is type ka — har department ke liye ek entry
export interface DepartmentReportDto {
  departmentName: string;    // Department ka naam (e.g. "Law Department")
  totalCases: number;        // Is department ke total cases
  pendingCases: number;      // Pending cases
  finalizedCases: number;    // Finalized cases
}

// CourtReportDto = Har court ke cases ki breakdown
// Same structure as DepartmentReportDto — sirf name alag hai
export interface CourtReportDto {
  courtName: string;         // Court ka naam (e.g. "Lahore High Court")
  totalCases: number;
  pendingCases: number;
  finalizedCases: number;
}
// ============================================================
// REPORTS API FILE
// Teen alag API calls hain — teen alag endpoints
// Sab GET requests hain (sirf data read karna hai)
// ============================================================

import axios from '../../../lib/axios';
import type{ SummaryReportDto, DepartmentReportDto, CourtReportDto } from '../types/report.types';

// Summary report — 4 numbers: total, pending, finalized, upcoming
export const getSummaryReport = async (): Promise<SummaryReportDto> => {
  const res = await axios.get('/reports/summary');
  return res.data.data;
};

// Department-wise report — har department ke cases ki list
export const getDepartmentReport = async (): Promise<DepartmentReportDto[]> => {
  // Promise<DepartmentReportDto[]> matlab: yeh function ek ARRAY return karta hai
  const res = await axios.get('/reports/department');
  return res.data.data;
};

// Court-wise report — har court ke cases ki list
export const getCourtReport = async (): Promise<CourtReportDto[]> => {
  const res = await axios.get('/reports/court');
  return res.data.data;
};
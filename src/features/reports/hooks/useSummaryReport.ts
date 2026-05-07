// ============================================================
// useSummaryReport HOOK
// Summary ke 4 numbers fetch karta hai
// ============================================================

import { useQuery } from '@tanstack/react-query';
import { getSummaryReport } from '../api/reportsApi';

export const useSummaryReport = () => {
  return useQuery({
    queryKey: ['reports', 'summary'], // Cache key
    queryFn: getSummaryReport,
  });
};
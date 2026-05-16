// ============================================================
// useCourtReport HOOK
// Court-wise cases data fetch karta hai
// ============================================================

import { useQuery } from '@tanstack/react-query';
import { getCourtReport } from '../api/reportsApi';

export const useCourtReport = () => {
  return useQuery({
    queryKey: ['reports', 'court'],
    queryFn: getCourtReport,
  });
};
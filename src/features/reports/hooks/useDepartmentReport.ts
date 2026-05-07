// ============================================================
// useDepartmentReport HOOK
// Department-wise cases data fetch karta hai
// ============================================================

import { useQuery } from '@tanstack/react-query';
import { getDepartmentReport } from '../api/reportsApi';

export const useDepartmentReport = () => {
  return useQuery({
    queryKey: ['reports', 'department'],
    queryFn: getDepartmentReport,
  });
};
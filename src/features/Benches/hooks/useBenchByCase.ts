import { useQuery } from '@tanstack/react-query';
import { getBenchByCase } from '../api/benchApi';

export const useBenchByCase = (caseId: string) => {
  return useQuery({
    queryKey: ['bench-by-case', caseId],
    queryFn: () => getBenchByCase(caseId),
    enabled: !!caseId, // Only fetch when caseId is provided
  });
};

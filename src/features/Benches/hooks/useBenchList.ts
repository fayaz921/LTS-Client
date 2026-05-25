import { useQuery } from '@tanstack/react-query';
import { getAllBenches } from '../api/benchApi';

export const useBenchList = (
  page: number,
  pageSize: number,
  search: string
) => {
  return useQuery({
    queryKey: ['bench-list', page, pageSize, search],
    queryFn: () => getAllBenches(page, pageSize, search),
    placeholderData: (prev) => prev, // Keep old data while fetching next page
  });
};
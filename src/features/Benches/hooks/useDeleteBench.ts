// ============================================================
// useDeleteBench HOOK
// Delete ke liye bhi useMutation use hota hai (DELETE request)
// Same pattern as useCreateBench — sirf deleteBench function alag hai
// ============================================================

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteBench } from '../api/benchApi';

export const useDeleteBench = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBench, // deleteBench(id) call karega
    onSuccess: () => {
      // Delete ke baad bhi cache refresh karo
      queryClient.invalidateQueries({ queryKey: ['bench'] });
    },
  });
};
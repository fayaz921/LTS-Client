// ============================================================
// useCreateBench HOOK
// Yeh "Mutation" hook hai — Write operations ke liye use hota hai
// (POST, PUT, DELETE). Read ke liye useQuery, Write ke liye useMutation.
//
// useMutation kya karta hai:
//   - mutate() function deta hai jise form submit pe call karte hain
//   - isPending: true jab request chal rahi ho (button disable karne ke liye)
//   - isError: agar kuch galat ho
//   - onSuccess: kaamyabi ke baad kya karna hai
// ============================================================

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBench } from '../api/benchApi';

export const useCreateBench = () => {
  // useQueryClient = React Query ka "cache manager" — isse cache invalidate karte hain
  const queryClient = useQueryClient();

  return useMutation({
    // mutationFn = wo function jo actually API call karta hai
    mutationFn: createBench,

    // onSuccess = jab API call kaamyab ho jaye toh yeh code chale
    onSuccess: () => {
      // invalidateQueries = bench ki purani cache hata do
      // Taake React Query dobara fresh data fetch kare server se
      // Warna table mein naya judge show nahi hoga!
      queryClient.invalidateQueries({ queryKey: ['bench-list'] });
      queryClient.invalidateQueries({ queryKey: ['bench-by-case'] });
    },
  });
};
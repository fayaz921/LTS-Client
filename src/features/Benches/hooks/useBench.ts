// ============================================================
// useBench HOOK
// "Hook" React ka ek special function hota hai jo "use" se start hota hai.
// React Query ka useQuery hook automatically:
//   - Data fetch karta hai (getBenchByCase function call karta hai)
//   - Loading state track karta hai (isLoading: true/false)
//   - Error handle karta hai (isError: true/false)
//   - Data cache (save) karta hai taake baar baar server hit na ho
//
// Agar tum khud yeh karte toh 20+ lines likhni padti (useState + useEffect)
// React Query isko 5-6 lines mein kar deta hai!
// ============================================================

import { useQuery } from '@tanstack/react-query';
import { getBenchByCase } from '../api/benchApi';


// caseId parameter: component yeh hook call karte waqt ID deta hai
export const useBench = (caseId: string) => {
  return useQuery({
    // queryKey = React Query ka "cache ID" — agar same key se dobara request aaye toh cached data use karta hai
    // Yahan caseId bhi key mein dala hai taake ALAG ALAG cases ke bench alag cache hon
    queryKey: ['bench', caseId],

    // queryFn = wo function jo actually data fetch karta hai
    queryFn: () => getBenchByCase(caseId),

    // enabled = sirf tab fetch karo jab caseId ho
    // Agar caseId empty string hai toh request mat karo
    enabled: !!caseId, // "!!" matlab: string ko boolean mein convert karo
  });
};
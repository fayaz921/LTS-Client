import { useQuery } from '@tanstack/react-query'

import { getFollowupsByCase }
from '../api/followup.api'

export const useFollowups = (
  caseId: string
) => {

  return useQuery({

    queryKey: ['followups', caseId],

    queryFn: () =>
      getFollowupsByCase(caseId),

    enabled: !!caseId
  })
}
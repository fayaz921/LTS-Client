import {
  useMutation,
  useQueryClient
} from '@tanstack/react-query'

import {
  createFollowup
} from '../api/followup.api'

export const useCreateFollowup = () => {

  const queryClient = useQueryClient()

  return useMutation({

    mutationFn: createFollowup,

    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ['followups']
      })
    }
  })
}
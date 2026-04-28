import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { alertsApi } from '../api/AlertsApi'
 

const ALERT_KEYS = {
    upcoming: ['alerts', 'upcoming'],
}

// GET — upcoming hearings
export function useGetUpcomingHearings() {
    return useQuery({
        queryKey: ALERT_KEYS.upcoming,
        queryFn: () => alertsApi.getUpcomingHearings(),
    })
}

// POST — send alert
export function useSendAlert() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (caseId: string) => alertsApi.sendAlert(caseId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ALERT_KEYS.upcoming,
            })
        },
    })
}
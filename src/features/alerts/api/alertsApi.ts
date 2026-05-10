import instance from '../../../lib/axios'
import type { ApiResponse } from '../../../shared/types/api.types';
import type { GetUpComingHearingDto } from '../types'

export const alertsApi = {

    // GET /api/alerts/GetUpComingHearing
    getUpcomingHearings: () =>
        instance
            .get<ApiResponse<GetUpComingHearingDto[]>>(
                '/alerts/GetUpComingHearing'
            )
            .then(r => {
              if (r.data.status === 404 || !r.data.data) return []
              if (!r.data.isSuccess) throw new Error(r.data.message || 'Upcoming hearings fetch failed')
              return r.data.data
        })
        .catch(err => {
            throw err
        }),
    // POST /api/alerts/SendHearingAlert{CaseId}
    sendAlert: (caseId: string) =>
        instance
            .post<ApiResponse<boolean>>(
                `/alerts/SendHearingAlert${caseId}`
            )
             .then(r => {
                if (!r.data.isSuccess) throw new Error(r.data.message || 'Alert send karne mein masla aaya')
                return r.data
            }),
}
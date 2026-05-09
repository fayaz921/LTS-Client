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
            .then(r => r.data.data),

    // POST /api/alerts/SendHearingAlert{CaseId}
    sendAlert: (caseId: string) =>
        instance
            .post<ApiResponse<boolean>>(
                `/alerts/SendHearingAlert${caseId}`
            )
            .then(r => r.data),
}
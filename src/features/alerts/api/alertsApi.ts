import instance from '../../../lib/axios'
import type { GetUpComingHearingDto } from '../types'

export const alertsApi = {

    // GET /api/alerts/GetUpComingHearing
    getUpcomingHearings: () =>
        instance
            .get<{ status: number; message: string; data: GetUpComingHearingDto[] }>(
                '/api/alerts/GetUpComingHearing'
            )
            .then(r => r.data.data),

    // POST /api/alerts/SendHearingAlert{CaseId}
    sendAlert: (caseId: string) =>
        instance
            .post<{ status: number; message: string; data: boolean }>(
                `/api/alerts/SendHearingAlert${caseId}`
            )
            .then(r => r.data),
}
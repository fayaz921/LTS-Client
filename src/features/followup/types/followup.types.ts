export interface FollowupDto {
  id: string
  caseId: string
  hearingDate: string
  nextHearingDate?: string
  interimOrder?: string
  decision?: string
  remarks?: string
}

export interface CreateFollowupDto {
  caseId: string
  hearingDate: string
  nextHearingDate?: string
  interimOrder?: string
  decision?: string
  remarks?: string
}
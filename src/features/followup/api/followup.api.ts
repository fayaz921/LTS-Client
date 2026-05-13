import axios from '../../../lib/axios'

import type {
  FollowupDto,
  CreateFollowupDto
} from '../types/followup.types'

export const getFollowupsByCase = async (
  caseId: string
): Promise<FollowupDto[]> => {

  const res = await axios.get(
    `/followup/${caseId}`
  )

  return res.data.data
}

export const createFollowup = async (
  data: CreateFollowupDto
) => {

  const res = await axios.post(
    '/followup',
    data
  )

  return res.data
}

export const deleteFollowup = async (
  id: string
) => {

  const res = await axios.delete(
    `/followup/${id}`
  )

  return res.data
}
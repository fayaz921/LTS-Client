import { useQuery } from '@tanstack/react-query'
import { courtApi } from '../api/courtApi'

const KEYS = {
    all: ['courts'],
}

export const useGetCourts = (enabled: boolean = true) =>
    useQuery({
        queryKey: KEYS.all,
        queryFn: courtApi.getAll,
        enabled,
    })
import instance from '../../../lib/axios'
import type { ApiResponse } from '../../auth/types/auth.types';
import type { GetCaseDocument, UploadDocumentDto } from '../types'

export const documentsApi = {
getByCase: (caseId: string) =>
    instance
        .get<ApiResponse<GetCaseDocument[]>>(`/casedocument/case/${caseId}`)
        .then(r => {
            if (r.data.status === 404 || !r.data.data) return []
            if (!r.data.isSuccess) throw new Error(r.data.message || 'Documents fetch failed')
            return r.data.data
        })
        .catch(err => {
            throw err
        }),

    getById: (id: string) =>
        instance
            .get<ApiResponse<GetCaseDocument>>(
                `/casedocument/${id}`
            )
            .then(r => {
            if (!r.data.isSuccess) throw new Error(r.data.message || 'Documents fetch failed')
            return r.data.data
        }),
    upload: (dto: UploadDocumentDto) => {
        const formData = new FormData()
        formData.append('caseId', dto.caseId)
        formData.append('file', dto.file)
        if (dto.fileName) formData.append('fileName', dto.fileName)
        if (dto.remarks)  formData.append('remarks', dto.remarks)

        return instance
            .post<ApiResponse<string>>(
                '/casedocument',
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            )
           .then(r => {
                if (!r.data.isSuccess) throw new Error(r.data.message || 'Upload failed')
                return r.data
            })
    },

    delete: (id: string) =>
        instance
            .delete<ApiResponse<string>>(
                `/casedocument/${id}`
            )
            .then(r => {
                if (!r.data.isSuccess) throw new Error(r.data.message || 'Delete failed')
                return r.data
            }),
}
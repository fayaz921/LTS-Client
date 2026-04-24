import instance from '../../../lib/axios'
import type { GetCaseDocument, UploadDocumentDto } from '../types'

export const documentsApi = {

    getByCase: (caseId: string) =>
        instance
            .get<{ status: number; message: string; data: GetCaseDocument[] }>(
                `/api/casedocument/case/${caseId}`
            )
            .then(r => r.data.data),

    getById: (id: string) =>
        instance
            .get<{ status: number; message: string; data: GetCaseDocument }>(
                `/api/casedocument/${id}`
            )
            .then(r => r.data.data),

    upload: (dto: UploadDocumentDto) => {
        const formData = new FormData()
        formData.append('caseId', dto.caseId)
        formData.append('file', dto.file)
        if (dto.fileName) formData.append('fileName', dto.fileName)
        if (dto.remarks)  formData.append('remarks', dto.remarks)

        return instance
            .post<{ status: number; message: string; data: string }>(
                '/api/casedocument',
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            )
            .then(r => r.data)
    },

    delete: (id: string) =>
        instance
            .delete<{ status: number; message: string; data: string }>(
                `/api/casedocument/${id}`
            )
            .then(r => r.data),
}
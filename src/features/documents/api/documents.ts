import instance from '../../../lib/axios'
import type { ApiResponse } from '../../auth/types/auth.types';
import type { GetCaseDocument, UploadDocumentDto } from '../types/document.types'

export const documentsApi = {
    getByCase: (caseId: string) =>
        instance
            .get<ApiResponse<GetCaseDocument[]>>(`/casedocument/case/${caseId}`)
            .then(r => {
                if (!r.data.isSuccess || !r.data.data) return []
                return r.data.data
            })
            .catch(err => {
                if (err?.response?.status === 404) return []
                throw err
            }),

    getById: (id: string) =>
        instance
            .get<ApiResponse<GetCaseDocument>>(
                `/casedocument/${id}`
            )
            .then(r => {
                if (!r.data.isSuccess) {
                    throw new Error(r.data.message);
                }
                return r.data;
            }),
    upload: async (dto: UploadDocumentDto): Promise<ApiResponse<string>> => {
        const formData = new FormData();

        formData.append('caseId', dto.caseId);
        formData.append('file', dto.file);

        if (dto.fileName) formData.append('fileName', dto.fileName);
        if (dto.remarks) formData.append('remarks', dto.remarks);

        const response = await instance.post<ApiResponse<string>>(
            '/casedocument',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        if (response.data.isSuccess)
            return response.data;
        if (!response.data.isSuccess) {
            alert(response.data.message)
            return response.data;
        }
        return response.data;
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
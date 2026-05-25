import axios from '../../../lib/axios';
import type { ApiResponse } from '../../auth/types/auth.types';
import type { PaginatedResponse } from '../../courts/types/court.types';
import type {
  Organization,
  Payment,
  DashboardStats,
  TrailUser,
  SubmitPaymentPayload,
} from '../types/superAdmin.types';

export const superAdminApi = {
  // ── Dashboard ──────────────────────────────────────
  getStats: () =>
    axios.get<ApiResponse<DashboardStats>>('/SuperAdmin/dashboard-stats'),

  // ── Organizations ──────────────────────────────────
  getOrganizations: (page = 1, pageSize = 8) =>
    axios.get<ApiResponse<PaginatedResponse<Organization>>>(
      `/SuperAdmin/all?page=${page}&pageSize=${pageSize}`
    ),

  getTrialUsers: (page = 1, pageSize = 8) =>
    axios.get<ApiResponse<PaginatedResponse<TrailUser>>>(
      `/SuperAdmin/trial?page=${page}&pageSize=${pageSize}`
    ),

  getSubscriptions: (page = 1, pageSize = 8) =>
    axios.get<ApiResponse<PaginatedResponse<Organization>>>(
      `/SuperAdmin/subscribed?page=${page}&pageSize=${pageSize}`
    ),

  getBlockedOrgs: (page = 1, pageSize = 8) =>
    axios.get<ApiResponse<PaginatedResponse<Organization>>>(
      `/SuperAdmin/blocked?page=${page}&pageSize=${pageSize}`
    ),

  getOrganizationById: (id: string) =>
    axios.get<ApiResponse<Organization>>(`/SuperAdmin/${id}`),

  // ── Payments ───────────────────────────────────────
  getPayments: (page = 1, pageSize = 10, status?: string) =>
    axios.get<ApiResponse<PaginatedResponse<Payment>>>(
      `/Payment/all?page=${page}&pageSize=${pageSize}${status ? `&status=${status}` : ''}`
    ),

  submitPayment: (payload: SubmitPaymentPayload) => {
    const formData = new FormData();
    formData.append('organizationId', payload.organizationId);
    formData.append('requestedPlan', payload.requestedPlan);
    formData.append('transactionId', payload.transactionId);
    formData.append('senderName', payload.senderName);
    formData.append('senderPhone', payload.senderPhone);
    formData.append('paymentMethod', payload.paymentMethod);
    formData.append('amount', payload.amount.toString());
    formData.append('screenshot', payload.screenshot);
    return axios.post<ApiResponse<string>>('/Payment/submit', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  approvePayment: (id: string, reviewedBy = 'SuperAdmin') =>
    axios.put<ApiResponse<string>>(
      `/Payment/${id}/approve?reviewedBy=${reviewedBy}`
    ),

  rejectPayment: (id: string, rejectionReason: string, reviewedBy = 'SuperAdmin') =>
    axios.put<ApiResponse<string>>(`/Payment/${id}/reject`, {
      rejectionReason,
      reviewedBy,
    }),

  // ── Wallet ─────────────────────────────────────────
  getWalletStats: () =>
    axios.get('/Wallets/stats'),

  getWalletTransactions: (page = 1, pageSize = 10) =>
    axios.get(`/Wallets/transactions?pageNumber=${page}&pageSize=${pageSize}`),
};
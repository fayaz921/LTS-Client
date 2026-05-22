import axios from '../../../lib/axios';
import type { ApiResponse } from '../../auth/types/auth.types';
import type {  PaginatedResponse } from '../../courts/types/court.types';
import type { 
  Organization, 
  Payment, 
  DashboardStats, 
  ActivityItem,
  TrailUser 
} from '../types/superAdmin.types';

export const superAdminApi = {
  getStats: () =>
    axios.get<ApiResponse<DashboardStats>>('/SuperAdmin/dashboard-stats'),
  


  getPayments: () =>
    axios.get<{ data: Payment[] }>('/super-admin/payments'),

  getActivity: () =>
    axios.get<{ data: ActivityItem[] }>('/super-admin/activity'),
 
getSubscriptions: (page = 1, pageSize = 8) =>
  axios.get<ApiResponse<PaginatedResponse<Organization>>>(
    `/SuperAdmin/subscription?page=${page}&pageSize=${pageSize}`
  ),

  // superAdmin.api.ts
getOrganizations: (page = 1, pageSize = 8) =>
  axios.get<ApiResponse<PaginatedResponse<Organization>>>(`/SuperAdmin/all?page=${page}&pageSize=${pageSize}`),

getTrialUsers: (page = 1, pageSize = 8) =>
  axios.get<ApiResponse<PaginatedResponse<TrailUser>>>(
    `/SuperAdmin/trial?page=${page}&pageSize=${pageSize}`
  ),
};
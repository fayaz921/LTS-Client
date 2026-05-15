import axios from '../../../lib/axios';
import type { ApiResponse } from '../../courts/types/court.types';
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

   getOrganizations: () =>
    axios.get<ApiResponse<Organization[]>>('/SuperAdmin/all'),
     getTrialUsers: () =>
    axios.get<ApiResponse<TrailUser[]>>('/SuperAdmin/trial'),
};
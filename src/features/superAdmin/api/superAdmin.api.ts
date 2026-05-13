import axios from '../../../lib/axios';
import type { 
  Organization, 
  Payment, 
  DashboardStats, 
  ActivityItem,
  TrailUser 
} from '../types/superAdmin.types';

export const superAdminApi = {
  getStats: () =>
    axios.get<{ data: DashboardStats }>('/super-admin/stats'),

  getOrganizations: () =>
    axios.get<{ data: Organization[] }>('/super-admin/organizations'),

  getPayments: () =>
    axios.get<{ data: Payment[] }>('/super-admin/payments'),

  getActivity: () =>
    axios.get<{ data: ActivityItem[] }>('/super-admin/activity'),

  // ── Trial Users ──────────────────────────────────
  getTrialUsers: () =>
    axios.get<{ data: TrailUser[] }>('/super-admin/trial-users'),
};
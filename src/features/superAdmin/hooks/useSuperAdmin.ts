import { useQuery } from '@tanstack/react-query';
import { superAdminApi } from '../api/superAdmin.api';

export const useDashboardStats = () =>
  useQuery({
    queryKey: ['superadmin-stats'],
    queryFn: () => superAdminApi.getStats(),
    select: (res) => res.data.data, 
  });

export const useOrganizations = () =>
  useQuery({
    queryKey: ['superadmin-orgs'],
    queryFn: () => superAdminApi.getOrganizations(),
    select: (res) => res.data.data, 
  });

export const useTrialUsers = () =>
  useQuery({
    queryKey: ['superadmin-trial-users'],
    queryFn: () => superAdminApi.getTrialUsers(),
    select: (res) => res.data.data,
  });

export const usePayments = () =>
  useQuery({
    queryKey: ['superadmin-payments'],
    queryFn: () => superAdminApi.getPayments(),
    select: (res) => res.data.data,
  });

export const useActivity = () =>
  useQuery({
    queryKey: ['superadmin-activity'],
    queryFn: () => superAdminApi.getActivity(),
    select: (res) => res.data.data,
  });
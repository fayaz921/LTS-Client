import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { superAdminApi } from '../api/superAdmin.api';
import type { SubmitPaymentPayload } from '../types/superAdmin.types';

// ── Stats ──────────────────────────────────────────
export const useDashboardStats = () =>
  useQuery({
    queryKey: ['superadmin-stats'],
    queryFn: () => superAdminApi.getStats(),
    select: (res) => res.data.data,
  });

// ── Organizations ──────────────────────────────────
export const useOrganizations = (page = 1, pageSize = 8) =>
  useQuery({
    queryKey: ['superadmin-orgs', page, pageSize],
    queryFn: () => superAdminApi.getOrganizations(page, pageSize),
    select: (res) => res.data.data,
  });

export const useTrialUsers = (page = 1, pageSize = 8) =>
  useQuery({
    queryKey: ['superadmin-trial-users', page, pageSize],
    queryFn: () => superAdminApi.getTrialUsers(page, pageSize),
    select: (res) => res.data.data,
  });

export const useSubscriptions = (page = 1, pageSize = 8) =>
  useQuery({
    queryKey: ['superadmin-subscriptions', page, pageSize],
    queryFn: () => superAdminApi.getSubscriptions(page, pageSize),
    select: (res) => res.data.data,
  });

// ── Payments ───────────────────────────────────────
export const usePayments = (page = 1, pageSize = 10, status?: string) =>
  useQuery({
    queryKey: ['superadmin-payments', page, pageSize, status],
    queryFn: () => superAdminApi.getPayments(page, pageSize, status),
    select: (res) => res.data.data,
  });

export const useSubmitPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SubmitPaymentPayload) =>
      superAdminApi.submitPayment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin-payments'] });
    },
  });
};

export const useApprovePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reviewedBy }: { id: string; reviewedBy?: string }) =>
      superAdminApi.approvePayment(id, reviewedBy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin-payments'] });
      queryClient.invalidateQueries({ queryKey: ['superadmin-stats'] });
      queryClient.invalidateQueries({ queryKey: ['superadmin-orgs'] });
    },
  });
};

export const useRejectPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      superAdminApi.rejectPayment(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin-payments'] });
    },
  });
};

// ── Wallet ─────────────────────────────────────────
export const useWalletStats = () =>
  useQuery({
    queryKey: ['wallet-stats'],
    queryFn: () => superAdminApi.getWalletStats(),
    select: (res) => res.data,
  });

export const useWalletTransactions = (page = 1, pageSize = 10) =>
  useQuery({
    queryKey: ['wallet-transactions', page, pageSize],
    queryFn: () => superAdminApi.getWalletTransactions(page, pageSize),
    select: (res) => res.data,
  });
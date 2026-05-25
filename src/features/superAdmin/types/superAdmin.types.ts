export type SubscriptionPlan = 'Trial' | 'Starter' | 'Professional' | 'Enterprise';
export type PaymentStatus = 'Pending' | 'Approved' | 'Rejected';

export interface Organization {
  id: string;
  organizationName: string;
  slug: string;
  plan: SubscriptionPlan;
  trialStartDate?: string;
  trialEndDate?: string;
  isTrialActive: boolean;
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  isSubscriptionActive: boolean;
  isActive: boolean;
  isBlocked: boolean;
  maxUsers: number;
  maxPetitioners: number;    // ← maxClients nahi
  maxCases: number;
  currentUserCount: number;  // ← activeUserCount nahi
  currentPetitionerCount: number;
  currentCaseCount: number;
  totalPaymentRequests: number;
  totalAmountPaid: number;
  lastPaymentStatus?: string;
  lastPaymentDate?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Payment {
  id: string;
  organizationId: string;
  organizationName: string;
  requestedPlan: SubscriptionPlan;
  transactionId: string;
  senderName: string;
  senderPhone: string;
  paymentMethod: string;
  amount: number;
  screenshotUrl: string;
  status: PaymentStatus;
  rejectionReason?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  createdAt: string;
}

export interface TrailUser {
  id: string;
  organizationName: string;
  email: string;
  trialStartDate: string;
  trialEndDate: string;
  isTrialActive: boolean;
}

export interface DashboardStats {
  totalOrganizations: number;
  activeTrials: number;
  paidSubscriptions: number;
  totalRevenue: number;
  totalActiveUsers: number;
  expiringIn3Days: number;
  expiredNotConverted: number;
  convertedToPaid: number;
  trialConversionRate: number;
  basicCount: number;
  professionalCount: number;
  enterpriseCount: number;
  inactiveCount: number;
  activeRate: number;
  totalMaxUsers: number;
  totalMaxClients: number;
  orgsNearLimit: number;
  userCapacityUsed: number;
  thisMonthRevenue: number;
  pendingRevenue: number;
  refundedRevenue: number;
  collectionRate: number;
}

export interface ActivityItem {
  id: string;
  icon: string;
  iconBg: string;
  text: string;
  time: string;
}

export interface SubmitPaymentPayload {
  organizationId: string;
  requestedPlan: SubscriptionPlan;
  transactionId: string;
  senderName: string;
  senderPhone: string;
  paymentMethod: string;
  amount: number;
  screenshot: File;
}
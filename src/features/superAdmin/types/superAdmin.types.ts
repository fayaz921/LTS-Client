export type SubscriptionPlan = 'Basic' | 'Professional' | 'Enterprise';
export type PaymentStatus = 'Paid' | 'Pending' | 'Overdue';

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
  maxUsers: number;
  maxClients: number;
  activeUserCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Payment {
  id: string;
  invoiceNo: string;
  organizationName: string;
  plan: SubscriptionPlan;
  amount: number;
  date: string;
  status: PaymentStatus;
}
export interface TrailUser{
  id:string,
  organizationName:string,
email:string,
trialStartDate:string,
trialEndDate:string,
isTrialActive:boolean
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
  overdueRevenue: number;
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
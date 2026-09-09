export type Language = 'en' | 'ar' | 'es' | 'fr' | 'de' | 'tr' | 'ur';

export type UserStatus = 'active' | 'banned';

/** Page size options offered in the admin users list. */
export const USER_PAGE_SIZES = [10, 25, 50] as const;

/** Page size options offered in the admin services list. */
export const SERVICE_PAGE_SIZES = [10, 25, 50] as const;

/** Page size options offered in the admin upstream providers list. */
export const UPSTREAM_PAGE_SIZES = [10, 25, 50] as const;

/** Maximum custom input fields a service can collect on the order form. */
export const SERVICE_MAX_INPUTS = 10;

export interface User {
  id: string;
  username: string;
  email: string;
  emailVerified: boolean;
  emailVerificationToken?: string; // jwt token for email verification the experation is in the token itself
  passwordResetToken?: string; // jwt token for password reset the experation is in the token itself
  passwordHash: string;
  balance : number;
  language: Language;
  /** Defaults to 'active' for legacy documents created before this field existed. */
  status?: UserStatus;
  /** ISO date string. Missing on legacy documents. */
  createdAt?: string;
}

export const TransactionTypes = ['deposit', 'withdrawal', 'order', 'refund'] as const;

export type TransactionType = (typeof TransactionTypes)[number];

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  /** ISO date string. */
  createdAt: string;
}

export type DepositStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

export interface Deposit {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: DepositStatus;
  gateway: string;
  transactionId?: string;
  gatewayTransactionId?: string;
  sessionId?: string;
  checkoutUrl?: string;
  errorMessage?: string;
  /** ISO date string */
  createdAt: string;
  /** ISO date string */
  completedAt?: string;
}

export interface AdminUser {
  id: string;
  username: string;
  passwordHash: string;
}

export interface UpstreamProvider {
  id: string;
  name: string;
  apiUrl: string;
  apiKey: string;
}

export const PLATFORM_TYPES = ['INSTAGRAM', 'TELEGRAM' , 'YOUTUBE', 'TIKTOK', 'FACEBOOK','X'] as const;

export type ServicePlatform = (typeof PLATFORM_TYPES)[number];

/** Sort options offered in the user services catalog. */
export const SERVICE_SORT_OPTIONS = ['name-asc', 'name-desc', 'price-asc', 'price-desc'] as const;

export type ServiceSortOption = (typeof SERVICE_SORT_OPTIONS)[number];

export interface Service {
  id: string;
  platform: (typeof PLATFORM_TYPES)[number];
  name: string;
  description: string;
  status: 'active' | 'inactive';
  price: number;
  minOrder: number;
  maxOrder: number;
  refill: boolean;
  cancel: boolean;
  inputs: Record<string, string>;
  upstreamId: string;
  upstreamServiceId: string;
}

export const ORDER_STATUSES = ['pending', 'processing', 'completed', 'cancelled', 'refunded'] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

/** Status filter options offered in the user orders list. */
export const ORDER_PAGE_SIZES = [10, 25, 50] as const;

export interface Order {
  id: string;
  upstreamOrderId?: string;
  userId: string;
  serviceId: string;
  quantity: number;
  remaining: number;
  totalPrice: number;
  status: OrderStatus;
  inputs?: Record<string, string>;
  /** ISO date string. */
  createdAt: string;
  /** ISO date string. */
  updatedAt: string;
}

/** Categories a support ticket can be filed under. */
export const SUPPORT_TICKET_CATEGORIES = [
  'order',
  'payment',
  'refund',
  'account',
  'technical',
  'other',
] as const;

export type SupportTicketCategory = (typeof SUPPORT_TICKET_CATEGORIES)[number];

export const SUPPORT_TICKET_PRIORITIES = ['low', 'medium', 'high'] as const;

export type SupportTicketPriority = (typeof SUPPORT_TICKET_PRIORITIES)[number];

export type SupportTicketStatus = 'open' | 'closed';

/** Page size options offered in the user support ticket list. */
export const SUPPORT_PAGE_SIZES = [10, 25, 50] as const;

/** Page size options offered in a support ticket conversation. */
export const SUPPORT_COMMENT_PAGE_SIZES = [10, 25, 50] as const;

export interface SupportTicket {
  id: string;
  userId: string;
  title: string;
  category: SupportTicketCategory;
  priority: SupportTicketPriority;
  status: SupportTicketStatus;
  /** ISO date string. */
  createdAt: string;
  /** ISO date string — bumped on every new comment. */
  updatedAt: string;
  /** ISO date string — set when the ticket was closed. */
  closedAt?: string;
  /** Who closed the ticket. */
  closedBy?: 'user' | 'admin';
}

export interface SupportTicketComment {
  id: string;
  ticketId: string;
  authorType: 'user' | 'admin';
  authorId: string;
  message: string;
  /** ISO date string. */
  createdAt: string;
}


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

export interface Deposit {
  id: string;
  userId: string;
  TransactionId: string;
  gateway: string;
  gatewayTransactionId: string;
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

export interface Service {
  id: string;
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

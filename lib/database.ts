export type Language = 'en' | 'ar' | 'es' | 'fr' | 'de' | 'tr' | 'ur';

export type UserStatus = 'active' | 'banned';

/** Page size options offered in the admin users list. */
export const USER_PAGE_SIZES = [10, 25, 50] as const;

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  language: Language;
  /** Defaults to 'active' for legacy documents created before this field existed. */
  status?: UserStatus;
  /** ISO date string. Missing on legacy documents. */
  createdAt?: string;
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

export type Language = 'en' | 'ar' | 'es' | 'fr' | 'de' | 'tr' | 'ur';

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  language: Language;
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
  price: number;
  minOrder: number;
  maxOrder: number;
  refill: boolean;
  cancel: boolean;
  inputs: Record<string, string>;
  upstreamId: string;
  upstreamServiceId: string;
}

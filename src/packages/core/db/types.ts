export type UserRole = 'customer' | 'rider' | 'company';
export type OrderType = 'food' | 'delivery' | 'grocery' | 'errands';

export interface Env {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY: string;
  SUPABASE_ANON_KEY: string;
}
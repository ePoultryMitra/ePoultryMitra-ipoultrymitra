
export interface Farm {
  id: string;
  farm_name: string;
}

export interface Flock {
  id: string;
  name: string;
  farm_id: string;
}

export interface Shed {
  id: string;
  name: string;
  farm_id: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  mobile_number: string;
  business_type: 'standalone' | 'integrated';
  partner_type?: 'dealer' | 'integrator';
  partner_code?: string;
  state: string;
  district: string;
  block?: string;
  village?: string;
  pincode: string;
  registration_status: 'pending' | 'active';
}

export enum AppScreen {
  WELCOME = 'WELCOME',
  AUTH = 'AUTH',
  REGISTRATION = 'REGISTRATION',
  FARM_SELECTION = 'FARM_SELECTION',
  DASHBOARD = 'DASHBOARD',
  AI_MITRA = 'AI_MITRA',
  RECORDS = 'RECORDS',
  PROFILE = 'PROFILE',
  FEED_ENTRY = 'FEED_ENTRY',
  MORTALITY_ENTRY = 'MORTALITY_ENTRY',
  EXPENSE_ENTRY = 'EXPENSE_ENTRY'
}

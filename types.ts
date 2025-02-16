export type UserData = {
  name: string;
  username: string;
  email: string;
  password: string;
  phone_number: string;
  country: string;
  currency: string; // Default currency
  total_balance: number;
  available_balance: number;
  profit_balance: number;
  bonus_balance: number;
  pending_withdrawal: number;
  account_type: string;
  account_status: string;
  email_verified: boolean;
  kyc_status: string;
  level: string;
  referral_list: string[];
};

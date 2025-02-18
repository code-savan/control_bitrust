export interface UserData {
  id: string;
  name: string;
  username: string;
  email: string;
  phone_number: string;
  country: string;
  currency: string;
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
  kyc_verified: boolean;
}

export interface VerificationData {
  id: string;
  user_id: string;
  document_urls: string[];
  created_at: string;
  profiles: {
    name: string;
    email: string;
    kyc_verified: boolean;
  };
}

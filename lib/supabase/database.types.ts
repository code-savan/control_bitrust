export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: UserData;
        Insert: Omit<UserData, 'id' | 'referral_list'>; // Adjust as needed
        Update: Partial<UserData>;
      };
    };
  };
}

export type UserData = {
  id: string;
  name: string;
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
  referral_list: string[];
};

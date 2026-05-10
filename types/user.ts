export interface User {
  id: string;
  email: string;
  full_name: string;
  role_id: number;
  is_banned: boolean;
  date_of_birth: string | null;
  last_online_at?: string | null;
  created_at: string;
  points?: number;
}

export interface UserProfile {
  full_name: string;
  date_of_birth: string;
}

export interface UpdateUserData {
  full_name?: string;
  date_of_birth?: string;
}

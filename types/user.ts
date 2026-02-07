export interface User {
  id: string;
  email: string;
  full_name: string;
  role_id: number;
  date_of_birth: string | null;
  created_at: string;
}

export interface UserProfile {
  full_name: string;
  date_of_birth: string;
}

export interface UpdateUserData {
  full_name?: string;
  date_of_birth?: string;
}

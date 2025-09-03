export interface UserData {
  name: string;
  email: string;
  schoolName: string;
  role: 'admin' | 'teacher' | 'staff';
  whatsapp: string;
  createdAt?: string;
  uid?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: any;
  error?: string;
}

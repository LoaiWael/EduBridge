export type Role = 'student' | 'ta';

export interface UserProfile {
  id: string;
  userName: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  bio?: string;
  createdAt: Date;
}

export interface UpdateProfileRequest {
  userName?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
}
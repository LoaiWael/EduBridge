export type Role = 'student' | 'ta';

export interface UserSkill {
  id: string;
  name: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  major?: string;
  university?: string;
  profileImageUrl?: string;
  githubUrl?: string;
  linkedInUrl?: string;
  isDisabled: boolean;
  skills: UserSkill[];
}

export interface TaProfile extends UserProfile {
  department: string;
  academicTitle?: string;
  officeLocation?: unknown;
  maxSlots: number;
  rating: number;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  bio?: string;
  major?: string;
  university?: string;
  // profileImageUrl?: string;
  githubUrl?: string;
  linkedInUrl?: string;
}

export interface UpdateTaProfileRequest extends UpdateProfileRequest {
  department: string;
  academicTitle?: string;
  officeLocation?: unknown;
  maxSlots: number;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
}
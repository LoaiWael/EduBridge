export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: string;
  universityName?: string;
  department?: string;
  studentId?: string;
  rememberMe?: boolean;
}

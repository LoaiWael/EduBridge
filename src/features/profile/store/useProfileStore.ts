import { create } from 'zustand';
import type { Role, UserSkill, UserProfile, TaProfile } from '../types';

interface ProfileState {
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  major: string;
  university: string;
  profileImageUrl: string;
  githubUrl: string;
  linkedInUrl: string;
  isDisabled: boolean;
  skills: UserSkill[];
  role: Role | null;
  // TA-specific fields
  department: string;
  academicTitle?: string;
  officeLocation?: unknown;
  maxSlots: number;
  rating: number;

  // Actions
  setProfile: (profile: UserProfile | TaProfile) => void;
  setFirstName: (firstName: string) => void;
  setLastName: (lastName: string) => void;
  setEmail: (email: string) => void;
  setBio: (bio: string) => void;
  setMajor: (major: string) => void;
  setUniversity: (university: string) => void;
  setProfileImageUrl: (profileImageUrl: string) => void;
  setGithubUrl: (githubUrl: string) => void;
  setLinkedInUrl: (linkedInUrl: string) => void;
  setIsDisabled: (isDisabled: boolean) => void;
  setSkills: (skills: UserSkill[]) => void;
  setRole: (role: Role) => void;
  setDepartment: (department: string) => void;
  setAcademicTitle: (academicTitle?: string) => void;
  setOfficeLocation: (officeLocation?: unknown) => void;
  setMaxSlots: (maxSlots: number) => void;
  setRating: (rating: number) => void;
}

export const useProfileStore = create<ProfileState>()(
  (set) => ({
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
    major: '',
    university: '',
    profileImageUrl: '',
    githubUrl: '',
    linkedInUrl: '',
    isDisabled: false,
    skills: [],
    role: null,
    department: '',
    academicTitle: undefined,
    officeLocation: undefined,
    maxSlots: 0,
    rating: 0,

    setProfile: (profile) => set({ ...profile }),
    setFirstName: (firstName) => set({ firstName: firstName }),
    setLastName: (lastName) => set({ lastName: lastName }),
    setEmail: (email) => set({ email: email }),
    setBio: (bio) => set({ bio: bio }),
    setMajor: (major) => set({ major: major }),
    setUniversity: (university) => set({ university: university }),
    setProfileImageUrl: (profileImageUrl) => set({ profileImageUrl: profileImageUrl }),
    setGithubUrl: (githubUrl) => set({ githubUrl: githubUrl }),
    setLinkedInUrl: (linkedInUrl) => set({ linkedInUrl: linkedInUrl }),
    setIsDisabled: (isDisabled) => set({ isDisabled: isDisabled }),
    setSkills: (skills) => set({ skills: skills }),
    setRole: (role) => set({ role: role }),
    setDepartment: (department) => set({ department: department }),
    setAcademicTitle: (academicTitle) => set({ academicTitle: academicTitle }),
    setOfficeLocation: (officeLocation) => set({ officeLocation: officeLocation }),
    setMaxSlots: (maxSlots) => set({ maxSlots: maxSlots }),
    setRating: (rating) => set({ rating: rating })
  })
);

import { create } from 'zustand';
import type { Role, UserSkill } from '../types';

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
}

export const useProfileStore = create<ProfileState>((set) => ({
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
  setRole: (role) => set({ role: role })
}));

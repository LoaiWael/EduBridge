// Team Status Lifecycle
export const TeamStatus = {
  Open: 'Open',
  Partial: 'Partial',
  Full: 'Full',
  IdeaSelection: 'IdeaSelection',
  TaPending: 'TaPending',
  TaApproved: 'TaApproved',
  InProgress: 'InProgress',
  Completed: 'Completed',
  Closed: 'Closed'
} as const;
export type TeamStatus = typeof TeamStatus[keyof typeof TeamStatus];

// Team Member Role
export const MemberRole = {
  Leader: 'Leader',
  Member: 'Member'
} as const;
export type MemberRole = typeof MemberRole[keyof typeof MemberRole];

// Join Request Status
export const JoinRequestStatus = {
  Pending: 'Pending',
  Approved: 'Approved',
  Rejected: 'Rejected',
  Cancelled: 'Cancelled'
} as const;
export type JoinRequestStatus = typeof JoinRequestStatus[keyof typeof JoinRequestStatus];

// User reference (minimal user info for team context)
export interface TeamUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImageUrl?: string;
  role: 'student' | 'ta' | 'doctor';
  major?: string;
  university?: string;
}

// Team Member
export interface TeamMember {
  id: string;
  userId: string;
  user?: TeamUser;
  teamId: string;
  role: MemberRole;
  joinedAt: string;
}

// Join Request
export interface JoinRequest {
  id: string;
  teamId: string;
  studentId: string;
  student?: TeamUser;
  status: JoinRequestStatus;
  createdAt: string;
  updatedAt: string;
  // Populated when fetching for a specific team
  team?: Team;
}

// Idea reference (minimal idea info for team context)
export interface TeamIdea {
  id: string;
  title: string;
  description: string;
  categoryId?: string;
  repositoryUrl?: string;
}

// Team Document
export interface TeamDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
}

// Team entity
export interface Team {
  id: string;
  name: string;
  description?: string;
  leaderId: string;
  leader?: TeamUser;
  members: TeamMember[];
  taId?: string;
  ta?: TeamUser;
  doctorId?: string;
  doctor?: TeamUser;
  ideaId?: string;
  idea?: TeamIdea;
  status: TeamStatus;
  maxMembers: number; // Global setting, typically 4-5
  // Persistent Metadata
  subject?: string;
  department?: string;
  academicYear?: string;
  documents?: TeamDocument[];
  requiredMembers?: string[];
  createdAt: string;
  updatedAt: string;
}

// Team Settings
export const TeamSettings = {
  MaxMembers: 5
} as const;

// API Response types
export interface TeamsResponse {
  teams: Team[];
}

export interface TeamResponse {
  team: Team;
}

export interface JoinRequestsResponse {
  joinRequests: JoinRequest[];
}

export interface JoinRequestResponse {
  joinRequest: JoinRequest;
}

// Team creation/update payload
export interface CreateTeamPayload {
  name: string;
  description?: string;
}

export interface UpdateTeamPayload {
  name?: string;
  description?: string;
}

export interface UpdateTeamStatusPayload {
  status: TeamStatus;
}

// API action responses
export interface TeamMemberResponse {
  member: TeamMember;
}

export interface JoinRequestActionResponse {
  joinRequest: JoinRequest;
  message: string;
}
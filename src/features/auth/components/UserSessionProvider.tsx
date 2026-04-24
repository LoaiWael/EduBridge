import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useIdeasStore } from "@/features/ideas/store/useIdeasStore";
import { useNotificationStore } from "@/features/notifications/store/useNotificationStore";
import { useProfileStore } from "@/features/profile/store/useProfileStore";
import { useTeamStore } from "@/features/teams/store/useTeamStore";
import usersData from "@/data/users.json";

export const UserSessionProvider = ({ children }: { children: React.ReactNode }) => {
  const currentUserId = useAuthStore(state => state.id);
  const users = useAuthStore(state => state.users);

  // Store Setters (Hydration)
  const setSavedIdeaIds = useIdeasStore(state => state.setSavedIdeaIds);
  const setNotifications = useNotificationStore(state => state.setNotifications);
  const setProfile = useProfileStore(state => state.setProfile);
  const setTeams = useTeamStore(state => state.setTeams);
  const setJoinRequests = useTeamStore(state => state.setJoinRequests);

  // Store Data (Persistence)
  const savedIdeaIds = useIdeasStore(state => state.savedIdeaIds);
  const notifications = useNotificationStore(state => state.notifications);
  const joinRequests = useTeamStore(state => state.joinRequests);

  // Profile capture - extracted as separate fields to avoid object reference loop
  const p_firstName = useProfileStore(state => state.firstName);
  const p_lastName = useProfileStore(state => state.lastName);
  const p_bio = useProfileStore(state => state.bio);
  const p_profileImageUrl = useProfileStore(state => state.profileImageUrl);
  const p_skills = useProfileStore(state => JSON.stringify(state.skills)); // Stringify for stable dependency
  const p_major = useProfileStore(state => state.major);
  const p_university = useProfileStore(state => state.university);
  const p_dept = useProfileStore(state => state.department);

  const updateUserSavedIdeas = useAuthStore(state => state.updateUserSavedIdeas);
  const updateUserJoinRequests = useAuthStore(state => state.updateUserJoinRequests);
  const updateUserNotifications = useAuthStore(state => state.updateUserNotifications);
  const updateUserProfile = useAuthStore(state => state.updateUserProfile);

  // A ref to prevent persistence from triggering when we are just hydrating the UI
  const isHydrating = useRef(false);
  const lastActiveUserId = useRef<string | null>(null);

  // 2. Hydration Logic: When ID changes, load that user's specific data into UI stores
  useEffect(() => {
    if (!currentUserId) return;

    // Only hydrate if we actually switched accounts or it's first load of this user
    if (lastActiveUserId.current !== currentUserId) {
      // Priority 1: Check registered users (Persistence)
      let activeUser: any = users.find(u => u.id === currentUserId);

      // Priority 2: Check mock data (Fake UI display)
      if (!activeUser) {
        const mockProfile = (usersData as any[]).find(u => u.id === currentUserId);
        if (mockProfile) {
          activeUser = {
            id: mockProfile.id,
            email: mockProfile.email,
            role: mockProfile.role,
            savedIdeaIds: [],
            myTeams: [],
            joinRequests: [],
            notifications: [],
            profile: mockProfile,
          };
        }
      }

      if (activeUser) {
        isHydrating.current = true;

        setSavedIdeaIds(activeUser.savedIdeaIds || []);
        setNotifications(activeUser.notifications || []);
        setTeams(activeUser.myTeams || []);
        setJoinRequests(activeUser.joinRequests || []);
        if (activeUser.profile) {
          setProfile(activeUser.profile);
        }

        lastActiveUserId.current = currentUserId;

        // Small delay to allow store updates to propagate before allowing persistence
        setTimeout(() => {
          isHydrating.current = false;
        }, 100);
      }
    }
  }, [currentUserId, users]);

  // 3. Persistence Logic: Save current active state back to the central Auth collection
  // These only run if NOT in a hydration cycle
  useEffect(() => {
    if (currentUserId && !isHydrating.current) {
      updateUserSavedIdeas(currentUserId, savedIdeaIds);
    }
  }, [savedIdeaIds, currentUserId]);

  useEffect(() => {
    if (currentUserId && !isHydrating.current) {
      updateUserNotifications(currentUserId, notifications);
    }
  }, [notifications, currentUserId]);

  useEffect(() => {
    if (currentUserId && !isHydrating.current) {
      updateUserJoinRequests(currentUserId, joinRequests);
    }
  }, [joinRequests, currentUserId]);

  useEffect(() => {
    if (currentUserId && !isHydrating.current) {
      // Construct clean profile object from individual tracked fields
      const fullProfile = useProfileStore.getState();
      const profileSnapshot = {
        firstName: fullProfile.firstName,
        lastName: fullProfile.lastName,
        email: fullProfile.email,
        bio: fullProfile.bio,
        major: fullProfile.major,
        university: fullProfile.university,
        profileImageUrl: fullProfile.profileImageUrl,
        skills: fullProfile.skills,
        department: fullProfile.department,
        role: fullProfile.role,
        academicTitle: fullProfile.academicTitle,
        officeLocation: fullProfile.officeLocation,
        maxSlots: fullProfile.maxSlots,
        rating: fullProfile.rating
      };
      updateUserProfile(currentUserId, profileSnapshot as any);
    }
  }, [p_firstName, p_lastName, p_bio, p_profileImageUrl, p_skills, p_major, p_university, p_dept, currentUserId]);

  // 4. Cleanup Logic: When logging out (currentUserId becomes null), reset all feature stores
  useEffect(() => {
    if (!currentUserId) {
      setSavedIdeaIds([]);
      setNotifications([]);
      setTeams([]);
      setJoinRequests([]);
      setProfile({
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
        role: '',
        department: '',
        academicTitle: undefined,
        officeLocation: undefined,
        maxSlots: 0,
        rating: 0
      } as any);
      lastActiveUserId.current = null;
    }
  }, [currentUserId, setSavedIdeaIds, setNotifications, setTeams, setJoinRequests, setProfile]);

  return <>{children}</>;
};

export default UserSessionProvider;

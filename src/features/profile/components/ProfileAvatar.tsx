import { forwardRef } from "react";
import { useProfileStore } from "../store/useProfileStore";

const ProfileAvatar = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => {
  const profileImageUrl = useProfileStore(state => state.profileImageUrl);
  const firstName = useProfileStore(state => state.firstName);
  const initial = firstName ? firstName.charAt(0).toUpperCase() : "?";

  return (
    <div
      ref={ref}
      {...props}
      className="w-10 h-10 rounded-full overflow-hidden bg-brand-grey flex items-center justify-center shadow-sm"
    >
      {profileImageUrl ? (
        <img
          src={profileImageUrl}
          alt="User Profile"
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-brand-dark-grey text-lg font-semibold">{initial}</span>
      )}
    </div>
  );
});

ProfileAvatar.displayName = "ProfileAvatar";
export default ProfileAvatar;

import { forwardRef } from "react";
import { useProfileStore } from "../store/useProfileStore";

const ProfileAvatar = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>((props, ref) => {
  const { profileImageUrl, firstName } = useProfileStore();
  const initial = firstName ? firstName.charAt(0).toUpperCase() : "?";

  return (
    <button
      ref={ref}
      {...props}
      className="w-10 h-10 rounded-full overflow-hidden bg-brand-grey flex items-center justify-center cursor-pointer shadow-sm hover:ring-2 hover:ring-brand-pink transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink"
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
    </button>
  );
});

ProfileAvatar.displayName = "ProfileAvatar";
export default ProfileAvatar;

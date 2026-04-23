import { forwardRef } from "react";
import { useProfileStore } from "../store/useProfileStore";
import { twMerge } from "tailwind-merge";

export interface ProfileAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl?: string | null;
  name?: string;
}

const ProfileAvatar = forwardRef<HTMLDivElement, ProfileAvatarProps>(({ imageUrl, name, className, ...props }, ref) => {
  const storeProfileImageUrl = useProfileStore(state => state.profileImageUrl);
  const storeFirstName = useProfileStore(state => state.firstName);

  const displayImageUrl = imageUrl !== undefined ? imageUrl : storeProfileImageUrl;
  const displayName = name !== undefined ? name : storeFirstName;

  const initial = displayName ? displayName.charAt(0).toUpperCase() : "?";

  return (
    <div
      ref={ref}
      {...props}
      className={twMerge("w-10 h-10 rounded-full overflow-hidden bg-brand-grey flex items-center justify-center shrink-0 shadow-sm", className)}
    >
      {displayImageUrl ? (
        <img
          src={displayImageUrl}
          alt={displayName ? `${displayName}'s Profile` : "User Profile"}
          className="w-full h-full object-cover"
          draggable='false'
        />
      ) : (
        <span className="text-brand-dark-grey text-lg font-semibold leading-none">{initial}</span>
      )}
    </div>
  );
});

ProfileAvatar.displayName = "ProfileAvatar";
export default ProfileAvatar;

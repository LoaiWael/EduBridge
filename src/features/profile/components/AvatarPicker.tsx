import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import ProfileAvatar from "./ProfileAvatar";
import usersData from "@/data/users.json";
import { useProfileStore } from "../store/useProfileStore";
import { Camera } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

// Extract unique avatar URLs from the mock database
const AVATARS = Array.from(new Set(usersData.map(u => u.profileImageUrl).filter(Boolean))) as string[];

const AvatarPicker = () => {
  const currentImageUrl = useProfileStore(state => state.profileImageUrl);
  const setProfileImageUrl = useProfileStore(state => state.setProfileImageUrl);
  const firstName = useProfileStore(state => state.firstName);
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4 py-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="relative group cursor-pointer outline-none transition-all focus-within:ring-2 focus-within:ring-brand-primary rounded-full p-1"
            aria-label="Change profile picture"
          >
            <ProfileAvatar
              imageUrl={currentImageUrl}
              name={firstName}
              className="w-24 h-24 border-4 border-brand-primary/10 shadow-xl group-hover:border-brand-primary/30 transition-colors"
            />
            {/* Overlay for hover/active */}
            <div className="absolute inset-1 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
              <Camera className="text-white size-6 drop-shadow-md" />
            </div>
            {/* Pulsing indicator if no image is set */}
            {!currentImageUrl && (
              <div className="absolute -bottom-1 -right-1 size-6 bg-brand-primary rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                <Plus className="text-white size-3" />
              </div>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[320px] p-6 rounded-4xl bg-brand-card/95 backdrop-blur-md border-brand-grey/20 shadow-2xl z-100"
          sideOffset={12}
          align="center"
        >
          <div className="space-y-5">
            <div className="flex flex-col gap-1">
              <h3 className="font-bold text-brand-text-primary text-base">Select your Avatar</h3>
              <p className="text-xs text-brand-text-secondary">Choose a look that matches your profile</p>
            </div>

            <div className="grid grid-cols-4 gap-4 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
              {AVATARS.map((url, i) => (
                <motion.button
                  key={i}
                  type="button"
                  whileHover={{ scale: 1.1, rotate: 2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setProfileImageUrl(url);
                    setOpen(false);
                  }}
                  className={`relative rounded-2xl overflow-hidden aspect-square border-2 transition-all p-0.5 ${currentImageUrl === url
                    ? 'border-brand-primary ring-2 ring-brand-primary/20 bg-brand-primary/5'
                    : 'border-transparent bg-brand-grey/10 hover:bg-brand-grey/20'
                    }`}
                >
                  <img
                    src={url}
                    alt={`Avatar preference ${i}`}
                    className="w-full h-full object-cover"
                  />
                  {currentImageUrl === url && (
                    <div className="absolute inset-0 bg-brand-primary/10 flex items-center justify-center">
                      {/* Optional checkmark icon could go here */}
                    </div>
                  )}
                </motion.button>
              ))}
            </div>

            <div className="pt-2 border-t border-brand-grey/10">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-full py-2 text-xs font-bold uppercase tracking-wider text-brand-text-secondary hover:text-brand-text-primary transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <div className="text-center">
        <p className="text-sm font-semibold text-brand-text-primary">Profile Picture</p>
        <p className="text-xs text-brand-text-secondary mt-0.5">Click to browse your gallery</p>
      </div>
    </div>
  );
};

// Help with missing icons if not imported
import { Plus } from "lucide-react";

export default AvatarPicker;

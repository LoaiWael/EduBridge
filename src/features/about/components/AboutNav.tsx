import { Link } from 'react-router-dom';
import { useAuthStore } from '@/features/auth';
import ProfileAvatar from '@/features/profile/components/ProfileAvatar';
import { NotificationDropdown } from '@/features/notifications';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

export const AboutNav = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const authId = useAuthStore(state => state.id);

  return (
    <header className="fixed top-0 left-[4%] right-[4%] z-50 px-6 py-4 flex justify-between items-center bg-brand-pink/30 backdrop-blur-xl border-b border-brand-grey/20 shadow-sm transition-all rounded-b-xl pointer-events-auto">
      <div className="font-brand-teams text-2xl font-bold tracking-wider text-brand-text-primary">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity" viewTransition>
          EduBridge
        </Link>
      </div>
      <nav className="flex items-center gap-4">
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <NotificationDropdown buttonClassName="hover:bg-brand-grey/10" />
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to={`/bridge/${authId}`} className="hover:opacity-90 transition-opacity" viewTransition>
                    <ProfileAvatar className="w-10 h-10 ring ring-brand-background" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom" sideOffset={8}>
                  <p>Profile</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ) : (
          <Link to="/login" className="px-5 py-2 rounded-brand-button bg-transparent border border-brand-text-primary text-brand-text-primary font-bold shadow-md hover:shadow-lg transition-all hover:opacity-70" viewTransition>
            Login
          </Link>
        )}
      </nav>
    </header>
  );
};

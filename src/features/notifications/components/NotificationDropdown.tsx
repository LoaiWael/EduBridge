import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { NotificationItem } from './NotificationItem';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NotificationDropdownProps {
  iconClassName?: string;
  buttonClassName?: string;
}

export const NotificationDropdown = ({
  iconClassName = "w-[22px] h-[22px] text-brand-text-primary",
  buttonClassName = "hover:bg-brand-secondary/20"
}: NotificationDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const currentUserId = useAuthStore(state => state.id);
  const registeredUsers = useAuthStore(state => state.users);
  const updateUserNotifications = useAuthStore(state => state.updateUserNotifications);

  const currentUser = registeredUsers.find(u => u.id === currentUserId);
  const notifications = currentUser?.notifications || [];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => removeEventListener('resize', handleResize);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const thisWeek = new Date(today);
  thisWeek.setDate(thisWeek.getDate() - 7);

  const todayNotifs = notifications.filter(n => new Date(n.createdAt) >= today);
  const yesterdayNotifs = notifications.filter(n => new Date(n.createdAt) >= yesterday && new Date(n.createdAt) < today);
  const weekNotifs = notifications.filter(n => new Date(n.createdAt) >= thisWeek && new Date(n.createdAt) < yesterday);
  const olderNotifs = notifications.filter(n => new Date(n.createdAt) < thisWeek);

  const handleMarkAllRead = () => {
    if (!currentUserId) return;
    const updatedNotifs = notifications.map(n => ({ ...n, isRead: true }));
    updateUserNotifications(currentUserId, updatedNotifs);
  };

  const Content = () => (
    <div className={`${isMobile ? 'flex flex-col h-full w-full bg-brand-background' : 'flex flex-col w-[380px] bg-brand-background/80 backdrop-blur-3xl rounded-xl border border-brand-grey/20 shadow-2xl overflow-hidden'}`}>
      {/* Header */}
      <div className="shrink-0 pt-6 pb-4 px-4 flex items-center justify-between border-b border-brand-grey/20">
        <div className="flex items-center gap-2">
          {isMobile ? (
            <button onClick={() => setOpen(false)} className="p-1 -ml-1 text-brand-text-primary hover:bg-brand-secondary/20 rounded-lg transition-colors">
              <ChevronLeft size={28} strokeWidth={2.5} />
            </button>
          ) : null}
          <h2 className={`${isMobile ? 'text-[28px]' : 'text-2xl'} font-bold text-brand-text-primary tracking-tight`}>
            Notification
          </h2>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-xs font-bold text-brand-text-secondary hover:text-brand-text-primary transition-colors flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-brand-secondary/20"
          >
            <CheckCircle2 size={14} />
            Mark all read
          </button>
        )}
      </div>

      {/* Body */}
      <ScrollArea className={`${isMobile ? 'flex-1 h-[calc(100svh-90px)]' : 'h-[500px]'} px-4 py-2`}>
        <div className="flex flex-col gap-6 py-4">

          {notifications.length === 0 && (
            <div className="py-12 flex flex-col items-center justify-center text-center opacity-50">
              <Bell className="w-12 h-12 text-brand-text-secondary mb-3" />
              <p className="text-brand-text-primary font-medium">You're all caught up!</p>
              <p className="text-sm text-brand-text-secondary">No new notifications</p>
            </div>
          )}

          {todayNotifs.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-brand-text-secondary tracking-wider uppercase pl-1">Today</h3>
              <div className="flex flex-col gap-2">
                {todayNotifs.map(n => <NotificationItem key={n.id} notification={n} />)}
              </div>
            </div>
          )}

          {yesterdayNotifs.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-brand-text-secondary tracking-wider uppercase pl-1">Yesterday</h3>
              <div className="flex flex-col gap-2">
                {yesterdayNotifs.map(n => <NotificationItem key={n.id} notification={n} />)}
              </div>
            </div>
          )}

          {weekNotifs.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-brand-text-secondary tracking-wider uppercase pl-1">This week</h3>
              <div className="flex flex-col gap-2">
                {weekNotifs.map(n => <NotificationItem key={n.id} notification={n} />)}
              </div>
            </div>
          )}

          {olderNotifs.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-brand-text-secondary tracking-wider uppercase pl-1">Older</h3>
              <div className="flex flex-col gap-2">
                {olderNotifs.map(n => <NotificationItem key={n.id} notification={n} />)}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <>
      {/* Desktop Popover */}
      {!isMobile && (
        <Popover open={open} onOpenChange={setOpen}>
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <button className={`relative p-2 rounded-brand-button transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${buttonClassName}`}>
                    <Bell className={iconClassName} strokeWidth={1.5} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-red rounded-full ring-2 ring-brand-background shadow-sm" />
                    )}
                  </button>
                </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={8} className="z-110">
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <PopoverContent className="w-auto p-0 border-0 shadow-none bg-transparent z-9999" align="end" sideOffset={8}>
            <Content />
          </PopoverContent>
        </Popover>
      )}

      {/* Mobile Absolute Modal (simulating full screen sheet smoothly) */}
      {isMobile && (
        <>
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={() => setOpen(true)} className={`relative p-2 rounded-brand-button transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${buttonClassName}`}>
                  <Bell className={iconClassName} strokeWidth={1.5} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-red rounded-full ring-2 ring-brand-background shadow-sm" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={8} className="z-110">
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {typeof document !== 'undefined' && createPortal(
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, x: '100%' }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed w-full inset-0 z-9999 bg-brand-background overflow-hidden"
                >
                  <Content />
                </motion.div>
              )}
            </AnimatePresence>,
            document.body
          )}
        </>
      )}
    </>
  );
};

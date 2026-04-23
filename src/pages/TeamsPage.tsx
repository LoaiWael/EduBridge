import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, FilterX } from 'lucide-react';
import communityBanner from '@/assets/imgs/svg/community.svg';
import { TeamCard } from '@/features/teams/components/TeamCard';
import teamsData from '@/data/teams.json';
import type { Team } from '@/features/teams/types';
import BackButton from '@/components/BackButton';
import ChatbotButton from '@/features/chatbot/components/ChatbotButton';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useProfileStore } from '@/features/profile';

interface ExtendedTeam extends Team {
  isBookmarked?: boolean;
  subject?: string;
  year?: string;
  department?: string;
}

const mockTeams = teamsData as unknown as ExtendedTeam[];

const extendedTeams: ExtendedTeam[] = mockTeams.map((team, i) => ({
  ...team,
  subject: ['Computer Science', 'Mathematics', 'Physics', 'Data Science'][i % 4],
  year: ['First Year', 'Second Year', 'Third Year', 'Fourth Year'][i % 4],
  department: ['Engineering', 'Science', 'Arts'][i % 3],
}));

const statusOptions = ['Open', 'Partial', 'Full'];
const subjectOptions = ['Computer Science', 'Mathematics', 'Physics', 'Data Science'];
const yearOptions = ['First Year', 'Second Year', 'Third Year', 'Fourth Year'];
const deptOptions = ['Engineering', 'Science', 'Arts'];

function TeamCardSkeleton() {
  return (
    <div className="w-full bg-brand-card rounded-[24px] p-5 shadow-brand-card flex flex-col border border-brand-grey/20 animate-pulse">
      <div className="flex justify-between items-start mb-2">
        <div className="h-7 w-32 bg-brand-grey/20 rounded-md" />
        <div className="w-6 h-6 bg-brand-grey/20 rounded" />
      </div>
      <div className="grow mb-4">
        <div className="h-4 w-full bg-brand-grey/20 rounded mb-2" />
        <div className="h-4 w-3/4 bg-brand-grey/20 rounded" />
      </div>
      <div className="w-full border-t border-border border-dashed my-2" />
      <div className="flex justify-end mt-auto pt-2">
        <div className="h-10 w-28 bg-brand-grey/20 rounded-brand-button" />
      </div>
    </div>
  );
}

export function TeamsPage() {
  const role = useProfileStore(state => state.role);
  const [status, setStatus] = useState('');
  const [subject, setSubject] = useState('');
  const [year, setYear] = useState('');
  const [dept, setDept] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = "EduBridge - Teams Community";
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const filteredTeams = useMemo(() => {
    return extendedTeams.filter(team => {
      if (status && team.status !== status) return false;
      if (subject && team.subject !== subject) return false;
      if (year && team.year !== year) return false;
      if (dept && team.department !== dept) return false;
      return true;
    });
  }, [status, subject, year, dept]);

  const hasFilters = status || subject || year || dept;

  const clearFilters = () => {
    setStatus('');
    setSubject('');
    setYear('');
    setDept('');
  };

  const listItemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.3
      }
    })
  };

  const fadeDownVariants = {
    hidden: { opacity: 0, y: -15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="min-h-screen w-full bg-linear-to-b from-brand-primary/20 via-brand-background to-brand-primary/10 pb-24 relative overflow-x-hidden pt-6">

        {/* Top Header - Just Left Back Button */}
        <div
          className="px-6 pb-4"
        >
          <BackButton />
        </div>

        <motion.div
          className="lg:w-[80dvw] max-w-7xl mx-auto flex flex-col gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
        >
          {/* Banner */}
          <motion.div variants={fadeDownVariants} className="px-6 w-full flex justify-center">
            <div className="relative w-full rounded-[30px] bg-linear-to-b from-brand-primary/60 to-brand-pink/40 shadow-[0_4px_24px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between pt-8 px-6 pb-0 md:p-10 min-h-[200px] md:min-h-[280px]">

              {/* Title */}
              <div className="z-10 w-full md:w-[60%] pb-2 md:pb-0">
                <h1
                  className="text-white leading-[0.85] drop-shadow-sm text-4xl sm:text-[64px] md:text-[80px] lg:text-[100px]"
                  style={{ fontFamily: 'var(--font-brand-teams)' }}
                >
                  EduBridge
                  <br />
                  Community
                </h1>
              </div>

              {/* Image */}
              <div className="relative md:absolute right-0 bottom-0 w-[90%] sm:w-[70%] md:w-[55%] h-auto md:h-full flex justify-end items-end self-end z-0 mt-4 md:mt-0">
                <img
                  src={communityBanner}
                  alt="People working together"
                  className="w-full h-auto md:h-[95%] md:w-auto object-contain object-bottom-right"
                />
              </div>

            </div>
          </motion.div>

          {/* Filters */}
          <motion.div variants={fadeDownVariants} className="px-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold text-brand-text-primary">Filter</h2>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 cursor-pointer text-sm text-brand-text-secondary hover:text-brand-text-secondary/70 transition-colors"
                >
                  <FilterX className="w-4 h-4" />
                  Clear filters
                </button>
              )}
            </div>
            <div className="flex gap-3 flex-wrap pb-2 hide-scrollbar snap-x">
              <div className="relative shrink-0 snap-start">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="appearance-none bg-brand-card min-w-[100px] border border-border/50 rounded-xl px-4 py-2.5 pr-8 text-sm font-medium text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary shadow-sm"
                >
                  <option value="">Status</option>
                  {statusOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-brand-text-secondary">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>

              <div className="relative shrink-0 snap-start">
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="appearance-none bg-brand-card min-w-[130px] border border-border/50 rounded-xl px-4 py-2.5 pr-8 text-sm font-medium text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary shadow-sm"
                >
                  <option value="">Subject</option>
                  {subjectOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-brand-text-secondary">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>

              <div className="relative shrink-0 snap-start">
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="appearance-none bg-brand-card min-w-[120px] border border-border/50 rounded-xl px-4 py-2.5 pr-8 text-sm font-medium text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary shadow-sm"
                >
                  <option value="">Year</option>
                  {yearOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-brand-text-secondary">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>

              <div className="relative shrink-0 snap-start">
                <select
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                  className="appearance-none bg-brand-card min-w-[120px] border border-border/50 rounded-xl px-4 py-2.5 pr-8 text-sm font-medium text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary shadow-sm"
                >
                  <option value="">Dept.</option>
                  {deptOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-brand-text-secondary">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Team List */}
          <div className="px-6 flex flex-col gap-4 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-6 lg:items-stretch pb-[100px]">
            <AnimatePresence mode="wait">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TeamCardSkeleton key={`skeleton-${i}`} />
                ))
              ) : filteredTeams.length > 0 ? (
                filteredTeams.map((team, index) => (
                  <TeamCard
                    key={team.id}
                    team={team}
                    index={index}
                    variants={listItemVariants}
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full flex flex-col items-center justify-center py-16 text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-brand-primary/10 flex items-center justify-center mb-4">
                    <Users className="w-10 h-10 text-brand-text-secondary" />
                  </div>
                  <h3 className="text-lg font-semibold text-brand-text-primary mb-2">
                    No teams found
                  </h3>
                  <p className="text-brand-text-secondary text-sm max-w-xs mb-4">
                    {hasFilters
                      ? "Try adjusting your filters to see more teams"
                      : "No teams available at the moment"}
                  </p>
                  {hasFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-brand-pink hover:underline text-sm font-medium"
                    >
                      Clear all filters
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </motion.div>

        {/* Floating Chatbot Button conditionally rendered */}
        {role !== 'ta' && (
          <div className="fixed bottom-[100px] right-4 lg:right-10 z-50">
            <ChatbotButton />
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

export default TeamsPage;
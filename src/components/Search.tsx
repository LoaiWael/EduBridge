import { useState, useRef } from "react";
import { Search as SearchIcon, User, Users, Lightbulb, UsersRound, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth";
import { useTeamStore } from "@/features/teams/store/useTeamStore";
import { Popover, PopoverContent, PopoverAnchor } from "@/components/ui/popover";
import ProfileAvatar from "@/features/profile/components/ProfileAvatar";

import usersData from "@/data/users.json";
import teamsData from "@/data/teams.json";
import ideasData from "@/data/ideas.json";

import type { Team } from "@/features/teams/types";
import type { Idea } from "@/features/ideas/types";

interface SearchResult {
  id: string;
  type: 'student' | 'ta' | 'team' | 'idea';
  title: string;
  subtitle?: string;
  link: string;
  imageUrl?: string;
}

const Search = () => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const currentUserId = useAuthStore(state => state.id);
  const registeredUsers = useAuthStore(state => state.users);
  const localTeams = useTeamStore(state => state.teams);

  // Combine all data sources
  const allData = (() => {
    // 1. Users (Students & TAs)
    const combinedUsers = [...(usersData as any[])];
    registeredUsers.forEach(regUser => {
      if (!combinedUsers.some(u => u.id === regUser.id)) {
        combinedUsers.push({
          ...regUser.profile,
          id: regUser.id,
          role: regUser.role,
          profileImageUrl: (regUser.profile as any)?.profileImageUrl
        });
      }
    });

    // 2. Teams
    const combinedTeams = [...(teamsData as Team[])];
    // Add teams from registered users' "myTeams"
    registeredUsers.forEach(user => {
      (user.myTeams || []).forEach(team => {
        if (!combinedTeams.some(t => t.id === team.id)) {
          combinedTeams.push(team);
        }
      });
    });
    // Add teams from useTeamStore
    localTeams.forEach(team => {
      if (!combinedTeams.some(t => t.id === team.id)) {
        combinedTeams.push(team);
      }
    });

    // 3. Ideas
    const allIdeas = ideasData as Idea[];

    return {
      users: combinedUsers,
      teams: combinedTeams,
      ideas: allIdeas
    };
  })();

  // Filter results
  const filteredResults = (() => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    const results: SearchResult[] = [];

    // Filter Users
    allData.users.forEach(user => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      if (user.id !== currentUserId && (fullName.includes(lowerQuery) || user.email?.toLowerCase().includes(lowerQuery))) {
        results.push({
          id: user.id,
          type: user.role === 'ta' ? 'ta' : 'student',
          title: `${user.firstName} ${user.lastName}`,
          subtitle: user.role === 'ta' ? user.academicTitle || 'Teaching Assistant' : user.major || 'Student',
          link: `/bridge/${user.id}`,
          imageUrl: user.profileImageUrl
        });
      }
    });

    // Filter Teams
    allData.teams.forEach(team => {
      if (team.name.toLowerCase().includes(lowerQuery) || (team.subject && team.subject.toLowerCase().includes(lowerQuery))) {
        results.push({
          id: team.id,
          type: 'team',
          title: team.name,
          subtitle: team.subject ? `Subject: ${team.subject}` : 'Team',
          link: `/teams/${team.id}`
        });
      }
    });

    // Filter Ideas
    allData.ideas.forEach(idea => {
      if (idea.title.toLowerCase().includes(lowerQuery) || idea.description.toLowerCase().includes(lowerQuery)) {
        results.push({
          id: idea.id,
          type: 'idea',
          title: idea.title,
          subtitle: 'Idea',
          link: `/library/${idea.id}`
        });
      }
    });

    return results;
  })();

  const handleSelect = (link: string) => {
    navigate(link, { viewTransition: true });
    setIsOpen(false);
    setQuery("");
  };

  const categories = [
    { type: 'student', label: 'Students', icon: User },
    { type: 'ta', label: 'Teaching Assistants', icon: UsersRound },
    { type: 'team', label: 'Teams', icon: Users },
    { type: 'idea', label: 'Ideas', icon: Lightbulb },
  ];

  return (
    <div className="relative w-full">
      <Popover open={isOpen && query.length > 0} onOpenChange={setIsOpen}>
        <PopoverAnchor asChild>
          <div className="relative group">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-[22px] h-[22px] text-brand-text-secondary transition-colors group-focus-within:text-brand-pink" strokeWidth={1.5} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (e.target.value.length > 0) setIsOpen(true);
              }}
              onFocus={() => query.length > 0 && setIsOpen(true)}
              placeholder="Search students, TAs, ideas or teams..."
              className="w-full h-14 bg-brand-card text-brand-text-primary rounded-brand-input pl-12 pr-12 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-pink/50 text-base transition-all border border-brand-grey/20"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  setIsOpen(false);
                  inputRef.current?.focus();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-brand-grey/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-brand-text-secondary" />
              </button>
            )}
          </div>
        </PopoverAnchor>

        <PopoverContent
          className="w-[calc(100vw-3.75rem)] lg:w-3xl p-0 border-brand-grey/20 shadow-xl overflow-hidden rounded-brand-card bg-brand-card mt-2 flex flex-col max-h-[min(500px,80vh)]"
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="flex-1 w-full overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-brand-primary/20 scrollbar-track-transparent">
            <div className="p-2">
              {filteredResults.length > 0 ? (
                categories.map(cat => {
                  const catResults = filteredResults.filter(r => r.type === cat.type);
                  if (catResults.length === 0) return null;

                  return (
                    <div key={cat.type} className="mb-4 last:mb-0">
                      <div className="px-4 py-2 text-xs font-bold text-brand-text-secondary uppercase tracking-wider flex items-center gap-2">
                        <cat.icon className="w-3.5 h-3.5" />
                        {cat.label}
                      </div>
                      <div className="space-y-1">
                        {catResults.map(result => (
                          <button
                            key={result.id}
                            onClick={() => handleSelect(result.link)}
                            className="w-full text-left px-4 py-3 rounded-lg hover:bg-brand-pink/10 transition-all flex items-center gap-3 group active:scale-[0.99]"
                          >
                            {(result.type === 'student' || result.type === 'ta') && (
                              <ProfileAvatar imageUrl={result.imageUrl} name={result.title} className="w-9 h-9" />
                            )}
                            <div className="flex flex-col grow">
                              <span className="font-semibold text-brand-text-primary group-hover:text-brand-pink transition-colors text-[15px]">
                                {result.title}
                              </span>
                              {result.subtitle && (
                                <span className="text-xs text-brand-text-secondary">
                                  {result.subtitle}
                                </span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center">
                  <p className="text-brand-text-secondary">No results found for "{query}"</p>
                </div>
              )}
            </div>
          </div>
          <div className="bg-brand-primary/5 p-3 border-t border-brand-grey/10 flex justify-between items-center text-[10px] text-brand-text-secondary shrink-0">
            <span>Press Enter to view all results</span>
            <span className="bg-brand-background px-1.5 py-0.5 rounded border border-brand-grey/20 shadow-xs">ESC to close</span>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Search;

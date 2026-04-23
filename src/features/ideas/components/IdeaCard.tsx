import { Link } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import type { Idea } from '../types';
import { toast } from 'sonner';
import { useProfileStore } from '@/features/profile';
import { useIdeasStore } from '../store/useIdeasStore';

export interface IdeaCardProps {
  idea: Idea;
  index?: number;
  variants?: any;
}

export function IdeaCard({ idea, index = 0, variants }: IdeaCardProps) {
  const role = useProfileStore(state => state.role)
  const isBookmarked = useIdeasStore(state => state.savedIdeaIds.includes(idea.id));
  const toggleSaveIdea = useIdeasStore(state => state.toggleSaveIdea);

  return (
    <motion.div
      key={idea.id}
      custom={index}
      variants={variants}
      initial="hidden"
      animate="visible"
      layout
      className="w-full bg-brand-card rounded-3xl p-5 shadow-brand-card flex flex-col border border-brand-grey/10 relative"
    >
      <div className="flex justify-between items-start mb-1">
        <h2 className="text-xl font-bold text-brand-text-primary mr-8">
          {idea.title}
        </h2>
        {role !== 'ta' && <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={(e) => {
                e.preventDefault();
                const wasBookmarked = isBookmarked;
                toggleSaveIdea(idea.id);
                toast.success(!wasBookmarked ? "Idea saved to your library!" : "Idea removed from library", {
                  description: !wasBookmarked ? `You can now find "${idea.title}" in your saved ideas.` : `"${idea.title}" has been removed.`,
                  duration: 2000,
                });
              }}
              className="text-brand-text-secondary hover:text-brand-text-primary transition-colors focus:outline-none absolute top-5 right-5"
              aria-label={isBookmarked ? "Remove bookmark" : "Bookmark idea"}
            >
              <Bookmark className="w-6 h-6" fill={isBookmarked ? 'currentColor' : 'transparent'} />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isBookmarked ? "Saved" : "Save Idea"}</p>
          </TooltipContent>
        </Tooltip>}
      </div>

      <div className="grow">
        <p className="text-brand-text-secondary text-sm mb-3">
          {idea.description}
        </p>
      </div>

      <div className="flex justify-end mt-auto">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to={`/library/${idea.id}`}
              viewTransition
              className="bg-linear-to-b from-brand-primary to-brand-pink text-brand-text-primary text-sm font-semibold px-4 py-2 flex items-center justify-center rounded-brand-card hover:opacity-90 active:scale-95 shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
              aria-label={`View details for ${idea.title}`}
            >
              View details
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>Click to view project details</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </motion.div>
  );
}

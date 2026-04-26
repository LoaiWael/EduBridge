import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import type { Team } from '../types';

export interface TeamCardProps {
  team: Team & { isBookmarked?: boolean };
  index?: number;
  variants?: any;
}

export function TeamCard({ team, index = 0, variants }: TeamCardProps) {
  return (
    <motion.div
      custom={index}
      variants={variants}
      initial="hidden"
      animate="visible"
      layout
      className="w-full bg-brand-card rounded-[24px] p-5 shadow-brand-card flex flex-col border border-brand-grey/20 relative"
    >
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-xl font-bold text-brand-text-primary">{team.name}</h2>
      </div>

      <div className="grow mb-4">
        {typeof team.description === 'string' && (
          <p className="text-brand-text-secondary text-sm leading-snug">
            {team.description}
          </p>
        )}
      </div>

      <div className="w-full border-t border-border border-dashed my-2"></div>

      <div className="flex justify-end mt-auto pt-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to={`/teams/${team.id}`}
              viewTransition
              className="bg-linear-to-b from-brand-primary to-brand-pink text-brand-text-primary text-sm font-semibold px-5 py-2.5 flex items-center justify-center rounded-brand-button hover:opacity-90 active:scale-95 shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
            >
              View details
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>Click to view team details</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </motion.div>
  );
}

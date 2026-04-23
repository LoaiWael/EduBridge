import { motion, AnimatePresence } from "framer-motion";
import { X, Bookmark, ChevronRight } from "lucide-react";
import { useIdeasStore } from "../store/useIdeasStore";
import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SavedIdeasDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SavedIdeasDialog({ isOpen, onClose }: SavedIdeasDialogProps) {
  const ideas = useIdeasStore((state) => state.ideas);
  const savedIdeaIds = useIdeasStore((state) => state.savedIdeaIds);
  const savedIdeas = ideas.filter((i) => savedIdeaIds.includes(i.id));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop/Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-110"
          />

          {/* Dialog Content */}
          <div className="fixed inset-0 flex items-center justify-center z-120 pointer-events-none p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="pointer-events-auto w-full max-w-lg bg-brand-card rounded-[2.5rem] shadow-2xl overflow-hidden border border-brand-grey/20 flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="p-6 sm:p-8 flex items-center justify-between border-b border-brand-grey/10 bg-linear-to-r from-brand-primary/5 to-transparent">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-brand-pink/10 rounded-2xl shadow-inner">
                    <Bookmark className="size-6 text-brand-pink" fill="currentColor" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-brand-text-primary tracking-tight">Your Saved Ideas</h3>
                    <p className="text-xs text-brand-text-secondary font-medium mt-0.5">
                      {savedIdeas.length} project{savedIdeas.length === 1 ? "" : "s"} bookmarked
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2.5 hover:bg-brand-grey/20 rounded-full transition-all active:scale-90"
                  aria-label="Close dialog"
                >
                  <X className="size-6 text-brand-text-secondary" />
                </button>
              </div>

              {/* Body */}
              <ScrollArea className="flex-1 overflow-y-auto">
                <div className="p-6">
                  {savedIdeas.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {savedIdeas.map((idea) => (
                        <Link
                          key={idea.id}
                          to={`/library/${idea.id}`}
                          onClick={onClose}
                          className="group relative flex items-center gap-4 p-5 bg-brand-background rounded-3xl border border-brand-grey/10 hover:border-brand-primary/30 hover:bg-brand-primary/5 transition-all shadow-sm active:scale-[0.98]"
                        >
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-brand-text-primary truncate text-base group-hover:text-brand-pink transition-colors">
                              {idea.title}
                            </h4>
                            <p className="text-xs text-brand-text-secondary line-clamp-1 mt-1 font-medium italic opacity-80">
                              {idea.categoryId.charAt(0).toUpperCase() + idea.categoryId.slice(1)}
                            </p>
                          </div>
                          <div className="shrink-0 size-10 bg-brand-card rounded-xl border border-brand-grey/10 flex items-center justify-center group-hover:bg-brand-pink group-hover:text-white transition-colors">
                            <ChevronRight className="size-5" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="size-20 bg-brand-grey/10 rounded-full flex items-center justify-center mb-6 border border-brand-grey/5">
                        <Bookmark className="size-10 text-brand-dark-grey/20" />
                      </div>
                      <h4 className="text-lg font-bold text-brand-text-primary mb-1">Your library is empty</h4>
                      <p className="text-sm text-brand-text-secondary max-w-[240px] leading-relaxed">
                        Start saving ideas from the library to see them listed here.
                      </p>
                      <Link
                        to="/library"
                        onClick={onClose}
                        className="mt-8 px-6 py-2.5 bg-brand-primary text-white text-sm font-bold rounded-full hover:opacity-90 transition-opacity"
                      >
                        Browse Library
                      </Link>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Footer */}
              {savedIdeas.length > 0 && (
                <div className="p-6 bg-brand-background/50 border-t border-brand-grey/10 flex justify-center">
                  <Link
                    to="/library"
                    onClick={onClose}
                    className="text-xs font-black text-brand-pink/70 hover:text-brand-pink uppercase tracking-[0.2em] transition-colors"
                  >
                    Manage all ideas
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export default SavedIdeasDialog;
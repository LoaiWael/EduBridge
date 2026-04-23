import { create } from 'zustand';
import type { Idea, IdeaCategory, IdeaTag } from '../types';

interface IdeasState {
  // Data
  ideas: Idea[];
  categories: IdeaCategory[];
  tags: IdeaTag[];
  savedIdeaIds: string[]; // IDs of ideas saved by the user

  // Filters
  selectedCategoryId: string | null;
  selectedTagId: string | null;
  selectedIdeaId: string | null;

  // UI State
  loading: boolean;
  error: string | null;

  setIdeas: (ideas: Idea[]) => void;
  setSelectedIdea: (id: string | null) => void;
  toggleSaveIdea: (id: string) => void;
  setSavedIdeaIds: (ids: string[]) => void;

  // Actions - Categories
  setCategories: (categories: IdeaCategory[]) => void;
  addCategory: (category: IdeaCategory) => void;
  setSelectedCategory: (id: string | null) => void;

  // Actions - Tags
  setTags: (tags: IdeaTag[]) => void;
  addTag: (tag: IdeaTag) => void;
  updateTag: (id: string, updates: Partial<IdeaTag>) => void;
  removeTag: (id: string) => void;
  setSelectedTag: (id: string | null) => void;

  // Actions - UI
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Getters
  getIdeasByCategory: (categoryId: string) => Idea[];
  getIdeasByTag: (tagId: string) => Idea[];
  getTagsByCategory: (categoryId: string) => IdeaTag[];
  isIdeaSaved: (id: string) => boolean;
}

export const useIdeasStore = create<IdeasState>()(
  (set, get) => ({
    // Initial Data
    ideas: [],
    categories: [],
    tags: [],
    savedIdeaIds: [],

    // Initial Filters
    selectedCategoryId: null,
    selectedTagId: null,
    selectedIdeaId: null,

    // Initial UI State
    loading: false,
    error: null,

    // Ideas Actions
    setIdeas: (ideas) => set({ ideas }),
    setSelectedIdea: (selectedIdeaId) => set({ selectedIdeaId }),
    toggleSaveIdea: (id) => set((state) => ({
      savedIdeaIds: state.savedIdeaIds.includes(id)
        ? state.savedIdeaIds.filter(savedId => savedId !== id)
        : [...state.savedIdeaIds, id]
    })),
    setSavedIdeaIds: (savedIdeaIds) => set({ savedIdeaIds }),

    // Categories Actions
    setCategories: (categories) => set({ categories }),
    addCategory: (category) =>
      set((state) => ({ categories: [...state.categories, category] })),
    setSelectedCategory: (selectedCategoryId) =>
      set({ selectedCategoryId, selectedTagId: null }),

    // Tags Actions
    setTags: (tags) => set({ tags }),
    addTag: (tag) => set((state) => ({ tags: [...state.tags, tag] })),
    updateTag: (id, updates) =>
      set((state) => ({
        tags: state.tags.map((tag) =>
          tag.id === id ? { ...tag, ...updates } : tag
        ),
      })),
    removeTag: (id) =>
      set((state) => ({ tags: state.tags.filter((tag) => tag.id !== id) })),
    setSelectedTag: (selectedTagId) => set({ selectedTagId }),

    // UI Actions
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),

    // Getters
    getIdeasByCategory: (categoryId) =>
      get().ideas.filter((idea) => idea.categoryId === categoryId),
    getIdeasByTag: (tagId) =>
      get().ideas.filter((idea) =>
        idea.tags.some((tag) => tag.id === tagId)
      ),
    getTagsByCategory: (categoryId) =>
      get().tags.filter((tag) => tag.categoryId === categoryId),
    isIdeaSaved: (id) => get().savedIdeaIds.includes(id),
  })
);
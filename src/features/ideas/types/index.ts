// Idea Category - belongs to a category
export interface IdeaCategory {
  id: string;
  name: string; // normalized to lowercase
}

// Idea Tag - belongs to a category, can have multiple tags per idea
export interface IdeaTag {
  id: string;
  name: string;
  categoryId: string;
}

// Idea - each team can have one idea (project concept)
export interface Idea {
  id: string;
  title: string;
  description: string;
  repositoryUrl?: string;
  categoryId: string;
  category?: IdeaCategory;
  tags: IdeaTag[];
  teamId: string;
  createdAt?: string;
  updatedAt?: string;
}

// API Response types
export interface IdeaCategoriesResponse {
  categories: IdeaCategory[];
  tags: IdeaTag[];
}

export interface IdeasResponse {
  ideas: Idea[];
}
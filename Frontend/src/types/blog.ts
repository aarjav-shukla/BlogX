export interface Blog {
  id: number | string;
  title: string;
  content: string;
  authorId?: string;
  author?: {
    name?: string;
    email?: string;
    avatar?: string;
    role?: string;
  };
  category?: string;
  date?: string;
  readTime?: string;
  imageUrl?: string;
  isFeatured?: boolean;
  dek?: string; // Subtitle / summary
}

export interface Columnist {
  name: string;
  role: string;
  avatar: string;
  bio: string;
  latestArticleTitle: string;
}

export interface PodcastEpisode {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  date: string;
  audioUrl?: string;
}

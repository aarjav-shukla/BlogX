export interface Blog {
  id: number;
  title: string;
  content: string;
  authorId?: string;
  published?: boolean;
}

export interface BlogEnvelope {
  blogs: Blog[];
}

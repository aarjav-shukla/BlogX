const words = (text: string): number =>
  text.trim().split(/\s+/).filter(Boolean).length;

export const readTime = (text: string): string =>
  `${Math.max(1, Math.ceil(words(text) / 220))} min read`;

export const flatten = (text: string): string =>
  text.replace(/\s+/g, ' ').trim();

export const deck = (text: string, max = 190): string => {
  const t = flatten(text);
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
};

export const byline = (authorId?: string, ownId?: string | null): string => {
  if (authorId && ownId && authorId === ownId) return 'by you';
  return authorId
    ? `by contributor ${authorId.slice(0, 8)}`
    : 'by an unnamed contributor';
};

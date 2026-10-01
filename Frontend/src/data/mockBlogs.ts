import type { Blog, Columnist, PodcastEpisode } from '../types/blog';

export const MOCK_BLOGS: Blog[] = [
  {
    id: 'hero-1',
    title: "Can Bernie Sanders Fix America's Broken Anti-Semitism Conversation?",
    dek: "The presidential trailblazer just took a historic first step toward national dialogue about anti-Semitism. But its success will depend on whether he's willing to confront some hard choices.",
    content: `For decades, the public conversation surrounding religious tolerance and national discourse has oscillated between political rhetoric and genuine social reform. In this exhaustive analysis, we examine the systemic roots of modern discourse, structural polarization, and the delicate balance required to foster true civic harmony across ideological divides.

    As communities across the country navigate changing cultural landscapes, historians and sociologists point to pivotal historical inflection points where public policy met moral philosophy. The path forward demands not just political willpower, but a re-examination of our fundamental shared values and institutional commitments.`,
    author: {
      name: "YAIR ROSENBERG",
      email: "y.rosenberg@tablet.org",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      role: "Senior Editorial Fellow"
    },
    category: "NEWS",
    date: "14 OCT 2026",
    readTime: "8 MIN READ",
    imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80",
    isFeatured: true,
  },
  {
    id: 'hero-2',
    title: "Zahav Chef Michael Solomonov a Semifinalist for James Beard Award",
    dek: "Tova du Plessis, the Jewish owner of South Philadelphia's Essen Bakery, has also been nominated for Outstanding Baker in this year's nationwide culinary honors.",
    content: `Culinary mastery meets cultural heritage in the heart of South Philadelphia. Chef Michael Solomonov continues to reshape traditional Mediterranean gastronomy into modern fine dining masterpieces, earning praise from food critics across North America.`,
    author: {
      name: "LIEL LEIBOVITZ",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      role: "Senior Writer"
    },
    category: "SCIENCE & CULTURE",
    date: "12 OCT 2026",
    readTime: "5 MIN READ",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 'fyrre-1',
    title: "Hope Dies Last: The Resilience of Classical Sculpture",
    dek: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Egestas dui id ornare arcu odio ut sem.",
    content: `Art is not merely a mirror reflected upon reality, but a hammer with which to shape it. From ancient marble busts to digital abstractions, human artistic expression preserves memories through eras of upheaval and light.`,
    author: {
      name: "JAKOB GRONBERG",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      role: "Art Historian"
    },
    category: "ART",
    date: "16 MARCH 2026",
    readTime: "4 MIN READ",
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 'fyrre-2',
    title: "Don't Close Your Eyes: Surrealism in the Modern Era",
    dek: "Explorations into the subconscious mind through monochrome printmaking and contemporary digital collage.",
    content: `When surrealism first surfaced in early 20th-century Paris, it offered an escape route from rationalism's rigid confines. Today, digital creators revive dreamlike landscapes using algorithmic synthesis and hand-drawn line art.`,
    author: {
      name: "JAKOB GRONBERG",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      role: "Art Historian"
    },
    category: "ART",
    date: "15 MARCH 2026",
    readTime: "6 MIN READ",
    imageUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 'fyrre-3',
    title: "The Best Art Museums of Northern Europe",
    dek: "A architectural and curatorial guide to the silent galleries of Stockholm, Oslo, and Copenhagen.",
    content: `Minimalist architecture meets centuries of Nordic craftsmanship. We take a journey through Scandinavia's most celebrated galleries, examining light design, space curation, and permanent collections.`,
    author: {
      name: "JAKOB GRONBERG",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      role: "Art Historian"
    },
    category: "SCULPTURES",
    date: "14 MARCH 2026",
    readTime: "7 MIN READ",
    imageUrl: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 'tablet-3',
    title: "The Real Problem With Cancel Culture",
    dek: "It's not about celebrities. It's about us losing trust in each other and destroying civic forgiveness.",
    content: `Public shaming was once restricted to pillories and local courts. Today, digital networks scale outrage globally within seconds. But what happens when redemption is erased from public discourse?`,
    author: {
      name: "KAT ROSENFIELD",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
      role: "Culture Critic"
    },
    category: "BELIEF",
    date: "10 OCT 2026",
    readTime: "7 MIN READ",
    imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 'tablet-4',
    title: "Papers, Please: A Video Game With No Shootouts or Theft—Only the Banality of Evil",
    dek: "Tova du Plessis on how interactive media can simulate administrative bureaucracy, ethics, and moral choice under total surveillance.",
    content: `Few digital experiences manage to turn mundane paperwork into a harrowing interrogation of duty versus human compassion. We analyze the design mechanics of indie games that tackle bureaucracy and ethics.`,
    author: {
      name: "LIEL LEIBOVITZ",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      role: "Gaming & Tech Editor"
    },
    category: "NEWS",
    date: "08 OCT 2026",
    readTime: "9 MIN READ",
    imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 'fyrre-4',
    title: "Street Art Festival: Reclaiming the Urban Canvas",
    dek: "Monochrome muralists transform forgotten concrete structures into towering monuments of storytelling.",
    content: `Urban street art has evolved from guerrilla graffiti tags into large-scale public art installations that re-energize neighborhood identities and question commercial spatial dominance.`,
    author: {
      name: "JAKOB GRONBERG",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      role: "Art Historian"
    },
    category: "STREET ART",
    date: "12 MARCH 2026",
    readTime: "5 MIN READ",
    imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80",
  }
];

export const MOCK_COLUMNIST: Columnist = {
  name: "LIEL LEIBOVITZ",
  role: "Featured Columnist & Senior Editor",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
  bio: "Liel Leibovitz is a senior writer for Tablet Magazine and a host of the Unorthodox podcast. He writes extensively on culture, theology, and philosophy.",
  latestArticleTitle: "Why We Need Silence in an Age of Infinite Noise"
};

export const MOCK_PODCAST: PodcastEpisode = {
  id: "pod-196",
  title: "Episode 196: The One With the Instagram Rabbis",
  subtitle: "Theater legend Joel Grey on directing 'Fiddler' and navigating modern digital faith.",
  duration: "52:14",
  date: "OCTOBER 10, 2026"
};

export const FEATURED_CATEGORIES = [
  "ALL",
  "NEWS",
  "SCIENCE",
  "ART",
  "BELIEF",
  "STREET ART",
  "SCULPTURES",
  "POLITICS"
];

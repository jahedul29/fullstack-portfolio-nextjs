export const SECTION_KEYS = [
  "about",
  "projects",
  "sideProjects",
  "contributions",
  "experience",
  "blogs",
  "skills",
  "contact",
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

export type Section = {
  key: string;
  visible: boolean;
};

export const SECTION_LABELS: Record<SectionKey, string> = {
  about: "About",
  projects: "Projects",
  sideProjects: "Side Projects",
  contributions: "Contributions",
  experience: "Experience",
  blogs: "Blogs",
  skills: "Skills",
  contact: "Contact",
};

export const DEFAULT_SECTIONS: Section[] = SECTION_KEYS.map((key) => ({
  key,
  visible: true,
}));

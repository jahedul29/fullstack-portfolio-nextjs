export type IOwner = {
  name: string;
  email: string;
  phoneNumber: string;
  linkedInUrl: string;
  facebookUrl?: string;
  githubUrl: string;
  resumeUrl: string;
  stackOverflowUrl?: string;
  calanderlyUrl?: string;
  address: string;
  photoUrl: string;
  designation: string;
  summery?: string;
  aboutOwner: string;
  metaKeywords?: string[];
  sections?: { key: string; visible: boolean }[];
};

export interface IMeta {
  limit: number;
  page: number;
  total: number;
}

export type ResponseSuccessType = {
  data: any;
  meta?: IMeta;
};

export type ResponseErrorType = {
  statusCode: number;
  message: string;
  errorMessages: IGenericErrorMessage[];
};

export type IGenericErrorMessage = {
  path: string | number;
  message: string;
};

export type ISkill = {
  _id: string;
  name: string;
  level: number;
  category?: string;
  position?: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
};

export type IBlog = {
  _id: string;
  title: string;
  category: string;
  photoUrl: string;
  blogUrl: string;
  platform: string;
  description: string;
  isFeatured: boolean;
  priorityScore: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
};

export type IProject = {
  _id: string;
  title: string;
  category: string;
  photoUrl: string;
  description: string;
  githubUrl: string;
  websiteUrl: string;
  videoUrl?: string;
  isFeatured: boolean;
  technologies: ISkill[];
  priorityScore: number;
  outcome?: string;
  role?: string;
  type?: "professional" | "personal";
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
};

export type IExperience = {
  _id: string;
  companyName: string;
  position: string;
  startTime: string;
  endTime?: string;
  isWorkingCurrently: boolean;
  show: boolean;
  technologies: ISkill[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  description: string;
  impact?: string[];
  metrics?: { label: string; value: string }[];
  role?: string;
  teamSize?: number;
  id: string;
};

export type IOwner = {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  linkedInUrl: string;
  facebookUrl?: string;
  githubUrl: string;
  resumeUrl: string;
  address: string;
  photoUrl: string;
  designation: string;
  summery?: string;
  yearsOfExperience?: number;
  heroTagline?: string;
  heroHighlight?: string;
  aboutOwner: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  calanderlyUrl?: string;
  stackOverflowUrl?: string;
  metaKeywords?: string[];
  id: string;
  sections?: { key: string; visible: boolean }[];
  heroSkills?: string[];
};

export type IContribution = {
  _id: string;
  title: string;
  photoUrl: string;
  contributionFor: string;
  description: string;
  githubUrl?: string;
  relatedUrl: string;
  isFeatured: boolean;
  technologies: ISkill[];
  priorityScore: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
};

export type IMessage = {
  _id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
};

export type IUser = {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: "admin" | "manager";
  address: string;
  profileUrl?: string;
  status: "active" | "blocked";
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
};

export type ISelectOptions = {
  label: string;
  value: string;
};

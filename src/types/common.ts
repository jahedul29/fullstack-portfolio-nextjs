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
  aboutOwner: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  calanderlyUrl?: string;
  stackOverflowUrl?: string;
  id: string;
};

export type ISelectOptions = {
  label: string;
  value: string;
};

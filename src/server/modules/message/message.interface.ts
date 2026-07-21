export type IMessage = {
  name: string;
  email: string;
  message: string;
  isRead?: boolean;
};

export type IMessageMethods = object;

export type IMessageFilters = {
  searchTerm?: string;
  isRead?: boolean;
};

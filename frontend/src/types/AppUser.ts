export type AppUserType = {
  name?: string;
  role?: 'USER' | 'ADMIN';
};

export type AppUser = {
  user?: AppUserType;
  setUser: (user: AppUserType | undefined) => void;
};

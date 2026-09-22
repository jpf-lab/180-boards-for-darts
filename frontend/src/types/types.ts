export type userType = {
  name?: string;
  role?: 'USER' | 'ADMIN';
};

export type user = {
  user?: userType;
  setUser: (user: userType | undefined) => void;
};

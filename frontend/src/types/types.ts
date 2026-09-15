export type userType = {
    name?: string;
    role?: "USER" | "ADMIN";
}

export type user = {
    user?: userType | undefined;
    setUser: (user: userType | undefined) => void;
}
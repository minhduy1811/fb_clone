// src/types/user.ts
export interface AppUser {
    uid: string;
    email: string;
    displayName?: string;
    gender?: string;
    birthdate?: string;
    createdAt?: string;
    verified?: boolean;
    role?: "user" | "admin";
}

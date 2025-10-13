export interface User {
    id: string;
    name: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
    email: string;
    password: string;
    verified: boolean;
    createdAt: string;
}

export interface OTPData {
    email: string;
    code: string;
    expiresAt: number;
    userData: Omit<User, 'id' | 'verified' | 'createdAt'>;
}

export interface LoginFormData {
    email: string;
    password: string;
    rememberMe: boolean;
}

export interface SignUpFormData {
    name: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
    email: string;
    uid: string;
    password: string;
    role: 'admin' | 'user';
}

export interface VerifyFormData {
    otp: string;
}

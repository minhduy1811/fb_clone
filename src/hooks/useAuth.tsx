"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase.config";


interface AuthContextType {
    user: User | null;
    loading: boolean;
}

// ✅ Tạo context đúng cách
const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
});

// ✅ Tạo provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {

            setUser(firebaseUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // ✅ return JSX hợp lệ
    return (
        <AuthContext.Provider value={{ user, loading }
        }>
            {children}
        </AuthContext.Provider>
    );
};

// ✅ Custom hook dùng để lấy user ở mọi component
export const useAuth = () => useContext(AuthContext);

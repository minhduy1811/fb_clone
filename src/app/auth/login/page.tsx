'use client'

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import LoginForm from '@/components/auth/LoginForm';
import { setCurrentUser } from '@/lib/mockApiFeed';

const Login = () => {
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const password = searchParams.get("password");
    const verified = searchParams.get("verified");

    useEffect(() => {
        if (verified === "true" && email) {
            // Set current user from signup
            const userData = {
                userId: Date.now().toString(),
                userName: email.split('@')[0],
                email: email,
                userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
            };
            setCurrentUser(userData);
            // Clear the state after using it
            window.history.replaceState({}, document.title);
        }
    }, [email, password, verified]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-blue-600 mb-2">Facebook</h1>
                    <p className="text-muted-foreground">
                        Đăng nhập để tiếp tục
                    </p>
                </div>

                <div className="bg-card p-8 rounded-lg shadow-lg border">
                    <LoginForm
                        defaultEmail={email ?? undefined}
                        defaultPassword={password ?? undefined}
                    />
                </div>

                <div className="text-center mt-6 text-sm text-muted-foreground">
                    <p>© 2025 Facebook Clone. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default Login;

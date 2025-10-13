'use client'

import { useSearchParams, useRouter } from 'next/navigation';
import { VerifyForm } from '@/components/auth/VerifyForm';
import { useEffect } from 'react';

const VerifyOTP = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const email = searchParams.get("email");
    useEffect(() => {
        // Redirect if no email provided
        if (!email) {
            router.push('/auth/signup');
        }
    }, [email, router]);

    if (!email) {
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-blue-600 mb-2">Facebook</h1>
                    <p className="text-muted-foreground">
                        Xác thực tài khoản
                    </p>
                </div>

                <div className="bg-card p-8 rounded-lg shadow-lg border">
                    <VerifyForm email={email} />
                </div>

                <div className="text-center mt-6 text-sm text-muted-foreground">
                    <p>© 2025 Facebook Clone. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default VerifyOTP;

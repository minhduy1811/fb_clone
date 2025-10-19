'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import LoginForm from '@/components/auth/LoginForm';

// 👉 Component con chứa hook useSearchParams
function LoginContent() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    // const verified = searchParams.get("verified");

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-[430px]">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-blue-600 mb-2">Facebook</h1>
                    <p className="text-muted-foreground">
                        Đăng nhập để tiếp tục
                    </p>
                </div>

                <div className="bg-card p-8 rounded-lg shadow-lg border">
                    <LoginForm defaultEmail={email ?? undefined} />
                </div>

                <div className="text-center mt-6 text-sm text-muted-foreground">
                    <p>© 2025 Facebook Clone. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}

// 👉 Component chính bọc trong Suspense để tránh lỗi build
export default function Login() {
    return (
        <Suspense fallback={<div>Đang tải trang đăng nhập...</div>}>
            <LoginContent />
        </Suspense>
    );
}

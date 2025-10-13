'use client'
import { SignUpForm } from '@/components/auth/SignUpForm';

const SignUp = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-blue-600 mb-2">Facebook</h1>
                    <p className="text-muted-foreground">
                        Tạo tài khoản mới
                    </p>
                </div>

                <div className="bg-card p-8 rounded-lg shadow-lg border">
                    <SignUpForm />
                </div>

                <div className="text-center mt-6 text-sm text-muted-foreground">
                    <p>© 2025 Facebook Clone. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
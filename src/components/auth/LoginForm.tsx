'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { LoginFormData } from '@/types/auth';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase.config';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Cookies from "js-cookie";

const loginSchema = z.object({
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
    rememberMe: z.boolean().default(false),
});

interface LoginFormProps {
    defaultEmail?: string;
    defaultPassword?: string;
}

export default function LoginForm({ defaultEmail, defaultPassword }: LoginFormProps) {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch,
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: defaultEmail || '',
            password: defaultPassword || '',
            rememberMe: false,
        },
    });

    const rememberMe = watch('rememberMe');

    const onSubmit = async (data: LoginFormData) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
            const user = userCredential.user;

            if (!user.emailVerified) {
                await signOut(auth);
                toast.error("Tài khoản chưa xác thực", {
                    description: "Vui lòng kiểm tra email để xác minh tài khoản.",
                });
                return;
            }

            // 🔥 Lấy role từ Firestore
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (!userDoc.exists()) {
                toast.error('Tài khoản không tồn tại trong hệ thống!');
                return;
            }

            const userData = userDoc.data();
            const role = userData.role || 'user';
            const token = await user.getIdToken();

            // ✅ Lưu cookie cho SSR
            await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
            });

            toast.success("Đăng nhập thành công!");

            // 🔐 Điều hướng theo role
            router.push(role === 'admin' ? '/admin' : '/feed');
        } catch (error: any) {
            console.error("🔥 Firebase login error:", error);
            let message = "Đăng nhập thất bại. Vui lòng thử lại.";

            switch (error.code) {
                case "auth/user-not-found":
                case "auth/wrong-password":
                case "auth/invalid-credential":
                    message = "Email hoặc mật khẩu không chính xác.";
                    break;
                case "auth/too-many-requests":
                    message = "Bạn đã thử quá nhiều lần. Vui lòng thử lại sau.";
                    break;
                case "auth/network-request-failed":
                    message = "Lỗi kết nối mạng. Hãy kiểm tra lại internet.";
                    break;
            }

            toast.error("Đăng nhập thất bại", {
                description: message,
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="Nhập email của bạn"
                    {...register('email')}
                    className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <div className="relative">
                    <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Nhập mật khẩu"
                        {...register('password')}
                        className={errors.password ? 'border-red-500' : ''}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
            </div>

            <div className="flex items-center space-x-2">
                <Checkbox
                    id="rememberMe"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setValue('rememberMe', checked as boolean)}
                />
                <label htmlFor="rememberMe" className="text-sm font-medium">
                    Ghi nhớ đăng nhập
                </label>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>

            <div className="text-center">
                <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
                    Quên mật khẩu?
                </a>
            </div>

            <div className="text-center pt-4 border-t">
                <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push('/auth/signup')}
                >
                    Tạo tài khoản mới
                </Button>
            </div>
        </form>
    );
}

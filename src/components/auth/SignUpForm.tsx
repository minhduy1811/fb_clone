'use client'

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner'
import { auth } from '@/lib/firebase.config';
import { SignUpFormData } from '@/types/auth';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification, getAuth } from 'firebase/auth';

const signUpSchema = z.object({
    name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
    dateOfBirth: z.string().min(1, 'Vui lòng chọn ngày sinh'),
    gender: z.enum(['male', 'female', 'other'], {
        required_error: 'Vui lòng chọn giới tính',
    }),
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

export const SignUpForm = () => {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch,
    } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
    });

    const gender = watch('gender');

    const onSubmit = async (data: SignUpFormData) => {
        try {
            // Đăng ký tài khoản qua Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
            // console.log('✅ User created:', userCredential.user);
            const user = userCredential.user;

            await sendEmailVerification(user);
            const idToken = await user.getIdToken();
            if (!process.env.NEXT_PUBLIC_API_URL) {
                throw new Error('NEXT_PUBLIC_API_URL không được định nghĩa trong file .env');
            }
            // Gửi thông tin sang NestJS
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}`, },
                body: JSON.stringify({
                    uid: data.uid, email: data.email, displayName: data.name, gender: data.gender, // Thêm giới tính
                    birthdate: data.dateOfBirth, role: data.role,
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Đăng ký thất bại khi gửi thông tin đến API.');
            }
            // Cập nhật thông tin người dùng (tên và giới tính)
            await updateProfile(user, {
                displayName: data.name,
            }).catch((error) => {
                console.error('Lỗi khi cập nhật thông tin người dùng:', error);
                throw new Error('Không thể cập nhật thông tin người dùng.');
            });

            // Hiển thị thông báo thành công
            toast.success('Xác minh email', {
                description: 'Email xác minh đã được gửi. Vui lòng kiểm tra hộp thư của bạn.',
            });

            // Chuyển hướng đến trang xác minh email
            router.push("/auth/login");
        } catch (error: any) {
            // Xử lý lỗi đăng ký
            console.error('Firebase Sign Up Error:', error.message);
            let errorMessage = 'Đăng ký thất bại. Vui lòng thử lại.';
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'Email này đã được sử dụng.';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn.';
            }

            toast.error('Lỗi', {
                description: errorMessage,
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Tên người dùng</Label>
                <Input
                    id="name"
                    placeholder="Nhập tên của bạn"
                    {...register('name')}
                    className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                <Input
                    id="dateOfBirth"
                    type="date"
                    {...register('dateOfBirth')}
                    className={errors.dateOfBirth ? 'border-red-500' : ''}
                />
                {errors.dateOfBirth && (
                    <p className="text-sm text-red-500">{errors.dateOfBirth.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label>Giới tính</Label>
                <RadioGroup value={gender} onValueChange={(value) => setValue('gender', value as 'male' | 'female' | 'other')}>
                    <div className='flex items-center space-x-3'>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="male" id="male" />
                            <Label htmlFor="male" className="font-normal cursor-pointer">Nam</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="female" id="female" />
                            <Label htmlFor="female" className="font-normal cursor-pointer">Nữ</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="other" id="other" />
                            <Label htmlFor="other" className="font-normal cursor-pointer">Khác</Label>
                        </div>
                    </div>

                </RadioGroup>
                {errors.gender && (
                    <p className="text-sm text-red-500">{errors.gender.message}</p>
                )}
            </div>

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
                <Input
                    id="password"
                    type="password"
                    placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                    {...register('password')}
                    className={errors.password ? 'border-red-500' : ''}
                />
                {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
            </div>

            <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 cursor-pointer"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
            </Button>

            <div className="text-center pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                    Bạn đã có tài khoản?{' '}
                    <button
                        type="button"
                        onClick={() => router.push('/auth/login')}
                        className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                    >
                        Đăng nhập
                    </button>
                </p>
            </div>
        </form>
    );
};

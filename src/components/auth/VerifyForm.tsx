import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner'
import { verifyOTP, resendOTP, getPendingOTPData } from '@/lib/mockApi';
import { VerifyFormData } from '@/types/auth';
import { useRouter } from 'next/navigation';
import { Countdown } from './Countdown';

const verifySchema = z.object({
    otp: z.string().length(6, 'Mã OTP phải có 6 ký tự'),
});

interface VerifyFormProps {
    email: string;
}

export const VerifyForm = ({ email }: VerifyFormProps) => {
    const router = useRouter();

    const {
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch,
    } = useForm<VerifyFormData>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            otp: '',
        },
    });

    const otp = watch('otp');

    const onSubmit = async (data: VerifyFormData) => {
        const result = await verifyOTP(email, data.otp);

        if (result.success) {
            toast.success(
                'Thành công', {
                description: result.message,
            });

            // Get user data from pending OTP
            const pendingData = getPendingOTPData();


            const query = new URLSearchParams({
                email,
                password: pendingData?.userData.password || "",
                verified: "true",
            }).toString();

            // Navigate to login with pre-filled credentials
            router.push(`/auth/login?${query}`);

        }
        else {
            toast.error(
                'Lỗi', {
                description: result.message,
            });
        };
    };

    const handleResend = async () => {
        const result = await resendOTP(email);

        if (result.success) {
            toast.success(
                'Thành công', {
                description: result.message,
            });
        } else {
            toast.error(
                'Lỗi', {
                description: result.message,
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                    Mã OTP đã được gửi đến email
                </p>
                <p className="font-medium">{email}</p>
            </div>

            <div className="space-y-2">
                <Label className="block text-center">Nhập mã OTP</Label>
                <div className="flex justify-center">
                    <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={(value) => setValue('otp', value)}
                    >
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                </div>
                {errors.otp && (
                    <p className="text-sm text-red-500 text-center">{errors.otp.message}</p>
                )}
            </div>

            <div className="flex justify-center">
                <Countdown
                    initialSeconds={120}
                    onComplete={() => {
                        toast.warning(
                            'Hết thời gian', {
                            description: 'Mã OTP đã hết hạn. Vui lòng gửi lại mã.',

                        });
                    }}
                    onReset={handleResend}
                />
            </div>

            <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting || otp.length !== 6}
            >
                {isSubmitting ? 'Đang xác thực...' : 'Xác thực'}
            </Button>

            <div className="text-center pt-4 border-t">
                <button
                    type="button"
                    onClick={() => router.push('/auth/login')}
                    className="text-sm text-muted-foreground hover:text-foreground"
                >
                    Quay lại đăng nhập
                </button>
            </div>
        </form>
    );
};
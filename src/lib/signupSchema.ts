import { z } from "zod";

// ✅ Regex kiểm tra mật khẩu mạnh
const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// ✅ Kiểm tra >= 16 tuổi
const isOlderThan16 = (dateString: string) => {
    const birthDate = new Date(dateString);
    const today = new Date();
    const age =
        today.getFullYear() -
        birthDate.getFullYear() -
        (today < new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate()) ? 1 : 0);
    return age >= 16;
};

// ✅ Kiểm tra không lớn hơn hôm nay
const isNotInFuture = (dateString: string) => {
    const birthDate = new Date(dateString);
    const today = new Date();
    return birthDate <= today;
};

// ✅ Schema đăng ký
export const signUpSchema = z.object({
    name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),

    dateOfBirth: z
        .string()
        .min(1, "Vui lòng chọn ngày sinh")
        .refine(isNotInFuture, { message: "Ngày sinh không được lớn hơn ngày hôm nay" })
        .refine(isOlderThan16, { message: "Bạn phải ít nhất 16 tuổi để đăng ký" }),

    gender: z.enum(["male", "female", "other"], {
        required_error: "Vui lòng chọn giới tính",
    }),

    email: z.string().email("Email không hợp lệ"),

    password: z
        .string()
        .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
        .regex(strongPasswordRegex, {
            message:
                "Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt",
        }),
});

// ✅ Export type để dùng cho TypeScript
export type SignUpFormData = z.infer<typeof signUpSchema>;

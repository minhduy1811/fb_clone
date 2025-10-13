import { User, OTPData, SignUpFormData } from '@/types/auth';

const USERS_KEY = 'mock_users';
const OTP_KEY = 'mock_otp';

// Generate random 6-digit OTP
export const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Get all users from localStorage
export const getUsers = (): User[] => {
    const usersJson = localStorage.getItem(USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
};

// Save users to localStorage
const saveUsers = (users: User[]): void => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Check if email exists
export const checkEmailExists = (email: string): boolean => {
    const users = getUsers();
    return users.some(user => user.email === email);
};

// Create account and send OTP
export const createAccount = async (data: SignUpFormData): Promise<{ success: boolean; message: string }> => {
    // Check if email already exists
    if (checkEmailExists(data.email)) {
        return { success: false, message: 'Email đã được sử dụng' };
    }

    // Generate OTP
    const otp = generateOTP();
    const otpData: OTPData = {
        email: data.email,
        code: otp,
        expiresAt: Date.now() + 120000, // 120 seconds
        userData: data,
    };

    // Save OTP to localStorage
    localStorage.setItem(OTP_KEY, JSON.stringify(otpData));

    // Log OTP to console (for testing)
    console.log('🔐 OTP Code:', otp);

    return { success: true, message: 'Mã OTP đã được gửi đến email của bạn' };
};

// Verify OTP
export const verifyOTP = async (email: string, code: string): Promise<{ success: boolean; message: string }> => {
    const otpJson = localStorage.getItem(OTP_KEY);

    if (!otpJson) {
        return { success: false, message: 'Không tìm thấy mã OTP' };
    }

    const otpData: OTPData = JSON.parse(otpJson);

    // Check if OTP matches email
    if (otpData.email !== email) {
        return { success: false, message: 'Email không khớp' };
    }

    // Check if OTP expired
    if (Date.now() > otpData.expiresAt) {
        return { success: false, message: 'Mã OTP đã hết hạn' };
    }

    // Check if OTP code is correct
    if (otpData.code !== code) {
        return { success: false, message: 'Mã OTP không đúng' };
    }

    // Create user account
    const users = getUsers();
    const newUser: User = {
        id: Date.now().toString(),
        ...otpData.userData,
        verified: true,
        createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    // Clear OTP data
    localStorage.removeItem(OTP_KEY);

    return { success: true, message: 'Xác thực thành công' };
};

// Resend OTP
export const resendOTP = async (email: string): Promise<{ success: boolean; message: string }> => {
    const otpJson = localStorage.getItem(OTP_KEY);

    if (!otpJson) {
        return { success: false, message: 'Không tìm thấy yêu cầu OTP' };
    }

    const otpData: OTPData = JSON.parse(otpJson);

    if (otpData.email !== email) {
        return { success: false, message: 'Email không khớp' };
    }

    // Generate new OTP
    const newOtp = generateOTP();
    otpData.code = newOtp;
    otpData.expiresAt = Date.now() + 120000;

    localStorage.setItem(OTP_KEY, JSON.stringify(otpData));

    // Log OTP to console (for testing)
    console.log('🔐 New OTP Code:', newOtp);

    return { success: true, message: 'Mã OTP mới đã được gửi' };
};

// Login
export const login = async (email: string, password: string): Promise<{ success: boolean; message: string; user?: User }> => {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return { success: false, message: 'Email hoặc mật khẩu không đúng' };
    }

    if (!user.verified) {
        return { success: false, message: 'Tài khoản chưa được xác thực' };
    }

    return { success: true, message: 'Đăng nhập thành công', user };
};

// Get pending OTP data (for pre-filling after verification)
export const getPendingOTPData = (): OTPData | null => {
    const otpJson = localStorage.getItem(OTP_KEY);
    return otpJson ? JSON.parse(otpJson) : null;
};
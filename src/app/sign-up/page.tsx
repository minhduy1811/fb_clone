"use client";
declare global {
    interface Window {
        recaptchaVerifier?: any;
    }
}

import { useState } from 'react';
import { auth } from '@/app/firebase/config'; // file cấu hình Firebase của bạn
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import '@/app/sign-up/SignUpPage.css'

const SignUp = () => {
    const [identifier, setIdentifier] = useState(''); // email hoặc phone
    const [password, setPassword] = useState('');
    const [createUserWithEmailAndPassword] =
        useCreateUserWithEmailAndPassword(auth);

    // Khởi tạo reCAPTCHA cho phone auth
    const setupRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth,
                'recaptcha-container',
                { size: 'invisible' },
            );
        }
        return window.recaptchaVerifier;
    };

    const handleSignUp = async () => {
        const isEmail = identifier.includes('@');

        try {
            if (isEmail) {
                // Đăng ký bằng email + password
                await createUserWithEmailAndPassword(identifier, password);
                console.log('Đăng ký email thành công');
            } else {
                // Đăng ký bằng số điện thoại (OTP)
                const appVerifier = setupRecaptcha();
                const confirmation = await signInWithPhoneNumber(
                    auth,
                    identifier,
                    appVerifier
                );
                // Lúc này bạn cần hiển thị UI cho người dùng nhập mã OTP
                const otp = window.prompt('Nhập mã OTP đã gửi SMS:');
                if (!otp) {
                    console.error('OTP không được để trống');
                    return;
                }
                await confirmation.confirm(otp);
                console.log('Đăng ký phone thành công');
            }
        } catch (error) {
            console.error('Sign up error:', error);
        }
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSignUp();
    }

    return (
        <div className="signup-container">
            <div className="signup-card">
                <h2 className="signup-title">Create an Account</h2>

                <form onSubmit={handleSubmit} className="signup-form">
                    <input
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="Enter your email or phone number"
                        required
                    />

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />

                    <button onClick={handleSignUp} type="submit" className="submit-btn">
                        Sign Up
                    </button>
                </form>

                <p className="login-text">
                    Already have an account?{" "}
                    <a href="/login" className="login-link">
                        Log in
                    </a>
                </p>
                {/* Bắt buộc cần thẻ này cho reCAPTCHA */}
                <div id="recaptcha-container"></div>
            </div>
        </div>
    );
}

export default SignUp;


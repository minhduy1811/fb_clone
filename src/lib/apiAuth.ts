// src/lib/api.ts
import axios from "axios";
import { getAuth } from "firebase/auth";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
    headers: {
        "Content-Type": "application/json",
    },
});

// 🧠 Interceptor để tự động thêm token Firebase vào header
api.interceptors.request.use(
    async (config) => {
        try {
            const auth = getAuth();
            const currentUser = auth.currentUser;

            // Lấy token của Firebase user nếu đã đăng nhập
            if (currentUser) {
                const token = await currentUser.getIdToken(true);
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (err) {
            console.warn("Không thể lấy Firebase token:", err);
        }

        return config;
    },
    (error) => Promise.reject(error)
);


export default api;

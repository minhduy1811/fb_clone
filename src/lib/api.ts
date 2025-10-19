// src/lib/api.ts
import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // gửi cookie cùng với yêu cầu
});
// api.interceptors.response.use(
//     (res) => res,
//     async (error) => {
//         if (error.response?.status === 401) {
//             await fetch("/api/refresh", { method: "POST" });
//             return api.request(error.config);
//         }
//         return Promise.reject(error);
//     }
// );

export default api;

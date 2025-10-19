import api from "./api";
import { auth, db } from "./firebase.config";
import { Post } from "@/types/feed";
import { doc, getDoc } from "firebase/firestore";

// Upload ảnh lên Cloudinary qua backend
export const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post("/posts/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data; // { url: "https://res.cloudinary.com/..." }
};

// Tạo bài viết mới
export const createPost = async (postData: { content: string; imageUrls?: string[] }) => {
    const res = await api.post("/posts", postData);
    return res.data;
};

// Lấy danh sách bài viết
// export const getAllPosts = async () => {
//     const res = await api.get("/posts");
//     return res.data;
// };

/**
 * Lấy danh sách bài viết.
 */
export const getAllPosts = async (): Promise<Post[]> => {
    const user = auth.currentUser;
    if (!user) { throw new Error("User not logged in"); }

    // 🔍 Lấy role từ Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const role = userDoc.exists() ? userDoc.data()?.role || "user" : "user";

    // 🧠 Endpoint phân nhánh theo role
    const endpoint = role === "admin" ? "/admin/posts" : "/posts";

    const res = await api.get(endpoint, { withCredentials: true });
    return res.data;
};
export const deleteAdminPost = async (postId: string) => {
    const res = await api.delete(`/admin/posts/${postId}`, {
        withCredentials: true,
    });
    return res.data;
}

export const deletePost = async (postId: string) => {
    const res = await api.delete(`/admin/posts/${postId}`, {
        withCredentials: true,
    });
    return res.data;
}

export const updatePost = async (postId: string, postData: { content: string; imageUrls?: string[] }) => {
    const res = await api.put(`/posts/${postId}`, postData, {
        withCredentials: true,
    });
    return res.data;
}
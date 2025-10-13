import api from "./apiAuth";
import { auth } from "./firebase.config";
import { Post } from "@/types/feed";

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
export const createPost = async (postData: { content: string; imageUrls?: string }) => {
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
 * @param isAdmin Nếu true => gọi API admin, ngược lại => user thường
 */
export const getAllPosts = async (isAdmin: boolean = false): Promise<Post[]> => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not logged in");

    // Lấy token của Firebase user
    const token = await user.getIdToken(true);

    // Chọn endpoint phù hợp
    const endpoint = isAdmin ? "/admin/posts" : "/posts";

    // Gọi API qua Axios
    const res = await api.get(endpoint, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
};



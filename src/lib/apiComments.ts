import api from "./api";

// Lấy danh sách comment
export const getComments = async (postId: string) => {
    const res = await api.get(`/posts/${postId}/comments`, { withCredentials: true });
    return res.data;
};

// Thêm comment
export const addComment = async (postId: string, content: string) => {
    const res = await api.post(`/posts/${postId}/comments`, { content });
    return res.data;
};

// Cập nhật comment
// export const updateComment = async (postId: string, commentId: string, content: string) => {
//     const res = await api.patch(`/posts/${postId}/comments/${commentId}`, { content });
//     return res.data;
// };

// // Xoá comment
// export const deleteComment = async (postId: string, commentId: string) => {
//     const res = await api.delete(`/posts/${postId}/comments/${commentId}`);
//     return res.data;
// };

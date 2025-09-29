"use client";

import { useState } from "react";
import CommentModal from "./CommentModal";

export default function Post() {
    const [isModalOpen, setModalOpen] = useState(false);

    const post = {
        id: 1,
        content: "Đây là nội dung bài viết ví dụ...",
    };

    return (
        <div className="p-3 border rounded-lg bg-white shadow-sm">
            {/* Nội dung bài viết */}
            <p>{post.content}</p>

            {/* Nút mở comment */}
            <div className="mt-3 flex space-x-4">
                <button
                    onClick={() => setModalOpen(true)}
                    className="flex-1 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                    Bình luận
                </button>
            </div>

            {/* Gọi modal */}
            <CommentModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                post={post}
            />
        </div>
    );
}

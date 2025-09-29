"use client";

import { useEffect } from "react";

interface CommentModalProps {
    isOpen: boolean;
    onClose: () => void;
    post: {
        id: number;
        content: string;
    } | null;
}

export default function CommentModal({ isOpen, onClose, post }: CommentModalProps) {
    // Đóng modal khi bấm ESC
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    if (!isOpen || !post) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-4 relative">
                {/* Nút đóng */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    ✕
                </button>

                {/* Nội dung bài viết */}
                <h2 className="font-bold text-lg mb-2">Bài viết</h2>
                <p className="mb-4">{post.content}</p>

                {/* Khu vực comment */}
                <div className="border-t pt-3">
                    <input
                        type="text"
                        placeholder="Viết bình luận..."
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                    />
                    <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                        Gửi
                    </button>
                </div>
            </div>
        </div>
    );
}

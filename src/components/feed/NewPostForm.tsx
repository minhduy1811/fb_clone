'use client';

import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogOverlay } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import TextareaAutosize from "react-textarea-autosize";
import { createPost, uploadImage } from '@/lib/posts';
import { useAuth } from '@/hooks/useAuth';
import { X, Camera } from "lucide-react";


interface PostModalProps {
    open: boolean;
    onPostOpen: (open: boolean) => void;
    onPostCreated: () => void;
}

export const NewPostForm = ({ open, onPostOpen, onPostCreated }: PostModalProps) => {
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleButtonClick = () => fileInputRef.current?.click();

    if (!user) {
        console.log("lỗi", { user });
        toast.error('Lỗi', {
            description: 'Bạn cần đăng nhập để tạo bài viết',
        });
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Ngăn form reload trang
        try {
            setLoading(true);
            let imageUrls = '';

            // Nếu có ảnh thì upload trước
            if (imageFile) {
                const uploadRes = await uploadImage(imageFile);
                imageUrls = uploadRes.url;
            }

            // Gửi bài đăng lên server
            await createPost({ content, imageUrls });
            console.log({ content, imageUrls });
            toast.success('Đăng bài thành công 🎉');

            // Reset form và đóng dialog
            setContent('');
            setImageFile(null);
            setPreview(null);
            onPostOpen(false); // Đóng dialog
            onPostCreated(); // Gọi callback khi bài đăng thành công
        } catch (err) {
            console.error('Lỗi khi đăng bài:', err); // Log lỗi chi tiết
            toast.error('Không thể đăng bài. Vui lòng thử lại.');
        } finally {
            setLoading(false); // Tắt trạng thái loading
        }
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => onPostOpen(isOpen)}>
            <DialogOverlay className="fixed inset-0 bg-gray/20  z-[90]" />
            <DialogContent className="z-[100] md:max-w-lg max-h-[100vh] overflow-hidden">
                <DialogHeader className='flex items-center'>
                    <DialogTitle>TẠO BÀI VIẾT</DialogTitle>
                </DialogHeader>

                {/* Post Content */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* User info */}
                    <div className="flex items-center space-x-3 mb-3">
                        <Avatar className="w-10 h-10">
                            <AvatarImage src={user?.photoURL || "/default-icon.jpg"} />
                            <AvatarFallback>
                                {user?.displayName?.[0]?.toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium pb-1">{user?.displayName || "Người dùng"}</p>
                            <select className="text-sm text-gray-600 bg-gray-200 rounded px-1 py-0.5 cursor-pointer">
                                <option>Công khai</option>
                                <option>Bạn bè</option>
                                <option>Chỉ mình tôi</option>
                            </select>
                        </div>
                    </div>

                    {/* Input content */}
                    <div className='max-h-[400px] overflow-y-auto '>
                        <TextareaAutosize
                            className="w-full resize-none outline-none  text-lg min-h-[30px] pb-2"
                            placeholder={`${user?.displayName || "Bạn"} ơi, bạn đang nghĩ gì thế?`}
                            minRows={1}
                            maxRows={10}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />

                        {/* Image preview */}
                        {preview && (
                            <div className="relative w-full  flex items-center justify-center bg-gray-100 rounded-lg ">
                                <img
                                    src={preview}
                                    alt="preview"
                                    className="w-full h-full object-contain rounded"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setImageFile(null);
                                        setPreview(null);
                                    }}
                                    className="absolute top-2 right-2 bg-white text-gray-700 rounded-full p-1 hover:bg-gray-200"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                    {/* Actions */}
                    <div className="flex items-center justify-between mt-3 border-t pt-3">
                        <span className="text-sm font-medium">Thêm vào bài viết của bạn</span>
                        <div className="flex items-center space-x-2">
                            <button
                                type="button"
                                className="p-2 hover:bg-gray-100 rounded-full cursor-pointer"
                                onClick={handleButtonClick}
                            >
                                <Camera />
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*, video/*"
                                onChange={handleFileChange}
                                hidden
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        disabled={loading || (!content.trim() && !imageFile)}
                        className="w-full cursor-pointer "
                    >
                        {loading ? "Đang đăng..." : "Đăng"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};
'use client';

import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogOverlay } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import TextareaAutosize from "react-textarea-autosize";
import { createPost, uploadImage } from '@/lib/apiPosts';
import { useAuth } from '@/hooks/useAuth';
import { X, Camera } from "lucide-react";

interface PostModalProps {
    open: boolean;
    onPostOpen: (open: boolean) => void;
    onPostCreated: () => void;
}

export const NewPostForm = ({ open, onPostOpen, onPostCreated }: PostModalProps) => {
    const [content, setContent] = useState('');
    const [imageFiles, setImageFiles] = useState<File[]>([]); // ✅ nhiều ảnh
    const [previews, setPreviews] = useState<string[]>([]);   // ✅ preview nhiều ảnh
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleButtonClick = () => fileInputRef.current?.click();

    if (!user) {
        toast.error('Lỗi', {
            description: 'Bạn cần đăng nhập để tạo bài viết',
        });
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        if (files.length > 0) {
            setImageFiles((prev) => [...prev, ...files]);
            const newPreviews = files.map((file) => URL.createObjectURL(file));
            setPreviews((prev) => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (index: number) => {
        setImageFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            let imageUrls: string[] = [];

            // ✅ Upload tất cả ảnh (nếu có)
            if (imageFiles.length > 0) {
                const uploadPromises = imageFiles.map((file) => uploadImage(file));
                const uploadResults = await Promise.all(uploadPromises);
                imageUrls = uploadResults.map((res) => res.url);
            }

            // ✅ Gửi bài đăng lên server
            await createPost({ content, imageUrls });
            toast.success('Đăng bài thành công 🎉');

            // ✅ Reset form
            setContent('');
            setImageFiles([]);
            setPreviews([]);
            onPostOpen(false);
            onPostCreated();
        } catch (err) {
            console.error('Lỗi khi đăng bài:', err);
            toast.error('Không thể đăng bài. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => onPostOpen(isOpen)}>
            <DialogOverlay className="fixed inset-0 bg-gray/20 z-[90]" />
            <DialogContent className="z-[100] md:max-w-lg max-h-[100vh] overflow-hidden">
                <DialogHeader className='flex items-center'>
                    <DialogTitle>TẠO BÀI VIẾT</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* User info */}
                    <div className="flex items-center space-x-3 mb-3">
                        <Avatar className="w-10 h-10">
                            <AvatarImage src={user?.photoURL || "/default-icon.jpg"} />
                            <AvatarFallback>{user?.displayName?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium pb-1">{user?.displayName || "Người dùng"}</p>
                            {/* <select className="text-sm text-gray-600 bg-gray-200 rounded px-1 py-0.5 cursor-pointer">
                                <option>Công khai</option>
                                <option>Bạn bè</option>
                                <option>Chỉ mình tôi</option>
                            </select> */}
                        </div>
                    </div>

                    {/* Input content */}
                    <div className='max-h-[400px] overflow-y-auto'>
                        <TextareaAutosize
                            className="w-full resize-none outline-none text-md min-h-[30px] pb-2"
                            placeholder={`${user?.displayName || "Bạn"} ơi, bạn đang nghĩ gì thế?`}
                            minRows={1}
                            maxRows={100}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />

                        {/* ✅ Image previews */}
                        {previews.length > 0 && (
                            <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden">
                                <div
                                    className={`
                grid gap-1 
                ${previews.length === 1 ? "grid-cols-1" : ""}
                ${previews.length === 2 ? "grid-cols-2" : ""}
                ${previews.length === 3 ? "grid-cols-2" : ""}
                ${previews.length >= 4 ? "grid-cols-2" : ""}
            `}
                                >
                                    {previews.slice(0, 4).map((preview, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={preview}
                                                alt={`preview-${index}`}
                                                className={`object-cover w-full h-full ${previews.length === 1 ? "max-h-[400px]" : "aspect-square"
                                                    }`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-2 right-2 bg-white/80 text-gray-700 rounded-full p-1 hover:bg-gray-200"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                            {index === 3 && previews.length > 4 && (
                                                <div className="absolute inset-0 bg-black/50 text-white flex items-center justify-center text-lg font-semibold">
                                                    +{previews.length - 4}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
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
                                accept="image/*,video/*"
                                multiple // ✅ Cho phép chọn nhiều file
                                onChange={handleFileChange}
                                hidden
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        disabled={loading || (!content.trim() && imageFiles.length === 0)}
                        className="w-full cursor-pointer"
                    >
                        {loading ? "Đang đăng..." : "Đăng"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

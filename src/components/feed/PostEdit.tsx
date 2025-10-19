'use client'

import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogOverlay } from '@/components/ui/dialog';
import { Post } from '@/types/feed';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '../ui/button';
import { X, Camera } from "lucide-react";
import { toast } from 'sonner';
import { updatePost, uploadImage } from '@/lib/apiPosts';
import TextareaAutosize from "react-textarea-autosize";

interface PostEditProps {
    post: Post | null;
    open: boolean;
    onPostCreated: () => void;
    onEditChange: (open: boolean) => void;
}

export const PostEdit = ({ post, open, onPostCreated, onEditChange }: PostEditProps) => {
    const [editContent, setEditContent] = useState(post?.content || '');
    const [existingImages, setExistingImages] = useState<string[]>(post?.imageUrls || []);
    const [originalPost, setOriginalPost] = useState<Post | null>(post); // ✅ Lưu bản gốc để reset
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [newPreviews, setNewPreviews] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [confirmClose, setConfirmClose] = useState(false); // ✅ dialog xác nhận

    useEffect(() => {
        if (post) {
            setEditContent(post.content || '');
            setExistingImages(post.imageUrls || []);
            setOriginalPost(post); // ✅ Lưu lại bài gốc khi mở lần đầu
        }
    }, [post]);

    const handleButtonClick = () => fileInputRef.current?.click();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        if (files.length > 0) {
            setNewImages((prev) => [...prev, ...files]);
            const newUrls = files.map((file) => URL.createObjectURL(file));
            setNewPreviews((prev) => [...prev, ...newUrls]);
        }
    };

    const removeExistingImage = (index: number) => {
        setExistingImages((prev) => prev.filter((_, i) => i !== index));
    };

    const removeNewImage = (index: number) => {
        setNewImages((prev) => prev.filter((_, i) => i !== index));
        setNewPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            let newUploadedUrls: string[] = [];

            if (newImages.length > 0) {
                const uploadPromises = newImages.map((file) => uploadImage(file));
                const uploadResults = await Promise.all(uploadPromises);
                newUploadedUrls = uploadResults.map((res) => res.url);
            }

            const finalImageUrls = [...existingImages, ...newUploadedUrls];
            const id = post?.id ?? '';
            if (!id) {
                toast.error('Không tìm thấy ID bài viết');
                return;
            }

            await updatePost(id, { content: editContent ?? "", imageUrls: finalImageUrls });
            console.log(id, { content: editContent, imageUrls: finalImageUrls });
            toast.success('Cập nhật bài viết thành công 🎉');
            onEditChange(false);
            onPostCreated();
        } catch (err) {
            console.error('Lỗi khi cập nhật bài viết:', err);
            toast.error('Không thể cập nhật bài viết. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    // ✅ Khi nhấn nút X (mở xác nhận)
    const handleCloseRequest = () => {
        setConfirmClose(true);
    };

    // ✅ Nếu người dùng chọn "Bỏ"
    const handleCancelEdit = () => {
        if (originalPost) {
            setEditContent(originalPost.content || '');
            setExistingImages(originalPost.imageUrls || []);
            setNewImages([]);
            setNewPreviews([]);
        }
        setConfirmClose(false);
        onEditChange(false);
    };

    return (
        <>
            {/* Dialog chính để chỉnh sửa */}
            <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleCloseRequest()}>
                <DialogOverlay className="fixed inset-0 bg-gray/20 z-[90]" />
                <DialogContent className="z-[100] md:max-w-lg max-h-[100vh] overflow-hidden">
                    <DialogHeader className='flex justify-between items-center'>
                        <DialogTitle>CHỈNH SỬA BÀI VIẾT</DialogTitle>
                        {/* <button
                            type="button"
                            onClick={handleCloseRequest}
                            className="p-2 hover:bg-gray-100 rounded-full"
                        >
                            <X className="w-5 h-5" />
                        </button> */}
                    </DialogHeader>

                    <form onSubmit={handleEdit}>
                        <div className="space-y-4">
                            {/* user info */}
                            <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10">
                                    <AvatarImage src={post?.authorAvatar || '/default-icon.jpg'} />
                                    <AvatarFallback>{post?.authorName?.[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{post?.authorName}</p>
                                </div>
                            </div>

                            {/* content */}
                            <div className='max-h-[400px] overflow-y-auto'>
                                <TextareaAutosize
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    className="w-full resize-none outline-none min-h-[30px] pb-2"
                                />

                                {/* Ảnh cũ */}
                                {(existingImages.length > 0 || newPreviews.length > 0) && (() => {
                                    const allImages = [...existingImages, ...newPreviews];
                                    const total = allImages.length;

                                    if (total === 1) {
                                        // 🖼 1 ảnh → full width
                                        return (
                                            <div className="mt-2">
                                                <div className="relative">
                                                    <img
                                                        src={allImages[0]}
                                                        alt="preview"
                                                        className="object-contain w-full max-h-[500px] rounded"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => (0 < existingImages.length ? removeExistingImage(0) : removeNewImage(0))}
                                                        className="absolute top-2 right-2 bg-white/80 text-gray-700 rounded-full p-1 hover:bg-gray-200"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    }

                                    if (total === 3) {
                                        // 🖼 3 ảnh → 1 bên trái, 2 bên phải
                                        return (
                                            <div className="grid grid-cols-2 gap-1 mt-2">
                                                {/* Ảnh to bên trái */}
                                                <div className="relative">
                                                    <img
                                                        src={allImages[0]}
                                                        alt="large"
                                                        className="object-cover w-full h-full rounded aspect-square"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            (0 < existingImages.length ? removeExistingImage(0) : removeNewImage(0))
                                                        }
                                                        className="absolute top-2 right-2 bg-white/80 text-gray-700 rounded-full p-1 hover:bg-gray-200"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                {/* Hai ảnh nhỏ bên phải */}
                                                <div className="grid grid-rows-2 gap-1">
                                                    {allImages.slice(1, 3).map((url, index) => (
                                                        <div key={index + 1} className="relative">
                                                            <img
                                                                src={url}
                                                                alt={`small-${index}`}
                                                                className="object-cover w-full h-full rounded aspect-square"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const realIndex = index + 1;
                                                                    if (realIndex < existingImages.length)
                                                                        removeExistingImage(realIndex);
                                                                    else removeNewImage(realIndex - existingImages.length);
                                                                }}
                                                                className="absolute top-2 right-2 bg-white/80 text-gray-700 rounded-full p-1 hover:bg-gray-200"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    }

                                    // 🖼 Các trường hợp còn lại (2 ảnh, 4 ảnh trở lên)
                                    return (
                                        <div
                                            className={`grid gap-1 mt-2 ${total === 2 ? "grid-cols-2" : "grid-cols-2"
                                                }`}
                                        >
                                            {allImages.map((url, index) => (
                                                <div key={index} className="relative">
                                                    <img
                                                        src={url}
                                                        alt={`preview-${index}`}
                                                        className="object-cover w-full aspect-square rounded"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (index < existingImages.length) removeExistingImage(index);
                                                            else removeNewImage(index - existingImages.length);
                                                        }}
                                                        className="absolute top-2 right-2 bg-white/80 text-gray-700 rounded-full p-1 hover:bg-gray-200"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })()}


                            </div>

                            {/* add images */}
                            <div className="flex items-center justify-between mt-3 border-t pt-3">
                                <span className="text-sm font-medium">Thêm ảnh mới</span>
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
                                        accept="image/*"
                                        multiple
                                        onChange={handleFileChange}
                                        hidden
                                    />
                                </div>
                            </div>

                            {/* buttons */}
                            <div className="flex gap-2 justify-end">
                                <Button
                                    type="submit"
                                    disabled={loading || (!editContent?.trim() && existingImages.length === 0 && newImages.length === 0)}
                                    className="w-full cursor-pointer"
                                >
                                    {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ✅ Dialog xác nhận huỷ */}
            {confirmClose && (
                <Dialog open={confirmClose} onOpenChange={setConfirmClose}>
                    <DialogOverlay className="fixed inset-0 bg-black/40 z-[200]" />
                    <DialogContent className="z-[210] max-w-sm text-center space-y-4">
                        <DialogHeader>
                            <DialogTitle>Bạn có muốn huỷ chỉnh sửa?</DialogTitle>
                        </DialogHeader>
                        <p className="text-sm text-gray-600">
                            Nếu bạn huỷ, các thay đổi hiện tại sẽ không được lưu.
                        </p>
                        <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" onClick={() => setConfirmClose(false)} className='cursor-pointer hover:bg-gray-200'>
                                Tiếp tục chỉnh sửa
                            </Button>
                            <Button variant="destructive" onClick={handleCancelEdit} className='text-white cursor-pointer'>
                                Bỏ
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};

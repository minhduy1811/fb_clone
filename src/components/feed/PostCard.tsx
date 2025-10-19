'use client'

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ThumbsUp, MessageCircle, Edit, Trash2 } from 'lucide-react';
import { Post } from '@/types/feed';
import { deletePost, updatePost } from '@/lib/apiPosts';
import { toast } from 'sonner';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/hooks/useAuth';
import { formatRelativeTime } from "@/lib/time"
import { MoreHorizontal } from 'lucide-react';



interface PostCardProps {
    post: Post;
    onCommentClick: (post: Post) => void;
    onPostEdit: (post: Post) => void;
    onPostUpdated: () => void;
}

export const PostCard = ({ post, onCommentClick, onPostEdit, onPostUpdated }: PostCardProps) => {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const { user } = useAuth();

    const isOwner = user?.uid === post.authorId;

    // const handleUpdate = async (id: string) => {
    //     if (!editContent.trim()) {
    //         toast.error('Lỗi', { description: 'Nội dung không được để trống' });
    //         return;
    //     }
    //     await updatePost(id, editContent);
    //     setIsEditing(false);
    //     onPostUpdated();
    //     toast.success('Thành công', { description: 'Đã cập nhật bài viết' });
    // };

    const handleDelete = async (id: string) => {
        try {
            await deletePost(id); // gọi API xóa
            onPostUpdated?.();
            toast.success("Thành công", {
                description: "Bài viết đã được xóa.",
            });
            setShowDeleteDialog(false); // đóng dialog
            // gọi callback reload danh sách nếu có
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi xóa bài viết", {
                description: "Vui lòng thử lại.",
            });
        }
    };
    const createdAt =
        typeof post.createdAt === 'string' || typeof post.createdAt === 'number'
            ? new Date(post.createdAt)
            : post.createdAt;


    const displayTime = formatRelativeTime(createdAt);

    return (
        <>
            <Card className="p-4 mb-4 shadow-sm">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                            <AvatarImage src={user?.photoURL || "/default-icon.jpg"} />
                            <AvatarFallback>
                                {user?.displayName?.[0]?.toUpperCase() || 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">{user?.displayName || 'Người dùng'}</p>
                            <p className="text-xs text-muted-foreground">{displayTime}</p>
                        </div>
                    </div>

                    {isOwner && (
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-32">
                                <DropdownMenuItem
                                    onClick={() => onPostEdit(post)}
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <Edit className="w-4 h-4" />
                                    Chỉnh sửa
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() => setShowDeleteDialog(true)}
                                    className="flex items-center gap-2 text-destructive cursor-pointer"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Xóa
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>

                {/* Content */}
                <p className='mb-2 whitespace-pre-line'> {post.content}</p>
                {/* {isEditing ? (
                    <div className="space-y-2 mb-3">
                        <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="min-h-[80px]"
                        />
                        <div className="flex gap-2 justify-end">
                            <Button variant="outline" onClick={() => setIsEditing(false)}>
                                Hủy
                            </Button>
                            <Button onClick={() => { handleUpdate(post.id) }}>Lưu</Button>
                        </div>
                    </div>
                ) : ( */}
                <div
                    className={`
                grid gap-1 overflow-hidden rounded-lg
                ${post.imageUrls.length === 1 ? "grid-cols-1" : ""}
                ${post.imageUrls.length === 2 ? "grid-cols-2" : ""}
                ${post.imageUrls.length === 3 ? "grid-cols-2 grid-rows-2" : ""}
                ${post.imageUrls.length >= 4 ? "grid-cols-2" : ""}
            `}
                >
                    {post.imageUrls.slice(0, 4).map((image, index) => (
                        <div
                            key={index}
                            className={`
                        relative overflow-hidden
                        ${post.imageUrls.length === 3 && index === 0 ? "row-span-2" : ""}
                    `}
                        >
                            <img
                                src={image}
                                alt={`post-image-${index}`}
                                className={`
                            w-full h-full object-cover
                            ${post.imageUrls.length === 1 ? "max-h-[600px] object-contain" : "aspect-square"}
                        `}
                            />
                            {index === 3 && post.imageUrls.length > 4 && (
                                <div className="absolute inset-0 bg-black/50 text-white text-2xl font-semibold flex items-center justify-center">
                                    +{post.imageUrls.length - 4}
                                </div>
                            )}
                        </div>
                    ))}
                </div>




                {/* Stats */}
                <div className="flex items-center justify-between py-2 border-y text-sm text-muted-foreground">
                    <span>0 lượt thích</span>
                    <span>{post.commentCount || 0} bình luận</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 ">
                    <Button variant="ghost" className="flex-1 cursor-pointer">
                        <ThumbsUp className="w-4 h-4 mr-2" />
                        Thích
                    </Button>
                    <Button
                        variant="ghost"
                        className="flex-1 cursor-pointer"
                        onClick={() => onCommentClick(post)}
                    >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Bình luận
                    </Button>
                </div>
            </Card>

            {/* Confirm Delete */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa bài viết</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => handleDelete(post.id)}
                            className="bg-destructive hover:bg-destructive/30"
                        >
                            Xóa
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

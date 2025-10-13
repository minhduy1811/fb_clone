'use client'

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsUp, MessageCircle, Edit, Trash2 } from 'lucide-react';
import { Post } from '@/types/feed';
import { updatePost, deletePost } from '@/lib/mockApiFeed';
import { toast } from 'sonner';
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



interface PostCardProps {
    post: Post;
    onCommentClick: (post: Post) => void;
    onPostUpdated: () => void;
}

export const PostCard = ({ post, onCommentClick, onPostUpdated }: PostCardProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(post.content);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const { user } = useAuth();

    const isOwner = user?.uid === post.authorId;

    const handleEdit = () => {
        if (!editContent.trim()) {
            toast.error('Lỗi', { description: 'Nội dung không được để trống' });
            return;
        }
        updatePost(post.id, editContent);
        setIsEditing(false);
        onPostUpdated();
        toast.success('Thành công', { description: 'Đã cập nhật bài viết' });
    };

    const handleDelete = () => {
        deletePost(post.id);
        onPostUpdated();
        setShowDeleteDialog(false);
        toast.success('Thành công', { description: 'Đã xóa bài viết' });
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
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)}>
                                <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowDeleteDialog(true)}
                            >
                                <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                        </div>
                    )}
                </div>

                {/* Content */}
                {isEditing ? (
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
                            <Button onClick={handleEdit}>Lưu</Button>
                        </div>
                    </div>
                ) : (
                    <div className='mb-2'><p className="mb-4">{post.content}</p>
                        {post.imageUrls.map((image, index) => (
                            <img key={index} src={image} alt="Post image" className="max-h-[400px] max-w-[544px] object-contain" />
                        ))}
                    </div>

                )}

                {/* Stats */}
                <div className="flex items-center justify-between py-2 border-y text-sm text-muted-foreground">
                    <span>lượt thích</span>
                    <span>{post.commentCount || 0} bình luận</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                    <Button variant="ghost" className="flex-1">
                        <ThumbsUp className="w-4 h-4 mr-2" />
                        Thích
                    </Button>
                    <Button
                        variant="ghost"
                        className="flex-1"
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
                            onClick={handleDelete}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            Xóa
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

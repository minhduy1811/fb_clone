'use client'

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Post, Comment } from '@/types/feed';
import { CommentForm } from './CommentForm';
import { CommentList } from './CommentList';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getComments } from '@/lib/apiComments';
import { formatRelativeTime } from '@/lib/time';

interface PostModalProps {
    post: Post | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const PostModal = ({ post, open, onOpenChange }: PostModalProps) => {
    const [comments, setComments] = useState<Comment[]>([]);

    useEffect(() => {
        let isMounted = true;

        const loadComments = async () => {
            if (post) {
                const postComments = await getComments(post.id);
                if (isMounted) setComments(postComments);
            }
        };

        loadComments();

        return () => {
            isMounted = false;
        };
    }, [post]);


    const loadComments = async () => {
        if (post) {
            const postComments = await getComments(post.id);
            setComments(postComments);
        }
    };
    if (!post) return null;
    const createdAt =
        typeof post.createdAt === 'string' || typeof post.createdAt === 'number'
            ? new Date(post.createdAt)
            : post.createdAt;


    const displayTime = formatRelativeTime(createdAt);
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl max-h-[120vh] overflow-hidden">
                <DialogHeader className='flex items-center'>
                    <DialogTitle>Bài viết của {post.authorName}</DialogTitle>
                </DialogHeader>

                {/* Post Content */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                            <AvatarImage src={post.authorAvatar || '/default-icon.jpg'} />
                            <AvatarFallback>{post.authorName?.[0]}</AvatarFallback>
                        </Avatar>
                        <div className=''>
                            <p className="font-semibold">{post.authorName}</p>
                            <p className="text-xs text-muted-foreground">
                                {displayTime}
                            </p>

                        </div>

                    </div>
                    <div className=' overflow-y-auto max-h-[65vh]'>
                        <p className="text-base whitespace-pre-line mb-2">{post.content}</p>
                        <div
                            className={`grid gap-1 overflow-hidden rounded-lg
                ${post.imageUrls.length === 1 ? "grid-cols-1" : ""}
                ${post.imageUrls.length === 2 ? "grid-cols-2" : ""}
                ${post.imageUrls.length === 3 ? "grid-cols-2 grid-rows-2" : ""}
                ${post.imageUrls.length >= 4 ? "grid-cols-2" : ""}
            `}
                        >
                            {post.imageUrls.slice(0, 4).map((image, index) => (
                                <div
                                    key={index}
                                    className={`relative overflow-hidden${post.imageUrls.length === 3 && index === 0 ? "row-span-2" : ""}`}
                                >
                                    <img
                                        src={image}
                                        alt={`post-image-${index}`}
                                        className={`w-full h-full object-cover${post.imageUrls.length === 1 ? "max-h-[600px] object-contain" : "aspect-square"}`}
                                    />
                                    {index === 3 && post.imageUrls.length > 4 && (
                                        <div className="absolute inset-0 bg-black/50 text-white text-2xl font-semibold flex items-center justify-center">
                                            +{post.imageUrls.length - 4}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="border-t pt-4">
                            <h4 className="font-semibold mb-4">Bình luận</h4>
                            <CommentList comments={comments} />
                        </div>
                    </div>
                    <div className="border-t pt-4">
                        <CommentForm postId={post.id} onCommentAdded={loadComments} />
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
};

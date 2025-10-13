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
            <DialogContent className="max-w-2xl max-h-[120vh] overflow-hidden">
                <DialogHeader>
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
                        <p className="text-base">{post.content}</p>
                        {(post.imageUrls ?? []).map((url, i) => (
                            <img key={i} src={url} alt={`image ${i}`} className="rounded-md object-cover" />
                        ))}

                        {/* {post.imageUrls.map((image, index) => (
                            <img key={index} src={image} alt="Post image" className="max-h-[400px] max-w-[544px] object-contain" />
                        ))} */}

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

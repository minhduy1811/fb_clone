'use client'

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth';
import { addComment } from '@/lib/apiComments';

interface CommentFormProps {
    postId: string;
    onCommentAdded: () => void;
}

export const CommentForm = ({ postId, onCommentAdded }: CommentFormProps) => {
    const [content, setContent] = useState('');
    const { user } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim()) {
            toast.warning('Lỗi', {
                description: 'Vui lòng nhập nội dung bình luận',
            });
            return;
        }

        await addComment(postId, content);
        console.log(postId, content);
        setContent('');
        onCommentAdded();
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <img src={user?.photoURL || 'default-icon.jpg'} alt="Post image" className="w-9 h-9" />
            <Input
                placeholder={`Bình luận dưới tên ${user?.displayName || 'Bạn'}`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="flex-1"
            />
            <Button type="submit">Gửi</Button>
        </form>
    );
};

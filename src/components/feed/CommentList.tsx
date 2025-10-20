import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Comment } from '@/types/feed';
import { formatRelativeTime } from "@/lib/time"

interface CommentListProps {
    comments: Comment[];
}

export const CommentList = ({ comments }: CommentListProps) => {
    if (comments.length === 0) {
        return (
            <div className="text-center text-muted-foreground py-6">
                Chưa có bình luận nào
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {comments.map((comment) => {
                // 🔹 Convert string -> Date
                const createdAt = new Date(comment.createdAt);
                const displayTime = formatRelativeTime(createdAt);

                return (
                    <div key={comment.id} className="flex gap-2">
                        <Avatar className="w-8 h-8">
                            <AvatarImage src={comment.userAvatar || '/default-icon.jpg'} />
                            <AvatarFallback>{comment.userName[0]}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                            <div className="inline-block bg-gray-200 rounded-2xl px-4 py-2 max-w-[75%] break-words mb-1">
                                <p className="font-semibold text-sm text-gray-800">
                                    {comment.userName}
                                </p>
                                <p className="text-sm text-gray-900 whitespace-pre-line">{comment.content}</p>
                            </div>

                            <p className="text-xs text-muted-foreground ml-4">
                                {displayTime}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
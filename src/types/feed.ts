export interface Post {
    id: string;
    authorId: string;
    authorName: string;
    authorAvatar: string;
    content: string;
    imageUrls: string[];
    likes: string[];
    commentCount: 0, // array of userIds who liked
    createdAt: string;
    updatedAt: string;
}

export interface Comment {
    id: string;
    postId: string;
    userId: string;
    userName: string;
    userAvatar: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    isEdited: boolean;
}

export interface PostFormData {
    content: string;
}

export interface CommentFormData {
    content: string;
}

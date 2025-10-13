import { Post, Comment } from '@/types/feed';

const POSTS_KEY = 'mock_posts';
const COMMENTS_KEY = 'mock_comments';
const CURRENT_USER_KEY = 'current_user';

// Get current user from localStorage
export const getCurrentUser = () => {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
};

// Set current user
export const setCurrentUser = (user: any) => {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

// Get all posts
export const getPosts = (): Post[] => {
    const postsJson = localStorage.getItem(POSTS_KEY);
    return postsJson ? JSON.parse(postsJson) : [];
};

// Save posts
const savePosts = (posts: Post[]): void => {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
};

// Create post
export const createPost = (content: string, userId: string, userName: string): Post => {
    const posts = getPosts();
    const newPost: Post = {
        id: Date.now().toString(),
        userId,
        userName,
        userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`,
        content,
        likes: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    posts.unshift(newPost);
    savePosts(posts);
    return newPost;
};

// Update post
export const updatePost = (postId: string, content: string): Post | null => {
    const posts = getPosts();
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) return null;

    posts[postIndex].content = content;
    posts[postIndex].updatedAt = new Date().toISOString();
    savePosts(posts);
    return posts[postIndex];
};

// Delete post
export const deletePost = (postId: string): boolean => {
    const posts = getPosts();
    const filteredPosts = posts.filter(p => p.id !== postId);
    savePosts(filteredPosts);

    // Also delete all comments for this post
    const comments = getComments();
    const filteredComments = comments.filter(c => c.postId !== postId);
    saveComments(filteredComments);

    return true;
};

// Toggle like
export const toggleLike = (postId: string, userId: string): Post | null => {
    const posts = getPosts();
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) return null;

    const post = posts[postIndex];
    const likeIndex = post.likes.indexOf(userId);

    if (likeIndex > -1) {
        post.likes.splice(likeIndex, 1);
    } else {
        post.likes.push(userId);
    }

    savePosts(posts);
    return post;
};

// Get all comments
export const getComments = (): Comment[] => {
    const commentsJson = localStorage.getItem(COMMENTS_KEY);
    return commentsJson ? JSON.parse(commentsJson) : [];
};

// Save comments
const saveComments = (comments: Comment[]): void => {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
};

// Get comments by post ID
export const getCommentsByPostId = (postId: string): Comment[] => {
    const comments = getComments();
    return comments.filter(c => c.postId === postId).sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
};

// Create comment
export const createComment = (postId: string, content: string, userId: string, userName: string): Comment => {
    const comments = getComments();
    const newComment: Comment = {
        id: Date.now().toString(),
        postId,
        userId,
        userName,
        userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`,
        content,
        createdAt: new Date().toISOString(),
    };
    comments.push(newComment);
    saveComments(comments);
    return newComment;
};

export const countCommentsByPostId = (postId: string): number => {
    const comments = getComments();
    return comments.filter(comment => comment.postId === postId).length;
}
'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/feed/Header';
import { LeftSidebar } from '@/components/feed/LeftSidebar';
import { RightSidebar } from '@/components/feed/RightSidebar';
import { PostForm } from '@/components/feed/PostForm';
import { NewPostForm } from '@/components/feed/NewPostForm'
import { PostEdit } from '@/components/feed/PostEdit';
import { PostCard } from '@/components/feed/PostCard';
import { PostModal } from '@/components/feed/PostModal';
import { Post } from '@/types/feed';
import { getAllPosts } from '@/lib/apiPosts';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase.config';
import { toast } from 'sonner';

const Feed = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();
    const [isNewPost, setIsPostOpen] = useState(false);
    const [isEditPost, setIsEditPost] = useState(false);
    useEffect(() => {
        let isMounted = true;

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!isMounted) return;

            if (!user) {
                router.replace("/auth/login");
                return;
            }

            try {
                await loadPosts();
            } catch (err: any) {
                console.error("❌ Lỗi loadPosts:", err);
                if (err?.response?.status === 401) {
                    await signOut(auth);
                    toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                }
                router.replace("/auth/login");
            }
        });

        return () => {
            isMounted = false;
            unsubscribe();
        };
        // ⚠️ auth là singleton (import cố định), không thay đổi nên không cần dependency
    }, [router]);




    const loadPosts = async () => {
        const allPosts = await getAllPosts();
        setPosts(allPosts);
    };

    const handleCommentClick = (post: Post) => {
        setSelectedPost(post);
        setIsModalOpen(true);
    };

    const handlePostClick = (post: Post) => {
        setSelectedPost(post);
        setIsEditPost(true);
    }

    return (
        <div className="min-h-screen bg-muted/30">

            <Header />



            <div className="relative">
                <div className=''>
                    <LeftSidebar />
                </div>


                {/* Main Feed */}
                <main className="lg:ml-80 xl:mr-80 min-h-screen mt-12">
                    <div className="max-w-xl mx-auto p-4 pt-6">
                        <PostForm onPostOpen={() => setIsPostOpen(true)} />

                        {posts.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                Chưa có bài viết nào. Hãy tạo bài viết đầu tiên!
                            </div>
                        ) : (
                            posts.map((post) => (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                    onPostEdit={handlePostClick}
                                    onCommentClick={handleCommentClick}
                                    onPostUpdated={loadPosts}
                                />
                            ))
                        )}
                    </div>
                </main>

                <RightSidebar />
            </div>
            <NewPostForm
                open={isNewPost}
                onPostCreated={loadPosts}
                onPostOpen={(isOpen) => setIsPostOpen(isOpen)} />
            <PostModal
                post={selectedPost}
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
            />
            <PostEdit
                post={selectedPost}
                open={isEditPost}
                onPostCreated={loadPosts}
                onEditChange={(isOpen) => setIsEditPost(isOpen)}
            />
        </div>
    );
};

export default Feed;
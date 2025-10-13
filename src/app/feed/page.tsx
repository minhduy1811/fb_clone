'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/feed/Header';
import { LeftSidebar } from '@/components/feed/LeftSidebar';
import { RightSidebar } from '@/components/feed/RightSidebar';
import { PostForm } from '@/components/feed/PostForm';
import { NewPostForm } from '@/components/feed/NewPostForm'
import { PostCard } from '@/components/feed/PostCard';
import { PostModal } from '@/components/feed/PostModal';
import { Post } from '@/types/feed';
import { getAllPosts } from '@/lib/posts';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase.config';

const Feed = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();
    const [isNewPost, setIsPostOpen] = useState(false);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                router.push("/auth/login");
                return;
            }

            // ✅ Luôn refresh token mới nhất
            const token = await user.getIdToken(true);
            localStorage.setItem("token", token);

            console.log("User hiện tại là: ", user);
            // Gọi API hoặc load post sau khi có token hợp lệ
            await loadPosts();
        });

        return () => unsubscribe();
    }, [router]);

    const loadPosts = async () => {
        const allPosts = await getAllPosts();
        setPosts(allPosts);
    };

    const handleCommentClick = (post: Post) => {
        setSelectedPost(post);
        setIsModalOpen(true);
    };


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

        </div>
    );
};

export default Feed;
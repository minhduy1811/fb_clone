"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Posts from "@/components/admin/Posts";
import { Post } from "@/types/feed"
import { getAllPosts } from "@/lib/apiPosts";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase.config";

export default function Page() {
    const [posts, setPosts] = useState<Post[]>([]);
    const router = useRouter();
    // useEffect(() => {
    //     const checkSession = async () => {
    //         try {
    //             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/posts`, {
    //                 method: "GET",
    //                 headers: { "Content-Type": "application/json" },
    //                 credentials: "include",
    //             });
    //             if (!res.ok) {
    //                 const errorText = await res.text();
    //                 console.error("Lỗi response:", errorText);
    //                 router.push("/auth/login");
    //                 return;
    //             }
    //             const data = await res.json();
    //             setPosts(data);
    //             console.log("✅ Session hợp lệ!");
    //             console.log("Dữ liệu bài viết:", data);
    //         } catch (err) {
    //             console.error("Lỗi fetch:", err);
    //             router.push("/auth/login");
    //         }
    //     };

    //     checkSession();
    // }, [router]);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                router.push("/auth/login");
                return;
            }

            try {
                const allPosts = await getAllPosts();
                setPosts(allPosts);
            } catch (error) {
                console.error("❌ Lỗi khi tải bài viết:", error);
                router.push("/auth/login");
            }
        });

        return () => unsubscribe();
    }, [router]);
    return <Posts postData={posts} />;
}

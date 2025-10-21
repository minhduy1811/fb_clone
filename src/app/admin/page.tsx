"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Dashboard from "@/components/admin/Dashboard";

export default function Page() {
    const router = useRouter();

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/check`, {
                    credentials: "include",
                });

                if (!res.ok) {
                    console.warn("❌ Không hợp lệ — redirect /auth/login");
                    router.push("/auth/login");
                    return;
                }
            } catch (err) {
                console.error("Lỗi fetch:", err);
                router.push("/auth/login");
            }
        };

        checkAdmin();
    }, [router]);


    return <Dashboard />;
}

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Dashboard from "@/components/admin/Dashboard";

export default async function Page() {
    // 🔹 Đọc cookie session từ trình duyệt
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
        console.warn("❌ Không tìm thấy cookie session — redirect tới /auth/login");
        redirect("/auth/login");
    }

    // 🔹 Gửi cookie này sang NestJS backend
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/posts`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Cookie": `session=${sessionCookie}`,
        },
        cache: "no-store",
    });

    // 🔹 Kiểm tra phản hồi từ backend
    if (res.status === 401 || res.status === 403) {
        console.warn("❌ Backend trả 401/403 — redirect /auth/login");
        redirect("/auth/login");
    }

    if (!res.ok) {
        console.error("Fetch failed:", res.status, await res.text());
        redirect("/auth/login");
    }

    const postData = await res.json();
    return <Dashboard />;
}

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Posts from "@/components/admin/Posts";

export default async function Page() {
    const cookieStore = await cookies(); // ✅ thêm await
    const token = cookieStore.get("token")?.value;
    console.log("SSR token:", token);


    if (!token) redirect("/auth/login");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/posts`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        cache: "no-store",
        // 👇 thêm dòng này rất quan trọng khi gọi sang server khác origin
        credentials: "include",
    });

    if (!res.ok) {
        console.error("Fetch failed:", res.status, await res.text());
        redirect("/auth/login");
    }

    const postData = await res.json();
    return <Posts postData={postData} />;
}

'use client';

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { auth } from "@/lib/firebase.config";
import { signOut } from "firebase/auth";

export function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            // Gọi logout API (NestJS xoá cookie)
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
                method: "POST",
                credentials: "include", // để gửi cookie session lên
            });

            if (!res.ok) throw new Error("Đăng xuất thất bại");

            // Logout Firebase client (xoá idToken, refreshToken local)
            await signOut(auth);

            toast.success("Đăng xuất thành công", {
                description: "Hẹn gặp lại bạn 👋",
            });

            router.replace("/auth/login");
        } catch (error) {
            toast.error("Không thể đăng xuất", {
                description: (error as Error).message,
            });
        }
    };

    return (
        <div
            onClick={handleLogout}
            className="text-destructive cursor-pointer flex items-center "
        >
            <LogOut className="ml-1 mr-3 h-4 w-4" />
            <span>Log out</span>
        </div>
    );
}

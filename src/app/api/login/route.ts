import { NextResponse } from "next/server";
import * as admin from "firebase-admin";

// 🔥 Khởi tạo Firebase Admin (server side)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
    });
}

export async function POST(req: Request) {
    try {
        const { token } = await req.json();
        const decodedToken = await admin.auth().verifyIdToken(token);

        // Tạo cookie HTTP-only (chỉ server đọc được)
        const response = NextResponse.json({ message: "Authenticated" });
        response.cookies.set({
            name: "token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 7 ngày
            path: "/",
        });

        return response;
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
}

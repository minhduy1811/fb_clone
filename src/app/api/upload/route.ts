import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { file } = await req.json();

        const cloudName = process.env.CLOUDINARY_CLOUD_NAME!;
        const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET!;

        const formData = new FormData();
        formData.append("file", file); // file là base64 hoặc URL
        formData.append("upload_preset", uploadPreset);

        const uploadRes = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
                method: "POST",
                body: formData, // ✅ multipart/form-data
            }
        );

        const data = await uploadRes.json();

        if (!uploadRes.ok) {
            return NextResponse.json(
                { error: data.error?.message || "Upload failed" },
                { status: 400 }
            );
        }

        return NextResponse.json({ url: data.secure_url });
    } catch (err) {
        console.error("Upload error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

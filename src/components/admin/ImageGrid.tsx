'use client';

import { useState } from "react";

export default function ImageGrid({ images }: { images: unknown }) {
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    // ép kiểu an toàn:
    const safeImages = Array.isArray(images)
        ? images
        : images
            ? [images as string] // nếu là 1 string duy nhất thì cho vào mảng
            : [];

    return (
        <div>
            <div className="grid grid-cols-2 gap-2">
                {safeImages.map((image, index) => (
                    <div
                        key={index}
                        className="relative overflow-hidden rounded-lg cursor-pointer group"
                        onClick={() => setPreviewImage(image)}
                    >
                        <img
                            src={image}
                            alt={`Image ${index + 1}`}
                            className="rounded-lg object-contain h-50 w-full transform transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                ))}
            </div>

            {previewImage && (
                <div
                    className="fixed inset-0 z-100 bg-black/80 flex items-center justify-center cursor-zoom-out"
                    onClick={() => setPreviewImage(null)}
                >
                    <img
                        src={previewImage}
                        alt="Preview"
                        className="max-h max-w object-contain rounded-lg shadow-2xl "
                    />
                </div>
            )}
        </div>
    );
}

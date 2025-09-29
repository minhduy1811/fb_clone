import { X } from "lucide-react";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import TextareaAutosize from "react-textarea-autosize";


type PopupProps = {
    show: boolean;
    onClose: () => void;
};


function CreatePostPopup({ show, onClose }: PopupProps) {
    useEffect(() => {
        if (show) {
            document.documentElement.style.overflow = "hidden";
            document.body.style.overflow = "hidden";
            document.body.style.position = "fixed";
            document.body.style.width = "100%";
        } else {
            document.documentElement.style.overflow = "";
            document.body.style.overflow = "";
            document.body.style.position = "";
            document.body.style.width = "";
        }

        return () => {
            document.documentElement.style.overflow = "";
            document.body.style.overflow = "";
            document.body.style.position = "";
            document.body.style.width = "";
        };
    }, [show]);

    const [content, setContent] = useState("");

    const [imageToPost, setImageToPost] = useState<File | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [loading, setLoading] = useState(false);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const CreatePost = async () => {
        if (content.trim().length === 0 && !imageToPost) return;
        setLoading(true);

        try {
            let imageUrl = "";
            if (imageToPost) {
                imageUrl = await uploadImage(imageToPost);
            }

            const newPost = {
                content: content,
                image: imageUrl,
                createdAt: serverTimestamp(),
            };

            await addDoc(collection(db, "posts"), newPost);

            setContent("");
            setImageToPost(null);
            onClose();

        } catch (error) {
            console.error("Error adding document: ", error);
        } finally {
            setLoading(false);
        }
    };



    const addImageToPost = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setImageToPost(file)
    };

    const uploadImage = async (file: File) => {
        const reader = new FileReader();

        return new Promise<string>((resolve, reject) => {
            reader.readAsDataURL(file);
            reader.onloadend = async () => {
                try {
                    const res = await fetch("/api/upload", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ file: reader.result }),
                    });
                    const data = await res.json();
                    resolve(data.url);
                } catch (err) {
                    console.error("Upload failed:", err);
                    reject(err);
                }
            };
        });
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
            {/* Overlay mờ */}
            <div
                className="absolute inset-0 opacity-50 z-40 bg-black"
                onClick={onClose} // click ra ngoài để tắt popup
            />
            <div className="relative flex items-center justify-center  z-50">
                <div className="bg-white rounded-xl shadow-xl w-[500px] max-w-full">
                    {/* Header */}
                    <div className="flex items-center justify-center border-b px-4 py-3">
                        <h2 className="text-lg font-semibold align-middle">Tạo bài viết</h2>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-full hover:bg-gray-200 absolute right-3 top-3"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>


                    {/* Body */}
                    <div className="p-4">
                        {/* User info */}
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-gray-300" />
                            <div>
                                <p className="font-medium">Tên người dùng</p>
                                <select className="text-sm text-gray-600 bg-gray-200 rounded px-1 py-0.5">
                                    <option>Công khai</option>
                                    <option>Bạn bè</option>
                                    <option>Chỉ mình tôi</option>
                                </select>
                            </div>
                        </div>


                        {/* Input content */}
                        <TextareaAutosize
                            className="w-full resize-none outline-none p-2 text-lg min-h-[10px]"
                            placeholder="Bạn đang nghĩ gì thế?"
                            minRows={1}
                            maxRows={10}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                        <div className="max-h-[300px] overflow-y-auto ">
                            {/* Hiện preview */}
                            {imageToPost && (
                                <div className="relative w-full bg-gray-300 rounded items-center justify-center">
                                    {imageToPost.type.startsWith("image/") ? (
                                        <img
                                            src={URL.createObjectURL(imageToPost)}
                                            alt="preview"
                                            className=" w-full h-auto rounded object-contain"
                                        />
                                    ) : (
                                        <video
                                            controls
                                            src={URL.createObjectURL(imageToPost)}
                                            className="w-full  h-auto rounded object-contain"
                                        />
                                    )}
                                    <button
                                        onClick={() => setImageToPost(null)}
                                        className="absolute top-4 right-3 bg-white text-gray-500 rounded-full p-1 cursor-pointer hover:bg-gray-200"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </div>


                        {/* Action buttons */}
                        <div className="flex items-center justify-between mt-3 p-2 border-gray-1000 rounded-lg shadow-lg">
                            <span className="text-sm font-medium">Thêm vào bài viết của bạn</span>
                            <div className="flex items-center space-x-2">
                                <button className="p-2 hover:bg-gray-100 rounded-full cursor-pointer" onClick={handleButtonClick}>📷
                                    <input type="file" accept="image/*, video/*" ref={fileInputRef} onChange={addImageToPost} hidden />
                                </button>
                            </div>
                        </div>


                        {/* Submit */}
                        <button
                            disabled={loading || (content.trim().length === 0 && !imageToPost)}
                            onClick={CreatePost}
                            className={`w-full mt-4 py-2 rounded-lg font-semibold flex items-center justify-center
    ${loading || (content.trim().length === 0 && !imageToPost)
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                                }`}
                        >
                            {loading ? (
                                <>
                                    <svg
                                        className="animate-spin h-5 w-5 mr-2 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                        ></path>
                                    </svg>
                                    Đang đăng...
                                </>
                            ) : (
                                "Đăng"
                            )}
                        </button>


                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreatePostPopup;
import { useRef, useState } from "react";

export default function CreatePost() {
    const [content, setContent] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Mở hộp thoại chọn file khi bấm nút
    const handlePickFile = () => {
        fileInputRef.current?.click();
    };

    // Xử lý khi chọn file
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    return (
        <div className="p-4 bg-white rounded-xl shadow-lg w-[500px] max-w-full">
            {/* textarea nhập nội dung */}
            <textarea
                className="w-full resize-none outline-none text-lg min-h-[100px]"
                placeholder="Bạn đang nghĩ gì thế?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />

            {/* nút chọn file */}
            <button
                type="button"
                onClick={handlePickFile}
                className="mt-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
                📷 Chọn ảnh hoặc video
            </button>

            {/* input file ẩn */}
            <input
                type="file"
                accept="image/*,video/*" // chỉ cho chọn ảnh hoặc video
                ref={fileInputRef}
                onChange={handleFileChange}
                hidden
            />

            {/* preview */}
            {file && (
                <div className="mt-3">
                    {file.type.startsWith("image/") ? (
                        <img
                            src={URL.createObjectURL(file)}
                            alt="preview"
                            className="w-40 rounded"
                        />
                    ) : (
                        <video
                            src={URL.createObjectURL(file)}
                            controls
                            className="w-60 rounded"
                        />
                    )}
                </div>
            )}
        </div>
    );
}

"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Facebook from '../../../assets/communication.png';
import Popup from "./Popup";

export default function NewPost() {
    const [showPopup, setShowPopup] = useState(false);
    const inputRef = useRef(null);

    return (
        <div className="">
            {/* Hàng nhập status */}
            <div className="flex items-center space-x-3 border-b border-gray-200 pb-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0">
                    <Image src={Facebook} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                </div>
                {/* Ô input */}
                <button className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-gray-600 cursor-pointer hover:bg-gray-200 " onClick={() => setShowPopup(true)}>
                    <p className="text-left"> Minhduy ơi, bạn đang nghĩ gì thế?</p>
                </button>
                <Popup show={showPopup} onClose={() => setShowPopup(false)} />
            </div>

            {/* Hàng nút */}
            <div className="flex justify-between pt-3">
                {/* Video trực tiếp */}
                <button className="flex cursor-pointer items-center space-x-2 flex-1 justify-center p-2 rounded-md hover:bg-gray-100">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="red"
                        viewBox="0 0 24 24"
                        className="w-6 h-6"
                    >
                        <path d="M17 10.5V6c0-1.1-.9-2-2-2H3C1.9 4 1 4.9 1 6v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4.5l4 4v-11l-4 4z" />
                    </svg>
                    <span className="text-sm font-bold text-gray-700">Video trực tiếp</span>
                </button>

                {/* Ảnh/video */}
                <button className="flex cursor-pointer items-center space-x-2 flex-1 justify-center p-2 rounded-md hover:bg-gray-100">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="green"
                        viewBox="0 0 24 24"
                        className="w-6 h-6"
                    >
                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                    </svg>
                    <span className="text-sm font-bold text-gray-700">Ảnh/video</span>
                </button>

                {/* Cảm xúc/hoạt động */}
                <button className="flex cursor-pointer items-center space-x-2 flex-1 justify-center p-2 rounded-md hover:bg-gray-100">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="gold"
                        viewBox="0 0 24 24"
                        className="w-6 h-6"
                    >
                        <path d="M12 22c5.5 0 10-4.48 10-10S17.5 2 12 2 2 6.48 2 12s4.5 10 10 10zm-4-9c.83 0 1.5-.67 1.5-1.5S8.83 10 8 10s-1.5.67-1.5 1.5S7.17 13 8 13zm8 0c.83 0 1.5-.67 1.5-1.5S16.83 10 16 10s-1.5.67-1.5 1.5S15.17 13 16 13zm-8.24 2.75c.6 1.36 2.1 2.25 4.24 2.25s3.64-.89 4.24-2.25" />
                    </svg>
                    <span className="text-sm font-bold text-gray-700">
                        Cảm xúc/hoạt động
                    </span>
                </button>
            </div>
        </div>
    );
}

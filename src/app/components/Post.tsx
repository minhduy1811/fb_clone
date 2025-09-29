import Meo from "../../../assets/meo.jpg";
import CommentModal from "./CommentModal";
import Image from "next/image";
import { BiWorld } from "react-icons/bi";
import { FiMoreHorizontal } from "react-icons/fi";
import { useState } from "react";
import meme from "../../../assets/meme.jpg";
import { BiLike } from "react-icons/bi";
import { BiCommentDetail } from "react-icons/bi";
import { BiShare } from "react-icons/bi";

const Post = () => {
    const [open, setOpen] = useState(false);

    const comments = [
        { id: 1, icon: BiLike, label: "Thích" },
        { id: 2, icon: BiCommentDetail, label: "Bình luận" },
        { id: 3, icon: BiShare, label: "Chia sẻ" },
    ];
    return (
        <div>
            {/* Header */}
            <div className="flex items-center p-1 justify-between">
                <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0">
                        <Image src={Meo} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                    </div>
                    <div className=" ml-3 item-center justify-between">
                        <p className=" font-bold">Minh Duy Ngo</p>
                        <div className="flex items-center">
                            <p className="text-xs mr-1 opacity-90"> 2 giờ &#8226;</p>
                            <BiWorld className="size-3 opacity-75" />
                        </div>

                    </div>
                </div>

                <div className="relative inline-block text-left">
                    {/* Nút 3 chấm */}
                    <div className="">
                        <button
                            onClick={() => setOpen(!open)}
                            className="p-2 rounded-full hover:bg-gray-200 cursor-pointer"
                        >
                            <FiMoreHorizontal size={20} />
                        </button>

                        {/* Menu xổ ra */}
                        {open && (
                            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-10">
                                <button
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                    onClick={() => alert("Edit clicked")}
                                >
                                    ✏️ Edit
                                </button>
                                <button
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                    onClick={() => alert("Delete clicked")}
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Input */}
            <div className="mt-2">
                <p> Brand new car </p>
            </div>
            {/* Image */}
            <div className="-mx-2 mt-2">
                <Image src={meme} alt="meo" />
            </div>
            {/* React */}
            <div className="border-b pl-2 pr-2 border-gray-300 pb-1 flex justify-between mt-2">
                <div className="flex items-center  ">
                    <Image src={"/icons/like.svg"} alt="like" width={18} height={18} />
                    <Image src={"/icons/heart.svg"} alt="heart" width={18} height={18} />
                    <p className="ml-1 opacity-75">12</p>
                </div>
                <p className="opacity-75 items-center">2 comments</p>
            </div>
            <div>
                <div className="list-none w-full flex items-center ">
                    {comments.map(({ id, icon: Icon, label }) => (
                        <li key={id} className="flex  items-center justify-center space-x-2
                             flex-1 p-2  hover:bg-gray-200 rounded-md m-1 cursor-pointer">
                            <div className="flex items-center space-x-2 opacity-75">
                                <Icon size={22} />
                                <span className="font-semibold text-base">{label}</span>
                            </div>

                        </li>
                        // <button key={index} className="flex items-center justify-center flex-1 p-2 space-x-2 hover:bg-gray-200 rounded-md m-1">
                        //     <comment.icon size={20} /> 
                        // <button key={index} className="flex items-center justify-center flex-1 p-2 space-x-2 hover:bg-gray-200 rounded-md m-1">
                        //     <comment.icon size={20} /> 
                    ))}
                </div>
            </div>
            {/* Comments Section*/}
            {/* <CommentModal /> */}
            {/* Share */}
        </div>
    )
}

export default Post;
'use client';

import React, { use } from "react";
import Image from "next/image";
import facebook from '../../../assets/communication.png';
import Link from "next/link";
import { IoSearch } from "react-icons/io5";
import { AiFillHome } from "react-icons/ai";
import { LuTvMinimalPlay } from "react-icons/lu";
import { RiGroup2Line } from "react-icons/ri";
import { CgGames } from "react-icons/cg";
import { MdOutlineStorefront } from "react-icons/md";
import { IoMdNotifications } from "react-icons/io";
import { IoApps } from "react-icons/io5";
import { IoPerson } from "react-icons/io5";
import { usePathname } from "next/navigation";



const Header = () => {
    const pathname = usePathname();

    const menus = [
        { id: "home", path: "/", icon: <AiFillHome size={24} /> },
        { id: "watch", path: "/watch", icon: <LuTvMinimalPlay size={24} /> },
        { id: "marketplace", path: "/marketplace", icon: <RiGroup2Line size={24} /> },
        { id: "groups", path: "/groups", icon: <CgGames size={24} /> },
        { id: "gaming", path: "/gaming", icon: <MdOutlineStorefront size={24} /> },
    ];
    const isActive = (path: string) => {
        return pathname === path ? "text-blue-600" : "text-gray-500";
    }
    return (
        <div className="fixed top-0 left-0 right-0 shadow z-50 p-2 h-14 flex justify-between items-center bg-white bg-size-[heigh_50px] border-b-2 border-gray-100">
            {/* {Left side} */}
            <div className="flex items-center mr-2">
                <div className="w-10 h-10">
                    <Image src={facebook} alt="facebook" />
                </div>
                <div className="ml-2 font-sans bg-[#f2f3f7] p-2 rounded-full flex items-center max-sm:p-3">
                    <IoSearch className="opacity-55" />
                    <input type='text' placeholder="Search Facebook" className="ml-3 hidden md:inline-flex" />
                </div>
            </div>
            {/* {Middle side} */}
            <div className="flex items-center w-full max-w-[600px] flex-1 ml-9  mr-5 ">
                <div className="sm:flex items-center active:border-blue-500 hidden max-md:space-x-5 max-lg:space-x-10 space-x-13 list-none group">
                    {menus.map((menu) => (
                        <li key={menu.id}>
                            <Link href={menu.path}>
                                <div className={`flex items-center mx-auto justify-center w-14 h-12  rounded-xl transition-colors duration-200 hover:bg-gray-200 cursor-pointer ${isActive(menu.path)}`}>
                                    {menu.icon}

                                </div>
                            </Link>
                        </li>
                    ))}
                </div>
            </div>

            {/* {Right side} */}
            <div className="flex items-center mr-2 ">
                <div className="flex items-center space-x-4 max-md:space-x-2">
                    <IoMdNotifications size={40} className="bg-[#d8d8d8] rounded-full p-2" />
                    <IoApps size={40} className="bg-[#d8d8d8] rounded-full p-2" />
                    <IoPerson size={40} className="bg-[#d8d8d8] rounded-full p-2" />
                </div>
            </div>
        </div >
    )
}


export default Header;
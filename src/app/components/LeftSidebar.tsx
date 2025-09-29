import Image from "next/image";
import facebook from '../../../assets/communication.png';

const menuItems = [
    { icon: "/icons/user.svg", label: "Minhduy Ngo" },
    //   { icon: "/icons/meta-ai.svg", label: "Meta AI" },
    { icon: "/icons/user.svg", label: "Bạn bè" },
    { icon: "/icons/time.svg", label: "Kỷ niệm" },
    { icon: "/icons/bookmark.svg", label: "Đã lưu" },
    { icon: "/icons/friend.svg", label: "Nhóm" },
    { icon: "/icons/video.svg", label: "Video" },
    { icon: "/icons/market.svg", label: "Marketplace" },
    { icon: "/icons/more.svg", label: "Xem thêm" },
];

const LeftSidebar = () => {
    return (
        <aside className="w-100 h-screen sticky top-0 max-xl:w-80 hidden lg:block overflow-y-auto px-3 py-4">
            <ul className="space-y-2 ">
                {menuItems.map(({ icon, label }, index) => (
                    <li
                        key={index}
                        className="flex max-items-center space-x-3 p-2 rounded-lg hover:bg-gray-200 cursor-pointer"
                    >
                        <div className="w-8 h-8 flex items-center justify-center">
                            <Image
                                src={icon}
                                alt={label}
                                width={40}
                                height={40}
                                className="object-contain"
                            />
                        </div>

                        <span className="text-[17px] mt-1 font-bold text-gray-800">
                            {label}
                        </span>

                    </li>
                ))}
            </ul>
        </aside>
    )
}

export default LeftSidebar;
import { Users, Clock, Bookmark, UsersRound, Store, Tv } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getCurrentUser } from '@/lib/mockApiFeed';
import { useAuth } from '@/hooks/useAuth';


const menuItems = [
    { icon: Users, label: 'Bạn bè', color: 'text-blue-500' },
    { icon: Clock, label: 'Kỷ niệm', color: 'text-blue-500' },
    { icon: Bookmark, label: 'Đã lưu', color: 'text-purple-500' },
    { icon: UsersRound, label: 'Nhóm', color: 'text-blue-500' },
    { icon: Store, label: 'Marketplace', color: 'text-blue-500' },
    { icon: Tv, label: 'Watch', color: 'text-blue-500' },
];

export const LeftSidebar = () => {
    const currentUser = useAuth();

    return (
        <aside className="hidden lg:block w-100 fixed left-0 top-14 h-[calc(100vh-3.5rem)] overflow-y-auto p-4">
            <div className="space-y-2">
                {/* User Profile */}
                <button className="flex items-center gap-3 w-full p-2 hover:bg-accent rounded-lg transition-colors">
                    <Avatar className="w-9 h-9">
                        <AvatarImage src={currentUser.user?.photoURL || "/default-icon.jpg"} />
                        <AvatarFallback>{currentUser.user?.displayName?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{currentUser.user?.displayName || 'User'}</span>
                </button>

                {/* Menu Items */}
                {menuItems.map((item) => (
                    <button
                        key={item.label}
                        className="flex items-center gap-3 w-full p-2 hover:bg-accent rounded-lg transition-colors"
                    >
                        <div className={`p-2 bg-accent rounded-lg ${item.color}`}>
                            <item.icon className="w-5 h-5" />
                        </div>
                        <span className="font-medium">{item.label}</span>
                    </button>
                ))}
            </div>
        </aside>
    );
};

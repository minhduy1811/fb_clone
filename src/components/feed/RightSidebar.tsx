import { Gift } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const onlineContacts = [
    { name: 'Nguyễn Văn A', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NguyenVanA' },
    { name: 'Trần Thị B', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TranThiB' },
    { name: 'Lê Văn C', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LeVanC' },
    { name: 'Phạm Thị D', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PhamThiD' },
];

export const RightSidebar = () => {
    return (
        <aside className="hidden xl:block w-80 fixed right-0 top-14 h-[calc(100vh-3.5rem)] overflow-y-auto p-4">
            <div className="space-y-4">
                {/* Birthdays */}
                <div className="bg-card rounded-lg p-4 shadow-sm border">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Gift className="w-5 h-5 text-primary" />
                        Sinh nhật
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Hôm nay là sinh nhật của <strong>Nguyễn Văn A</strong> và{' '}
                        <strong>2 người khác</strong>
                    </p>
                </div>

                {/* Sponsored
                <div className="border-t pt-4">
                    <h3 className="text-muted-foreground text-sm font-semibold mb-3">Được tài trợ</h3>
                    <div className="space-y-3">
                        <div className="flex gap-3 p-2 hover:bg-accent rounded-lg cursor-pointer">
                            <img
                                src="https://via.placeholder.com/80"
                                alt="Ad"
                                className="w-20 h-20 rounded-lg object-cover"
                            />
                            <div>
                                <p className="font-medium text-sm">Quảng cáo sản phẩm</p>
                                <p className="text-xs text-muted-foreground">example.com</p>
                            </div>
                        </div>
                    </div>
                </div> */}

                {/* Online Contacts */}
                <div className="border-t pt-4">
                    <h3 className="text-muted-foreground text-sm font-semibold mb-3">Người liên hệ</h3>
                    <div className="space-y-2">
                        {onlineContacts.map((contact) => (
                            <button
                                key={contact.name}
                                className="flex items-center gap-3 w-full p-2 hover:bg-accent rounded-lg transition-colors"
                            >
                                <div className="relative">
                                    <Avatar className="w-9 h-9">
                                        <AvatarImage src={contact.avatar} />
                                        <AvatarFallback>{contact.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                                </div>
                                <span className="text-sm font-medium">{contact.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    );
};
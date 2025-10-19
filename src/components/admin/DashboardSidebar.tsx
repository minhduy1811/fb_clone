import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
    BarChart3,
    Users,
    FileText,
    UserCog,
} from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
    {
        title: "Thống kê",
        url: "/admin",
        icon: BarChart3,
    },
    {
        title: "Quản lý tài khoản",
        url: "/admin/users",
        icon: Users,
    },
    {
        title: "Quản lý bài viết",
        url: "/admin/posts",
        icon: FileText,
    },
    {
        title: "Phân quyền admin",
        url: "/admin/admin-roles",
        icon: UserCog,
    },
];

export default function DashboardSidebar() {
    const pathname = usePathname()
    const { state } = useSidebar() // 👈 lấy state từ SidebarProvider
    const collapsed = state === "collapsed"

    return (
        <Sidebar collapsible="icon" variant="inset" className="border-r border-sidebar-border bg-card"
            style={{
                ['--sidebar-width' as any]: '220px',       // khi mở
                ['--sidebar-width-icon' as any]: '30px',   // khi đóng (gọn hơn)
            }}>
            <SidebarContent className="bg-card">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => {
                                const isActive = pathname === item.url

                                const linkButton = (
                                    <SidebarMenuButton asChild>
                                        <Link
                                            href={item.url}
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                                                "text-foreground hover:bg-muted",
                                                isActive && "bg-primary text-primary-foreground hover:bg-primary/90"
                                            )}
                                        >
                                            <item.icon className="h-5 w-5 shrink-0" />
                                            {/* Chỉ hiện label khi sidebar mở */}
                                            {!collapsed && <span className="text-sm font-medium">{item.title}</span>}
                                        </Link>
                                    </SidebarMenuButton>
                                )

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        {/* Tooltip chỉ bật khi sidebar đang collapse */}
                                        {collapsed ? (
                                            <TooltipProvider delayDuration={200}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>{linkButton}</TooltipTrigger>
                                                    <TooltipContent side="right">{item.title}</TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        ) : (
                                            linkButton
                                        )}
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
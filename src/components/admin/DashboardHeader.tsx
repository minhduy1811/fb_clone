'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { LogOut, Settings, User } from "lucide-react";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { LogoutButton } from "../auth/LogoutButton";

export default function DashboardHeader() {
    const { state } = useSidebar();
    useEffect(() => console.log("sidebar state (header):", state), [state]);
    const { user } = useAuth();

    return (
        <header className="flex h-16 items-center justify-between border-b bg-card px-6">
            <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                        <span className="text-sm font-bold text-primary-foreground">F</span>
                    </div>
                    <h1 className="text-xl font-semibold text-foreground">Admin Dashboard</h1>
                </div>
            </div>

            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="/default-icon.jpg" alt="Admin" />
                            <AvatarFallback>AD</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                            <p className="font-medium">{user?.displayName || 'Admin'}</p>
                            <p className="w-[200px] truncate text-sm text-muted-foreground">{user?.email || ""}</p>
                        </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem><User className="mr-2 h-4 w-4" />Profile</DropdownMenuItem>
                    <DropdownMenuItem><Settings className="mr-2 h-4 w-4" />Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem><LogoutButton /></DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}
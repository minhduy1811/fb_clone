import { Search, Home, MessageCircle, Bell, User, TvMinimalPlay, Store, CircleUserRound, Gamepad } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { useAuth } from '@/hooks/useAuth';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuSeparator } from '../ui/dropdown-menu';
import { Settings } from 'lucide-react';
import { LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { LogoutButton } from '../auth/LogoutButton';

export const Header = () => {
    const currentUser = useAuth();

    return (
        <header className="  fixed top-0 left-0 right-0 z-50 bg-background border-b shadow-sm">
            <div className="flex items-center justify-between px-4 h-14">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="bg-[#f2f3f7] rounded-full w-10 h-10 p-2 text-4xl font-bold text-primary flex items-center justify-center">f</div>
                    <div className='ml-1 font-sans bg-[#f2f3f7] p-2 rounded-2xl flex items-center max-sm:p-2'>
                        <Search className='w-4 h-4 opacity-45' />
                        <input
                            type="search"
                            placeholder="Tìm kiếm trên Facebook"
                            className="w-50 ml-3 hidden md:inline-flex"

                        />
                    </div>


                </div>

                {/* Center Icons */}
                <div className="flex flex-1 items-center justify-center md:gap-15 md:mr-30 gap-8">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button className="p-3  rounded-lg transition-colors cursor-pointer ">
                                    <Home className="w-6 h-6 text-blue-500" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Trang chủ</p>
                            </TooltipContent>
                            <button className="p-3 hover:bg-accent rounded-lg transition-colors cursor-pointer">
                                <TvMinimalPlay className="w-6 h-6" />
                            </button>
                            <button className="p-3 hover:bg-accent rounded-lg transition-colors cursor-pointer">
                                <Store className="w-6 h-6" />
                            </button>
                            <button className="p-3 hover:bg-accent rounded-lg transition-colors cursor-pointer">
                                <CircleUserRound className="w-6 h-6" />
                            </button>
                            <button className="p-3 hover:bg-accent rounded-lg transition-colors cursor-pointer">
                                <Gamepad className="w-6 h-6" />
                            </button>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                {/* Profile */}
                <div className="flex items-center gap-2">
                    <Bell className="w-8 h-8 bg-gray-100 rounded-full p-1 flex items-center justify-center cursor-pointer" />
                    <MessageCircle className="w-8 h-8 bg-gray-100 rounded-full p-1 flex items-center justify-center cursor-pointer" />

                    <div className='relative'>
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <div className='flex items-center gap-2 cursor-pointer'>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full cursor-pointer">
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage src={currentUser.user?.photoURL ?? "/default-icon.jpg"} />
                                            <AvatarFallback>
                                                <User className="w-6 h-6" />
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                    <span className="hidden md:inline text-sm font-medium">
                                        {currentUser.user?.displayName || 'User'}
                                    </span>
                                </div>

                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <div className="flex items-center justify-start gap-2 p-2">
                                    <div className="flex flex-col space-y-1 leading-none">
                                        <p className="font-medium">Admin User</p>
                                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                                            admin@facebook.com
                                        </p>
                                    </div>
                                </div>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <LogoutButton />
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </header>
    );
};
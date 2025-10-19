"use client"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import DashboardSidebar from "@/components/admin/DashboardSidebar"
import DashboardHeader from "@/components/admin/DashboardHeader"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { Toaster as Sonner } from "@/components/ui/sonner"

const queryClient = new QueryClient();

export default function AdminLayout({ children }: { children: React.ReactNode }) {

    return (
        <QueryClientProvider client={queryClient}>
            <SidebarProvider>
                <TooltipProvider>
                    <Sonner />
                    <div className="flex min-h-screen w-full bg-background transition-all duration-300">
                        {/* Sidebar */}
                        <DashboardSidebar />

                        {/* Inset chứa header + main */}
                        <SidebarInset className="m-0"
                        >
                            <DashboardHeader />
                            <main className="flex-1 p-6 overflow-y-auto transition-all duration-300">
                                {children}
                            </main>
                        </SidebarInset>
                    </div>
                </TooltipProvider>
            </SidebarProvider>
        </QueryClientProvider>
    )
}
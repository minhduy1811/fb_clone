'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Users, FileText, MessageSquare, Flag, TrendingUp, TrendingDown } from "lucide-react";

// Mock data for charts
const monthlyData = [
    { name: "Jan", users: 120, posts: 45, comments: 180, reports: 12 },
    { name: "Feb", users: 150, posts: 62, comments: 220, reports: 8 },
    { name: "Mar", users: 180, posts: 78, comments: 280, reports: 15 },
    { name: "Apr", users: 220, posts: 95, comments: 340, reports: 10 },
    { name: "May", users: 280, posts: 120, comments: 420, reports: 18 },
    { name: "Jun", users: 320, posts: 145, comments: 480, reports: 22 },
];

const dailyData = [
    { name: "Mon", value: 45 },
    { name: "Tue", value: 52 },
    { name: "Wed", value: 48 },
    { name: "Thu", value: 61 },
    { name: "Fri", value: 55 },
    { name: "Sat", value: 67 },
    { name: "Sun", value: 43 },
];

export default function Dashboard() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-foreground">Thống kê tổng quan</h2>
                <p className="text-muted-foreground">
                    Xem tổng quan về hoạt động của hệ thống
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tài khoản mới</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+320</div>
                        <p className="text-xs text-muted-foreground flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1 text-success" />
                            +20.1% từ tháng trước
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bài viết mới</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+145</div>
                        <p className="text-xs text-muted-foreground flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1 text-success" />
                            +15.2% từ tháng trước
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bình luận mới</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+480</div>
                        <p className="text-xs text-muted-foreground flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1 text-success" />
                            +25.8% từ tháng trước
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Báo cáo mới</CardTitle>
                        <Flag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">22</div>
                        <p className="text-xs text-muted-foreground flex items-center">
                            <TrendingDown className="h-3 w-3 mr-1 text-destructive" />
                            -5.2% từ tháng trước
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Thống kê theo tháng</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="users" fill="hsl(var(--primary))" />
                                <Bar dataKey="posts" fill="hsl(var(--success))" />
                                <Bar dataKey="comments" fill="hsl(var(--warning))" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Hoạt động 7 ngày qua</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={dailyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
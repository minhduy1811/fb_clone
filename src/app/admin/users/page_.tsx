// 'use client'

// import { useState } from "react";
// import { ColumnDef } from "@tanstack/react-table";
// import { DataTable } from "@/components/ui/data-table";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select";
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
// } from "@/components/ui/dialog";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { MoreHorizontal, Shield, Unlock, RotateCcw, Eye, Trash2, AlertTriangle } from "lucide-react";
// import { toast } from 'sonner'
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";

// type User = {
//     id: string;
//     name: string;
//     email: string;
//     role: "member" | "admin";
//     status: "active" | "banned";
//     createdAt: string;
// };

// // Mock data
// const userData: User[] = [
//     {
//         id: "1",
//         name: "Nguyễn Văn A",
//         email: "nguyenvana@example.com",
//         role: "member",
//         status: "active",
//         createdAt: "2024-01-15",
//     },
//     {
//         id: "2",
//         name: "Trần Thị B",
//         email: "tranthib@example.com",
//         role: "admin",
//         status: "active",
//         createdAt: "2024-02-10",
//     },
//     {
//         id: "3",
//         name: "Lê Văn C",
//         email: "levanc@example.com",
//         role: "member",
//         status: "banned",
//         createdAt: "2024-03-05",
//     },
// ];

// export default function Users() {
//     const [users, setUsers] = useState<User[]>(userData);
//     const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; user: User | null }>({
//         open: false,
//         user: null,
//     });
//     const [detailDialog, setDetailDialog] = useState<{ open: boolean; user: User | null }>({
//         open: false,
//         user: null,
//     });
//     const [statusFilter, setStatusFilter] = useState<string>("all");
//     const [roleFilter, setRoleFilter] = useState<string>("all");

//     const toggleUserStatus = (userId: string) => {
//         setUsers(users.map(user =>
//             user.id === userId
//                 ? { ...user, status: user.status === "active" ? "banned" : "active" }
//                 : user
//         ));
//         toast(
//             "Trạng thái đã được cập nhật", {
//             description: "Trạng thái người dùng đã được thay đổi thành công.",
//         });
//     };

//     const resetPassword = (userId: string) => {
//         toast(
//             "Mật khẩu đã được reset", {
//             description: "Email hướng dẫn đặt lại mật khẩu đã được gửi.",
//         });
//     };

//     const deleteUser = () => {
//         if (deleteDialog.user) {
//             setUsers(users.filter(user => user.id !== deleteDialog.user!.id));
//             toast.warning(
//                 "Người dùng đã được xóa", {
//                 description: "Tài khoản người dùng đã được xóa khỏi hệ thống.",
//             });
//         }
//         setDeleteDialog({ open: false, user: null });
//     };

//     const columns: ColumnDef<User>[] = [
//         {
//             accessorKey: "id",
//             header: "ID",
//         },
//         {
//             accessorKey: "name",
//             header: "Tên",
//         },
//         {
//             accessorKey: "email",
//             header: "Email",
//         },
//         {
//             accessorKey: "role",
//             header: "Role",
//             cell: ({ row }) => {
//                 const role = row.getValue("role") as string;
//                 return (
//                     <Badge variant={role === "admin" ? "default" : "secondary"}>
//                         {role === "admin" ? "Admin" : "Member"}
//                     </Badge>
//                 );
//             },
//         },
//         {
//             accessorKey: "status",
//             header: "Trạng thái",
//             cell: ({ row }) => {
//                 const status = row.getValue("status") as string;
//                 return (
//                     <Badge variant={status === "active" ? "default" : "destructive"}>
//                         {status === "active" ? "Hoạt động" : "Đã khóa"}
//                     </Badge>
//                 );
//             },
//         },
//         {
//             accessorKey: "createdAt",
//             header: "Ngày tạo",
//         },
//         {
//             id: "actions",
//             header: "Hành động",
//             cell: ({ row }) => {
//                 const user = row.original;
//                 return (
//                     <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                             <Button variant="ghost" className="h-8 w-8 p-0">
//                                 <MoreHorizontal className="h-4 w-4" />
//                             </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end">
//                             <DropdownMenuItem onClick={() => toggleUserStatus(user.id)}>
//                                 {user.status === "active" ? (
//                                     <>
//                                         <Shield className="mr-2 h-4 w-4" />
//                                         Khóa tài khoản
//                                     </>
//                                 ) : (
//                                     <>
//                                         <Unlock className="mr-2 h-4 w-4" />
//                                         Mở khóa
//                                     </>
//                                 )}
//                             </DropdownMenuItem>
//                             <DropdownMenuItem onClick={() => resetPassword(user.id)}>
//                                 <RotateCcw className="mr-2 h-4 w-4" />
//                                 Reset mật khẩu
//                             </DropdownMenuItem>
//                             <DropdownMenuItem onClick={() => setDetailDialog({ open: true, user })}>
//                                 <Eye className="mr-2 h-4 w-4" />
//                                 Xem chi tiết
//                             </DropdownMenuItem>
//                             <DropdownMenuItem
//                                 onClick={() => setDeleteDialog({ open: true, user })}
//                                 className="text-destructive"
//                             >
//                                 <Trash2 className="mr-2 h-4 w-4" />
//                                 Xóa
//                             </DropdownMenuItem>
//                         </DropdownMenuContent>
//                     </DropdownMenu>
//                 );
//             },
//         },
//     ];
//     const [search, setSearch] = useState("")

//     const filteredUsers = users.filter(user => {
//         const statusMatch = statusFilter === "all" || user.status === statusFilter;
//         const roleMatch = roleFilter === "all" || user.role === roleFilter;
//         const matchSearch = user.name.toLowerCase().includes(search.toLowerCase())
//         return statusMatch && roleMatch && matchSearch;
//     });

//     return (
//         <div className="space-y-6">
//             <div>
//                 <h2 className="text-3xl font-bold text-foreground">Quản lý tài khoản</h2>
//                 <p className="text-muted-foreground pt-3 ">
//                     Quản lý người dùng và phân quyền trong hệ thống
//                 </p>
//             </div>

//             <Card className="rounded-2xl shadow-md min-h-[400px] md:min-h-[500px]">
//                 <CardHeader>
//                     <CardTitle className="text-xl">Danh sách tài khoản</CardTitle>
//                     {/* Filters */}
//                     <div className="flex items-center gap-4 pt-3">
//                         {/* Ô tìm kiếm */}
//                         <Input
//                             placeholder="Tìm kiếm theo tên ..."
//                             value={search}
//                             onChange={(e) => setSearch(e.target.value)}
//                             className="h-9 md:w-[200px] w-[150px]"
//                         />

//                         {/* Filter: Status */}
//                         <Select value={statusFilter} onValueChange={setStatusFilter} >
//                             <SelectTrigger className="h-8 w-[180px] cursor-pointer">
//                                 <SelectValue placeholder="Trạng thái" />
//                             </SelectTrigger>
//                             <SelectContent >
//                                 <SelectItem value="all" className="cursor-pointer">Tất cả trạng thái</SelectItem>
//                                 <SelectItem value="active" className="cursor-pointer">Hoạt động</SelectItem>
//                                 <SelectItem value="banned" className="cursor-pointer">Đã khóa</SelectItem>
//                             </SelectContent>
//                         </Select>

//                         {/* Filter: Role */}
//                         <Select value={roleFilter} onValueChange={setRoleFilter}>
//                             <SelectTrigger className="h-8 w-[180px] cursor-pointer">
//                                 <SelectValue placeholder="Role" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 <SelectItem value="all" className="cursor-pointer">Tất cả role</SelectItem>
//                                 <SelectItem value="member" className="cursor-pointer">Member</SelectItem>
//                                 <SelectItem value="admin" className="cursor-pointer">Admin</SelectItem>
//                             </SelectContent>
//                         </Select>
//                     </div>
//                 </CardHeader>
//                 <CardContent>
//                     <DataTable
//                         columns={columns}
//                         data={filteredUsers} />
//                 </CardContent>
//             </Card>

//             {/* Delete Confirmation Dialog */}
//             <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, user: null })}>
//                 <DialogContent className="rounded-2xl">
//                     <DialogHeader>
//                         <div className="flex items-center gap-2">
//                             <AlertTriangle className="h-5 w-5 text-destructive" />
//                             <DialogTitle>Xác nhận xóa</DialogTitle>
//                         </div>
//                         <DialogDescription>
//                             Bạn có chắc chắn muốn xóa tài khoản <strong>{deleteDialog.user?.name}</strong>?
//                             Hành động này không thể hoàn tác.
//                         </DialogDescription>
//                     </DialogHeader>
//                     <DialogFooter>
//                         <Button
//                             variant="outline"
//                             onClick={() => setDeleteDialog({ open: false, user: null })}
//                         >
//                             Hủy
//                         </Button>
//                         <Button variant="destructive" onClick={deleteUser}>
//                             Xác nhận xóa
//                         </Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>

//             {/* User Detail Dialog */}
//             <Dialog open={detailDialog.open} onOpenChange={(open) => setDetailDialog({ open, user: null })}>
//                 <DialogContent className="rounded-2xl max-w-2xl">
//                     <DialogHeader>
//                         <DialogTitle>Chi tiết tài khoản</DialogTitle>
//                     </DialogHeader>
//                     {detailDialog.user && (
//                         <div className="space-y-4">
//                             <div className="grid grid-cols-2 gap-4">
//                                 <div>
//                                     <Label className="text-sm font-medium text-muted-foreground">ID</Label>
//                                     <p className="text-sm">{detailDialog.user.id}</p>
//                                 </div>
//                                 <div>
//                                     <Label className="text-sm font-medium text-muted-foreground">Tên</Label>
//                                     <p className="text-sm">{detailDialog.user.name}</p>
//                                 </div>
//                                 <div>
//                                     <Label className="text-sm font-medium text-muted-foreground">Email</Label>
//                                     <p className="text-sm">{detailDialog.user.email}</p>
//                                 </div>
//                                 <div>
//                                     <Label className="text-sm font-medium text-muted-foreground">Role</Label>
//                                     <Badge variant={detailDialog.user.role === "admin" ? "default" : "secondary"}>
//                                         {detailDialog.user.role === "admin" ? "Admin" : "Member"}
//                                     </Badge>
//                                 </div>
//                                 <div>
//                                     <Label className="text-sm font-medium text-muted-foreground">Trạng thái</Label>
//                                     <Badge variant={detailDialog.user.status === "active" ? "default" : "destructive"}>
//                                         {detailDialog.user.status === "active" ? "Hoạt động" : "Đã khóa"}
//                                     </Badge>
//                                 </div>
//                                 <div>
//                                     <Label className="text-sm font-medium text-muted-foreground">Ngày tạo</Label>
//                                     <p className="text-sm">{detailDialog.user.createdAt}</p>
//                                 </div>
//                             </div>
//                             <div>
//                                 <Label className="text-sm font-medium text-muted-foreground">Hoạt động gần đây</Label>
//                                 <p className="text-sm text-muted-foreground">Đăng nhập lần cuối: {new Date().toLocaleDateString('vi-VN')}</p>
//                             </div>
//                         </div>
//                     )}
//                     <DialogFooter>
//                         <Button variant="outline" onClick={() => setDetailDialog({ open: false, user: null })}>
//                             Đóng
//                         </Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>
//         </div>
//     );
// }
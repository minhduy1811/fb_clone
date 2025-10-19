// 'use client'

// import { useState } from "react";
// import { ColumnDef } from "@tanstack/react-table";
// import { DataTable } from "@/ui/data-table";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
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
// import { MoreHorizontal, Edit, Trash2, Plus, AlertTriangle } from "lucide-react";
// import { toast } from "sonner"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// type AdminUser = {
//     id: string;
//     name: string;
//     email: string;
//     role: "super_admin" | "moderator";
//     createdAt: string;
//     permissions: string[];
// };

// // Mock data
// const adminData: AdminUser[] = [
//     {
//         id: "1",
//         name: "Admin chính",
//         email: "admin@facebook.com",
//         role: "super_admin",
//         createdAt: "2024-01-01",
//         permissions: ["all"],
//     },
//     {
//         id: "2",
//         name: "Moderator A",
//         email: "mod1@facebook.com",
//         role: "moderator",
//         createdAt: "2024-02-15",
//         permissions: ["posts", "comments", "reports"],
//     },
//     {
//         id: "3",
//         name: "Moderator B",
//         email: "mod2@facebook.com",
//         role: "moderator",
//         createdAt: "2024-03-10",
//         permissions: ["users", "reports"],
//     },
// ];

// export default function AdminRoles() {
//     const [admins, setAdmins] = useState<AdminUser[]>(adminData);
//     const [editDialog, setEditDialog] = useState<{ open: boolean; admin: AdminUser | null }>({
//         open: false,
//         admin: null,
//     });
//     const [addDialog, setAddDialog] = useState(false);
//     const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; admin: AdminUser | null }>({
//         open: false,
//         admin: null,
//     });
//     const [roleFilter, setRoleFilter] = useState<string>("all");
//     const [newAdmin, setNewAdmin] = useState({
//         name: "",
//         email: "",
//         role: "moderator" as "super_admin" | "moderator",
//     });

//     const updateAdminRole = (adminId: string, newRole: "super_admin" | "moderator") => {
//         setAdmins(admins.map(admin =>
//             admin.id === adminId
//                 ? { ...admin, role: newRole }
//                 : admin
//         ));
//         toast.success(
//             "Quyền đã được cập nhật", {
//             description: "Quyền của admin đã được thay đổi thành công.",
//         });
//         setEditDialog({ open: false, admin: null });
//     };

//     const addNewAdmin = () => {
//         if (newAdmin.name && newAdmin.email) {
//             const admin: AdminUser = {
//                 id: (admins.length + 1).toString(),
//                 name: newAdmin.name,
//                 email: newAdmin.email,
//                 role: newAdmin.role,
//                 createdAt: new Date().toISOString().split('T')[0],
//                 permissions: newAdmin.role === "super_admin" ? ["all"] : ["posts", "comments"],
//             };

//             setAdmins([...admins, admin]);
//             toast.success(
//                 "Admin mới đã được thêm", {
//                 description: "Tài khoản admin mới đã được tạo thành công.",
//             });
//             setAddDialog(false);
//             setNewAdmin({ name: "", email: "", role: "moderator" });
//         }
//     };

//     const deleteAdmin = () => {
//         if (deleteDialog.admin) {
//             setAdmins(admins.filter(admin => admin.id !== deleteDialog.admin!.id));
//             toast.warning(
//                 "Admin đã được xóa", {
//                 description: "Tài khoản admin đã được xóa khỏi hệ thống.",
//             });
//         }
//         setDeleteDialog({ open: false, admin: null });
//     };

//     const columns: ColumnDef<AdminUser>[] = [
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
//                     <Badge variant={role === "super_admin" ? "default" : "secondary"}>
//                         {role === "super_admin" ? "Super Admin" : "Moderator"}
//                     </Badge>
//                 );
//             },
//         },
//         {
//             accessorKey: "createdAt",
//             header: "Ngày tạo",
//         },
//         {
//             accessorKey: "permissions",
//             header: "Quyền",
//             cell: ({ row }) => {
//                 const permissions = row.getValue("permissions") as string[];
//                 const displayPermissions = permissions.includes("all")
//                     ? "Toàn quyền"
//                     : permissions.join(", ");
//                 return (
//                     <div className="max-w-[150px] truncate" title={displayPermissions}>
//                         {displayPermissions}
//                     </div>
//                 );
//             },
//         },
//         {
//             id: "actions",
//             header: "Hành động",
//             cell: ({ row }) => {
//                 const admin = row.original;
//                 return (
//                     <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                             <Button variant="ghost" className="h-8 w-8 p-0">
//                                 <MoreHorizontal className="h-4 w-4" />
//                             </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end">
//                             <DropdownMenuItem onClick={() => setEditDialog({ open: true, admin })}>
//                                 <Edit className="mr-2 h-4 w-4" />
//                                 Chỉnh sửa quyền
//                             </DropdownMenuItem>
//                             {admin.role !== "super_admin" && (
//                                 <DropdownMenuItem
//                                     onClick={() => setDeleteDialog({ open: true, admin })}
//                                     className="text-destructive"
//                                 >
//                                     <Trash2 className="mr-2 h-4 w-4" />
//                                     Xóa admin
//                                 </DropdownMenuItem>
//                             )}
//                         </DropdownMenuContent>
//                     </DropdownMenu>
//                 );
//             },
//         },
//     ];
//     const [search, setSearch] = useState("")
//     const filteredAdmins = admins.filter(admin => {
//         const matchSearch = admin.name.toLowerCase().includes(search.toLowerCase());
//         return roleFilter === "all" || admin.role === roleFilter && matchSearch;
//     });

//     return (
//         <div className="space-y-6">
//             <div className="flex justify-between items-center">
//                 <div>
//                     <h2 className="text-3xl font-bold text-foreground">Phân quyền admin</h2>
//                     <p className="text-muted-foreground pt-3">
//                         Quản lý quyền và vai trò của các admin trong hệ thống
//                     </p>
//                 </div>

//             </div>

//             <Card className="rounded-2xl shadow-md">
//                 <CardHeader>
//                     <CardTitle className="text-xl">Danh sách admin</CardTitle>
//                     <div className="flex items-center justify-between gap-4 pt-3">
//                         <div className="flex gap-4">
//                             <Input
//                                 placeholder="Tìm kếm theo tên ..."
//                                 value={search}
//                                 onChange={(e) => setSearch(e.target.value)}
//                                 className="h-9 md:w-[200px] w-[150px]"
//                             />

//                             <Select value={roleFilter} onValueChange={setRoleFilter}>
//                                 <SelectTrigger className="w-[180px] cursor-pointer">
//                                     <SelectValue placeholder="Role" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="all" className="cursor-pointer">Tất cả role</SelectItem>
//                                     <SelectItem value="super_admin" className="cursor-pointer">Super Admin</SelectItem>
//                                     <SelectItem value="moderator" className="cursor-pointer">Moderator</SelectItem>
//                                 </SelectContent>
//                             </Select>
//                         </div>

//                         <Button className="cursor-pointer" onClick={() => setAddDialog(true)}>
//                             <Plus className=" mr-2 h-4 w-3 " />
//                             Thêm admin
//                         </Button>

//                     </div>
//                 </CardHeader>
//                 <CardContent>
//                     <DataTable
//                         columns={columns}
//                         data={filteredAdmins}
//                     />
//                 </CardContent>
//             </Card>

//             {/* Edit Role Dialog */}
//             <Dialog open={editDialog.open} onOpenChange={(open) => setEditDialog({ open, admin: null })}>
//                 <DialogContent className="rounded-2xl max-w-2xl">
//                     <DialogHeader>
//                         <DialogTitle>Chỉnh sửa admin</DialogTitle>
//                         <DialogDescription>
//                             Cập nhật thông tin và quyền cho {editDialog.admin?.name}
//                         </DialogDescription>
//                     </DialogHeader>
//                     {editDialog.admin && (
//                         <div className="space-y-4">
//                             <div className="grid grid-cols-2 gap-4">
//                                 <div>
//                                     <Label className="text-sm font-medium text-muted-foreground">ID</Label>
//                                     <p className="text-sm">{editDialog.admin.id}</p>
//                                 </div>
//                                 <div>
//                                     <Label className="text-sm font-medium text-muted-foreground">Tên</Label>
//                                     <p className="text-sm">{editDialog.admin.name}</p>
//                                 </div>
//                                 <div>
//                                     <Label className="text-sm font-medium text-muted-foreground">Email</Label>
//                                     <p className="text-sm">{editDialog.admin.email}</p>
//                                 </div>
//                                 <div>
//                                     <Label className="text-sm font-medium text-muted-foreground">Ngày tạo</Label>
//                                     <p className="text-sm">{editDialog.admin.createdAt}</p>
//                                 </div>
//                             </div>
//                             <div>
//                                 <Label className="text-sm font-medium text-muted-foreground">Quyền hiện tại</Label>
//                                 <p className="text-sm">{editDialog.admin.permissions.includes("all") ? "Toàn quyền" : editDialog.admin.permissions.join(", ")}</p>
//                             </div>
//                             <div>
//                                 <Label>Chọn role mới:</Label>
//                                 <Select
//                                     defaultValue={editDialog.admin.role}
//                                     onValueChange={(value) => {
//                                         if (editDialog.admin) {
//                                             updateAdminRole(editDialog.admin.id, value as "super_admin" | "moderator");
//                                         }
//                                     }}
//                                 >
//                                     <SelectTrigger>
//                                         <SelectValue />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         <SelectItem value="super_admin">Super Admin</SelectItem>
//                                         <SelectItem value="moderator">Moderator</SelectItem>
//                                     </SelectContent>
//                                 </Select>
//                             </div>
//                         </div>
//                     )}
//                     <DialogFooter>
//                         <Button variant="outline" onClick={() => setEditDialog({ open: false, admin: null })}>
//                             Hủy
//                         </Button>
//                         <Button onClick={() => setEditDialog({ open: false, admin: null })}>
//                             Save
//                         </Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>

//             {/* Add Admin Dialog */}
//             <Dialog open={addDialog} onOpenChange={setAddDialog}>
//                 <DialogContent className="rounded-2xl">
//                     <DialogHeader>
//                         <DialogTitle>Thêm admin mới</DialogTitle>
//                         <DialogDescription>
//                             Tạo tài khoản admin mới cho hệ thống
//                         </DialogDescription>
//                     </DialogHeader>
//                     <div className="space-y-4">
//                         <div>
//                             <Label htmlFor="name">Tên</Label>
//                             <Input
//                                 id="name"
//                                 value={newAdmin.name}
//                                 onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
//                                 placeholder="Nhập tên admin"
//                             />
//                         </div>
//                         <div>
//                             <Label htmlFor="email">Email</Label>
//                             <Input
//                                 id="email"
//                                 type="email"
//                                 value={newAdmin.email}
//                                 onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
//                                 placeholder="Nhập email admin"
//                             />
//                         </div>
//                         <div>
//                             <Label>Role</Label>
//                             <Select
//                                 value={newAdmin.role}
//                                 onValueChange={(value) => setNewAdmin({ ...newAdmin, role: value as "super_admin" | "moderator" })}
//                             >
//                                 <SelectTrigger>
//                                     <SelectValue />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="super_admin">Super Admin</SelectItem>
//                                     <SelectItem value="moderator">Moderator</SelectItem>
//                                 </SelectContent>
//                             </Select>
//                         </div>
//                     </div>
//                     <DialogFooter>
//                         <Button variant="outline" onClick={() => setAddDialog(false)}>
//                             Hủy
//                         </Button>
//                         <Button onClick={addNewAdmin}>
//                             Thêm admin
//                         </Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>

//             {/* Delete Confirmation Dialog */}
//             <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, admin: null })}>
//                 <DialogContent className="rounded-2xl">
//                     <DialogHeader>
//                         <div className="flex items-center gap-2">
//                             <AlertTriangle className="h-5 w-5 text-destructive" />
//                             <DialogTitle>Xác nhận xóa</DialogTitle>
//                         </div>
//                         <DialogDescription>
//                             Bạn có chắc chắn muốn xóa admin <strong>{deleteDialog.admin?.name}</strong>?
//                             Hành động này không thể hoàn tác.
//                         </DialogDescription>
//                     </DialogHeader>
//                     <DialogFooter >
//                         <Button className="cursor-pointer"
//                             variant="outline"
//                             onClick={() => setDeleteDialog({ open: false, admin: null })}
//                         >
//                             Hủy
//                         </Button>
//                         <Button className="cursor-pointer" variant="destructive" onClick={deleteAdmin}>
//                             Xác nhận xóa
//                         </Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>
//         </div>
//     );
// }
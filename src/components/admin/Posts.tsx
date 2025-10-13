'use client'

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { MoreHorizontal, Eye, Flag, Trash2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner'
import { Post } from "@/types/feed";
import { getActiveResourcesInfo } from "process";
import { getAllPosts } from "@/lib/posts";
import ImageGrid from "@/components/admin/ImageGrid"
import { formatDateVN } from "@/lib/time";

// Mock data
interface Props {
    postData: Post[];
}

export default function Posts({ postData }: Props) {
    const [posts, setPosts] = useState(postData || []);
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; post: Post | null }>({
        open: false,
        post: null,
    });
    const [detailDialog, setDetailDialog] = useState<{ open: boolean; post: Post | null }>({
        open: false,
        post: null,
    });
    const [statusFilter, setStatusFilter] = useState<string>("all");

    // const togglePostStatus = (postId: string) => {
    //     setPosts(posts.map(post =>
    //         post.id === postId
    //             ? { ...post }
    //             : post
    //     ));
    //     toast.success(
    //         "Trạng thái đã được cập nhật", {
    //         description: "Trạng thái bài viết đã được thay đổi thành công.",
    //     });
    // };

    const flagPost = (postId: string) => {
        toast.warning(
            "Đã gắn nhãn vi phạm", {
            description: "Bài viết đã được gắn nhãn vi phạm quy định.",
        });
    };

    const deletePost = () => {
        if (deleteDialog.post) {
            setPosts(posts.filter(post => post.id !== deleteDialog.post!.id));
            toast.error(
                "Bài viết đã được xóa", {
                description: "Bài viết đã được xóa khỏi hệ thống.",

            });
        }
        setDeleteDialog({ open: false, post: null });
    };

    const columns: ColumnDef<Post>[] = [
        {
            accessorKey: "id",
            header: "ID",
        },
        {
            accessorKey: "content",
            header: "Tiêu đề",
            cell: ({ row }) => {
                const title = row.getValue("content") as string;
                return (
                    <div className="max-w-[200px] truncate" title={title}>
                        {title}
                    </div>
                );
            },
        },
        {
            accessorKey: "authorName",
            header: "Tác giả",
        },
        {
            accessorKey: "createdAt",
            header: "Ngày đăng",
            cell: ({ row }) => {
                const createdAt = row.getValue("createdAt") as string;
                return <span>{formatDateVN(createdAt)}</span>;
            },
        },
        {
            id: "actions",
            header: "Hành động",
            cell: ({ row }) => {
                const post = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setDetailDialog({ open: true, post })}>
                                <Eye className="mr-2 h-4 w-4" />
                                Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => flagPost(post.id)}>
                                <Flag className="mr-2 h-4 w-4" />
                                Gắn nhãn vi phạm
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setDeleteDialog({ open: true, post })}
                                className="text-destructive"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Xóa
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                );
            },
        },
    ];
    const [search, setSearch] = useState("")

    const filteredPosts = posts.filter(post => {
        // const statusMatch = statusFilter === "all" || post.status === statusFilter;
        const matchSearch = post.content.toLowerCase().includes(search.toLowerCase())
        return matchSearch;
    });

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-foreground">Quản lý bài viết</h2>
                <p className="text-muted-foreground pt-3">
                    Quản lý và kiểm duyệt các bài viết trong hệ thống
                </p>
            </div>

            <Card className="rounded-2xl shadow-md">
                <CardHeader>
                    <CardTitle className="text-xl">Danh sách bài viết</CardTitle>
                    {/* Filters */}
                    <div className="flex items-center gap-4 pt-4">
                        <Input
                            placeholder="Tìm kiếm theo tên..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-9 md:w-[200px] w-[150px]"
                        />

                        {/* <div className="flex gap-4">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[180px] cursor-pointer">
                                    <SelectValue placeholder="Trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all" className="cursor-pointer"> Tất cả trạng thái</SelectItem>
                                    <SelectItem value="visible" className="cursor-pointer">Hiển thị</SelectItem>
                                    <SelectItem value="hidden" className="cursor-pointer">Ẩn</SelectItem>
                                </SelectContent>
                            </Select>
                        </div> */}
                    </div>
                </CardHeader>

                <CardContent>
                    <DataTable
                        columns={columns}
                        data={filteredPosts}
                    />
                </CardContent>
            </Card>

            {/* Post Detail Dialog */}
            <Dialog open={detailDialog.open} onOpenChange={(open) => setDetailDialog({ open, post: null })}>
                <DialogContent className="rounded-2xl max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{detailDialog.post?.content}</DialogTitle>
                        <DialogDescription>
                            Bởi {detailDialog.post?.authorName} • {" "}
                            {detailDialog.post?.createdAt ? formatDateVN(detailDialog.post.createdAt) : ""}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium mb-2">Nội dung:</h4>
                            <p className="text-sm text-muted-foreground">{detailDialog.post?.content}</p>
                        </div>
                        {detailDialog.post?.imageUrls && detailDialog.post.imageUrls.length > 0 && (
                            <div>
                                {detailDialog.post?.imageUrls && detailDialog.post.imageUrls.length > 0 && (
                                    <div>
                                        <h4 className="font-medium mb-2">Hình ảnh:</h4>
                                        <ImageGrid images={detailDialog.post.imageUrls} />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setDetailDialog({ open: false, post: null })}>
                            Đóng
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, post: null })}>
                <DialogContent className="rounded-2xl">
                    <DialogHeader>
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                            <DialogTitle>Xác nhận xóa</DialogTitle>
                        </div>
                        <DialogDescription>
                            Bạn có chắc chắn muốn xóa bài viết <strong>{deleteDialog.post?.content}</strong>?
                            Hành động này không thể hoàn tác.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialog({ open: false, post: null })}
                        >
                            Hủy
                        </Button>
                        <Button variant="destructive" onClick={deletePost}>
                            Xác nhận xóa
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
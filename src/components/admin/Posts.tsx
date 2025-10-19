'use client'

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Eye, Flag, Trash2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner'
import { Post } from "@/types/feed";
import { deleteAdminPost } from "@/lib/apiPosts";
import ImageGrid from "@/components/admin/ImageGrid"
import { formatDateVN } from "@/lib/time";

interface Props {
    postData: Post[];
}

export default function Posts({ postData }: Props) {
    // ✅ Gán sẵn displayId khi khởi tạo
    const [posts, setPosts] = useState(() =>
        postData.map((post, i) => ({
            ...post,
            displayId: `P${String(i + 1).padStart(4, "0")}`,
        }))
    );

    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; post: Post | null }>({
        open: false,
        post: null,
    });
    const [detailDialog, setDetailDialog] = useState<{ open: boolean; post: Post | null }>({
        open: false,
        post: null,
    });

    const [search, setSearch] = useState("");

    // const flagPost = (postId: string) => {
    //     toast.warning("Đã gắn nhãn vi phạm", {
    //         description: "Bài viết đã được gắn nhãn vi phạm quy định.",
    //     });
    // };

    const handleDelete = async (id: string) => {
        try {
            if (deleteDialog.post) {
                await deleteAdminPost(id);
                // ✅ Xoá bài và cập nhật lại index
                setPosts((prev) =>
                    prev
                        .filter((post) => post.id !== id)
                        .map((post, i) => ({
                            ...post,
                            displayId: `P${String(i + 1).padStart(4, "0")}`,
                        }))
                );

                toast.success("Bài viết đã được xóa", {
                    description: "Bài viết đã được xóa khỏi hệ thống.",
                });
            }
        } catch (error) {
            toast.error("Không thể xóa bài viết", {
                description: "Đã xảy ra lỗi trong quá trình xóa.",
            });
        } finally {
            setDeleteDialog({ open: false, post: null });
        }
    };

    // ✅ Cột hiển thị
    const columns: ColumnDef<Post>[] = [
        {
            accessorKey: "displayId",
            header: "Mã bài viết",
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
        { accessorKey: "authorName", header: "Tác giả" },
        { accessorKey: "authorMail", header: "Email" },
        {
            accessorKey: "imageUrls",
            header: "Ảnh",
            cell: ({ row }) => {
                const imgs = row.getValue("imageUrls") as string[] | undefined;
                return imgs && imgs.length > 0 ? (
                    <div className="text-sm text-muted-foreground">{imgs.length} ảnh</div>
                ) : (
                    <div className="text-sm text-muted-foreground">Không có ảnh</div>
                );
            },
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
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDetailDialog({ open: true, post })}
                            className="cursor-pointer hover:bg-gray-200"
                        >
                            <Eye className="h-4 w-4" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            // onClick={() => flagPost(post.id)}
                            className="cursor-pointer hover:bg-gray-200"
                        >
                            <Flag className="h-4 w-4 text-yellow-500" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteDialog({ open: true, post })}
                            className="cursor-pointer hover:bg-gray-200"
                        >
                            <Trash2 className="text-destructive h-4 w-4" />
                        </Button>
                    </div>
                );
            },
        },
    ];

    // ✅ Tìm kiếm
    const filteredPosts = posts.filter((post) =>
        post.content.toLowerCase().includes(search.toLowerCase())
    );

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
                    <div className="flex items-center gap-4 pt-4">
                        <Input
                            placeholder="Tìm kiếm theo tên..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-9 md:w-[200px] w-[150px]"
                        />
                    </div>
                </CardHeader>

                <CardContent>
                    <DataTable columns={columns} data={filteredPosts} />
                </CardContent>
            </Card>

            {/* Chi tiết bài viết */}
            <Dialog open={detailDialog.open} onOpenChange={(open) => setDetailDialog({ open, post: null })}>
                <DialogContent className="rounded-2xl max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{detailDialog.post?.content}</DialogTitle>
                        <DialogDescription>
                            Bởi {detailDialog.post?.authorName} •{" "}
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
                                <h4 className="font-medium mb-2">Hình ảnh:</h4>
                                <ImageGrid images={detailDialog.post.imageUrls} />
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setDetailDialog({ open: false, post: null })}>Đóng</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Xác nhận xoá */}
            <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, post: null })}>
                <DialogContent className="rounded-2xl">
                    <DialogHeader>
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                            <DialogTitle>Xác nhận xóa</DialogTitle>
                        </div>
                        <DialogDescription>
                            Bạn có chắc chắn muốn xóa bài viết{" "}
                            <strong>{deleteDialog.post?.content}</strong>? Hành động này không thể hoàn tác.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialog({ open: false, post: null })}
                            className="cursor-pointer hover:bg-gray-200"
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => handleDelete(deleteDialog.post?.id!)}
                            className="text-white cursor-pointer"
                        >
                            Xác nhận xóa
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

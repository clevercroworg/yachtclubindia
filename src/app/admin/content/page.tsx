import Link from "next/link"
import { PlusCircle, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default function ContentPage() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="space-y-1">
                    <CardTitle>Content Management</CardTitle>
                    <CardDescription>
                        Manage your blog posts, pages, and other content types here.
                    </CardDescription>
                </div>
                <Button size="sm" className="h-8 gap-1" asChild>
                    <Link href="/admin/content/new">
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            New Content
                        </span>
                    </Link>
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Status</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead className="hidden md:table-cell">Author</TableHead>
                            <TableHead className="hidden md:table-cell">Created At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {/* Mock Data */}
                        <TableRow>
                            <TableCell>
                                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary">
                                    Published
                                </div>
                            </TableCell>
                            <TableCell className="font-medium">Building Reusable UI</TableCell>
                            <TableCell className="hidden md:table-cell">John Doe</TableCell>
                            <TableCell className="hidden md:table-cell">2026-03-07</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-muted text-muted-foreground">
                                    Draft
                                </div>
                            </TableCell>
                            <TableCell className="font-medium">Understanding Headless CMS</TableCell>
                            <TableCell className="hidden md:table-cell">Jane Smith</TableCell>
                            <TableCell className="hidden md:table-cell">2026-03-06</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

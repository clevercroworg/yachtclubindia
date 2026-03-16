import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function NewContentPage() {
    return (
        <div className="grid gap-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/admin/content">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Link>
                </Button>
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                    Create New Content
                </h1>
                <div className="hidden items-center gap-2 md:ml-auto md:flex">
                    <Button variant="outline" size="sm">
                        Discard
                    </Button>
                    <Button size="sm">Save Product</Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
                <div className="grid auto-rows-max items-start gap-6 lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Content Details</CardTitle>
                            <CardDescription>
                                Title and text content of your entry.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        type="text"
                                        className="w-full"
                                        placeholder="Enter post title"
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="slug">Slug / URL</Label>
                                    <Input
                                        id="slug"
                                        type="text"
                                        className="w-full"
                                        placeholder="enter-post-title"
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="description">Description (Content)</Label>
                                    {/* Replaced with standard textarea for simplicity, normally use rich text editor */}
                                    <textarea
                                        id="description"
                                        className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Start writing..."
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <div className="flex items-center justify-center gap-2 md:hidden">
                <Button variant="outline" size="sm">
                    Discard
                </Button>
                <Button size="sm">Save Product</Button>
            </div>
        </div>
    )
}

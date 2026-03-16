"use client"

import { Menu, LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"

export function AdminHeader() {
    return (
        <header className="flex h-16 items-center gap-4 border-b border-[#10233D]/5 bg-white/50 backdrop-blur-md px-4 lg:px-8">
            <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden border-slate-200"
            >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
            </Button>

            <div className="w-full flex-1">
                {/* Placeholder for Breadcrumbs or Search */}
                <h1 className="text-xl font-bold text-[#10233D] tracking-tight">Dashboard Overview</h1>
            </div>

            <div className="flex items-center gap-4">
                <form action={async () => {
                    const { logout } = await import('@/app/admin/actions');
                    await logout();
                }}>
                    <Button
                        type="submit"
                        variant="ghost"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors gap-2 rounded-full px-4"
                    >
                        <LogOut className="h-4 w-4" />
                        <span className="hidden sm:inline font-medium">Logout</span>
                    </Button>
                </form>
            </div>
        </header>
    )
}

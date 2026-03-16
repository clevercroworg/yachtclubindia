"use client"

import * as React from "react"
import { AdminHeader } from "./AdminHeader"
import { AdminSidebar } from "./AdminSidebar"

interface AdminLayoutProps {
    children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <div className="flex min-h-screen w-full flex-col">
            <div className="flex min-h-screen flex-row">
                {/* Desktop Sidebar */}
                <div className="hidden border-r bg-muted/20 md:block">
                    <AdminSidebar />
                </div>

                {/* Main Content Area */}
                <div className="flex flex-1 flex-col">
                    <AdminHeader />
                    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    )
}

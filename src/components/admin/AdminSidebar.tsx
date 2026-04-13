"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Ship } from "lucide-react"

import { cn } from "@/lib/utils"

const navigation = [
    { name: "Bookings", href: "/admin", icon: LayoutDashboard },
    { name: "Fleets", href: "/admin/fleet", icon: Ship },
]

export function AdminSidebar() {
    const pathname = usePathname()

    return (
        <div className="flex h-full w-64 flex-col border-r border-[#10233D]/10 bg-slate-50/80 backdrop-blur-md">
            <div className="flex h-16 items-center border-b border-[#10233D]/5 px-4 lg:px-6">
                <Link href="/" className="flex items-center gap-2 font-semibold hover:opacity-80 transition-opacity">
                    <Image
                        src="/images/logo-dark-highres.png"
                        alt="Yacht Club India"
                        width={140}
                        height={40}
                        className="h-8 w-auto object-contain"
                        priority
                    />
                </Link>
            </div>
            <div className="flex-1 overflow-auto py-6">
                <nav className="grid items-start px-4 text-sm font-medium gap-2">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300",
                                    isActive
                                        ? "bg-white text-[#10233D] shadow-sm shadow-[#10233D]/5 font-semibold"
                                        : "text-slate-500 hover:text-[#10233D] hover:bg-white/50"
                                )}
                            >
                                <item.icon className={cn("h-4 w-4", isActive ? "text-gold" : "text-slate-400")} />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </div>
    )
}

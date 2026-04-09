import * as React from "react"
import { LucideIcon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

interface StatCardProps {
    title: string
    value: string | number
    description?: string
    icon: LucideIcon
    trend?: {
        value: number
        label: string
        isPositive: boolean
    }
}

export function StatCard({
    title,
    value,
    description,
    icon: Icon,
    trend,
}: StatCardProps) {
    return (
        <Card className="group relative overflow-hidden transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100/60 bg-white hover:-translate-y-1 rounded-[1.5rem]">
            {/* Soft background blob for visual interest */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-50 group-hover:scale-150 transition-transform duration-700 ease-out pointer-events-none" />
            
            <CardContent className="p-6 relative z-10 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-slate-50 group-hover:bg-[#D4AF37]/10 rounded-[1rem] transition-colors duration-500">
                        <Icon className="h-5 w-5 text-slate-400 group-hover:text-[#D4AF37] transition-colors duration-500" />
                    </div>
                </div>
                
                <div>
                    <div className="text-3xl font-black text-[#10233D] tracking-tight mb-1">{value}</div>
                    <div className="text-xs font-bold tracking-widest text-slate-400 uppercase">{title}</div>
                </div>

                {(description || trend) && (
                    <p className="text-xs text-slate-500 mt-4 flex items-center gap-2 font-medium">
                        {trend && (
                            <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${trend.isPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                                {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
                            </span>
                        )}
                        {description}
                    </p>
                )}
            </CardContent>
        </Card>
    )
}

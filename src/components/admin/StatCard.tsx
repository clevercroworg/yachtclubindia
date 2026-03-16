import * as React from "react"
import { LucideIcon } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
        <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[#10233D]/5 border-slate-100 bg-white hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-50/50 pointer-events-none" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-semibold tracking-wide text-slate-500 uppercase">{title}</CardTitle>
                <div className="p-2.5 bg-slate-50 rounded-xl group-hover:bg-[#10233D]/5 group-hover:text-gold transition-colors duration-300">
                    <Icon className="h-4 w-4 text-slate-400 group-hover:text-gold transition-colors duration-300" />
                </div>
            </CardHeader>
            <CardContent className="relative z-10 pt-4">
                <div className="text-3xl font-black text-[#10233D] tracking-tight">{value}</div>
                {(description || trend) && (
                    <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5 font-medium">
                        {trend && (
                            <span
                                className={`px-1.5 py-0.5 rounded-md ${trend.isPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                                    }`}
                            >
                                {trend.isPositive ? "+" : "-"}
                                {Math.abs(trend.value)}%
                            </span>
                        )}
                        {description}
                    </p>
                )}
            </CardContent>
        </Card>
    )
}

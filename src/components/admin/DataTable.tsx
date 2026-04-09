import * as React from "react"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface ColumnDef<T> {
    key: keyof T | string;
    label: string;
    render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
    columns: ColumnDef<T>[]
    data: T[]
    onRowClick?: (row: T) => void
    searchPlaceholder?: string
    searchValue?: string
    onSearchChange?: (value: string) => void
    toolbar?: React.ReactNode
    enableSelection?: boolean
    selectedIds?: string[]
    onSelectionChange?: (ids: string[]) => void
}

export function DataTable<T extends { id: string | number }>({
    columns,
    data,
    onRowClick,
    searchPlaceholder = "Search records...",
    searchValue,
    onSearchChange,
    toolbar,
    enableSelection = false,
    selectedIds = [],
    onSelectionChange
}: DataTableProps<T>) {

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!onSelectionChange) return;
        if (e.target.checked) {
            onSelectionChange(data.map(d => String(d.id)));
        } else {
            onSelectionChange([]);
        }
    }

    const handleSelectRow = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        e.stopPropagation(); // prevent row click open
        if (!onSelectionChange) return;
        if (e.target.checked) {
            onSelectionChange([...selectedIds, id]);
        } else {
            onSelectionChange(selectedIds.filter(selectedId => selectedId !== id));
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full max-w-sm group">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-[#10233D] transition-colors" />
                    <Input
                        type="search"
                        placeholder={searchPlaceholder}
                        className="pl-9 bg-slate-50/50 border-slate-200 focus-visible:ring-1 focus-visible:ring-[#10233D]/20 rounded-xl transition-all h-10"
                        value={searchValue}
                        onChange={(e) => onSearchChange?.(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                    {toolbar}
                </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm">
                <div className="w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b bg-slate-50/80">
                            <tr className="border-b border-slate-100 uppercase tracking-widest text-[10px] text-slate-500 font-bold">
                                {enableSelection && (
                                    <th className="h-12 px-6 text-left align-middle w-12">
                                        <input 
                                            type="checkbox" 
                                            className="rounded border-slate-300 text-[#10233D] focus:ring-[#10233D]" 
                                            checked={data.length > 0 && selectedIds.length === data.length}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                )}
                                {columns.map((col) => (
                                    <th
                                        key={col.key.toString()}
                                        className="h-12 px-6 text-left align-middle"
                                    >
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={enableSelection ? columns.length + 1 : columns.length}
                                        className="p-8 text-center align-middle text-slate-400 font-medium"
                                    >
                                        No results found.
                                    </td>
                                </tr>
                            ) : (
                                data.map((row) => {
                                    const isSelected = selectedIds.includes(String(row.id));
                                    return (
                                        <tr
                                            key={row.id}
                                            onClick={() => onRowClick?.(row)}
                                            className={`border-b border-slate-50 transition-colors hover:bg-slate-50/50 cursor-pointer group ${isSelected ? 'bg-sky-50/30' : ''}`}
                                        >
                                            {enableSelection && (
                                                <td className="p-4 px-6 align-middle" onClick={(e) => e.stopPropagation()}>
                                                    <input 
                                                        type="checkbox" 
                                                        className="rounded border-slate-300 text-[#10233D] focus:ring-[#10233D] transition-all" 
                                                        checked={isSelected}
                                                        onChange={(e) => handleSelectRow(e, String(row.id))}
                                                    />
                                                </td>
                                            )}
                                            {columns.map((col, idx) => (
                                                <td key={col.key.toString()} className={`p-4 px-6 align-middle ${idx === 0 ? 'font-medium text-slate-900' : 'text-slate-600'}`}>
                                                    {col.render ? col.render(row) : String(row[col.key as keyof T])}
                                                </td>
                                            ))}
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Placeholder */}
            <div className="flex items-center justify-between py-2 px-1">
                <div className="text-xs font-medium text-slate-400">
                    Showing <span className="text-slate-900">{data.length}</span> records
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8 rounded-lg border-slate-200 text-slate-600 font-medium" disabled>
                        Previous
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 rounded-lg border-slate-200 text-slate-600 font-medium hover:bg-slate-50 hover:text-slate-900">
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}

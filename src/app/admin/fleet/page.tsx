"use client"

import { useEffect, useState, useCallback } from "react"
import { Ship, Trash2, Plus, LayoutDashboard, AlertTriangle, Edit2 } from "lucide-react"

import { StatCard } from "@/components/admin/StatCard"
import { DataTable } from "@/components/admin/DataTable"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { AddFleetModal } from "@/components/admin/AddFleetModal"

export default function FleetDashboardPage() {
    const [fleets, setFleets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingFleet, setEditingFleet] = useState<any>(null);
    
    const [selectedFleetIds, setSelectedFleetIds] = useState<string[]>([]);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchFleets = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/fleets');
            const data = await res.json();
            if (data.success && data.fleets) {
                // Formatting for the datatable
                const formatted = data.fleets.map((f: any) => ({
                    ...f,
                    formatted_price: f.price || `₹${Number(f.pricePerHour).toLocaleString()}/hr`
                }));
                setFleets(formatted);
            }
        } catch (err) {
            console.error("Failed to fetch fleets:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFleets();
    }, [fetchFleets]);

    const handleDeleteSelected = async () => {
        if (!confirm(`Are you sure you want to permanently delete ${selectedFleetIds.length} fleets?`)) return;
        setIsDeleting(true);
        try {
            const res = await fetch('/api/fleets', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: selectedFleetIds })
            });
            const data = await res.json();
            if (data.success) {
                setFleets(prev => prev.filter(f => !selectedFleetIds.includes(f.id)));
                setSelectedFleetIds([]);
            } else {
                alert(data.error || 'Failed to delete');
            }
        } catch(err) {
            alert('Internal server error');
        } finally {
            setIsDeleting(false);
        }
    };

    const columns = [
        { key: "title", label: "Fleet Title", render: (row: any) => <span className="font-bold text-[#10233D]">{row.title}</span> },
        { key: "series", label: "Series", render: (row: any) => <span className="text-slate-500 font-medium">{row.series || 'N/A'}</span> },
        { key: "capacity", label: "Capacity", render: (row: any) => <span className="px-2.5 py-1 bg-slate-100/80 text-slate-700 rounded-lg font-bold text-xs">{row.capacity} Guests</span> },
        { key: "pricingType", label: "Type", render: (row: any) => <span className="font-semibold text-slate-600 capitalize">{row.pricingType}</span> },
        { 
            key: "formatted_price", 
            label: "Price Base",
            render: (row: any) => <span className="font-black text-[#10233D] text-[15px]">{row.formatted_price}</span>
        },
        {
            key: "actions",
            label: "",
            render: (row: any) => (
                <button 
                    onClick={(e) => { e.stopPropagation(); setEditingFleet(row); setIsAddModalOpen(true); }}
                    className="p-2 text-slate-400 hover:text-[#10233D] hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
                    title="Edit Fleet"
                >
                    <Edit2 className="w-4 h-4" />
                </button>
            )
        }
    ];

    const filteredFleets = fleets.filter((f) => {
        const matchesSearch =
            searchQuery === "" ||
            f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (f.series && f.series.toLowerCase().includes(searchQuery.toLowerCase()));

        // The user page only shows normal fleets (!isExclusive and pricingType != ticket if we strictly mirror, 
        // but here we just show all non-exclusive fleets or everything depending on the search)
        // We will show everything in the dashboard for admin visibility, 
        // but let's be explicitly clear.
        return matchesSearch;
    });

    const activeFleets = fleets.filter(f => !f.isExclusive).length;
    const exclusiveFleets = fleets.filter(f => f.isExclusive).length;
    const ticketCruises = fleets.filter(f => f.pricingType === 'ticket').length;

    const toolbar = (
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center w-full gap-5">
            <div className="text-xs font-black text-slate-400 tracking-widest uppercase">
                {filteredFleets.length} Results
            </div>
            
            <div className="flex w-full xl:w-auto items-center gap-3">
                {selectedFleetIds.length > 0 && (
                     <button
                        onClick={handleDeleteSelected}
                        disabled={isDeleting}
                        className="flex items-center justify-center gap-2 bg-red-50 text-red-600 border border-red-200 px-6 py-3 rounded-2xl text-sm font-black shadow-sm"
                    >
                         <Trash2 className="w-4 h-4" />
                         {isDeleting ? "Deleting..." : `Delete (${selectedFleetIds.length})`}
                     </button>
                )}
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center justify-center gap-2 bg-[#10233D] text-white px-6 py-3 rounded-2xl text-sm font-black shadow-lg"
                >
                    <Plus className="w-4 h-4 text-[#D4AF37]" strokeWidth={3} />
                    New Fleet
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Ambient Background Gradient Glows */}
            <div className="fixed top-0 left-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none -z-0"></div>
            
            <div className="space-y-10 pb-24 max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 pt-10 relative z-10">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2.5 bg-white shadow-sm ring-1 ring-slate-100 rounded-xl">
                                <Ship className="w-5 h-5 text-[#D4AF37]" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-[#10233D]">Fleet Dashboard</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#10233D] drop-shadow-sm">
                            Manage Fleets
                        </h1>
                    </div>
                </header>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    <StatCard
                        title="Active Fleets (Standard)"
                        value={activeFleets.toString()}
                        icon={Ship}
                        description="Visible on public page"
                    />
                    <StatCard
                        title="Exclusive Fleets"
                        value={exclusiveFleets.toString()}
                        icon={AlertTriangle}
                        description="Visible on exclusive routes"
                    />
                    <StatCard
                        title="Ticketed Cruises"
                        value={ticketCruises.toString()}
                        icon={LayoutDashboard}
                        description="Per-person tickets"
                    />
                </div>

                <div className="space-y-5">
                    <Card className="border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] bg-white ring-1 ring-black/5 overflow-hidden">
                        <CardContent className="p-6 sm:p-10">
                            {loading ? (
                                <div className="py-32 text-center">Loading Database...</div>
                            ) : (
                                <DataTable
                                    columns={columns}
                                    data={filteredFleets}
                                    searchPlaceholder="Search yachts, title, or series..."
                                    searchValue={searchQuery}
                                    onSearchChange={setSearchQuery}
                                    toolbar={toolbar}
                                    enableSelection={true}
                                    selectedIds={selectedFleetIds}
                                    onSelectionChange={setSelectedFleetIds}
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>

                <AddFleetModal 
                    isOpen={isAddModalOpen} 
                    onClose={() => { setIsAddModalOpen(false); setEditingFleet(null); }} 
                    onSuccess={fetchFleets}
                    initialData={editingFleet}
                />
            </div>
        </div>
    )
}

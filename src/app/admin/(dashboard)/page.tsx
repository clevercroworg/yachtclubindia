"use client"

import { useEffect, useState, useCallback } from "react"
import { Users, DollarSign, Activity, ShoppingCart, Plus, LayoutDashboard, Calendar as CalendarIcon, Clock, Trash2 } from "lucide-react"

import { StatCard } from "@/components/admin/StatCard"
import { DataTable } from "@/components/admin/DataTable"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { AddBookingModal } from "@/components/admin/AddBookingModal"

type Booking = {
    id: string;
    customer_first_name: string;
    customer_last_name: string;
    customer_email: string;
    yacht_title: string;
    booking_date: string;
    status: string;
    subtotal: number;
    created_at: string;
    customer_phone?: string;
    customer_company?: string;
    guests?: number;
    total_hours?: number;
    charter_cost?: number;
    addons_cost?: number;
    time_slot?: string;
    addons?: string[];
}

type BookingRow = Booking & { customer_name: string; formatted_price: string };

export default function AdminDashboardPage() {
    const [bookings, setBookings] = useState<BookingRow[]>([]);
    const [selectedBooking, setSelectedBooking] = useState<BookingRow | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState<"all" | "recent" | "paid" | "pending">("all");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    
    // Multi-Select Deletion State
    const [selectedBookingIds, setSelectedBookingIds] = useState<string[]>([]);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/bookings');
            const data = await res.json();
            if (data.success) {
                const formatted = data.bookings.map((b: any) => ({
                    ...b,
                    customer_name: `${b.customer_first_name} ${b.customer_last_name}`,
                    formatted_price: `₹${Number(b.subtotal).toLocaleString()}`
                }));
                setBookings(formatted);
            }
        } catch (err) {
            console.error("Failed to fetch bookings:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const handleTogglePaid = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'paid' ? 'pending' : 'paid';
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));

        try {
            const res = await fetch('/api/bookings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus })
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                setBookings(prev => prev.map(b => b.id === id ? { ...b, status: currentStatus } : b));
                alert('Failed to update status.');
            }
        } catch (err) {
            console.error('Failed to patch status:', err);
            setBookings(prev => prev.map(b => b.id === id ? { ...b, status: currentStatus } : b));
            alert('Error updating status.');
        }
    };

    const handleDeleteSelected = async () => {
        if (!confirm(`Are you sure you want to permanently delete ${selectedBookingIds.length} bookings?`)) return;
        setIsDeleting(true);
        try {
            const res = await fetch('/api/bookings', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: selectedBookingIds })
            });
            const data = await res.json();
            if (data.success) {
                setBookings(prev => prev.filter(b => !selectedBookingIds.includes(b.id)));
                setSelectedBookingIds([]);
            } else {
                alert(data.error || 'Failed to delete');
            }
        } catch(err) {
            alert('Internal server error');
        } finally {
            setIsDeleting(false);
        }
    };

    const columns: { key: keyof BookingRow | "status"; label: string; render?: (row: BookingRow) => React.ReactNode }[] = [
        { key: "customer_name", label: "Customer", render: (row) => <span className="font-bold text-[#10233D]">{row.customer_name}</span> },
        { key: "customer_email", label: "Email", render: (row) => <span className="text-slate-500 font-medium">{row.customer_email}</span> },
        { key: "yacht_title", label: "Fleet", render: (row) => <span className="px-2.5 py-1 bg-slate-100/80 text-slate-700 rounded-lg font-bold text-xs">{row.yacht_title}</span> },
        { key: "booking_date", label: "Date", render: (row) => <span className="font-semibold text-slate-600">{new Date(row.booking_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric'})}</span> },
        { 
            key: "formatted_price", 
            label: "Amount",
            render: (row) => <span className="font-black text-[#10233D] text-[15px]">{row.formatted_price}</span>
        },
        {
            key: "status",
            label: "Status",
            render: (row) => (
                <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-2">
                    <button
                        onClick={() => handleTogglePaid(row.id, row.status)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 ${row.status === 'paid' ? 'bg-[#10233D]' : 'bg-slate-200'}`}
                    >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full transition-transform shadow-sm ${row.status === 'paid' ? 'translate-x-4.5 bg-[#D4AF37]' : 'translate-x-1 bg-white'}`} />
                    </button>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${row.status === 'paid' ? 'text-[#10233D]' : 'text-slate-400'}`}>
                        {row.status}
                    </span>
                </div>
            )
        },
    ]

    const filteredBookings = bookings.filter((b) => {
        const matchesSearch =
            searchQuery === "" ||
            b.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.yacht_title.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter = (() => {
            if (activeFilter === "all") return true;
            if (activeFilter === "paid") return b.status === "paid";
            if (activeFilter === "pending") return b.status === "pending";
            if (activeFilter === "recent") {
                const createdDate = new Date(b.created_at || b.booking_date);
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                return createdDate >= sevenDaysAgo;
            }
            return true;
        })();

        return matchesSearch && matchesFilter;
    });

    const totalRevenue = bookings.filter(b => b.status === 'paid').reduce((sum: number, b: BookingRow) => sum + (Number(b.subtotal) || 0), 0);
    const pendingRequests = bookings.filter((b: BookingRow) => b.status === 'pending').length;

    const toolbar = (
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center w-full gap-5">
            <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full xl:w-auto overflow-x-auto border border-slate-200/60 shadow-inner">
                {(["all", "recent", "paid", "pending"] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        className={`flex-1 xl:flex-none px-6 py-2.5 rounded-xl text-xs font-black transition-all duration-300 capitalize whitespace-nowrap ${
                            activeFilter === f
                                ? "bg-white text-[#10233D] shadow-[0_2px_10px_rgb(0,0,0,0.06)] scale-100 ring-1 ring-black/5"
                                : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 scale-95"
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>
            
            <div className="flex w-full xl:w-auto items-center gap-3">
                {selectedBookingIds.length > 0 && (
                     <button
                        onClick={handleDeleteSelected}
                        disabled={isDeleting}
                        className="flex items-center justify-center gap-2 bg-red-50 text-red-600 border border-red-200 px-6 py-3 rounded-2xl text-sm font-black shadow-sm hover:bg-red-100 transition-all ring-1 ring-red-100"
                    >
                         <Trash2 className="w-4 h-4" />
                         {isDeleting ? "Deleting..." : `Delete (${selectedBookingIds.length})`}
                     </button>
                )}
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center justify-center gap-2 bg-[#10233D] text-white px-6 py-3 rounded-2xl text-sm font-black shadow-lg shadow-[#10233D]/20 hover:bg-[#152e50] hover:shadow-xl hover:-translate-y-0.5 transition-all w-full xl:w-auto ring-1 ring-[#10233D]"
                >
                    <Plus className="w-4 h-4 text-[#D4AF37]" strokeWidth={3} />
                    New Booking
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Ambient Background Gradient Glows */}
            <div className="fixed top-0 left-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none -z-0"></div>
            <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-400/5 rounded-full blur-[150px] pointer-events-none -z-0"></div>

            <div className="space-y-10 pb-24 max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 pt-10 relative z-10">
                
                {/* Dashboard Header */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2.5 bg-white shadow-sm ring-1 ring-slate-100 rounded-xl">
                                <LayoutDashboard className="w-5 h-5 text-[#D4AF37]" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-[#10233D]">Overview</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#10233D] drop-shadow-sm">
                            Command Center
                        </h1>
                        <p className="text-sm font-semibold text-slate-500 mt-3 leading-relaxed max-w-xl">
                            Operate your entire yacht fleet effortlessly. Monitor upcoming departures, manage client requests, and track financial growth in real-time.
                        </p>
                    </div>
                    
                    {/* Fast Status Bar */}
                    <div className="hidden md:flex flex-col items-end gap-1.5 text-right bg-white p-4 rounded-2xl shadow-sm ring-1 ring-slate-100">
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-600">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Live System
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'})}</span>
                    </div>
                </header>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        title="Total Revenue"
                        value={`₹${(totalRevenue/1000).toFixed(1)}k`}
                        icon={DollarSign}
                        description="From completed payments"
                    />
                    <StatCard
                        title="Total Transactions"
                        value={bookings.length.toString()}
                        icon={ShoppingCart}
                        description="Lifetime bookings"
                    />
                    <StatCard
                        title="Pending Approvals"
                        value={pendingRequests.toString()}
                        icon={Activity}
                        description="Awaiting collection"
                    />
                    <StatCard
                        title="Unique Clients"
                        value={new Set(bookings.map((b: BookingRow) => b.customer_email)).size.toString()}
                        icon={Users}
                        description="Distinct emails"
                    />
                </div>

                <div className="space-y-5">
                    <h2 className="text-xl font-black text-[#10233D] tracking-tight">Booking Operations</h2>
                    
                    <Card className="border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] bg-white ring-1 ring-black/5 overflow-hidden">
                        <CardHeader className="bg-white px-6 sm:px-10 py-8 border-b border-slate-100/80 mb-0 hidden">
                        </CardHeader>
                        
                        <CardContent className="p-6 sm:p-10">
                            {loading ? (
                                <div className="py-32 text-center flex flex-col items-center justify-center">
                                    <div className="relative w-16 h-16">
                                        <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                                        <div className="absolute inset-0 border-4 border-[#D4AF37] rounded-full border-t-transparent animate-spin"></div>
                                    </div>
                                    <h3 className="text-sm font-black text-[#10233D] uppercase tracking-widest mt-6 mb-2">Synchronizing Database</h3>
                                    <p className="text-xs font-bold text-slate-400">Loading your latest transactions...</p>
                                </div>
                            ) : (
                                <div className="">
                                    <DataTable
                                        columns={columns}
                                        data={filteredBookings}
                                        searchPlaceholder="Search client name, email, or exact yacht..."
                                        searchValue={searchQuery}
                                        onSearchChange={setSearchQuery}
                                        toolbar={toolbar}
                                        onRowClick={(row) => setSelectedBooking(row)}
                                        enableSelection={true}
                                        selectedIds={selectedBookingIds}
                                        onSelectionChange={setSelectedBookingIds}
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <AddBookingModal 
                    isOpen={isAddModalOpen} 
                    onClose={() => setIsAddModalOpen(false)} 
                    onSuccess={fetchBookings} 
                />

                {/* Booking Details Modal */}
                {selectedBooking && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#10233D]/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
                        <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col relative animate-in zoom-in-95 duration-300 ring-1 ring-white/20">
                            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-white/80 backdrop-blur-xl rounded-t-[2rem]">
                                <div className="flex items-center gap-4">
                                     <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm">
                                        <LayoutDashboard className="w-5 h-5 text-[#D4AF37]" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-[#10233D] tracking-tight">Booking Profile</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">ID {selectedBooking.id.substring(0,8)}...</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                            <span className="text-[10px] font-bold text-slate-400">{new Date(selectedBooking.created_at).toLocaleString('en-GB')}</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedBooking(null)}
                                    className="p-3 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <div className="p-8 overflow-y-auto flex-1 space-y-8 bg-slate-50/50 rounded-b-[2rem]">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full"></div>
                                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Customer Identity</h4>
                                        </div>
                                        <div className="bg-white rounded-[1.5rem] p-6 space-y-4 border border-slate-100 shadow-sm">
                                            <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                                                <span className="text-slate-400 text-sm font-bold">Client Name</span>
                                                <span className="font-black text-slate-900">{selectedBooking.customer_name}</span>
                                            </div>
                                            <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                                                <span className="text-slate-400 text-sm font-bold">Primary Email</span>
                                                <a href={`mailto:${selectedBooking.customer_email}`} className="font-bold text-[#10233D] hover:text-[#D4AF37] transition-colors truncate max-w-[200px]">{selectedBooking.customer_email}</a>
                                            </div>
                                            <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                                                <span className="text-slate-400 text-sm font-bold">Phone No.</span>
                                                <a href={`tel:${selectedBooking.customer_phone}`} className="font-bold text-slate-900 hover:text-[#D4AF37]">{selectedBooking.customer_phone || 'N/A'}</a>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-400 text-sm font-bold">Organization</span>
                                                <span className="font-bold text-slate-900">{selectedBooking.customer_company || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                         <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full"></div>
                                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Fleet & Logistics</h4>
                                        </div>
                                        <div className="bg-[#10233D] rounded-[1.5rem] p-6 space-y-4 text-white shadow-xl shadow-[#10233D]/10 relative overflow-hidden group">
                                            <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-[30px] group-hover:bg-[#D4AF37]/10 transition-colors duration-1000"></div>
                                            <div className="flex justify-between items-center pb-3 border-b border-white/10 relative z-10">
                                                <span className="text-slate-400 text-sm font-bold">Reserved Asset</span>
                                                <span className="font-black text-[#D4AF37] text-lg">{selectedBooking.yacht_title}</span>
                                            </div>
                                            <div className="flex justify-between items-center pb-3 border-b border-white/10 relative z-10">
                                                <span className="text-slate-400 text-sm font-bold">Departure</span>
                                                <span className="font-bold">{new Date(selectedBooking.booking_date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                            </div>
                                            <div className="flex justify-between items-center pb-4 border-b border-white/5 relative z-10">
                                                <span className="text-slate-400 text-sm font-bold">Time Window</span>
                                                <span className="font-bold capitalize">{selectedBooking.time_slot}</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 relative z-10">
                                                <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-default">
                                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                                        <Users className="w-4 h-4 text-[#D4AF37]" />
                                                    </div>
                                                    <div>
                                                        <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-black">Capacity</span>
                                                        <span className="block font-black text-lg leading-tight">{selectedBooking.guests || 2} <span className="text-xs font-semibold text-slate-400">pax</span></span>
                                                    </div>
                                                </div>
                                                <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-default">
                                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                                        <Clock className="w-4 h-4 text-[#D4AF37]" />
                                                    </div>
                                                    <div>
                                                        <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-black">Duration</span>
                                                        <span className="block font-black text-lg leading-tight">{selectedBooking.total_hours || 2} <span className="text-xs font-semibold text-slate-400">hrs</span></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-slate-200/60 mt-8">
                                    <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5">
                                        <div className="p-8 space-y-6">
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-500 font-bold text-sm">Base Charter Authorization</span>
                                                <span className="font-black text-[#10233D] text-xl">₹{(Number(selectedBooking.charter_cost) || 0).toLocaleString()}</span>
                                            </div>

                                            {selectedBooking.addons && Array.isArray(selectedBooking.addons) && selectedBooking.addons.length > 0 && (
                                                <div className="py-5 pl-6 border-l-[3px] border-[#D4AF37] bg-[#D4AF37]/5 rounded-r-2xl space-y-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#10233D]">Requested Enhancements</span>
                                                    </div>
                                                    {selectedBooking.addons.map((addon: string, idx: number) => (
                                                        <div key={idx} className="flex justify-between items-center text-sm">
                                                            <span className="text-[#10233D] font-bold capitalize flex items-center gap-3">
                                                                <div className="w-5 h-5 bg-white shadow-sm border border-[#D4AF37]/20 rounded flex items-center justify-center">
                                                                    <div className="w-2 h-2 bg-[#D4AF37] rounded-sm"></div>
                                                                </div>
                                                                {addon.replace(/-/g, ' ')}
                                                            </span>
                                                        </div>
                                                    ))}
                                                    <div className="flex justify-between items-center pt-4 border-t border-[#D4AF37]/20">
                                                        <span className="text-xs font-bold text-slate-600 uppercase">Subtotal Enhancements</span>
                                                        <span className="text-sm font-black text-[#10233D]">₹{(Number(selectedBooking.addons_cost) || 0).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex justify-between items-end pt-6 mt-6 border-t-2 border-slate-100">
                                                <div>
                                                    <span className="font-black text-slate-400 uppercase tracking-widest text-xs">Total Ledger Amount</span>
                                                    <p className="text-[10px] font-bold text-slate-400 mt-1">Includes exact tax calculations.</p>
                                                </div>
                                                <span className="text-4xl sm:text-5xl font-black text-[#10233D] tracking-tighter">₹{(Number(selectedBooking.subtotal) || 0).toLocaleString()}</span>
                                            </div>
                                        </div>
                                        
                                        <div className={`px-8 py-5 flex justify-between items-center border-t border-slate-100/80 ${selectedBooking.status === 'paid' ? 'bg-emerald-50/50' : 'bg-amber-50/50'}`}>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-3.5 h-3.5 rounded-full ${selectedBooking.status === 'paid' ? 'bg-emerald-500 animate-[pulse_2s_ease-in-out_infinite]' : 'bg-amber-500'}`}></div>
                                                <span className={`text-xs font-black uppercase tracking-widest ${selectedBooking.status === 'paid' ? 'text-emerald-700' : 'text-amber-700'}`}>
                                                    Payment Status: {selectedBooking.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-xl shadow-sm border border-slate-200">
                                                <span className="text-[11px] font-black text-slate-600 uppercase tracking-wider">{selectedBooking.status === 'paid' ? 'Mark Pending' : 'Mark Complete'}</span>
                                                <button
                                                    onClick={async () => {
                                                        await handleTogglePaid(selectedBooking.id, selectedBooking.status);
                                                        setSelectedBooking(prev => prev ? { ...prev, status: prev.status === 'paid' ? 'pending' : 'paid' } : null)
                                                    }}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 ${selectedBooking.status === 'paid' ? 'bg-[#10233D]' : 'bg-slate-200'
                                                        }`}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full transition-transform shadow-sm ${selectedBooking.status === 'paid' ? 'translate-x-6 bg-[#D4AF37]' : 'translate-x-1 bg-white'
                                                            }`}
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

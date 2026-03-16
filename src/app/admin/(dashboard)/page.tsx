"use client"

import { useEffect, useState } from "react"
import { Users, DollarSign, Activity, ShoppingCart } from "lucide-react"

import { StatCard } from "@/components/admin/StatCard"
import { DataTable } from "@/components/admin/DataTable"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Types for Booking
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

// Ensure the mapped key exists for the DataTable
type BookingRow = Booking & { customer_name: string; formatted_price: string };

export default function AdminDashboardPage() {
    const [bookings, setBookings] = useState<BookingRow[]>([]);
    const [selectedBooking, setSelectedBooking] = useState<BookingRow | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState<"all" | "recent" | "paid" | "pending">("all");

    useEffect(() => {
        const fetchBookings = async () => {
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
        };
        fetchBookings();
    }, []);

    const handleTogglePaid = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'paid' ? 'pending' : 'paid';

        // Optimistic UI update
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));

        try {
            const res = await fetch('/api/bookings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus })
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                // Revert if failed
                setBookings(prev => prev.map(b => b.id === id ? { ...b, status: currentStatus } : b));
                alert('Failed to update status.');
            }
        } catch (err) {
            console.error('Failed to patch status:', err);
            setBookings(prev => prev.map(b => b.id === id ? { ...b, status: currentStatus } : b));
            alert('Error updating status.');
        }
    };

    const columns: { key: keyof BookingRow | "status"; label: string; render?: (row: BookingRow) => React.ReactNode }[] = [
        { key: "customer_name", label: "Customer" },
        { key: "customer_email", label: "Email" },
        { key: "yacht_title", label: "Yacht" },
        { key: "booking_date", label: "Date" },
        { key: "formatted_price", label: "Amount" },
        {
            key: "status",
            label: "Paid Status",
            render: (row) => (
                <div onClick={(e) => e.stopPropagation()} className="flex items-center">
                    <button
                        onClick={() => handleTogglePaid(row.id, row.status)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#10233D] focus:ring-offset-2 ${row.status === 'paid' ? 'bg-[#D4AF37]' : 'bg-slate-200'
                            }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${row.status === 'paid' ? 'translate-x-6' : 'translate-x-1'
                                }`}
                        />
                    </button>
                    <span className={`ml-3 text-xs font-bold uppercase tracking-wider ${row.status === 'paid' ? 'text-amber-600' : 'text-slate-400'}`}>
                        {row.status === 'paid' ? 'Paid' : 'Pending'}
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
        <div className="flex bg-gray-100/80 p-1 rounded-lg border border-gray-200 shadow-sm">
            {(["all", "recent", "paid", "pending"] as const).map((f) => (
                <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 capitalize whitespace-nowrap ${activeFilter === f
                        ? "bg-white text-gold shadow-sm"
                        : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                        }`}
                >
                    {f}
                </button>
            ))}
        </div>
    );

    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Revenue"
                    value={`₹${totalRevenue.toLocaleString()}`}
                    icon={DollarSign}
                    description="all time"
                />
                <StatCard
                    title="Total Bookings"
                    value={bookings.length.toString()}
                    icon={ShoppingCart}
                    description="total requests received"
                />
                <StatCard
                    title="Pending Requests"
                    value={pendingRequests.toString()}
                    icon={Activity}
                    description="awaiting confirmation"
                />
                <StatCard
                    title="Customers"
                    value={new Set(bookings.map((b: BookingRow) => b.customer_email)).size.toString()}
                    icon={Users}
                    description="unique emails"
                />
            </div>

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle className="capitalize">{activeFilter} Bookings</CardTitle>
                    <CardDescription>
                        {activeFilter === 'recent'
                            ? "Bookings from the last 7 days."
                            : activeFilter === 'all'
                                ? "Overview of every booking request received."
                                : `Overview of all ${activeFilter} bookings.`}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="p-8 text-center text-muted-foreground animate-pulse">Loading bookings...</div>
                    ) : (
                        <DataTable
                            columns={columns}
                            data={filteredBookings}
                            searchPlaceholder="Search by name, email, or yacht..."
                            searchValue={searchQuery}
                            onSearchChange={setSearchQuery}
                            toolbar={toolbar}
                            onRowClick={(row) => setSelectedBooking(row)}
                        />
                    )}
                </CardContent>
            </Card>

            {/* Booking Details Modal */}
            {selectedBooking && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col relative animate-in zoom-in-95 duration-300 border border-white/20">
                        {/* Header */}
                        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-white rounded-t-[2rem]">
                            <div>
                                <h3 className="text-2xl font-black text-[#10233D] tracking-tight">Booking Overview</h3>
                                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mt-1.5">ID: {selectedBooking.id}</p>
                            </div>
                            <button
                                onClick={() => setSelectedBooking(null)}
                                className="p-2.5 rounded-full hover:bg-slate-50 transition-colors text-slate-400 hover:text-[#10233D]"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* Body - Scrollable */}
                        <div className="p-6 overflow-y-auto flex-1 space-y-8">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Customer Info */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Customer Information</h4>
                                    <div className="bg-gray-50 rounded-xl p-4 space-y-3 relative overflow-hidden">
                                        <div className="flex justify-between items-center pb-2 border-b border-gray-200/60">
                                            <span className="text-gray-500 text-sm">Name</span>
                                            <span className="font-medium text-gray-900">{selectedBooking.customer_name}</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-2 border-b border-gray-200/60">
                                            <span className="text-gray-500 text-sm">Email</span>
                                            <a href={`mailto:${selectedBooking.customer_email}`} className="font-medium text-blue-600 hover:underline">{selectedBooking.customer_email}</a>
                                        </div>
                                        <div className="flex justify-between items-center pb-2 border-b border-gray-200/60">
                                            <span className="text-gray-500 text-sm">Phone</span>
                                            <a href={`tel:${selectedBooking.customer_phone}`} className="font-medium text-blue-600 hover:underline">{selectedBooking.customer_phone || 'N/A'}</a>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-500 text-sm">Company</span>
                                            <span className="font-medium text-gray-900">{selectedBooking.customer_company || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Trip Info */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Trip Details</h4>
                                    <div className="bg-[#10233D]/5 rounded-xl p-4 space-y-3 relative overflow-hidden">
                                        <div className="flex justify-between items-center pb-2 border-b border-[#10233D]/10">
                                            <span className="text-gray-500 text-sm">Yacht</span>
                                            <span className="font-bold text-[#10233D]">{selectedBooking.yacht_title}</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-2 border-b border-[#10233D]/10">
                                            <span className="text-gray-500 text-sm">Date</span>
                                            <span className="font-medium text-gray-900">{new Date(selectedBooking.booking_date).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-2 border-b border-[#10233D]/10">
                                            <span className="text-gray-500 text-sm">Time Slot</span>
                                            <span className="font-medium text-gray-900 capitalize">{selectedBooking.time_slot}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 pt-1">
                                            <div className="bg-white rounded-lg p-2 text-center shadow-sm">
                                                <span className="block text-xs text-gray-500 mb-1">Guests</span>
                                                <span className="block font-bold text-gray-900">{selectedBooking.guests || 0}</span>
                                            </div>
                                            <div className="bg-white rounded-lg p-2 text-center shadow-sm">
                                                <span className="block text-xs text-gray-500 mb-1">Duration</span>
                                                <span className="block font-bold text-gray-900">{selectedBooking.total_hours || 0} hrs</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Add-ons & Pricing */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Financial Summary</h4>
                                <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                                    <div className="p-6 space-y-4 bg-white">
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-500 font-medium">Base Charter Cost</span>
                                            <span className="font-semibold text-slate-900">₹{(Number(selectedBooking.charter_cost) || 0).toLocaleString()}</span>
                                        </div>

                                        {/* Addons List */}
                                        {selectedBooking.addons && Array.isArray(selectedBooking.addons) && selectedBooking.addons.length > 0 && (
                                            <div className="py-3 pl-5 border-l-2 border-slate-100 space-y-2.5">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">Selected Enhancements</span>
                                                {selectedBooking.addons.map((addon: string, idx: number) => (
                                                    <div key={idx} className="flex justify-between items-center text-sm">
                                                        <span className="text-slate-600 flex items-center gap-2.5 font-medium">
                                                            <div className="w-1.5 h-1.5 bg-gold rounded-full"></div>
                                                            <span className="capitalize">{addon.replace(/-/g, ' ')}</span>
                                                        </span>
                                                    </div>
                                                ))}
                                                <div className="flex justify-between items-center pt-3 mt-3 border-t border-dashed border-slate-200">
                                                    <span className="text-xs font-semibold text-slate-500">Enhancements Total</span>
                                                    <span className="text-sm font-bold text-slate-900">₹{(Number(selectedBooking.addons_cost) || 0).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center pt-5 mt-2 border-t border-slate-100">
                                            <span className="font-bold text-slate-400 uppercase tracking-widest text-xs">Total Amount</span>
                                            <span className="text-3xl font-black text-[#10233D]">₹{(Number(selectedBooking.subtotal) || 0).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className={`p-6 flex justify-between items-center border-t border-slate-100/50 ${selectedBooking.status === 'paid' ? 'bg-emerald-50/50' : 'bg-amber-50/50'}`}>
                                        <span className={`text-xs font-bold uppercase tracking-widest ${selectedBooking.status === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>Current Status</span>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                                                <span className="text-sm font-semibold text-slate-600">Mark as {selectedBooking.status === 'paid' ? 'Pending' : 'Paid'}</span>
                                                <button
                                                    onClick={async () => {
                                                        await handleTogglePaid(selectedBooking.id, selectedBooking.status);
                                                        setSelectedBooking(prev => prev ? { ...prev, status: prev.status === 'paid' ? 'pending' : 'paid' } : null)
                                                    }}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#10233D] focus:ring-offset-2 ${selectedBooking.status === 'paid' ? 'bg-[#D4AF37]' : 'bg-slate-200'
                                                        }`}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${selectedBooking.status === 'paid' ? 'translate-x-6' : 'translate-x-1'
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
                </div>
            )}
        </>
    )
}

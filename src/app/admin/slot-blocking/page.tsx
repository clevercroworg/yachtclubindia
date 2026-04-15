"use client"

import { useEffect, useState, useCallback } from "react"
import { CalendarOff, Ship, Trash2, Clock, AlertTriangle } from "lucide-react"

import { StatCard } from "@/components/admin/StatCard"
import { Card, CardContent } from "@/components/ui/card"

const TIME_SLOTS = [
    { value: '6AM-8AM', label: '6 AM – 8 AM' },
    { value: '8AM-10AM', label: '8 AM – 10 AM' },
    { value: '10AM-12PM', label: '10 AM – 12 PM' },
    { value: '12PM-2PM', label: '12 PM – 2 PM' },
    { value: '2PM-4PM', label: '2 PM – 4 PM' },
    { value: '4PM-6PM', label: '4 PM – 6 PM' },
    { value: '6PM-8PM', label: '6 PM – 8 PM' },
    { value: '8PM-10PM', label: '8 PM – 10 PM' },
    { value: '10PM-12AM', label: '10 PM – 12 AM' },
    { value: '12AM-2AM', label: '12 AM – 2 AM' },
];

type Fleet = {
    id: string;
    fleet_id: string;
    title: string;
    pricingType: string;
};

type BlockedSlot = {
    id: string;
    fleet_id: string;
    date: string;
    time_slot: string;
    reason: string | null;
    createdAt: string;
};

export default function SlotBlockingPage() {
    const [fleets, setFleets] = useState<Fleet[]>([]);
    const [selectedFleetId, setSelectedFleetId] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [reason, setReason] = useState("");
    const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
    const [allBlockedSlots, setAllBlockedSlots] = useState<BlockedSlot[]>([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [minDate, setMinDate] = useState("");

    // Selected fleet ids for bulk delete
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const today = new Date();
        const localDateStr = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
        setMinDate(localDateStr);
    }, []);

    // Fetch fleets
    useEffect(() => {
        fetch('/api/fleets')
            .then(r => r.json())
            .then(data => {
                if (data.success && data.fleets) {
                    setFleets(data.fleets);
                }
            })
            .catch(console.error);
    }, []);

    // Fetch all blocked slots
    const fetchAllBlockedSlots = useCallback(async () => {
        try {
            const res = await fetch('/api/blocked-slots');
            const data = await res.json();
            if (data.success) {
                setAllBlockedSlots(data.blockedSlots);
            }
        } catch (err) {
            console.error("Failed to fetch all blocked slots:", err);
        }
    }, []);

    useEffect(() => {
        fetchAllBlockedSlots();
    }, [fetchAllBlockedSlots]);

    // Fetch blocked slots for selected fleet + date
    const fetchBlockedSlots = useCallback(async () => {
        if (!selectedFleetId || !selectedDate) {
            setBlockedSlots([]);
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`/api/blocked-slots?fleetId=${selectedFleetId}&date=${selectedDate}`);
            const data = await res.json();
            if (data.success) {
                setBlockedSlots(data.blockedSlots);
            }
        } catch (err) {
            console.error("Failed to fetch blocked slots:", err);
        } finally {
            setLoading(false);
        }
    }, [selectedFleetId, selectedDate]);

    useEffect(() => {
        fetchBlockedSlots();
    }, [fetchBlockedSlots]);

    const isSlotBlocked = (slotValue: string) => {
        return blockedSlots.some(bs => bs.time_slot === slotValue);
    };

    const getBlockedSlotId = (slotValue: string) => {
        return blockedSlots.find(bs => bs.time_slot === slotValue)?.id;
    };

    const handleToggleSlot = async (slotValue: string) => {
        if (!selectedFleetId || !selectedDate) return;
        setActionLoading(slotValue);

        if (isSlotBlocked(slotValue)) {
            // Unblock
            const slotId = getBlockedSlotId(slotValue);
            if (slotId) {
                try {
                    const res = await fetch('/api/blocked-slots', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ ids: [slotId] })
                    });
                    const data = await res.json();
                    if (data.success) {
                        await fetchBlockedSlots();
                        await fetchAllBlockedSlots();
                    }
                } catch (err) {
                    alert('Failed to unblock slot');
                }
            }
        } else {
            // Block
            try {
                const res = await fetch('/api/blocked-slots', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fleet_id: selectedFleetId,
                        date: selectedDate,
                        time_slot: slotValue,
                        reason: reason || null,
                    })
                });
                const data = await res.json();
                if (data.success) {
                    await fetchBlockedSlots();
                    await fetchAllBlockedSlots();
                } else {
                    alert(data.error || 'Failed to block slot');
                }
            } catch (err) {
                alert('Failed to block slot');
            }
        }
        setActionLoading(null);
    };

    const handleBulkDelete = async () => {
        if (!confirm(`Are you sure you want to unblock ${selectedIds.length} slot(s)?`)) return;
        setIsDeleting(true);
        try {
            const res = await fetch('/api/blocked-slots', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: selectedIds })
            });
            const data = await res.json();
            if (data.success) {
                setSelectedIds([]);
                await fetchBlockedSlots();
                await fetchAllBlockedSlots();
            } else {
                alert(data.error || 'Failed to delete');
            }
        } catch (err) {
            alert('Internal server error');
        } finally {
            setIsDeleting(false);
        }
    };

    const selectedFleet = fleets.find(f => f.fleet_id === selectedFleetId || f.id === selectedFleetId);
    const totalBlocked = allBlockedSlots.length;
    const todayBlocked = allBlockedSlots.filter(bs => bs.date === minDate).length;
    const uniqueFleetsBlocked = new Set(allBlockedSlots.map(bs => bs.fleet_id)).size;

    const inputClasses = "w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white focus:bg-white focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 transition-all font-medium text-slate-900 appearance-none cursor-pointer";

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Ambient Background Gradient Glows */}
            <div className="fixed top-0 left-1/4 w-96 h-96 bg-red-400/8 rounded-full blur-[120px] pointer-events-none -z-0"></div>
            <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[150px] pointer-events-none -z-0"></div>

            <div className="space-y-10 pb-24 max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 pt-10 relative z-10">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2.5 bg-white shadow-sm ring-1 ring-slate-100 rounded-xl">
                                <CalendarOff className="w-5 h-5 text-red-500" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-[#10233D]">Slot Manager</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#10233D] drop-shadow-sm">
                            Slot Blocking
                        </h1>
                        <p className="text-sm font-semibold text-slate-500 mt-3 leading-relaxed max-w-xl">
                            Block specific time slots for any fleet on any date. Blocked slots will appear as unavailable to users on the booking page.
                        </p>
                    </div>
                </header>

                {/* Stats */}
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    <StatCard
                        title="Total Blocked Slots"
                        value={totalBlocked.toString()}
                        icon={CalendarOff}
                        description="All active blocks"
                    />
                    <StatCard
                        title="Blocked Today"
                        value={todayBlocked.toString()}
                        icon={Clock}
                        description={`For ${minDate}`}
                    />
                    <StatCard
                        title="Fleets Affected"
                        value={uniqueFleetsBlocked.toString()}
                        icon={Ship}
                        description="Unique fleets with blocks"
                    />
                </div>

                {/* Slot Blocking Controls */}
                <Card className="border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] bg-white ring-1 ring-black/5 overflow-hidden">
                    <CardContent className="p-6 sm:p-10">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full"></div>
                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Block / Unblock Slots</h2>
                        </div>

                        {/* Fleet + Date Selection */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Select Fleet</label>
                                <select
                                    className={inputClasses}
                                    style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                                    value={selectedFleetId}
                                    onChange={e => setSelectedFleetId(e.target.value)}
                                >
                                    <option value="" disabled>Choose a fleet...</option>
                                    {fleets.map(f => (
                                        <option key={f.id} value={f.fleet_id}>{f.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Select Date</label>
                                <input
                                    type="date"
                                    min={minDate}
                                    className={`${inputClasses} cursor-text`}
                                    value={selectedDate}
                                    onChange={e => setSelectedDate(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Reason / Note (Optional)</label>
                                <input
                                    type="text"
                                    className={`${inputClasses} cursor-text`}
                                    placeholder="e.g. Maintenance, Private Event..."
                                    value={reason}
                                    onChange={e => setReason(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Time Slot Grid */}
                        {selectedFleetId && selectedDate ? (
                            <div>
                                <div className="flex items-center gap-3 mb-5">
                                    <Clock className="w-4 h-4 text-[#D4AF37]" />
                                    <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                                        Time Slots for {selectedFleet?.title || selectedFleetId} — {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>
                                </div>
                                {loading ? (
                                    <div className="py-16 text-center text-sm text-slate-400 font-bold">Loading slots...</div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                                        {TIME_SLOTS.map(slot => {
                                            const blocked = isSlotBlocked(slot.value);
                                            const isLoading = actionLoading === slot.value;
                                            return (
                                                <button
                                                    key={slot.value}
                                                    onClick={() => handleToggleSlot(slot.value)}
                                                    disabled={isLoading}
                                                    className={`relative p-5 rounded-2xl border-2 text-center transition-all duration-300 group ${
                                                        blocked
                                                            ? 'border-red-300 bg-red-50 shadow-sm shadow-red-100 hover:border-red-400 hover:bg-red-100'
                                                            : 'border-slate-100 bg-white hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-sm'
                                                    } ${isLoading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
                                                >
                                                    <div className={`text-sm font-black mb-1 ${blocked ? 'text-red-700' : 'text-[#10233D]'}`}>
                                                        {slot.label}
                                                    </div>
                                                    <div className={`text-[10px] font-bold uppercase tracking-widest ${blocked ? 'text-red-500' : 'text-slate-400 group-hover:text-emerald-600'}`}>
                                                        {isLoading ? '...' : blocked ? '🔒 Blocked' : '✅ Available'}
                                                    </div>
                                                    {blocked && (
                                                        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-sm"></div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}

                                <div className="flex items-center gap-6 mt-6 text-xs font-bold text-slate-400">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded bg-red-100 border border-red-300"></div>
                                        Click to Unblock
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded bg-white border border-slate-200"></div>
                                        Click to Block
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="py-16 text-center">
                                <CalendarOff className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                <p className="text-sm font-bold text-slate-400">Select a fleet and date to manage time slot availability.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* All Blocked Slots Table */}
                <Card className="border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] bg-white ring-1 ring-black/5 overflow-hidden">
                    <CardContent className="p-6 sm:p-10">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">All Blocked Slots</h2>
                            </div>
                            {selectedIds.length > 0 && (
                                <button
                                    onClick={handleBulkDelete}
                                    disabled={isDeleting}
                                    className="flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 px-5 py-2.5 rounded-2xl text-sm font-black shadow-sm hover:bg-red-100 transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    {isDeleting ? "Removing..." : `Unblock (${selectedIds.length})`}
                                </button>
                            )}
                        </div>

                        {allBlockedSlots.length === 0 ? (
                            <div className="py-16 text-center">
                                <AlertTriangle className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                                <p className="text-sm font-bold text-slate-400">No slots are currently blocked.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-100">
                                            <th className="py-4 px-4 text-left">
                                                <input
                                                    type="checkbox"
                                                    className="accent-[#D4AF37] w-4 h-4"
                                                    checked={selectedIds.length === allBlockedSlots.length && allBlockedSlots.length > 0}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedIds(allBlockedSlots.map(bs => bs.id));
                                                        } else {
                                                            setSelectedIds([]);
                                                        }
                                                    }}
                                                />
                                            </th>
                                            <th className="py-4 px-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Fleet</th>
                                            <th className="py-4 px-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                                            <th className="py-4 px-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Time Slot</th>
                                            <th className="py-4 px-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Reason</th>
                                            <th className="py-4 px-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Blocked On</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allBlockedSlots.map(bs => {
                                            const fleetName = fleets.find(f => f.fleet_id === bs.fleet_id)?.title || bs.fleet_id;
                                            const slotLabel = TIME_SLOTS.find(s => s.value === bs.time_slot)?.label || bs.time_slot;
                                            return (
                                                <tr key={bs.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                    <td className="py-4 px-4">
                                                        <input
                                                            type="checkbox"
                                                            className="accent-[#D4AF37] w-4 h-4"
                                                            checked={selectedIds.includes(bs.id)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setSelectedIds(prev => [...prev, bs.id]);
                                                                } else {
                                                                    setSelectedIds(prev => prev.filter(id => id !== bs.id));
                                                                }
                                                            }}
                                                        />
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className="px-3 py-1.5 bg-slate-100/80 text-slate-700 rounded-lg font-bold text-xs">{fleetName}</span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className="font-semibold text-slate-600">{new Date(bs.date + 'T00:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg font-bold text-xs border border-red-100">{slotLabel}</span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className="text-slate-500 font-medium text-xs">{bs.reason || '—'}</span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className="text-slate-400 text-xs font-medium">{new Date(bs.createdAt).toLocaleDateString('en-GB')}</span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

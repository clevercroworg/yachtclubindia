"use client"

import { useState, useEffect, useCallback } from "react"
import { X, Calculator, CreditCard, Calendar, UserRound, ArrowRight, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import fleets from "@/data/fleet.json"
import { ADDONS } from "@/data/addons"

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

type AddBookingModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function AddBookingModal({ isOpen, onClose, onSuccess }: AddBookingModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [customer, setCustomer] = useState({ firstName: "", lastName: "", email: "", phone: "", company: "" });
    const [yachtId, setYachtId] = useState("");
    const [date, setDate] = useState("");
    const [timeSlot, setTimeSlot] = useState("");
    const [blockedSlots, setBlockedSlots] = useState<string[]>([]);
    const [slotWarningVisible, setSlotWarningVisible] = useState(false);
    const [overrideConfirmed, setOverrideConfirmed] = useState(false);
    const [guests, setGuests] = useState(2);
    const [duration, setDuration] = useState(2);
    const [quantity, setQuantity] = useState(1);
    const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
    
    // Financials
    const [charterCost, setCharterCost] = useState(0);
    const [addonsCost, setAddonsCost] = useState(0);
    const [subtotal, setSubtotal] = useState(0);
    const [paymentStatus, setPaymentStatus] = useState("paid");

    const selectedYacht = fleets.find(f => f.id === yachtId);

    // Dynamic Logic Based on Selected Fleet
    const isTicket = selectedYacht?.pricingType === 'ticket';
    const hideAddons = selectedYacht ? ['nauti-buoy', 'rare-catamaran', 'water-sports-booking'].includes(selectedYacht.id) || isTicket : false;

    // Auto calculate costs
    const handleCalculate = () => {
        let baseCost = 0;
        if (selectedYacht) {
            if (isTicket) {
                const numericString = selectedYacht.price.replace(/[^0-9]/g, '');
                baseCost = (parseInt(numericString) || 0) * quantity;
            } else {
                const costPerHour = Number(selectedYacht.pricePerHour) || 0;
                baseCost = costPerHour * duration;
                if (baseCost === 0 && selectedYacht.price) {
                    const numericString = selectedYacht.price.replace(/[^0-9]/g, '');
                    baseCost = parseInt(numericString) || 0;
                }
            }
        }
        
        let extrasCost = 0;
        if (!hideAddons) {
            selectedAddons.forEach(a => {
                const addonDef = ADDONS.find(ad => ad.id === a);
                if (addonDef) extrasCost += addonDef.price;
            });
        }

        setCharterCost(baseCost);
        setAddonsCost(extrasCost);
        setSubtotal(baseCost + extrasCost);
    }

    // Auto set specific fields when ticket type is selected
    useEffect(() => {
        if (isTicket && selectedYacht?.timing) {
            setTimeSlot(selectedYacht.timing);
        }
    }, [yachtId, selectedYacht, isTicket]);

    // Fetch blocked slots when fleet or date changes
    useEffect(() => {
        const fleetIdVal = selectedYacht?.id || yachtId;
        if (!fleetIdVal || !date) {
            setBlockedSlots([]);
            return;
        }
        fetch(`/api/blocked-slots?fleetId=${fleetIdVal}&date=${date}`)
            .then(r => r.json())
            .then(data => {
                if (data.success && data.blockedSlots) {
                    setBlockedSlots(data.blockedSlots.map((bs: any) => bs.time_slot));
                } else {
                    setBlockedSlots([]);
                }
            })
            .catch(() => setBlockedSlots([]));
        // Reset override when fleet/date changes
        setOverrideConfirmed(false);
        setSlotWarningVisible(false);
    }, [yachtId, date, selectedYacht]);

    // Check if selected time slot is blocked
    useEffect(() => {
        if (timeSlot && blockedSlots.includes(timeSlot)) {
            setSlotWarningVisible(true);
            setOverrideConfirmed(false);
        } else {
            setSlotWarningVisible(false);
            setOverrideConfirmed(false);
        }
    }, [timeSlot, blockedSlots]);

    useEffect(() => {
        if (hideAddons && selectedAddons.length > 0) {
            setSelectedAddons([]); 
        }
        handleCalculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [yachtId, duration, guests, quantity, selectedAddons]);

    const toggleAddon = (id: string) => {
        setSelectedAddons(prev => 
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const yachtTitle = selectedYacht?.title || "Unknown Yacht";

        const payload = {
            yacht: yachtTitle,
            yachtId: yachtId,
            date,
            timeSlot: isTicket ? (selectedYacht?.timing || 'Fixed Timing') : timeSlot,
            guests: isTicket ? 0 : guests,
            quantity: isTicket ? quantity : 1,
            hours: isTicket ? 0 : duration,
            charterCost,
            addonsCost: hideAddons ? 0 : addonsCost,
            subtotal,
            addons: hideAddons ? [] : selectedAddons,
            customer: customer,
            payment: {
                paymentStatus: paymentStatus
            }
        };

        try {
            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (data.success) {
                onSuccess();
                onClose();
            } else {
                setError(data.error || "Failed to create booking.");
            }
        } catch (err: any) {
            setError("Internal Server Error or Network Issue. (Ensure DATABASE_URL is configured)");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    // Premium Input Styles
    const inputClasses = "w-full h-11 px-4 rounded-xl border-slate-200 bg-slate-50 hover:bg-white focus:bg-white focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 transition-all font-medium text-slate-900";
    const labelClasses = "text-xs font-bold uppercase tracking-widest text-slate-500 mb-1.5 ml-1";

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#10233D]/40 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl flex flex-col my-auto animate-in zoom-in-95 duration-300 ring-1 ring-black/5">
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-white/80 backdrop-blur-xl rounded-t-[2rem] sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm">
                            <ArrowRight className="w-5 h-5 text-[#D4AF37]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-[#10233D] tracking-tight">Create Manual Booking</h2>
                            <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-widest">Admin Dashboard Entry</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-8 overflow-y-auto max-h-[75vh]">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-medium mb-8 border border-red-100 shadow-sm flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0 animate-pulse"></div>
                            {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-10">
                        {/* Customer Details */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <UserRound className="w-5 h-5 text-[#D4AF37]" />
                                <h3 className="text-sm font-black text-[#10233D] uppercase tracking-widest">Customer Details</h3>
                                <div className="h-px bg-slate-100 flex-1 ml-4"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 px-2">
                                <div className="space-y-1">
                                    <Label className={labelClasses}>First Name</Label>
                                    <input required className={inputClasses} value={customer.firstName} onChange={e => setCustomer({...customer, firstName: e.target.value})} placeholder="e.g. Sanjay" />
                                </div>
                                <div className="space-y-1">
                                    <Label className={labelClasses}>Last Name</Label>
                                    <input required className={inputClasses} value={customer.lastName} onChange={e => setCustomer({...customer, lastName: e.target.value})} placeholder="e.g. Kumar" />
                                </div>
                                <div className="space-y-1">
                                    <Label className={labelClasses}>Email Address</Label>
                                    <input required type="email" className={inputClasses} value={customer.email} onChange={e => setCustomer({...customer, email: e.target.value})} placeholder="example@domain.com" />
                                </div>
                                <div className="space-y-1">
                                    <Label className={labelClasses}>Phone Number</Label>
                                    <input required type="tel" className={inputClasses} value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})} placeholder="+91 99999 99999" />
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <Label className={labelClasses}>Company / Organization (Optional)</Label>
                                    <input className={inputClasses} value={customer.company} onChange={e => setCustomer({...customer, company: e.target.value})} placeholder="Company Name" />
                                </div>
                            </div>
                        </section>

                        {/* Trip Info */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <Calendar className="w-5 h-5 text-[#D4AF37]" />
                                <h3 className="text-sm font-black text-[#10233D] uppercase tracking-widest">Trip Configuration</h3>
                                <div className="h-px bg-slate-100 flex-1 ml-4"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 px-2">
                                <div className="space-y-1">
                                    <Label className={labelClasses}>Experience / Fleet Selection</Label>
                                    <select 
                                        required
                                        className={`${inputClasses} appearance-none cursor-pointer`}
                                        style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                                        value={yachtId} 
                                        onChange={e => setYachtId(e.target.value)}
                                    >
                                        <option value="" disabled>Choose a yacht or cruise...</option>
                                        {fleets.map(f => (
                                            <option key={f.id} value={f.id}>{f.title} {f.pricingType === 'ticket' ? '(Cruise)' : ''}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <Label className={labelClasses}>Date of Departure</Label>
                                    <input required type="date" className={inputClasses} value={date} onChange={e => setDate(e.target.value)} />
                                </div>
                                
                                {/* Dynamic Fields based on Yacht Selection */}
                                {isTicket ? (
                                    <>
                                        <div className="space-y-1">
                                            <Label className={labelClasses}>Event Timing</Label>
                                            <input readOnly disabled className={`${inputClasses} cursor-not-allowed opacity-70`} value={selectedYacht?.timing || 'Fixed Timing'} />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className={labelClasses}>Ticket Quantity</Label>
                                            <input required type="number" min={1} className={inputClasses} value={quantity} onChange={e => setQuantity(parseInt(e.target.value) || 0)} />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="space-y-1">
                                            <Label className={labelClasses}>Time Slot</Label>
                                            <select 
                                                className={`${inputClasses} appearance-none cursor-pointer ${slotWarningVisible && !overrideConfirmed ? 'border-amber-400 ring-2 ring-amber-100' : ''}`}
                                                style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                                                value={timeSlot} 
                                                onChange={e => setTimeSlot(e.target.value)}
                                            >
                                                <option value="" disabled>Select a time slot</option>
                                                {TIME_SLOTS.map(slot => {
                                                    const isBlocked = blockedSlots.includes(slot.value);
                                                    return (
                                                        <option key={slot.value} value={slot.value}>
                                                            {slot.label}{isBlocked ? ' 🔒 (Blocked)' : ''}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                            {slotWarningVisible && (
                                                <div className="mt-3 p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 shadow-sm">
                                                    <div className="flex items-start gap-3">
                                                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                                        <div className="flex-1">
                                                            <p className="text-sm font-black text-amber-800">⚠️ This slot is blocked</p>
                                                            <p className="text-xs text-amber-700 mt-1 leading-relaxed">This time slot has been blocked by an admin. It will show as "Slot Booked" to users on the booking page.</p>
                                                            {!overrideConfirmed ? (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setOverrideConfirmed(true)}
                                                                    className="mt-3 px-4 py-2 bg-amber-600 text-white text-xs font-black rounded-xl hover:bg-amber-700 transition-colors shadow-sm"
                                                                >
                                                                    Yes, Override & Proceed Anyway
                                                                </button>
                                                            ) : (
                                                                <div className="mt-3 flex items-center gap-2">
                                                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                                                    <span className="text-xs font-black text-emerald-700">Override confirmed — you may proceed.</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-5">
                                            <div className="space-y-1">
                                                <Label className={labelClasses}>Duration (Hrs)</Label>
                                                <input required type="number" min={1} className={inputClasses} value={duration} onChange={e => setDuration(parseInt(e.target.value) || 0)} />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className={labelClasses}>Guests</Label>
                                                <input required type="number" min={1} className={inputClasses} value={guests} onChange={e => setGuests(parseInt(e.target.value) || 0)} />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </section>

                        {/* Enhancements */}
                        {!hideAddons && (
                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-5 h-5 flex items-center justify-center rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/30">
                                        <div className="w-2.5 h-2.5 bg-[#D4AF37] rounded-full"></div>
                                    </div>
                                    <h3 className="text-sm font-black text-[#10233D] uppercase tracking-widest">Optional Enhancements</h3>
                                    <div className="h-px bg-slate-100 flex-1 ml-4"></div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-2">
                                    {ADDONS.map(addon => {
                                        const isChecked = selectedAddons.includes(addon.id);
                                        return (
                                            <label 
                                                key={addon.id} 
                                                className={`flex items-center space-x-4 p-4 rounded-[1.25rem] border-2 cursor-pointer transition-all duration-300 ${isChecked ? 'border-[#D4AF37] bg-[#D4AF37]/5 shadow-sm shadow-[#D4AF37]/10' : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'}`}
                                            >
                                                <input 
                                                    type="checkbox" 
                                                    className="hidden"
                                                    checked={isChecked}
                                                    onChange={() => toggleAddon(addon.id)}
                                                />
                                                <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors duration-200 shrink-0 ${isChecked ? 'bg-[#D4AF37] border-[#D4AF37]' : 'border-slate-300 bg-white'}`}>
                                                    {isChecked && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className={`font-black text-sm truncate ${isChecked ? 'text-[#10233D]' : 'text-slate-600'}`}>{addon.label}</div>
                                                    <div className={`text-xs font-bold mt-0.5 ${isChecked ? 'text-[#D4AF37]' : 'text-slate-400'}`}>+ ₹{addon.price.toLocaleString()}</div>
                                                </div>
                                            </label>
                                        )
                                    })}
                                </div>
                            </section>
                        )}
                        
                        {hideAddons && selectedYacht && (
                            <section className="bg-sky-50/50 border border-sky-100 px-6 py-5 rounded-2xl flex gap-4">
                                <div className="w-8 h-8 bg-sky-100 text-sky-600 rounded-full flex justify-center items-center shrink-0">✨</div>
                                <div>
                                    <h4 className="text-sm font-black text-sky-900 mb-1">Standard Enhancements Hidden</h4>
                                    <p className="text-xs font-medium text-sky-700/80 leading-relaxed">Typical yacht add-ons are not applicable for <strong>{selectedYacht.title}</strong> since this fleet operates on exclusive routes or predefined packages.</p>
                                </div>
                            </section>
                        )}

                        {/* Finance */}
                        <section className="bg-slate-50 px-8 py-8 rounded-[2rem] border border-slate-100 shadow-inner">
                            <div className="flex flex-col sm:flex-row items-baseline sm:items-center justify-between border-b-2 border-slate-200/60 pb-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <CreditCard className="w-5 h-5 text-[#D4AF37]" />
                                    <h3 className="text-sm font-black text-[#10233D] uppercase tracking-widest">Financial Override</h3>
                                </div>
                                <button type="button" onClick={handleCalculate} className="mt-3 sm:mt-0 px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs flex items-center font-bold text-slate-600 hover:text-[#10233D] hover:border-slate-300 shadow-sm transition-all">
                                    <Calculator className="w-3.5 h-3.5 mr-2 text-[#D4AF37]" /> Auto-Calculate
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="space-y-1">
                                    <Label className={labelClasses}>{isTicket ? 'Tickets Cost (₹)' : 'Charter Cost (₹)'}</Label>
                                    <input required type="number" className={inputClasses} value={charterCost} onChange={e => {setCharterCost(parseInt(e.target.value) || 0); setSubtotal((parseInt(e.target.value) || 0) + addonsCost);}} />
                                </div>
                                <div className="space-y-1">
                                    <Label className={labelClasses}>Add-ons Cost (₹)</Label>
                                    <input required type="number" disabled={hideAddons} className={`${inputClasses} ${hideAddons ? 'opacity-50 cursor-not-allowed' : ''}`} value={addonsCost} onChange={e => {setAddonsCost(parseInt(e.target.value) || 0); setSubtotal(charterCost + (parseInt(e.target.value) || 0));}} />
                                </div>
                                <div className="space-y-1">
                                    <Label className={labelClasses}>Grand Total (₹)</Label>
                                    <input required type="number" className={`${inputClasses} border-[#10233D] ring-1 ring-[#10233D]/10 bg-[#10233D]/5 text-[#10233D] font-black text-lg`} value={subtotal} onChange={e => setSubtotal(parseInt(e.target.value) || 0)} />
                                </div>
                            </div>
                            
                            <div className="mt-6 pt-6 border-t border-slate-200/60">
                                <Label className={labelClasses}>Payment Status</Label>
                                <select 
                                    className={`${inputClasses} mt-1 appearance-none cursor-pointer max-w-sm font-bold text-[#10233D] bg-white`}
                                    style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                                    value={paymentStatus} 
                                    onChange={e => setPaymentStatus(e.target.value)}
                                >
                                    <option value="paid">✅ Paid Successfully</option>
                                    <option value="pending">⏳ Pending Payment</option>
                                    <option value="manual">💵 Offline Manual Collection</option>
                                </select>
                            </div>
                        </section>

                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 lg:pt-8 bg-white border-t border-slate-100">
                            <Button type="button" variant="outline" className="h-12 px-6 rounded-xl font-bold text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-800" onClick={onClose}>Discard</Button>
                            <Button type="submit" className="h-12 px-8 rounded-xl bg-[#10233D] text-white font-black hover:bg-[#152e50] shadow-xl shadow-[#10233D]/20 transition-all hover:-translate-y-0.5" disabled={loading || (slotWarningVisible && !overrideConfirmed)}>
                                {loading ? "Saving Record..." : (slotWarningVisible && !overrideConfirmed) ? "⚠️ Override Required" : "Confirm & Create Booking"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

'use client';

import { useEffect, useState } from 'react';
import { ShieldCheck, ArrowLeft, ArrowRight, Minus, Plus, Ship, Clock, Users, CalendarDays, MapPin, CreditCard, Smartphone } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Added this import
import fleetData from '@/data/fleet.json';
import { ADDONS } from '@/data/addons';

const TIME_SLOT_LABELS: Record<string, string> = {
    '6AM-8AM': '6 AM – 8 AM',
    '8AM-10AM': '8 AM – 10 AM',
    '10AM-12PM': '10 AM – 12 PM',
    '12PM-2PM': '12 PM – 2 PM',
    '2PM-4PM': '2 PM – 4 PM',
    '4PM-6PM': '4 PM – 6 PM',
    '6PM-8PM': '6 PM – 8 PM',
    '8PM-10PM': '8 PM – 10 PM',
    '10PM-12AM': '10 PM – 12 AM',
    '12AM-2AM': '12 AM – 2 AM',
};

export default function CheckoutPage() {
    const router = useRouter(); // Added router
    const [step, setStep] = useState(1); // 1 = Cart, 2 = Checkout
    const [bookingData, setBookingData] = useState<any>(null);
    const [yacht, setYacht] = useState<any>(null);
    const [quantity, setQuantity] = useState(1);

    // Checkout form state
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [company, setCompany] = useState('');
    const [phone, setPhone] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('razorpay'); // Kept state variable for completeness but form section is hidden

    // Toggle optional fields
    const [showCompany, setShowCompany] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);

        const extraHoursRaw = parseInt(searchParams.get('extraHours') || '0', 10);
        const addonsRaw = searchParams.get('addons');

        const data = {
            yachtId: searchParams.get('yachtId'),
            date: searchParams.get('date'),
            timeSlot: searchParams.get('timeSlot'),
            guests: searchParams.get('guests'),
            extraHours: [0, 2, 3, 4].includes(extraHoursRaw) ? extraHoursRaw : 0,
            addons: addonsRaw ? addonsRaw.split(',').filter(id => ADDONS.some(a => a.id === id)) : [],
        };

        if (data.yachtId) {
            const foundYacht = fleetData.find(y => y.id === data.yachtId);
            if (foundYacht) setYacht(foundYacht);
        }

        setBookingData(data);
    }, []);

    // Format date nicely
    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '--';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    // Format time slot label
    const formatSlot = (slotValue: string | null) => {
        if (!slotValue) return '--';
        return TIME_SLOT_LABELS[slotValue] || slotValue;
    };

    // Calculate price — base slot is 2 hrs + extra hours (0, 2, 3, or 4)
    const getHours = () => {
        return 2 + (bookingData?.extraHours || 0);
    };

    const getAddonsCost = () => {
        if (!bookingData?.addons || bookingData.addons.length === 0) return 0;
        return bookingData.addons.reduce((sum: number, addonId: string) => {
            const found = ADDONS.find(a => a.id === addonId);
            return sum + (found?.price || 0);
        }, 0);
    };

    const charterCost = (yacht?.pricePerHour || 0) * getHours();
    const addonsCost = getAddonsCost();
    const subtotal = (charterCost + addonsCost) * quantity;

    const ensureRazorpayScript = () => {
        return new Promise<void>((resolve, reject) => {
            if (typeof window === 'undefined') {
                reject(new Error('Window is not available.'));
                return;
            }

            if ((window as any).Razorpay) {
                resolve();
                return;
            }

            const existing = document.getElementById('razorpay-script') as HTMLScriptElement | null;

            if (existing) {
                if (existing.getAttribute('data-ready') === 'true') {
                    resolve();
                    return;
                }
                existing.addEventListener('load', () => resolve(), { once: true });
                existing.addEventListener('error', () => reject(new Error('Failed to load Razorpay checkout.')), { once: true });
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.id = 'razorpay-script';
            script.onload = () => {
                script.setAttribute('data-ready', 'true');
                resolve();
            };
            script.onerror = () => reject(new Error('Failed to load Razorpay checkout.'));
            document.body.appendChild(script);
        });
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!yacht || !bookingData) {
            alert('Please select a yacht and booking slot before submitting.');
            return;
        }

        setIsSubmitting(true);

        const amountInPaise = Math.round(subtotal * 100);
        const bookingDetails = {
            yacht: yacht.title,
            yachtId: yacht.id,
            date: bookingData.date,
            timeSlot: bookingData.timeSlot,
            guests: bookingData.guests,
            extraHours: bookingData.extraHours,
            addons: bookingData.addons ?? [],
            hours: getHours(),
            charterCost,
            addonsCost,
            quantity,
            subtotal,
            customer: { firstName, lastName, email, phone, company },
            paymentMethod,
        };

        try {
            console.log('[checkout/order] Creating Razorpay order:', { amountInPaise, bookingDetails });
            const orderRes = await fetch('/api/razorpay/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: amountInPaise,
                    yacht: yacht.title,
                }),
            });

            const orderPayload = await orderRes.json();

            if (!orderRes.ok) {
                throw new Error(orderPayload.error || 'Failed to create payment order');
            }

            const { order, key } = orderPayload;

            setIsSubmitting(false);

            await ensureRazorpayScript();

            const openRazorpay = () => {
                const rzp = new (window as any).Razorpay({
                    key,
                    amount: order.amount,
                    currency: order.currency,
                    name: 'Yacht Club India',
                    description: 'Private luxury yacht charter',
                    order_id: order.id,
                    handler: async (response: any) => {
                        try {
                            const paymentDetails = {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                paymentStatus: 'paid',
                            };

                            const bookingResponse = await fetch('/api/bookings', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    ...bookingDetails,
                                    amountInPaise,
                                    payment: paymentDetails,
                                }),
                            });

                            if (!bookingResponse.ok) {
                                const bookingError = await bookingResponse.json();
                                throw new Error(bookingError.error || 'Failed to store booking');
                            }

                            const result = await bookingResponse.json();
                            const bookingId = result.booking?.id;

                            setIsSubmitting(false);

                            if (bookingId) {
                                await router.push(`/thank-you?bookingId=${bookingId}`);
                                return;
                            }

                            await router.push(`/thank-you?paymentId=${paymentDetails.razorpay_payment_id}`);
                        } catch (err: any) {
                            console.error('Error saving booking after payment:', err);
                            alert('Payment succeeded, but we could not save the booking. Please reach out to support.');
                            setIsSubmitting(false);
                        }
                    },
                    theme: {
                        color: '#10233D',
                    },
                });

                rzp.on('payment.failed', (response: any) => {
                    console.error('Razorpay payment failed:', response);
                    alert('Payment failed. Please try again or use another payment method.');
                    setIsSubmitting(false);
                });

                rzp.on('checkout.modal.closed', () => {
                    console.log('[checkout] Razorpay modal closed');
                    setIsSubmitting(false);
                });

                rzp.open();
            };

            openRazorpay();
            } catch (error: any) {
                console.error('Error initiating payment:', error);
                alert(error.message || 'Unable to process payment at the moment. Please try again later.');
                setIsSubmitting(false);
            }
        };

    const inputClass = "w-full border border-black/10 rounded-lg px-4 py-3.5 text-sm text-textMain placeholder:text-textMuted/50 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/40 transition-all bg-white";

    return (
        <main className="pt-32 pb-24 min-h-screen" style={{ background: '#F7F8FA' }}>
            <div className="mx-auto max-w-3xl px-6">

                {/* Back link */}
                <div className="mb-6">
                    {step === 1 ? (
                        <button onClick={() => router.back()} className="inline-flex items-center text-sm font-semibold text-textMuted hover:text-gold transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Booking
                        </button>
                    ) : (
                        <button onClick={() => setStep(1)} className="inline-flex items-center text-sm font-semibold text-textMuted hover:text-gold transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Cart
                        </button>
                    )}
                </div>

                {/* Step Indicator */}
                <div className="flex items-center gap-3 mb-8">
                    <div className={`flex items-center gap-2 text-sm font-bold ${step >= 1 ? 'text-[#10233D]' : 'text-textMuted'}`}>
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-[#10233D] text-white' : 'bg-black/10 text-textMuted'}`}>1</span>
                        Cart
                    </div>
                    <div className="flex-1 h-px bg-black/10" />
                    <div className={`flex items-center gap-2 text-sm font-bold ${step >= 2 ? 'text-[#10233D]' : 'text-textMuted'}`}>
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-[#10233D] text-white' : 'bg-black/10 text-textMuted'}`}>2</span>
                        Checkout
                    </div>
                </div>

                {/* ═══════════════════ STEP 1: CART ═══════════════════ */}
                {step === 1 && (
                    <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
                        {/* Cart Header */}
                        <div className="px-8 py-5 border-b border-black/5 flex items-center justify-between">
                            <h1 className="text-2xl font-black font-jakarta text-textMain">Your Booking</h1>
                            <div className="flex items-center gap-2 text-sm text-textMuted">
                                <Ship className="w-4 h-4 text-gold" />
                                <span>{quantity} item{quantity > 1 ? 's' : ''}</span>
                            </div>
                        </div>

                        {/* Cart Item */}
                        {yacht ? (
                            <div className="px-8 py-6">
                                <div className="flex flex-col md:flex-row gap-5 md:gap-6">
                                    <div className="flex gap-4 sm:gap-6 flex-1">
                                        {/* Yacht Image */}
                                        <div className="relative w-24 h-24 sm:w-32 sm:h-24 rounded-xl overflow-hidden shrink-0 border border-black/5">
                                            <Image src={yacht.image} alt={yacht.title} fill className="object-cover" />
                                        </div>

                                        {/* Yacht Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-bold font-jakarta text-textMain">{yacht.title}</h3>
                                            <div className="mt-2 text-sm text-textMuted flex flex-col gap-1.5">
                                                <div className="flex gap-2 items-start sm:items-center">
                                                    <CalendarDays className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5 sm:mt-0" />
                                                    <span className="leading-snug truncate">Booking Date: {formatDate(bookingData?.date)}</span>
                                                </div>
                                                <div className="flex gap-2 items-start sm:items-center">
                                                    <Clock className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5 sm:mt-0" />
                                                    <span className="leading-snug break-words">Slot: {formatSlot(bookingData?.timeSlot)} ({getHours()} hrs{bookingData?.extraHours > 0 ? ` incl. +${bookingData.extraHours} hr extra` : ''})</span>
                                                </div>
                                                <div className="flex gap-2 items-center">
                                                    <Users className="w-3.5 h-3.5 text-gold shrink-0" />
                                                    <span className="leading-snug">Guests: {bookingData?.guests || '--'}</span>
                                                </div>
                                                <div className="flex gap-2 items-center">
                                                    <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                                                    <span className="leading-snug">Zone: Asia/Kolkata</span>
                                                </div>
                                            </div>

                                            {/* Top/Desktop Quantity Controls */}
                                            <div className="hidden md:flex mt-4 items-center gap-3">
                                                <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-9 h-9 rounded-full border border-black/10 flex items-center justify-center hover:bg-black/5 transition-colors">
                                                    <Minus className="w-3.5 h-3.5" />
                                                </button>
                                                <span className="w-10 text-center font-bold text-textMain">{quantity}</span>
                                                <button type="button" onClick={() => setQuantity(quantity + 1)} className="w-9 h-9 rounded-full border border-black/10 flex items-center justify-center hover:bg-black/5 transition-colors">
                                                    <Plus className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mobile bottom row / Desktop right column */}
                                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start border-t border-black/5 md:border-none pt-4 md:pt-0 shrink-0">
                                        {/* Mobile Quantity Controls */}
                                        <div className="md:hidden flex items-center gap-3">
                                            <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-9 h-9 rounded-full border border-black/10 flex items-center justify-center hover:bg-black/5 transition-colors">
                                                <Minus className="w-3.5 h-3.5" />
                                            </button>
                                            <span className="w-8 text-center font-bold text-textMain">{quantity}</span>
                                            <button type="button" onClick={() => setQuantity(quantity + 1)} className="w-9 h-9 rounded-full border border-black/10 flex items-center justify-center hover:bg-black/5 transition-colors">
                                                <Plus className="w-3.5 h-3.5" />
                                            </button>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-xl font-black font-jakarta text-textMain">₹{charterCost.toLocaleString()}</p>
                                            <p className="text-xs text-textMuted mt-1">{yacht.price}/hr × {getHours()} hrs</p>
                                            {addonsCost > 0 && (
                                                <p className="text-xs text-gold mt-1 font-semibold">+ ₹{addonsCost.toLocaleString()} add-ons</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="px-8 py-12 text-center text-textMuted">
                                <Ship className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                <p>No yacht selected. Go back to the fleet page to choose one.</p>
                            </div>
                        )}

                        {/* Subtotal & Proceed */}
                        <div className="px-8 py-6 border-t border-black/5 bg-[#FAFBFC]">
                            <div className="flex items-center justify-between mb-5">
                                <span className="text-lg font-bold font-jakarta text-textMain">Subtotal</span>
                                <span className="text-2xl font-black font-jakarta text-textMain">₹{subtotal.toLocaleString()}</span>
                            </div>
                            <button
                                onClick={() => setStep(2)}
                                disabled={!yacht}
                                className="w-full bg-[#10233D] hover:bg-[#0c1b2f] text-white font-bold py-4 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg hover:-translate-y-0.5"
                            >
                                Proceed To Checkout
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </button>
                        </div>
                    </div>
                )}

                {/* ═══════════════════ STEP 2: CHECKOUT ═══════════════════ */}
                {step === 2 && (
                    <form onSubmit={handlePayment} className="space-y-6">

                        {/* Information Section */}
                        <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-8">
                            <h2 className="text-xl font-bold font-jakarta text-textMain mb-6">Contact Information</h2>
                            <label className="block">
                                <input type="email" className={inputClass} placeholder="Email address" required value={email} onChange={e => setEmail(e.target.value)} />
                            </label>
                        </div>

                        {/* Billing Address / Contact Details Component */}
                        <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-8">
                            <h2 className="text-xl font-bold font-jakarta text-textMain mb-6">Your Details</h2>
                            <div className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <input type="text" className={inputClass} placeholder="First name" required value={firstName} onChange={e => setFirstName(e.target.value)} />
                                    <input type="text" className={inputClass} placeholder="Last name" required value={lastName} onChange={e => setLastName(e.target.value)} />
                                </div>

                                {!showCompany ? (
                                    <button type="button" onClick={() => setShowCompany(true)} className="text-sm font-semibold text-gold hover:underline flex items-center gap-1">
                                        <Plus className="w-3.5 h-3.5" /> Add Company (optional)
                                    </button>
                                ) : (
                                    <input type="text" className={inputClass} placeholder="Company name" value={company} onChange={e => setCompany(e.target.value)} />
                                )}

                                <input type="tel" className={inputClass} placeholder="Phone" required value={phone} onChange={e => setPhone(e.target.value)} />
                            </div>
                        </div>

                        {/* Order Summary Bar */}
                        <div className="bg-[#10233D] rounded-2xl p-6 text-white">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm text-white/60">Order Summary</span>
                                <button type="button" onClick={() => setStep(1)} className="text-xs text-gold font-semibold hover:underline">Edit Cart</button>
                            </div>

                            {yacht && (
                                <div className="flex gap-4 mb-5 pb-5 border-b border-white/10">
                                    <div className="relative w-16 h-14 rounded-lg overflow-hidden shrink-0">
                                        <Image src={yacht.image} alt={yacht.title} fill className="object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm">{yacht.title}</p>
                                        <p className="text-xs text-white/50 mt-0.5">{formatDate(bookingData?.date)} • {formatSlot(bookingData?.timeSlot)}</p>
                                    </div>
                                    <p className="font-bold text-sm shrink-0">₹{charterCost.toLocaleString()}</p>
                                </div>
                            )}

                            {/* Add-ons breakdown */}
                            {bookingData?.addons && bookingData.addons.length > 0 && (
                                <div className="mb-5 pb-4 border-b border-white/10 space-y-2">
                                    <p className="text-xs text-white/40 uppercase tracking-wider">Add-ons</p>
                                    {bookingData.addons.map((addonId: string) => {
                                        const addon = ADDONS.find(a => a.id === addonId);
                                        if (!addon) return null;
                                        return (
                                            <div key={addonId} className="flex justify-between text-sm">
                                                <span className="text-white/70">{addon.label}</span>
                                                <span>₹{addon.price.toLocaleString()}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            <div className="space-y-2 text-sm mb-5">
                                <div className="flex justify-between">
                                    <span className="text-white/60">Subtotal</span>
                                    <span>₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white/60">Tax & Fees</span>
                                    <span className="text-white/40">Included</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-white/10 mb-6">
                                <span className="text-lg font-bold font-jakarta">Total</span>
                                <span className="text-2xl font-black text-gold font-jakarta">₹{subtotal.toLocaleString()}</span>
                            </div>

                            <button type="submit" disabled={isSubmitting} className="w-full bg-gold hover:bg-gold/90 text-[#10233D] font-bold py-4 rounded-xl flex items-center justify-center transition-all shadow-[0_4px_20px_rgba(200,164,93,0.3)] hover:shadow-[0_4px_25px_rgba(200,164,93,0.5)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed">
                                {isSubmitting ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : (
                                    <>
                                        <ShieldCheck className="w-5 h-5 mr-2" />
                                        Submit Request
                                    </>
                                )}
                            </button>

                            <p className="text-center text-[10px] text-white/30 mt-4 leading-relaxed">
                                By proceeding, you agree to our Cancellation Policy and Terms of Service. Final itinerary confirmation subject to availability.
                            </p>
                        </div>
                    </form>
                )}

            </div>
        </main>
    );
}

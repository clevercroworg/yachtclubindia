'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Anchor, Instagram, Play, Ship, Waves, Camera, Sunset, ShieldCheck, Utensils, Clock3, Gift, PartyPopper, CameraIcon, Music, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

import faqsData from '@/data/faqs.json';
import fleetData from '@/data/fleet.json';

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

const ADDONS = [
    { id: 'balloon-decor', label: 'Balloon decor', price: 1500, icon: 'party' },
    { id: 'drone-shoot', label: 'Drone shoot videography and photography', price: 3500, icon: 'camera' },
    { id: 'pre-wedding-shoot', label: 'Pre wedding or professional shoot', price: 10000, icon: 'camera' },
    { id: 'dj-music', label: 'DJ / Music Setup', price: 7000, icon: 'music' },
    { id: 'dining-setup', label: 'Premium Dining Setup', price: 10000, icon: 'dining' },
];

const ADDON_ICONS: Record<string, any> = {
    party: PartyPopper,
    camera: CameraIcon,
    music: Music,
    dining: UtensilsCrossed,
};

export default function BookingPage() {
    const router = useRouter();
    const [mainImg, setMainImg] = useState('/images/yacht.png');
    const [openFaq, setOpenFaq] = useState<string | null>(null);
    const [selectedYacht, setSelectedYacht] = useState<any>(null);

    // Form State
    const [date, setDate] = useState('');
    const [minDate, setMinDate] = useState('');
    const [timeSlot, setTimeSlot] = useState('');
    const [guests, setGuests] = useState('');
    const [extraHours, setExtraHours] = useState(0);
    const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

    const [galleryImages, setGalleryImages] = useState<string[]>([
        '/images/yacht/phoenix-1.jpg',
        '/images/yacht/phoenix-2.jpg',
        '/images/yacht/phoenix-3.jpg',
        '/images/yacht/phoenix-4.jpg',
        '/images/yacht/phoenix-5.jpg',
        '/images/yacht/DJI_20260214204839_0010_D.JPG',
        '/images/yacht/DJI_20260214205036_0046_D.JPG',
        '/images/yacht/DJI_20260214205042_0051_D.JPG',
        '/images/yacht/DJI_20260214205313_0099_D.JPG',
        '/images/yacht/DJI_20260214205423_0109_D.JPG',
        '/images/yacht/DJI_20260214210735_0003_D.JPG',
        '/images/yacht/DJI_20260214210739_0006_D.JPG',
        '/images/yacht/DJI_20260214210743_0009_D.JPG'
    ]);
    const [showAllGallery, setShowAllGallery] = useState(false);

    useEffect(() => {
        // Set min date to today local time
        const today = new Date();
        const localDateStr = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
        setMinDate(localDateStr);

        // Basic Intersection Observer for reveal animation
        const revealEls = document.querySelectorAll('[data-reveal]');
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealEls.forEach((el) => io.observe(el));

        // Load dynamic yacht data from URL params if present
        const searchParams = new URLSearchParams(window.location.search);
        const yachtId = searchParams.get('yachtId');
        if (yachtId) {
            const foundYacht = (fleetData as any[]).find((y: any) => y.id === yachtId);
            if (foundYacht) {
                setSelectedYacht(foundYacht);
                setMainImg(foundYacht.image);
                if (foundYacht.images && foundYacht.images.length > 0) {
                    setGalleryImages(foundYacht.images);
                }
            }
        }

        return () => io.disconnect();
    }, []);

    // Re-observe reveal elements when selectedYacht changes (for dynamically rendered sections)
    useEffect(() => {
        if (!selectedYacht) return;
        const timer = setTimeout(() => {
            const revealEls = document.querySelectorAll('[data-reveal]:not(.revealed)');
            const io = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        io.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            revealEls.forEach((el) => io.observe(el));
            return () => io.disconnect();
        }, 100);
        return () => clearTimeout(timer);
    }, [selectedYacht]);

    const toggleFaq = (id: string) => {
        setOpenFaq(openFaq === id ? null : id);
    };

    const handleCheckout = (e: React.FormEvent) => {
        e.preventDefault();

        if (!date) {
            alert('Please select a Departure Date before proceeding.');
            return;
        }
        if (!timeSlot) {
            alert('Please select a Time Slot before proceeding.');
            return;
        }

        if (guests && selectedYacht && parseInt(guests, 10) > parseInt(selectedYacht.capacity, 10)) {
            alert(`A maximum of ${selectedYacht.capacity} guests is allowed for this yacht.`);
            return;
        }

        const params = new URLSearchParams();
        if (selectedYacht) params.set('yachtId', selectedYacht.id);
        params.set('date', date);
        params.set('timeSlot', timeSlot);
        if (guests) params.set('guests', guests);
        params.set('extraHours', String(extraHours));
        if (selectedAddons.length > 0) params.set('addons', selectedAddons.join(','));

        router.push(`/checkout?${params.toString()}`);
    };

    return (
        <main className="pt-28 lg:pt-32">
            {/* Product / Booking Section */}
            <section className="booking-product py-10 lg:py-16">
                <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1.15fr_0.85fr] items-start">
                    <div data-reveal="true" className="lg:sticky lg:top-32">
                        {/* Title Area */}
                        <div className="mb-6 lg:mb-8 block">
                            <p className="booking-label">Yacht Booking</p>
                            {/* Yacht Title */}
                            <h1 className="booking-title text-3xl lg:text-4xl mt-1.5">{selectedYacht ? selectedYacht.title : 'Yacht Name Placeholder'}</h1>
                        </div>

                        <div className="booking-main-image relative h-[450px]">
                            <Image
                                src={mainImg}
                                alt="Yacht gallery main image"
                                fill
                                className="object-cover rounded-2xl"
                                priority
                                unoptimized={mainImg.toLowerCase().endsWith('.dng')}
                            />
                        </div>
                        <div className="mt-4 grid grid-cols-4 gap-3">
                            {galleryImages.slice(0, 4).map((src, idx) => (
                                <button
                                    key={idx}
                                    className={`booking-thumb relative h-24 ${mainImg === src ? 'is-active base-active-border' : ''}`}
                                    onClick={() => setMainImg(src)}
                                >
                                    <Image src={src} alt={`Yacht view ${idx + 1}`} fill className="object-cover rounded-xl" unoptimized={src.toLowerCase().endsWith('.dng')} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <aside id="booking-form" className="booking-panel" data-reveal="true">
                        <div className="mt-1 flex flex-wrap gap-2 text-xs">
                            <span className="badge">Up to {selectedYacht ? selectedYacht.capacity : '___'} guests</span>
                            <span className="badge">{selectedYacht ? selectedYacht.duration.replace(' hrs', '') : '___'} hrs</span>
                            <span className="badge">Crew included</span>
                        </div>

                        <p className="booking-price mt-5 lg:mt-6">Starting from {selectedYacht ? selectedYacht.price : '₹____'} <span>/ 2 hours</span></p>

                        <p className="booking-copy mt-6 border-t border-black/10 pt-4">Select your date and time slot to reserve this yacht. Final itinerary can be customized with concierge support.</p>

                        <form className="mt-7 space-y-4" onSubmit={handleCheckout}>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="booking-field">
                                    <span>Departure Date</span>
                                    <input type="date" min={minDate} value={date} onChange={(e) => setDate(e.target.value)} required />
                                </label>
                                <label className="booking-field">
                                    <span>Guests (Max {selectedYacht ? selectedYacht.capacity : '12'})</span>
                                    <input type="number" min="1" max={selectedYacht ? selectedYacht.capacity : "12"} placeholder="No. of guests" value={guests} onChange={(e) => setGuests(e.target.value)} required />
                                </label>
                            </div>
                            <label className="booking-field">
                                <span>Time Slot (2 hrs)</span>
                                <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} required>
                                    <option value="" disabled>Select a time slot</option>
                                    {TIME_SLOTS.map((slot) => (
                                        <option key={slot.value} value={slot.value}>{slot.label}</option>
                                    ))}
                                </select>
                            </label>
                            <label className="booking-field">
                                <span>Extra Hours</span>
                                <select value={extraHours} onChange={(e) => setExtraHours(Number(e.target.value))}>
                                    <option value={0}>No extra time</option>
                                    <option value={2}>+2 Hours{selectedYacht?.pricePerHour ? ` (+₹${(selectedYacht.pricePerHour * 2).toLocaleString()})` : ''}</option>
                                    <option value={3}>+3 Hours{selectedYacht?.pricePerHour ? ` (+₹${(selectedYacht.pricePerHour * 3).toLocaleString()})` : ''}</option>
                                    <option value={4}>+4 Hours{selectedYacht?.pricePerHour ? ` (+₹${(selectedYacht.pricePerHour * 4).toLocaleString()})` : ''}</option>
                                </select>
                            </label>

                            {/* Add-ons */}
                            <div>
                                <p className="text-sm font-semibold text-textMain mb-3">Add-ons (optional)</p>
                                <div className="space-y-2">
                                    {ADDONS.map((addon) => {
                                        const isSelected = selectedAddons.includes(addon.id);
                                        const IconComp = ADDON_ICONS[addon.icon];
                                        return (
                                            <label
                                                key={addon.id}
                                                className="flex items-center gap-3 cursor-pointer select-none rounded-xl border px-4 py-3 transition-all hover:border-gold/40"
                                                style={{
                                                    borderColor: isSelected ? 'rgba(200,164,93,0.5)' : 'rgba(0,0,0,0.1)',
                                                    background: isSelected ? 'rgba(200,164,93,0.07)' : 'transparent',
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => {
                                                        setSelectedAddons(prev =>
                                                            prev.includes(addon.id)
                                                                ? prev.filter(id => id !== addon.id)
                                                                : [...prev, addon.id]
                                                        );
                                                    }}
                                                    className="accent-gold w-4 h-4"
                                                />
                                                {IconComp && <IconComp className="w-4 h-4 text-gold" />}
                                                <span className="text-sm font-semibold text-textMain flex-1">{addon.label}</span>
                                                <span className="text-xs font-bold text-gold">₹{addon.price.toLocaleString()}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                            <button type="submit" className="btn-gold btn-icon booking-submit w-full mt-2 flex justify-center" style={{ width: '100%' }}>
                                <Anchor className="w-5 h-5" />
                                <span>Proceed to Checkout</span>
                            </button>
                        </form>
                    </aside>
                </div>
            </section>

            {/* Dynamic Yacht Image Gallery */}
            <section className="section-surface py-24 border-t border-black/5">
                <div className="mx-auto max-w-7xl px-6" data-reveal="true">
                    <div className="flex items-center justify-between gap-4 mb-10">
                        <h2 className="section-title no-divider text-left mb-0">Gallery</h2>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {(showAllGallery ? galleryImages : galleryImages.slice(0, 8)).map((src, idx) => (
                            <div key={idx} className="relative h-64 sm:h-80 block overflow-hidden rounded-2xl group cursor-pointer hover:shadow-xl transition-all" onClick={() => setMainImg(src)}>
                                <Image src={src} alt={`Yacht image ${idx + 1}`} fill className="object-cover transition-transform duration-700 group-hover:scale-105" unoptimized={src.toLowerCase().endsWith('.dng')} />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                            </div>
                        ))}
                    </div>

                    {galleryImages.length > 8 && (
                        <div className="mt-12 flex justify-center">
                            <button
                                onClick={() => setShowAllGallery(!showAllGallery)}
                                className="btn-gold rounded-full px-8"
                            >
                                {showAllGallery ? 'See Less' : 'See More Gallery'}
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Yacht Details Section */}
            {selectedYacht && (
                <section className="bg-white py-24">
                    <div className="mx-auto max-w-7xl px-6" data-reveal="true">
                        <div className="max-w-3xl mb-12">
                            <h2 className="section-title text-left no-divider">Yacht Overview</h2>
                            {selectedYacht.highlight && (
                                <p className="mt-4 text-lg text-gold font-medium">✨ {selectedYacht.highlight}</p>
                            )}
                        </div>

                        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                            {/* Route & Core Info */}
                            <div className="space-y-6">
                                {selectedYacht.route && (
                                    <div>
                                        <h3 className="flex items-center gap-2 font-bold text-[#10233D] mb-2"><Ship className="w-5 h-5 text-gold" /> Route & Itinerary</h3>
                                        <p className="text-sm text-[#4E5B6D] leading-relaxed">{selectedYacht.route}</p>
                                    </div>
                                )}
                                {selectedYacht.bestSuitedFor && (
                                    <div>
                                        <h3 className="flex items-center gap-2 font-bold text-[#10233D] mb-2"><PartyPopper className="w-5 h-5 text-gold" /> Best Suited For</h3>
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {selectedYacht.bestSuitedFor.map((item: string, i: number) => (
                                                <span key={i} className="px-3 py-1.5 bg-[#F4F7FB] text-xs font-semibold text-[#4E5B6D] rounded-lg">{item}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Features */}
                            {selectedYacht.features && (
                                <div>
                                    <h3 className="flex items-center gap-2 font-bold text-[#10233D] mb-4"><ShieldCheck className="w-5 h-5 text-gold" /> Key Features</h3>
                                    <ul className="space-y-3">
                                        {selectedYacht.features.map((feature: string, idx: number) => (
                                            <li key={idx} className="flex items-start gap-3 text-sm text-[#4E5B6D]">
                                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Inclusions & Food */}
                            <div className="space-y-6">
                                {selectedYacht.inclusions && (
                                    <div>
                                        <h3 className="flex items-center gap-2 font-bold text-[#10233D] mb-3"><Gift className="w-5 h-5 text-gold" /> Complimentary</h3>
                                        <p className="text-sm text-[#4E5B6D] leading-relaxed">{selectedYacht.inclusions.join(' • ')}</p>
                                    </div>
                                )}
                                {selectedYacht.foodOptions && (
                                    <div>
                                        <h3 className="flex items-center gap-2 font-bold text-[#10233D] mb-2"><Utensils className="w-5 h-5 text-gold" /> Food & Drinks</h3>
                                        <p className="text-sm text-[#4E5B6D] leading-relaxed">{selectedYacht.foodOptions}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            )}





            {/* What's Included */}
            <section className="bg-[#F4F7FB] py-24">
                <div className="mx-auto max-w-7xl px-6" data-reveal="true">
                    <h2 className="section-title">What's Included</h2>
                    <p className="section-subtitle">Everything you get with your yacht charter experience.</p>
                    <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                        <article className="feature-card">
                            <ShieldCheck className="w-8 h-8 text-gold mb-3" />
                            <h3>Safety Assured</h3>
                            <p>Certified crew, life jackets, safety gear, and compliant onboard protocols for a worry-free experience.</p>
                        </article>
                        <article className="feature-card">
                            <Gift className="w-8 h-8 text-gold mb-3" />
                            <h3>Complimentary Amenities</h3>
                            <p>{selectedYacht?.inclusions ? selectedYacht.inclusions.join(', ') : 'Ice, drinking water, soft drinks, music system, and cutlery included.'}</p>
                        </article>
                        <article className="feature-card">
                            <Clock3 className="w-8 h-8 text-gold mb-3" />
                            <h3>Flexible Duration</h3>
                            <p>{selectedYacht ? `${selectedYacht.duration} hours base cruise with optional extra hours available.` : 'Customizable cruise duration with extra hours available on request.'}</p>
                        </article>
                        <article className="feature-card">
                            <Utensils className="w-8 h-8 text-gold mb-3" />
                            <h3>Food & Drinks</h3>
                            <p>{selectedYacht?.foodOptions || 'Bring your own food and beverages. Premium dining setup available as add-on.'}</p>
                        </article>
                    </div>
                </div>
            </section>

            {/* Booking FAQs */}
            <section className="section-surface py-24">
                <div className="mx-auto max-w-4xl px-6" data-reveal="true">
                    <h2 className="section-title">Booking FAQs</h2>
                    <div className="mt-8 space-y-3" id="faq-list">
                        <article className="faq-item">
                            <button className="faq-trigger w-full text-left" aria-expanded={openFaq === 'faq1'} onClick={() => toggleFaq('faq1')}>
                                How much advance notice is required for booking?
                            </button>
                            <div className="faq-panel overflow-hidden transition-all duration-300" style={{ maxHeight: openFaq === 'faq1' ? '200px' : '0' }}>
                                <div className="pb-4">We recommend booking at least 48-72 hours in advance for preferred yachts and time slots.</div>
                            </div>
                        </article>
                        <article className="faq-item">
                            <button className="faq-trigger w-full text-left" aria-expanded={openFaq === 'faq2'} onClick={() => toggleFaq('faq2')}>
                                Can we modify guest count after booking?
                            </button>
                            <div className="faq-panel overflow-hidden transition-all duration-300" style={{ maxHeight: openFaq === 'faq2' ? '200px' : '0' }}>
                                <div className="pb-4">Yes, guest count can be adjusted based on yacht capacity and final confirmation cut-off time.</div>
                            </div>
                        </article>
                        <article className="faq-item">
                            <button className="faq-trigger w-full text-left" aria-expanded={openFaq === 'faq3'} onClick={() => toggleFaq('faq3')}>
                                Do you support custom occasions and decor?
                            </button>
                            <div className="faq-panel overflow-hidden transition-all duration-300" style={{ maxHeight: openFaq === 'faq3' ? '200px' : '0' }}>
                                <div className="pb-4">Absolutely. Share your occasion details and our team will tailor decor and onboard arrangements.</div>
                            </div>
                        </article>
                        <article className="faq-item">
                            <button className="faq-trigger w-full text-left" aria-expanded={openFaq === 'faq4'} onClick={() => toggleFaq('faq4')}>
                                What happens in case of weather disruption?
                            </button>
                            <div className="faq-panel overflow-hidden transition-all duration-300" style={{ maxHeight: openFaq === 'faq4' ? '200px' : '0' }}>
                                <div className="pb-4">Sailing depends on weather and port advisories. We offer rescheduling support for affected bookings.</div>
                            </div>
                        </article>
                    </div>
                </div>
            </section>
        </main>
    );
}

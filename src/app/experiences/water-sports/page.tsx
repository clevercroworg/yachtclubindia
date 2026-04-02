'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Anchor, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InstagramEmbed } from '@/components/ui/InstagramEmbed';
import { useRouter } from 'next/navigation';
import fleetData from '@/data/fleet.json';

const galleryImages = [
    { src: 'https://loremflickr.com/800/600/jetski?lock=1', alt: 'Jet Skiing' },
    { src: 'https://loremflickr.com/800/600/wakeboard?lock=1', alt: 'Wakeboarding' },
    { src: 'https://loremflickr.com/800/600/parasailing?lock=1', alt: 'Parasailing' },
    { src: 'https://loremflickr.com/800/600/snorkeling?lock=1', alt: 'Snorkeling' },
    { src: 'https://loremflickr.com/800/600/kayaking?lock=1', alt: 'Kayaking' },
    { src: 'https://loremflickr.com/800/600/surfing?lock=1', alt: 'Surfing' },
];

export default function WaterSportsPage() {
    const router = useRouter();
    const [ticketQuantities, setTicketQuantities] = useState<Record<string, number>>({});
    const [date, setDate] = useState('');
    const [minDate, setMinDate] = useState('');

    const waterSportsData = fleetData.find(y => y.id === 'water-sports-booking');

    useEffect(() => {
        const today = new Date();
        const localDateStr = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
        setMinDate(localDateStr);
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

        // Process Instagram embeds
        if (typeof window !== 'undefined' && (window as any).instgrm) {
            (window as any).instgrm.Embeds.process();
        }

        return () => io.disconnect();
    }, []);

    const handleCheckout = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!date) {
            alert('Please select a Date of Activity.');
            return;
        }

        const hasTickets = Object.values(ticketQuantities).some(qty => qty > 0);
        if (!hasTickets) {
            alert('Please select at least one package or ride.');
            return;
        }

        const encodedTickets = Object.entries(ticketQuantities)
            .filter(([_, qty]) => qty > 0)
            .map(([id, qty]) => `${id}:${qty}`)
            .join(',');

        const params = new URLSearchParams();
        params.set('yachtId', 'water-sports-booking');
        params.set('date', date);
        params.set('timeSlot', 'Flexible (9 AM - 5 PM)');
        params.set('tickets', encodedTickets);

        router.push(`/checkout?${params.toString()}`);
    };

    return (
        <main className="pt-24">
            <section className="occasion-page-hero relative overflow-hidden">
                <Image
                    src="/images/c5.jpg"
                    alt="Water Sports in Goa"
                    fill
                    sizes="100vw"
                    priority
                    className="occasion-page-hero-bg object-cover"
                />
                <div className="occasion-page-hero-overlay"></div>
                <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-28 lg:py-36" data-reveal="true">
                    <p className="experience-page-kicker">Signature Experience</p>
                    <h1 className="experience-page-title">Water Sports</h1>
                    <p className="experience-page-sub">
                        Add thrill to your charter with jet skis, kayaking, and more.
                    </p>
                    <div className="mt-8 flex items-center gap-4">
                        <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 font-medium tracking-wide">
                            Add-on Starting from ₹2,500
                        </span>
                    </div>
                </div>
            </section>

            {/* Live Booking Section */}
            <section className="bg-white py-24" id="book-now">
                <div className="mx-auto max-w-4xl px-6" data-reveal="true">
                    <h2 className="section-title text-left no-divider">Book Your Thrill</h2>
                    <p className="mt-4 text-[#4E5B6D]">Select your desired individual rides or money-saving combo packages below. All activities take place at Baina Beach under certified supervision.</p>
                    
                    <form className="mt-10" onSubmit={handleCheckout}>
                        <div className="mb-8 p-6 bg-[#F4F7FB] border border-black/5 rounded-2xl flex flex-col md:flex-row gap-6 md:items-center justify-between">
                            <div className="flex-1">
                                <label className="block text-sm font-semibold text-[#10233D] mb-2">Date of Activity</label>
                                <input type="date" min={minDate} value={date} onChange={(e) => setDate(e.target.value)} required className="w-full md:w-64 px-4 py-2.5 rounded-xl border border-black/10 text-sm focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50" />
                            </div>
                            <div className="text-sm text-[#4E5B6D] max-w-xs">
                                <strong>Operating Hours:</strong> <br/> 9:00 AM to 5:00 PM (Flexible entry on selected date).
                            </div>
                        </div>

                        <div className="space-y-3">
                            {waterSportsData?.packages?.map((pkg: any) => (
                                <div key={pkg.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-black/10 transition-colors hover:border-gold/40 hover:bg-gold/5">
                                    <div>
                                        <p className="font-bold text-[#10233D]">{pkg.label}</p>
                                        {pkg.description && <p className="text-xs text-[#4E5B6D] mt-1 pr-2">{pkg.description}</p>}
                                        <p className="text-sm text-gold font-semibold mt-1">₹{pkg.price.toLocaleString()} <span className="text-xs text-[#8a9bb0] font-normal">/ person or ride</span></p>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <button type="button" onClick={() => setTicketQuantities(prev => ({...prev, [pkg.id]: Math.max(0, (prev[pkg.id] || 0) - 1)}))} className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center hover:bg-black/5">-</button>
                                        <span className="w-6 text-center font-bold">{ticketQuantities[pkg.id] || 0}</span>
                                        <button type="button" onClick={() => setTicketQuantities(prev => ({...prev, [pkg.id]: (prev[pkg.id] || 0) + 1}))} className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center hover:bg-black/5">+</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 flex justify-end shrink-0">
                            <button type="submit" className="btn-gold px-12 py-3.5 rounded-full font-bold text-sm tracking-wide flex items-center gap-2">
                                <Anchor className="w-4 h-4" /> Proceed to Checkout
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            <section className="section-surface py-24">
                <div className="mx-auto max-w-7xl px-6" data-reveal="true">
                    <h2 className="section-title">Gallery</h2>
                    <p className="section-subtitle">A glimpse into the action-packed water sports moments we provide.</p>

                    <div className="occasion-gallery mt-12">
                        {galleryImages.map((img, idx) => (
                            <div key={idx} className="occasion-gallery-item">
                                <Image src={img.src} alt={img.alt} fill unoptimized={true} sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Reels Section */}
            <section className="bg-[#F4F7FB] py-24">
                <div className="mx-auto max-w-7xl px-6" data-reveal="true">
                    <h2 className="section-title">Reels</h2>
                    <p className="section-subtitle">Watch real water moments captured off our yachts.</p>

                    <div className="reels-grid mt-12">
                        {['DSjo5HTEwY7', 'DNVSbGsTMGl', 'DUDpRS1CLHa', 'DVsgxz4k6rX'].map((id) => (
                            <div key={id} className="reel-item">
                                <InstagramEmbed id={id} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Get in Touch CTA */}
            <section className="contact-cta-section py-24">
                <div className="mx-auto max-w-4xl px-6 text-center" data-reveal="true">
                    <h2 className="section-title text-white">Get in Touch</h2>
                    <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.7)' }}>Have questions or ready to add water sports to your charter? Reach out to us directly.</p>
                    <div className="contact-cta-actions mt-10">
                        <a href="tel:+918147331594" className="contact-cta-btn">
                            <Phone className="w-5 h-5" />
                            <span>+91 81473 31594</span>
                        </a>
                        <a href="https://wa.me/918147331594" className="contact-cta-btn whatsapp">
                            <MessageCircle className="w-5 h-5" />
                            <span>Chat on WhatsApp</span>
                        </a>
                    </div>
                </div>
            </section>

            <section className="luxe-cta-wrap">
                <div className="luxe-cta-box" data-reveal="true">
                    <div className="luxe-cta-inner">
                        <div className="luxe-cta-copy">
                            <p className="luxe-cta-kicker">Experience Enhancement</p>
                            <h3 className="luxe-cta-title">Add Thrill to Your Journey</h3>
                        </div>
                        <Button href="/fleet" variant="gold" icon={Anchor} className="luxe-cta-btn text-white" style={{ background: '#102A47', borderColor: 'rgba(9, 25, 45, 0.35)' }}>
                            Book a Yacht
                        </Button>
                    </div>
                </div>
            </section>
        </main>
    );
}








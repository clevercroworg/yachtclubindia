'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Anchor, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InstagramEmbed } from '@/components/ui/InstagramEmbed';

const galleryImages = [
    { src: '/images/yacht/nauti%20buoy/nauti-1.jpg', alt: 'Nauti Buoy 1' },
    { src: '/images/yacht/nauti%20buoy/nauti-2.jpg', alt: 'Nauti Buoy 2' },
    { src: '/images/yacht/nauti%20buoy/nauti-3.jpg', alt: 'Nauti Buoy 3' },
    { src: '/images/yacht/nauti%20buoy/nauti-4.jpg', alt: 'Nauti Buoy 4' },
    { src: '/images/yacht/nauti%20buoy/nauti-5.jpg', alt: 'Nauti Buoy 5' },
    { src: '/images/yacht/nauti%20buoy/nauti-6.jpg', alt: 'Nauti Buoy 6' },
    { src: '/images/yacht/nauti%20buoy/nauti-7.jpg', alt: 'Nauti Buoy 7' },
    { src: '/images/yacht/nauti%20buoy/nauti-8.jpg', alt: 'Nauti Buoy 8' },
    { src: '/images/yacht/nauti%20buoy/nauti-9.jpg', alt: 'Nauti Buoy 9' },
    { src: '/images/yacht/nauti%20buoy/nauti-10.jpg', alt: 'Nauti Buoy 10' },
    { src: '/images/yacht/nauti%20buoy/nauti-11.jpg', alt: 'Nauti Buoy 11' },
    { src: '/images/yacht/nauti%20buoy/nauti-12.jpg', alt: 'Nauti Buoy 12' },
    { src: '/images/yacht/rare%20catamaran/rare-cat-1.jpg', alt: 'Rare Catamaran 1' },
    { src: '/images/yacht/rare%20catamaran/rare-cat-2.jpg', alt: 'Rare Catamaran 2' },
    { src: '/images/yacht/rare%20catamaran/rare-cat-3.jpg', alt: 'Rare Catamaran 3' },
    { src: '/images/yacht/rare%20catamaran/rare-cat-4.jpg', alt: 'Rare Catamaran 4' },
    { src: '/images/yacht/rare%20catamaran/rare-cat-5.jpg', alt: 'Rare Catamaran 5' },
    { src: '/images/yacht/rare%20catamaran/rare-cat-6.jpg', alt: 'Rare Catamaran 6' },
    { src: '/images/yacht/rare%20catamaran/rare-cat-7.jpg', alt: 'Rare Catamaran 7' },
    { src: '/images/yacht/rare%20catamaran/rare-cat-8.jpg', alt: 'Rare Catamaran 8' },
    { src: '/images/yacht/rare%20catamaran/rare-cat-9.jpg', alt: 'Rare Catamaran 9' },
    { src: '/images/yacht/rare%20catamaran/rare-cat-10.jpg', alt: 'Rare Catamaran 10' }
];

export default function IslandAdventurePage() {
    const [showAllGallery, setShowAllGallery] = useState(false);
    useEffect(() => {
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

    return (
        <main className="pt-24">
            <section className="occasion-page-hero relative overflow-hidden">
                <Image
                    src="/images/c4.jpg"
                    alt="Island and Adventure Trips in South Goa"
                    fill
                    sizes="100vw"
                    priority
                    className="occasion-page-hero-bg object-cover"
                />
                <div className="occasion-page-hero-overlay"></div>
                <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-28 lg:py-36" data-reveal="true">
                    <p className="experience-page-kicker">Signature Experience</p>
                    <h1 className="experience-page-title">Island and Adventure Trips in South Goa</h1>
                    <p className="experience-page-sub">
                        Explore hidden shorelines and pristine island routes off the Goan coast.
                    </p>
                    <div className="mt-8 flex items-center gap-4">
                        <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 font-medium tracking-wide">
                            Starting from ₹15,000
                        </span>
                    </div>
                </div>
            </section>

            {/* Exclusive South Goa Fleet Section */}
            <section className="py-24 bg-white relative">
                <div className="mx-auto max-w-7xl px-6" data-reveal="true">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <p className="experience-page-kicker justify-center mb-4">Unique Vessels</p>
                        <h2 className="section-title">Exclusive South Goa Fleet</h2>
                        <p className="section-subtitle mt-4">
                            Specially curated vessels available exclusively for our South Goa island routes. These ships offer unmatched experiences outside our standard fleet.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* NAUTI BUOY */}
                        <div className="bg-[#F8FAFC] rounded-[2rem] overflow-hidden border border-[#E2E8F0] shadow-sm flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                            <div className="relative h-72 sm:h-80 w-full overflow-hidden">
                                <Image src="/images/yacht/nauti%20buoy/nauti-1.jpg" alt="NAUTI BUOY" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-transparent to-transparent"></div>
                                <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md text-[#0F172A] px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase shadow-sm">
                                    Exclusive Route
                                </div>
                                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                                    <h3 className="text-3xl font-display font-bold text-white tracking-tight">NAUTI BUOY</h3>
                                    <span className="bg-[#D4AF37] text-white px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide shadow-lg">
                                        ₹15,000 / 2 hrs
                                    </span>
                                </div>
                            </div>
                            <div className="p-8 sm:p-10 flex flex-col flex-grow relative">
                                <div className="flex flex-wrap gap-3 mb-6">
                                    <span className="inline-flex items-center gap-1.5 bg-[#E2E8F0] text-[#0F172A] px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                                        Max 12 Pax
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 bg-[#E2E8F0] text-[#0F172A] px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                                        Baina Beach
                                    </span>
                                </div>
                                
                                <div className="text-[#475569] space-y-4 text-sm/relaxed flex-grow">
                                    <p><strong className="text-[#0F172A]">Make waves with NAUTI BUOY.</strong> Say goodbye to long, crowded passenger boat rides. Discover scenic gems along the coast.</p>
                                    <p>Dive into crystal-clear waters - swimming or snorkeling, surrounded by vibrant marine life. Sip on your favorite drinks as you cruise past Bat Island, Grande Island, and finally St. Jorge Island—and don&apos;t miss the famous Shoe Rock along the way. Want to try your hand at fishing? Just let us know—we&apos;ll arrange it for you.</p>
                                </div>

                                <div className="mt-8 pt-6 border-t border-[#E2E8F0]">
                                    <h4 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider mb-4">Inclusions</h4>
                                    <ul className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm font-medium text-[#475569]">
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div>Ice & Water</li>
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div>Soft Drinks</li>
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div>Music System</li>
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div>Fishing</li>
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div>Snorkeling Gear</li>
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div>Swimming</li>
                                    </ul>
                                    <p className="mt-5 text-[0.7rem] text-[#64748B] italic leading-tight">
                                        * Don&apos;t forget to carry: Swimwear, sunscreen, and your sense of wonder! Additional food or beverages can be arranged at a nominal charge.
                                    </p>
                                </div>
                                
                                <div className="mt-8 pt-2">
                                    <Button href="/booking?yachtId=nauti-buoy" variant="gold" className="w-full justify-center group-hover:bg-[#C5A028] transition-colors">
                                        Book NAUTI BUOY <Anchor className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* RARE CATAMARAN */}
                        <div className="bg-[#F8FAFC] rounded-[2rem] overflow-hidden border border-[#E2E8F0] shadow-sm flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                            <div className="relative h-72 sm:h-80 w-full overflow-hidden">
                                <Image src="/images/yacht/rare%20catamaran/rare-cat-1.jpg" alt="Rare Catamaran" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-transparent to-transparent"></div>
                                <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md text-[#0F172A] px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase shadow-sm">
                                    Rare Fleet
                                </div>
                                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                                    <h3 className="text-3xl font-display font-bold text-white tracking-tight">Rare Catamaran</h3>
                                    <span className="bg-[#D4AF37] text-white px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide shadow-lg">
                                        ₹20,000 / 2 hrs
                                    </span>
                                </div>
                            </div>
                            <div className="p-8 sm:p-10 flex flex-col flex-grow relative">
                                <div className="flex flex-wrap gap-3 mb-6">
                                    <span className="inline-flex items-center gap-1.5 bg-[#E2E8F0] text-[#0F172A] px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                                        Max 17 Pax
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 bg-[#E2E8F0] text-[#0F172A] px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                                        South Goa Route
                                    </span>
                                </div>
                                
                                <div className="text-[#475569] space-y-4 text-sm/relaxed flex-grow">
                                    <p><strong className="text-[#0F172A]">Adventure trips in South Goa.</strong> Set sail on our unique catamaran layout designed specifically for adventure trips in South Goa, blending comfort with scenic adventure on the coastline.</p>
                                    <p>Enjoy unmatched stability while slicing through the waves and taking in panoramic ocean views that only a multi-hull design can provide. Perfect for larger groups wanting extra lounging space.</p>
                                </div>

                                <div className="mt-8 pt-6 border-t border-[#E2E8F0]">
                                    <h4 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider mb-4">Inclusions</h4>
                                    <ul className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm font-medium text-[#475569]">
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div>Ice & Water</li>
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div>Soft Drinks</li>
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div>Music System</li>
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div>Swimming</li>
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div>Snorkeling</li>
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div>Fishing</li>
                                    </ul>
                                </div>
                                
                                <div className="mt-8 pt-2">
                                    <Button href="/booking?yachtId=rare-catamaran" variant="gold" className="w-full justify-center group-hover:bg-[#C5A028] transition-colors">
                                        Book Rare Catamaran <Anchor className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section-surface py-24">
                <div className="mx-auto max-w-7xl px-6" data-reveal="true">
                    <h2 className="section-title">Gallery</h2>
                    <p className="section-subtitle">A glimpse into the unforgettable island adventures we&apos;ve helped create at sea.</p>

                    <div className="occasion-gallery mt-12">
                        {(showAllGallery ? galleryImages : galleryImages.slice(0, 6)).map((img, idx) => (
                            <div key={idx} className="occasion-gallery-item">
                                <Image src={img.src} alt={img.alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                            </div>
                        ))}
                    </div>
                    {galleryImages.length > 6 && (
                        <div className="mt-12 text-center">
                            <Button 
                                onClick={() => setShowAllGallery(!showAllGallery)} 
                                variant="outline" 
                                className="border-[#0F172A] text-[#0F172A] hover:bg-[#0F172A] hover:text-white transition-colors"
                            >
                                {showAllGallery ? 'Show Less' : 'See More Moments'}
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* Reels Section */}
            <section className="bg-[#F4F7FB] py-24">
                <div className="mx-auto max-w-7xl px-6" data-reveal="true">
                    <h2 className="section-title">Reels</h2>
                    <p className="section-subtitle">Watch real adventure moments captured on our yachts.</p>

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
                    <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.7)' }}>Have questions or ready to plan your island adventure? Reach out to us directly.</p>
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
                            <p className="luxe-cta-kicker">Adventure Planning</p>
                            <h3 className="luxe-cta-title">Reserve Your Island Trip Date</h3>
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









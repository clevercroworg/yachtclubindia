'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { Anchor, Phone, MessageCircle, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InstagramEmbed } from '@/components/ui/InstagramEmbed';

const galleryImages = [
    { src: '/images/yacht/leopard/leopard-1.jpg', alt: 'Leopard Yacht Birthday' },
    { src: '/images/yacht/leopard/leopard-2.jpg', alt: 'Leopard Yacht Birthday 2' },
    { src: '/images/yacht/leopard/leopard-3.jpg', alt: 'Leopard Yacht Birthday 3' },
    { src: '/images/yacht/leopard/leopard-4.jpg', alt: 'Leopard Yacht Birthday 4' },
    { src: '/images/yacht/leopard/leopard-5.jpg', alt: 'Leopard Yacht Birthday 5' },
    { src: '/images/yacht/leopard/leopard-6.jpg', alt: 'Leopard Yacht Birthday 6' },
];

export default function BirthdaysPage() {
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
                    src="/images/s2.jpg"
                    alt="Birthday yacht celebration"
                    fill
                    sizes="100vw"
                    priority
                    className="occasion-page-hero-bg object-cover"
                />
                <div className="occasion-page-hero-overlay"></div>
                <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-28 lg:py-36" data-reveal="true">
                    <p className="experience-page-kicker">Occasion Collection</p>
                    <h1 className="experience-page-title">Birthday Experiences</h1>
                    <p className="experience-page-sub">
                        Mark milestones with sea-view celebrations, curated music, and premium party-ready setup onboard.
                    </p>
                </div>
            </section>

            <section className="section-surface py-24">
                <div className="mx-auto max-w-7xl px-6" data-reveal="true">
                    <h2 className="section-title">Gallery</h2>
                    <p className="section-subtitle">Celebrations that set the bar — birthday moments crafted on deck with unforgettable views.</p>

                    <div className="occasion-gallery mt-12">
                        {galleryImages.map((img, idx) => (
                            <div key={idx} className="occasion-gallery-item">
                                <Image src={img.src} alt={img.alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Reels Section */}
            <section className="bg-[#F4F7FB] py-24">
                <div className="mx-auto max-w-7xl px-6" data-reveal="true">
                    <h2 className="section-title">Reels</h2>
                    <p className="section-subtitle">Watch real birthday celebration moments from our yacht charters.</p>

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
                    <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.7)' }}>Have questions or ready to plan your birthday at sea? Reach out to us directly.</p>
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
                            <p className="luxe-cta-kicker">Birthday Concierge</p>
                            <h3 className="luxe-cta-title">Plan Your Celebration on the Sea</h3>
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








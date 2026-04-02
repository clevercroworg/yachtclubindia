'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Anchor, Compass, ShieldCheck, Sparkles, Clock3, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import experiencesData from '@/data/experiences.json';

export default function ExperiencesPage() {
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
        return () => io.disconnect();
    }, []);

    return (
        <main className="pt-24">
            {/* Hero Section */}
            <section className="experience-page-hero relative overflow-hidden">
                <Image
                    src="/images/c8.jpg"
                    alt="Luxury yacht experience in Goa"
                    fill
                    sizes="100vw"
                    priority
                    className="experience-page-hero-bg object-cover"
                />
                <div className="experience-page-hero-overlay"></div>
                <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-28 lg:py-36" data-reveal="true">
                    <p className="experience-page-kicker">Signature Experiences</p>
                    <h1 className="experience-page-title">Curated Yacht Moments for Every Kind of Celebration</h1>
                    <p className="experience-page-sub">
                        From private escapes to iconic celebrations, every route, setup, and onboard touchpoint is tailored for a premium Goa-at-sea experience.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-4">
                        <Button href="/fleet" variant="gold" icon={Anchor}>Book Experience</Button>
                        <Button href="#experiences-grid" variant="outline" icon={Compass}>Explore Experiences</Button>
                    </div>
                </div>
            </section>

            {/* Experiences Grid */}
            <section id="experiences-grid" className="section-surface py-24">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="mb-12" data-reveal="true">
                        <h2 className="section-title">Signature Settings</h2>
                        <p className="section-subtitle">From dreamy escapes to corporate excellence — explore our curated yacht experiences designed for life&apos;s finest moments.</p>
                    </div>

                    <div className="experience-grid" data-reveal="true">
                        {experiencesData.map((exp, idx) => (
                            <article key={exp.id} className={`experience-card ${idx === 0 ? 'featured' : ''}`}>
                                <div className="experience-card-media">
                                    <Image src={exp.image} alt={exp.title} fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover" />
                                </div>
                                <div className="experience-card-body">
                                    {idx === 0 && <p className="experience-card-label">Most Popular</p>}
                                    <h3>{exp.title}</h3>
                                    <p>{exp.description}</p>
                                    <div className="experience-card-meta">
                                        <Link href={`/experiences/${exp.slug}`} className="occasion-card-link">
                                            <span>View More</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Highlights */}
            <section className="bg-[#F4F7FB] py-24">
                <div className="mx-auto max-w-7xl px-6" data-reveal="true">
                    <div className="experience-highlights flex-wrap gap-8 md:grid md:grid-cols-3">
                        <article className="highlight-item flex-1">
                            <ShieldCheck className="w-8 h-8 text-gold mb-4" />
                            <h3>Safety & Professional Crew</h3>
                            <p>Licensed operations with experienced crew and protocol-led guest handling.</p>
                        </article>
                        <article className="highlight-item flex-1">
                            <Sparkles className="w-8 h-8 text-gold mb-4" />
                            <h3>Bespoke Setup Options</h3>
                            <p>Tailored decor, dining, music, and occasion planning for every charter style.</p>
                        </article>
                        <article className="highlight-item flex-1">
                            <Clock3 className="w-8 h-8 text-gold mb-4" />
                            <h3>Flexible Charter Slots</h3>
                            <p>Morning, sunset, and evening windows with custom duration on request.</p>
                        </article>
                    </div>
                </div>
            </section>

            {/* Luxe CTA */}
            <section className="luxe-cta-wrap">
                <div className="luxe-cta-box" data-reveal="true">
                    <div className="luxe-cta-inner">
                        <div className="luxe-cta-copy">
                            <p className="luxe-cta-kicker">Ready to Sail</p>
                            <h3 className="luxe-cta-title">Reserve Your Preferred Experience Today</h3>
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

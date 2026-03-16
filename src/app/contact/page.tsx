'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Anchor, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionTitle } from '@/components/ui/SectionTitle';

export default function ContactPage() {
    const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus('sending');
        // Simulate form submission
        setTimeout(() => {
            setFormStatus('sent');
            setTimeout(() => setFormStatus('idle'), 3000);
        }, 1500);
    };

    return (
        <main className="pt-24">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-24 lg:py-32 bg-[#06121F]">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/c8.jpg"
                        alt="Coastal background"
                        fill
                        className="object-cover opacity-30"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#06121F]/80 via-[#06121F]/60 to-[#06121F]"></div>
                </div>

                <div className="relative z-10 mx-auto max-w-7xl px-6" data-reveal="true">
                    <div className="max-w-3xl">
                        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-gold">Get in Touch</p>
                        <h1 className="font-heading text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
                            Connect with the Sea
                        </h1>
                        <p className="mt-6 text-lg text-[#D6DEE8]">
                            Have questions about our fleet or special occasions? Our concierge team is ready to help you craft the perfect sea experience.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Content Section */}
            <section className="bg-white py-24">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="grid gap-16 lg:grid-cols-2">
                        {/* Contact Form side */}
                        <div data-reveal="true">
                            <h2 className="font-heading text-3xl text-[#06121F]">Send us a Message</h2>
                            <p className="mt-4 text-[#4A5568]">Fill out the form below and we'll get back to you within 24 hours.</p>

                            <form onSubmit={handleSubmit} className="mt-10 space-y-6">
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-medium text-[#06121F]">Full Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            required
                                            className="w-full rounded-lg border border-black/10 bg-[#F8FAFC] px-4 py-3 outline-none transition-all focus:border-gold/50 focus:ring-2 focus:ring-gold/5"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-medium text-[#06121F]">Email Address</label>
                                        <input
                                            type="email"
                                            id="email"
                                            required
                                            className="w-full rounded-lg border border-black/10 bg-[#F8FAFC] px-4 py-3 outline-none transition-all focus:border-gold/50 focus:ring-2 focus:ring-gold/5"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="phone" className="text-sm font-medium text-[#06121F]">Phone Number</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        required
                                        className="w-full rounded-lg border border-black/10 bg-[#F8FAFC] px-4 py-3 outline-none transition-all focus:border-gold/50 focus:ring-2 focus:ring-gold/5"
                                        placeholder="+91 00000 00000"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-medium text-[#06121F]">Your Message</label>
                                    <textarea
                                        id="message"
                                        rows={5}
                                        required
                                        className="w-full rounded-lg border border-black/10 bg-[#F8FAFC] px-4 py-3 outline-none transition-all focus:border-gold/50 focus:ring-2 focus:ring-gold/5 resize-none"
                                        placeholder="Tell us about your planned event or enquiry..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={formStatus !== 'idle'}
                                    className={`flex w-full items-center justify-center gap-2 rounded-lg bg-[#06121F] px-8 py-4 font-semibold text-white transition-all hover:bg-[#0A1F33] disabled:opacity-70`}
                                >
                                    {formStatus === 'idle' && (
                                        <>
                                            <Send className="w-5 h-5" />
                                            <span>Send Enquiry</span>
                                        </>
                                    )}
                                    {formStatus === 'sending' && <span>Sending...</span>}
                                    {formStatus === 'sent' && <span>Enquiry Sent Successfully!</span>}
                                </button>
                            </form>
                        </div>

                        {/* Contact Info & Map side */}
                        <div className="space-y-12" data-reveal="true">
                            <div>
                                <h3 className="font-heading text-2xl text-[#06121F]">Contact Details</h3>
                                <div className="mt-8 space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold">
                                            <Phone className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-[#06121F]">Call Us</p>
                                            <a href="tel:+918147331594" className="mt-1 block text-[#4A5568] hover:text-gold transition-colors">+91 81473 31594</a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold">
                                            <MessageCircle className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-[#06121F]">WhatsApp</p>
                                            <a href="https://wa.me/918147331594" target="_blank" rel="noopener noreferrer" className="mt-1 block text-[#4A5568] hover:text-gold transition-colors">Chat on WhatsApp</a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold">
                                            <Mail className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-[#06121F]">Email Us</p>
                                            <a href="mailto:hello@yachtclubindia.com" className="mt-1 block text-[#4A5568] hover:text-gold transition-colors">hello@yachtclubindia.com</a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-black/5">
                                <h3 className="font-heading text-2xl text-[#06121F]">Our Location</h3>
                                <div className="mt-6 space-y-4">
                                    <div className="flex items-start gap-4 text-[#4A5568]">
                                        <MapPin className="w-5 h-5 shrink-0 text-gold mt-1" />
                                        <div>
                                            <p className="font-semibold text-[#06121F]">Boarding Point:</p>
                                            <p>Brittona Jetty, Panjim, Goa</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 text-[#4A5568]">
                                        <Clock className="w-5 h-5 shrink-0 text-gold mt-1" />
                                        <div>
                                            <p className="font-semibold text-[#06121F]">Operating Hours:</p>
                                            <p>Mon - Sun: 07:00 AM - 10:00 PM</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 overflow-hidden rounded-2xl border border-black/5 shadow-sm">
                                    <iframe
                                        title="Yacht Club India boarding point map"
                                        src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d15379.524304324936!2d73.81148447611676!3d15.490827737741519!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sBrittona%20Jetty%2C%20Panjim!5e0!3m2!1sen!2sin!4v1771985595168!5m2!1sen!2sin"
                                        width="100%"
                                        height="300"
                                        style={{ border: 0 }}
                                        allowFullScreen={true}
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

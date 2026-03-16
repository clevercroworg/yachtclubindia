'use client';

import Link from 'next/link';
import { Sparkles, Ship, CalendarDays, Instagram, MessageCircle, Facebook, Youtube } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Footer() {
    const pathname = usePathname();

    if (pathname.startsWith('/admin')) {
        return null;
    }

    return (
        <footer className="footer-dark border-t border-white/12 py-16">
            <div className="footer-divider mx-auto mb-10 h-px w-full max-w-7xl"></div>
            <div className="footer-grid mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-3">
                <div>
                    <h4 className="footer-title">Yacht Club India</h4>
                    <p className="mt-1 max-w-sm text-sm text-textMuted">Private luxury charters designed for memorable sea experiences in Goa.</p>
                    <p className="mt-3 max-w-sm text-sm text-textMuted">From intimate sunset sails to bespoke celebration cruises, every charter is curated with premium hospitality and seamless concierge support.</p>
                    <p className="mt-3 text-xs tracking-[0.12em] uppercase text-gold/80">Luxury Private Charters • Goa</p>
                </div>
                <div>
                    <h4 className="footer-title">For Bookings</h4>
                    <p className="footer-copy">+91 81473 31594</p>
                    <p className="footer-copy">hello@yachtclubindia.com</p>
                    <p className="footer-copy">Brittona Jetty, Panjim, Goa</p>
                </div>
                <div>
                    <h4 className="footer-title">Quick Links</h4>
                    <div className="grid gap-2 text-sm text-textMuted">
                        <Link href="/experiences" className="footer-link inline-flex items-center gap-2"><Sparkles className="w-3.5 h-3.5" /><span>Experiences</span></Link>
                        <Link href="/fleet" className="footer-link inline-flex items-center gap-2"><Ship className="w-3.5 h-3.5" /><span>Fleet</span></Link>
                        {/* <Link href="/occasions/weddings" className="footer-link inline-flex items-center gap-2"><CalendarDays className="w-3.5 h-3.5" /><span>Occasions</span></Link> */}
                        <a href="https://www.instagram.com/yachtclubindia_?igsh=MXhqemkzeWk5OXRkNA%3D%3D" target="_blank" rel="noopener noreferrer" className="footer-link inline-flex items-center gap-2"><Instagram className="w-3.5 h-3.5" /><span>Instagram</span></a>
                        <a href="https://wa.me/918147331594" target="_blank" rel="noopener noreferrer" className="footer-link inline-flex items-center gap-2"><MessageCircle className="w-3.5 h-3.5" /><span>WhatsApp</span></a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom mx-auto mt-10 max-w-7xl border-t border-white/12 px-6 pt-6 text-xs text-textMuted">
                <p>© {new Date().getFullYear()} Yacht Club India. All rights reserved.</p>
                <div className="footer-social flex items-center gap-3">
                    <a href="https://www.instagram.com/yachtclubindia_?igsh=MXhqemkzeWk5OXRkNA%3D%3D" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram"><Instagram /></a>
                    <a href="#" className="social-link" aria-label="Facebook"><Facebook /></a>
                    <a href="#" className="social-link" aria-label="YouTube"><Youtube /></a>
                </div>
            </div>
        </footer>
    );
}

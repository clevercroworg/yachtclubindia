'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Anchor, MessageCircle, ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';
import experiencesData from '@/data/experiences.json';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isOccasionsOpen, setIsOccasionsOpen] = useState(false);

    const pathname = usePathname();
    const isHomePage = pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 24);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleOccasions = () => {
        setIsOccasionsOpen(!isOccasionsOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
        setIsOccasionsOpen(false);
    };

    const headerClasses = `fixed top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'header-scrolled' : ''} ${!isHomePage && !isScrolled ? 'force-dark-text' : ''}`;

    // Determine which logo to show
    // Homepage hero has dark bg → needs light logo; everywhere else (scrolled / inner pages) has white bg → needs dark logo
    const hasDarkBg = isHomePage && !isScrolled;
    const logoSrc = hasDarkBg ? '/images/logo-light-highres.png' : '/images/logo-dark-highres.png';

    if (pathname.startsWith('/admin')) {
        return null;
    }

    return (
        <header id="site-header" className={headerClasses}>
            <div className="header-wrap mx-auto max-w-7xl px-6 transition-all duration-300">
                <nav className="flex h-20 items-center justify-between" aria-label="Primary">
                    <Link href="/" className="inline-flex items-center gap-3" onClick={closeMenu}>
                        <Image src={logoSrc} alt="Yacht Club India" width={140} height={40} className="h-10 w-auto object-contain" priority />
                    </Link>

                    <ul className="hidden items-center gap-8 lg:flex">
                        <li><Link className="nav-link is-active" href="/">Home</Link></li>
                        <li className="relative group">
                            <button className="nav-link nav-trigger" aria-haspopup="true">
                                <span>Experiences</span>
                                <ChevronDown />
                            </button>
                            <div className="dropdown-panel absolute left-0 top-9 hidden min-w-52 rounded-xl border border-black/10 bg-white/95 p-2 shadow-lg backdrop-blur-sm group-hover:block group-focus-within:block">
                                <Link href="/experiences" className="dropdown-item font-medium">All Experiences</Link>
                                <div className="my-1 h-px bg-black/8"></div>
                                <p className="px-2 pt-1 pb-1 text-[0.68rem] uppercase tracking-[0.14em] text-[#8a9bb0]">Signature Settings</p>
                                {experiencesData.map(exp => (
                                    <Link key={exp.id} href={`/experiences/${exp.slug}`} className="dropdown-item">
                                        {exp.title}
                                    </Link>
                                ))}
                            </div>
                        </li>
                        <li><Link className="nav-link" href="/fleet">Fleet</Link></li>
                        <li><Link className="nav-link" href="/contact">Contact</Link></li>
                    </ul>

                    <div className="hidden items-center gap-3 lg:flex">
                        <Link href="/fleet" className="btn-gold btn-icon"><Anchor /><span>Book Now</span></Link>
                        <a href="https://wa.me/918147331594" target="_blank" rel="noopener noreferrer" className="btn-outline btn-icon"><MessageCircle /><span>Chat with us</span></a>
                    </div>

                    <div className="flex items-center gap-2 lg:hidden">
                        <Link href="/fleet" className="mobile-quick-btn book" aria-label="Book Now">
                            <Anchor />
                            <span>Book Now</span>
                        </Link>
                        <button
                            id="menu-toggle"
                            className="inline-flex items-center rounded-lg border border-white/25 p-2 text-white"
                            aria-expanded={isMenuOpen}
                            aria-controls="mobile-menu"
                            aria-label="Toggle menu"
                            onClick={toggleMenu}
                        >
                            <span className="text-lg">☰</span>
                        </button>
                    </div>
                </nav>

                {/* Mobile Menu */}
                <div id="mobile-menu" className={`mobile-menu lg:hidden ${isMenuOpen ? 'is-open' : ''}`} hidden={!isMenuOpen}>
                    <div className="mobile-menu-panel rounded-2xl border border-black/10 bg-white/95 p-5">
                        <p className="mobile-menu-label">Navigation</p>
                        <Link className="mobile-link" href="/" onClick={closeMenu}>Home</Link>
                        <div className="mobile-dropdown">
                            <button
                                className="mobile-link mobile-drop-trigger"
                                type="button"
                                aria-expanded={isOccasionsOpen}
                                aria-controls="mobile-exp-list"
                                onClick={toggleOccasions}
                            >
                                <span>Experiences</span>
                                <ChevronDown />
                            </button>
                            <div id="mobile-exp-list" className="mobile-drop-list" hidden={!isOccasionsOpen}>
                                <Link href="/experiences" className="mobile-sub-link font-medium" onClick={closeMenu}>All Experiences</Link>
                                <div className="my-2" />
                                <p className="text-xs uppercase tracking-wider text-gray-500 mb-2 pl-3">Signature Settings</p>
                                {experiencesData.map(exp => (
                                    <Link key={exp.id} href={`/experiences/${exp.slug}`} className="mobile-sub-link" onClick={closeMenu}>
                                        {exp.title}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <Link className="mobile-link" href="/fleet" onClick={closeMenu}>Fleet</Link>
                        <Link className="mobile-link" href="/contact" onClick={closeMenu}>Contact</Link>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <Link href="/fleet" className="btn-gold btn-icon text-center" onClick={closeMenu}><Anchor /><span>Book Now</span></Link>
                            <a href="https://wa.me/918147331594" target="_blank" rel="noopener noreferrer" className="btn-outline btn-icon text-center"><MessageCircle /><span>Chat</span></a>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

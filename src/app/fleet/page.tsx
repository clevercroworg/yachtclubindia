'use client';

import { useEffect } from 'react';
import { RotateCcw, Search } from 'lucide-react';
import { FleetCard } from '@/components/ui/FleetCard';
import fleetData from '@/data/fleet.json';

export default function FleetPage() {
    useEffect(() => {
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
        return () => io.disconnect();
    }, []);

    return (
        <main className="pt-32">
            <section className="section-surface py-16">
                <div className="mx-auto max-w-7xl px-6" data-reveal="true">
                    <h1 className="section-title no-divider text-left">Our Fleet</h1>
                    <p className="section-subtitle ml-0 mr-0 text-left">
                        Discover available yachts, compare options, and shortlist the right charter for your plan.
                    </p>

                    <form className="fleet-search-panel mt-10" aria-label="Fleet search form">
                        <div className="fleet-search-grid">
                            <label className="fleet-search-field">
                                <span>Yacht Name</span>
                                <input type="text" placeholder="Search yacht" />
                            </label>
                            <label className="fleet-search-field">
                                <span>Capacity</span>
                                <select>
                                    <option>Any</option>
                                    <option>Up to 8 guests</option>
                                    <option>Up to 12 guests</option>
                                    <option>Up to 20 guests</option>
                                    <option>20+ guests</option>
                                </select>
                            </label>
                            <label className="fleet-search-field">
                                <span>Price Range</span>
                                <select>
                                    <option>Any</option>
                                    <option>₹ Low to Mid</option>
                                    <option>₹₹ Mid to Premium</option>
                                    <option>₹₹₹ Premium</option>
                                </select>
                            </label>
                            <label className="fleet-search-field">
                                <span>Duration</span>
                                <select>
                                    <option>Any</option>
                                    <option>2 Hours</option>
                                    <option>3 Hours</option>
                                    <option>4+ Hours</option>
                                    <option>Sunset Slot</option>
                                    <option>Custom Duration</option>
                                </select>
                            </label>
                            <label className="fleet-search-field">
                                <span>Type</span>
                                <select>
                                    <option>Any</option>
                                    <option>Private Charter</option>
                                    <option>Premium Cruiser</option>
                                    <option>Celebration Yacht</option>
                                    <option>Corporate Hosting</option>
                                </select>
                            </label>
                            <label className="fleet-search-field">
                                <span>Sort</span>
                                <select>
                                    <option>Featured</option>
                                    <option>Price: Low to High</option>
                                    <option>Price: High to Low</option>
                                    <option>Capacity</option>
                                    <option>Newest</option>
                                </select>
                            </label>
                        </div>
                        <div className="mt-5 flex flex-wrap justify-end gap-3">
                            <button className="btn-outline btn-icon" type="reset">
                                <RotateCcw className="w-[15px] h-[15px]" />
                                <span>Reset</span>
                            </button>
                            <button className="btn-gold btn-icon" type="button">
                                <Search className="w-[15px] h-[15px]" />
                                <span>Search Fleet</span>
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            <section className="bg-[#F4F7FB] pb-24">
                <div className="mx-auto max-w-7xl px-6" data-reveal="true">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {fleetData.map((yacht) => (
                            <FleetCard key={yacht.id} {...yacht} tag={yacht.tag as any} />
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}

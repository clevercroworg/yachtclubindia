'use client';

import { useEffect, useState, useMemo } from 'react';
import { RotateCcw, Search } from 'lucide-react';
import { FleetCard } from '@/components/ui/FleetCard';
import fleetData from '@/data/fleet.json';

export default function FleetPage() {
    const [filters, setFilters] = useState({
        name: '',
        capacity: 'Any',
        price: 'Any',
        duration: 'Any',
        type: 'Any',
        sort: 'Featured'
    });

    const [fleetsState, setFleetsState] = useState<any[]>(fleetData as any[]);

    useEffect(() => {
        fetch('/api/fleets')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.fleets) {
                    setFleetsState(data.fleets);
                }
            })
            .catch(err => console.error("Failed to fetch dynamic fleets:", err));
    }, []);


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

    const filteredFleet = useMemo(() => {
        let result = fleetsState.filter(yacht => !yacht.isExclusive);

        // 1. Filter by Name
        if (filters.name.trim()) {
            const term = filters.name.toLowerCase();
            result = result.filter(yacht => yacht.title.toLowerCase().includes(term));
        }

        // 2. Filter by Capacity
        if (filters.capacity !== 'Any') {
            result = result.filter(yacht => {
                const cap = parseInt(yacht.capacity, 10) || 0;
                switch (filters.capacity) {
                    case 'Up to 8 guests': return cap <= 8;
                    case 'Up to 12 guests': return cap <= 12;
                    case 'Up to 20 guests': return cap <= 20;
                    case '20+ guests': return cap > 20;
                    default: return true;
                }
            });
        }

        // 3. Filter by Price Range (using pricePerHour or parsing price string)
        if (filters.price !== 'Any') {
            result = result.filter(yacht => {
                // Approximate prices based on actual dataset values
                const priceMatch = yacht.price.replace(/[^0-9]/g, '');
                const priceValue = parseInt(priceMatch, 10) || 0;
                
                switch (filters.price) {
                    case '₹ Low to Mid': return priceValue < 20000;
                    case '₹₹ Mid to Premium': return priceValue >= 20000 && priceValue <= 30000;
                    case '₹₹₹ Premium': return priceValue > 30000;
                    default: return true;
                }
            });
        }

        // 4. Filter by Duration (simplified since sample data is mostly '2' hours)
        if (filters.duration !== 'Any') {
            result = result.filter(yacht => {
                const dur = parseInt(yacht.duration, 10) || 0;
                switch (filters.duration) {
                    case '2 Hours': return dur === 2;
                    case '3 Hours': return dur === 3;
                    case '4+ Hours': return dur >= 4;
                    // Custom matches would need more context, but returning true as fallback for now
                    default: return true; 
                }
            });
        }

        // 5. Filter by Type (searching within bestSuitedFor or features)
        if (filters.type !== 'Any') {
             result = result.filter(yacht => {
                 const searchSpace = [...(yacht.bestSuitedFor || []), ...(yacht.features || [])].join(' ').toLowerCase();
                 const typeLower = filters.type.toLowerCase();
                 
                 // Approximate matching based on available keywords in sample data
                 if (typeLower.includes('private')) return true; // All are basically private
                 if (typeLower.includes('premium') || typeLower.includes('celebration')) {
                     return searchSpace.includes('party') || searchSpace.includes('celebration') || yacht.pricePerHour > 10000;
                 }
                 if (typeLower.includes('corporate')) return parseInt(yacht.capacity) >= 15;
                 
                 return searchSpace.includes(typeLower);
             });
        }

        // 6. Sort Results
        result.sort((a, b) => {
            const priceA = parseInt(a.price.replace(/[^0-9]/g, '')) || 0;
            const priceB = parseInt(b.price.replace(/[^0-9]/g, '')) || 0;
            const capA = parseInt(a.capacity, 10) || 0;
            const capB = parseInt(b.capacity, 10) || 0;

            switch (filters.sort) {
                case 'Price: Low to High': return priceA - priceB;
                case 'Price: High to Low': return priceB - priceA;
                case 'Capacity': return capB - capA; // Highest capacity first
                case 'Newest': return (b.tag?.type === 'new' ? 1 : 0) - (a.tag?.type === 'new' ? 1 : 0);
                case 'Featured':
                default:
                    // Puts 'featured' tag first
                    return (b.tag?.type === 'featured' ? 1 : 0) - (a.tag?.type === 'featured' ? 1 : 0);
            }
        });

        return result;
    }, [filters]);

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return (
        <main className="pt-32">
            <section className="section-surface py-16">
                <div className="mx-auto max-w-7xl px-6" data-reveal="true">
                    <h1 className="section-title no-divider text-left">Our Fleet</h1>
                    <p className="section-subtitle ml-0 mr-0 text-left">
                        Discover available yachts, compare options, and shortlist the right charter for your plan.
                    </p>

                    <form 
                        className="fleet-search-panel mt-10" 
                        aria-label="Fleet search form"
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <div className="fleet-search-grid">
                            <label className="fleet-search-field">
                                <span>Yacht Name</span>
                                <input 
                                    type="text" 
                                    placeholder="Search yacht" 
                                    value={filters.name}
                                    onChange={(e) => handleFilterChange('name', e.target.value)}
                                />
                            </label>
                            <label className="fleet-search-field">
                                <span>Capacity</span>
                                <select 
                                    value={filters.capacity}
                                    onChange={(e) => handleFilterChange('capacity', e.target.value)}
                                >
                                    <option>Any</option>
                                    <option>Up to 8 guests</option>
                                    <option>Up to 12 guests</option>
                                    <option>Up to 20 guests</option>
                                    <option>20+ guests</option>
                                </select>
                            </label>
                            <label className="fleet-search-field">
                                <span>Price Range</span>
                                <select 
                                    value={filters.price}
                                    onChange={(e) => handleFilterChange('price', e.target.value)}
                                >
                                    <option>Any</option>
                                    <option>₹ Low to Mid</option>
                                    <option>₹₹ Mid to Premium</option>
                                    <option>₹₹₹ Premium</option>
                                </select>
                            </label>
                            <label className="fleet-search-field">
                                <span>Duration</span>
                                <select 
                                    value={filters.duration}
                                    onChange={(e) => handleFilterChange('duration', e.target.value)}
                                >
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
                                <select 
                                    value={filters.type}
                                    onChange={(e) => handleFilterChange('type', e.target.value)}
                                >
                                    <option>Any</option>
                                    <option>Private Charter</option>
                                    <option>Premium Cruiser</option>
                                    <option>Celebration Yacht</option>
                                    <option>Corporate Hosting</option>
                                </select>
                            </label>
                            <label className="fleet-search-field">
                                <span>Sort</span>
                                <select 
                                    value={filters.sort}
                                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                                >
                                    <option>Featured</option>
                                    <option>Price: Low to High</option>
                                    <option>Price: High to Low</option>
                                    <option>Capacity</option>
                                    <option>Newest</option>
                                </select>
                            </label>
                        </div>
                        <div className="mt-5 flex flex-wrap justify-end gap-3">
                            <button 
                                className="btn-outline btn-icon" 
                                type="reset"
                                onClick={() => setFilters({
                                    name: '',
                                    capacity: 'Any',
                                    price: 'Any',
                                    duration: 'Any',
                                    type: 'Any',
                                    sort: 'Featured'
                                })}
                            >
                                <RotateCcw className="w-[15px] h-[15px]" />
                                <span>Reset</span>
                            </button>
                            <button className="btn-gold btn-icon" type="submit">
                                <Search className="w-[15px] h-[15px]" />
                                <span>Search Fleet</span>
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            <section className="bg-[#F4F7FB] pb-24">
                <div className="mx-auto max-w-7xl px-6" data-reveal="true">
                    {filteredFleet.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredFleet.map((yacht) => (
                                <FleetCard key={yacht.id} {...yacht} tag={yacht.tag as any} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center">
                            <h3 className="text-xl font-medium text-[#0b2038] mb-2">No yachts found</h3>
                            <p className="text-[#647C9A]">Try adjusting your filters to find available options.</p>
                            <button 
                                className="mt-6 text-[#bd9b5b] font-medium hover:text-[#0b2038] transition-colors"
                                onClick={() => setFilters({
                                    name: '',
                                    capacity: 'Any',
                                    price: 'Any',
                                    duration: 'Any',
                                    type: 'Any',
                                    sort: 'Featured'
                                })}
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}

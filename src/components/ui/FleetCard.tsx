import React from 'react';
import Image from 'next/image';
import { Anchor } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FleetCardProps {
    id: string;
    title: string;
    image: string;
    capacity: string;
    duration: string;
    price: string;
    tag?: {
        type: 'new' | 'featured' | 'best';
        label: string;
    };
}

export function FleetCard({ id, title, image, capacity, duration, price, tag }: FleetCardProps) {
    return (
        <article className="fleet-card">
            <div className="fleet-head">
                <h3 className="fleet-title">{title}</h3>
                {tag && (
                    <span className={`fleet-tag ${tag.type}`}>
                        {tag.label}
                    </span>
                )}
            </div>
            <div className="image-ph h-44 fleet-image relative">
                <Image src={image} alt={title} fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover" style={{ objectPosition: id === 'princessa-dinner-cruise' ? 'top' : 'center' }} />
            </div>
            <div className="mt-3 flex gap-2 text-xs">
                <span className="badge">Up to {capacity} guests</span>
                <span className="badge">{duration} hrs</span>
            </div>
            <div className="fleet-meta-row mt-3">
                <p className="card-meta">Starting from {price}</p>
                <Button href={`/booking?yachtId=${id}`} variant="gold" className="fleet-book-btn" icon={Anchor}>
                    Book Now
                </Button>
            </div>
        </article>
    );
}

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface ExperienceGridCardProps {
    title: string;
    description: string;
    price: string;
    image: string;
    featured?: boolean;
    label?: string;
}

export function ExperienceGridCard({ title, description, price, image, featured, label }: ExperienceGridCardProps) {
    return (
        <article className={`experience-card ${featured ? 'featured' : ''}`}>
            <div className="experience-card-media">
                <Image src={image} alt={title} fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover" />
            </div>
            <div className="experience-card-body">
                {label && <p className="experience-card-label">{label}</p>}
                <h3>{title}</h3>
                <p>{description}</p>
                <div className="experience-card-meta">
                    <span>{price}</span>
                    <Link href="/booking" className="enquire-chip btn-icon">
                        <span>Enquire</span>
                        <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </article>
    );
}

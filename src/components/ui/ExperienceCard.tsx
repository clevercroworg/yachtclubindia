import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ExperienceCardProps {
    title: string;
    description: string;
    price?: string;
    image: string;
    slug?: string;
}

export function ExperienceCard({ title, description, image, slug }: ExperienceCardProps) {
    const innerContent = (
        <>
            <div className="image-ph exp-image relative mb-4 flex-shrink-0">
                <Image src={image} alt={title} fill sizes="(max-width: 768px) 100vw, 300px" className="object-cover" />
            </div>
            <h3 className="card-title font-heading text-lg mb-2 flex-shrink-0">{title}</h3>
            <p className="card-copy text-sm text-gray-600 mb-4 flex-grow">{description}</p>
            {slug && (
                <div className="mt-auto pt-4 border-t border-gray-100 uppercase text-gold text-xs tracking-wider flex items-center gap-1 font-medium flex-shrink-0">
                    Explore Experience <span>&rarr;</span>
                </div>
            )}
        </>
    );

    const classes = `exp-card flex flex-col ${slug ? 'hover:opacity-90 transition-opacity' : ''}`;

    if (slug) {
        return <Link href={`/experiences/${slug}`} className={classes}>{innerContent}</Link>;
    }

    return <article className={classes}>{innerContent}</article>;
}

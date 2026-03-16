import React from 'react';
import Image from 'next/image';

interface ExperienceCardProps {
    title: string;
    description: string;
    price?: string;
    image: string;
}

export function ExperienceCard({ title, description, image }: ExperienceCardProps) {
    return (
        <article className="exp-card">
            <div className="image-ph exp-image">
                <Image src={image} alt={title} fill sizes="(max-width: 768px) 100vw, 300px" />
            </div>
            <h3 className="card-title">{title}</h3>
            <p className="card-copy">{description}</p>
        </article>
    );
}

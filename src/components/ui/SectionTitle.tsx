import React from 'react';

interface SectionTitleProps {
    title: string;
    subtitle?: string;
    noDivider?: boolean;
    align?: 'center' | 'left';
    className?: string;
}

export function SectionTitle({ title, subtitle, noDivider = false, align = 'center', className = '' }: SectionTitleProps) {
    return (
        <div className={`mb-10 ${align === 'center' ? 'text-center' : 'text-left'} ${className}`} data-reveal="true">
            <h2 className={`section-title ${noDivider ? 'no-divider' : ''}`}>
                {title}
            </h2>
            {subtitle && (
                <p className={`section-subtitle mt-4 ${align === 'left' ? 'ml-0 mr-0 max-w-[36rem]' : ''}`}>
                    {subtitle}
                </p>
            )}
        </div>
    );
}

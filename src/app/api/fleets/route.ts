import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import fleetData from '@/data/fleet.json'; // Fallback import

export async function GET(request: Request) {
    try {
        // We will try grabbing from database first
        let fleets = [];
        try {
            fleets = await prisma.fleet.findMany();

            // Parse json fields
            fleets = fleets.map(f => ({
                ...f,
                images: f.images ? JSON.parse(f.images as string) : [],
                features: f.features ? JSON.parse(f.features as string) : [],
                inclusions: f.inclusions ? JSON.parse(f.inclusions as string) : [],
                bestSuitedFor: f.bestSuitedFor ? JSON.parse(f.bestSuitedFor as string) : [],
                tag: f.tag ? JSON.parse(f.tag as string) : null,
                packages: f.packages ? JSON.parse(f.packages as string) : null,
            }));
        } catch (dbErr) {
            console.log("Database not ready or Fleet schema missing. Falling back to JSON.");
            fleets = [];
        }
        
        // If the database has 0 fleets or isn't connected properly yet, fallback to local JSON.
        // This ensures the local experience works flawlessly before pushing to Vercel and running /api/fleets/seed
        if (fleets.length === 0) {
            console.log("Falling back to local fleet.json due to empty database");
            fleets = [...fleetData];
        }

        return NextResponse.json({ success: true, fleets }, { status: 200 });
    } catch (err: any) {
        console.error('Server error handling fleet GET:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Expect parsed body params
        const {
            fleet_id, title, pricingType, image, images, capacity,
            duration, timing, price, pricePerHour, series, route,
            features, inclusions, foodOptions, bestSuitedFor,
            highlight, tag, isExclusive, packages
        } = body;

        if (!title || !image) {
            return NextResponse.json({ error: 'Title and Main Image are required.' }, { status: 400 });
        }

        const newFleet = await prisma.fleet.create({
            data: {
                fleet_id: fleet_id || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'), // Generate ID if absent
                title,
                isExclusive: isExclusive || false,
                pricingType: pricingType || 'hourly',
                image,
                images: images ? JSON.stringify(images) : null,
                capacity: capacity?.toString() || '0',
                duration: duration?.toString() || '0',
                timing: timing || null,
                price: price || '0',
                pricePerHour: parseInt(pricePerHour) || 0,
                series: series || null,
                route: route || null,
                features: features ? JSON.stringify(features) : null,
                inclusions: inclusions ? JSON.stringify(inclusions) : null,
                foodOptions: foodOptions || null,
                bestSuitedFor: bestSuitedFor ? JSON.stringify(bestSuitedFor) : null,
                highlight: highlight || null,
                tag: tag ? JSON.stringify(tag) : null,
                packages: packages ? JSON.stringify(packages) : null,
            }
        });

        return NextResponse.json({ success: true, newFleet }, { status: 201 });
    } catch (err: any) {
        console.error('Server error handling fleet POST:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const body = await request.json();
        const { ids } = body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ error: 'Missing or invalid ids array.' }, { status: 400 });
        }

        const result = await prisma.fleet.deleteMany({
            where: {
                id: {
                    in: ids
                }
            }
        });

        return NextResponse.json({ success: true, count: result.count }, { status: 200 });
    } catch (err: any) {
        console.error('Server error handling fleet DELETE:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();

        const {
            id, fleet_id, title, pricingType, image, images, capacity,
            duration, timing, price, pricePerHour, series, route,
            features, inclusions, foodOptions, bestSuitedFor,
            highlight, tag, isExclusive, packages
        } = body;

        if (!id) {
            return NextResponse.json({ error: 'Fleet ID is required for update.' }, { status: 400 });
        }

        const updatedFleet = await prisma.fleet.update({
            where: { id },
            data: {
                fleet_id: fleet_id || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                title,
                isExclusive: isExclusive || false,
                pricingType: pricingType || 'hourly',
                image,
                images: images ? JSON.stringify(images) : null,
                capacity: capacity?.toString() || '0',
                duration: duration?.toString() || '0',
                timing: timing || null,
                price: price || '0',
                pricePerHour: parseInt(pricePerHour) || 0,
                series: series || null,
                route: route || null,
                features: features ? JSON.stringify(features) : null,
                inclusions: inclusions ? JSON.stringify(inclusions) : null,
                foodOptions: foodOptions || null,
                bestSuitedFor: bestSuitedFor ? JSON.stringify(bestSuitedFor) : null,
                highlight: highlight || null,
                tag: tag ? JSON.stringify(tag) : null,
                packages: packages ? JSON.stringify(packages) : null,
            }
        });

        return NextResponse.json({ success: true, updatedFleet }, { status: 200 });
    } catch (err: any) {
        console.error('Server error handling fleet PUT:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import fleetData from '@/data/fleet.json';

export async function GET() {
    try {
        // Count existing fleets to avoid duplicating
        const existingCount = await prisma.fleet.count();
        if (existingCount > 0) {
            return NextResponse.json({ 
                message: "Fleets already seeded. Cannot run seed again.", 
                count: existingCount 
            }, { status: 400 });
        }

        const fleetsToSeed = fleetData.map((f: any) => ({
            fleet_id: f.id,
            isExclusive: f.isExclusive || false,
            title: f.title,
            pricingType: f.pricingType || "hourly",
            image: f.image,
            images: f.images ? JSON.stringify(f.images) : null,
            capacity: f.capacity?.toString() || "N/A",
            duration: f.duration?.toString() || "Flexible",
            timing: f.timing || null,
            price: f.price?.toString() || "Custom",
            pricePerHour: f.pricePerHour || 0,
            series: f.series || null,
            route: f.route || null,
            features: f.features ? JSON.stringify(f.features) : null,
            inclusions: f.inclusions ? JSON.stringify(f.inclusions) : null,
            foodOptions: f.foodOptions || null,
            bestSuitedFor: f.bestSuitedFor ? JSON.stringify(f.bestSuitedFor) : null,
            highlight: f.highlight || null,
            tag: f.tag ? JSON.stringify(f.tag) : null,
            packages: f.packages ? JSON.stringify(f.packages) : null,
        }));

        // Use Prisma transaction/createMany to push all at once
        const result = await prisma.fleet.createMany({
            data: fleetsToSeed,
            skipDuplicates: true,
        });

        return NextResponse.json({ 
            success: true, 
            message: `Successfully seeded ${result.count} fleets locally.` 
        }, { status: 200 });

    } catch (err: any) {
        console.error('Failed to seed fleets:', err);
        return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
    }
}

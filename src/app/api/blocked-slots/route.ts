import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const fleetId = searchParams.get('fleetId');
        const date = searchParams.get('date');

        const where: any = {};
        if (fleetId) where.fleet_id = fleetId;
        if (date) where.date = date;

        const blockedSlots = await prisma.blockedSlot.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ success: true, blockedSlots }, { status: 200 });
    } catch (err: any) {
        console.error('Error fetching blocked slots:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { fleet_id, date, time_slot, reason } = body;

        if (!fleet_id || !date || !time_slot) {
            return NextResponse.json({ error: 'fleet_id, date, and time_slot are required.' }, { status: 400 });
        }

        // Check if already blocked
        const existing = await prisma.blockedSlot.findUnique({
            where: {
                fleet_id_date_time_slot: { fleet_id, date, time_slot }
            }
        });

        if (existing) {
            return NextResponse.json({ error: 'This slot is already blocked.' }, { status: 409 });
        }

        const blockedSlot = await prisma.blockedSlot.create({
            data: {
                fleet_id,
                date,
                time_slot,
                reason: reason || null,
            }
        });

        return NextResponse.json({ success: true, blockedSlot }, { status: 201 });
    } catch (err: any) {
        console.error('Error creating blocked slot:', err);
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

        const result = await prisma.blockedSlot.deleteMany({
            where: {
                id: { in: ids }
            }
        });

        return NextResponse.json({ success: true, count: result.count }, { status: 200 });
    } catch (err: any) {
        console.error('Error deleting blocked slots:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

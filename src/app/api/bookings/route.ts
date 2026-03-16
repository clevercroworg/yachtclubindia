import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Ensure we have a payload to work with
        if (!body || !body.customer) {
            return NextResponse.json({ error: 'Invalid booking payload provided.' }, { status: 400 });
        }

        const {
            yacht,
            yachtId,
            date,
            timeSlot,
            guests,
            extraHours,
            addons,
            hours,
            charterCost,
            addonsCost,
            quantity,
            subtotal,
            customer,
        } = body;
        const payment = body.payment ?? {};
        const amountInPaise = body.amountInPaise ?? Math.round((subtotal || 0) * 100);

        const booking = await prisma.booking.create({
            data: {
                yacht_title: yacht,
                yacht_id: yachtId,
                booking_date: date,
                time_slot: timeSlot,
                guests: parseInt(guests) || 0,
                extra_hours: extraHours || 0,
                addons: addons || [],
                total_hours: hours,
                charter_cost: charterCost,
                addons_cost: addonsCost,
                quantity: quantity || 1,
                subtotal: subtotal,
                customer_first_name: customer.firstName,
                customer_last_name: customer.lastName,
                customer_email: customer.email,
                customer_phone: customer.phone,
                customer_company: customer.company || '',
                status: 'booked', // default status
                amount_in_paise: amountInPaise,
                razorpay_order_id: payment.razorpay_order_id ?? null,
                razorpay_payment_id: payment.razorpay_payment_id ?? null,
                razorpay_signature: payment.razorpay_signature ?? null,
                payment_status: payment.paymentStatus ?? 'pending',
            }
        });

        return NextResponse.json({ success: true, booking }, { status: 201 });
    } catch (err: any) {
        console.error('Server error handling booking POST:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const bookings = await prisma.booking.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({ success: true, bookings }, { status: 200 });
    } catch (err: any) {
        console.error('Server error handling booking GET:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, status } = body;

        if (!id || !status) {
            return NextResponse.json({ error: 'Missing id or status.' }, { status: 400 });
        }

        const booking = await prisma.booking.update({
            where: { id },
            data: { status }
        });

        return NextResponse.json({ success: true, booking }, { status: 200 });

    } catch (err: any) {
        console.error('Server error handling booking PATCH:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

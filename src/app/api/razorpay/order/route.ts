import { NextResponse } from 'next/server';
import razorpay from '@/lib/razorpay';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const amount = Number(body?.amount);

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount passed for Razorpay order.' }, { status: 400 });
    }

    const options = {
      amount: Math.round(amount),
      currency: 'INR',
      receipt: `yacht-${Date.now()}`,
      payment_capture: 1,
      notes: {
        yacht: body?.yacht || 'Yacht Club India charter',
      },
    };

    console.log('[razorpay/order] Creating order with options:', options);


    const order = await razorpay.orders.create(options);

    const keyId = process.env.RAZORPAY_KEY_ID;

    if (!keyId) {
      throw new Error('RAZORPAY_KEY_ID environment variable is required.');
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      key: keyId,
    });
  } catch (error: any) {
    console.error('Razorpay order creation failed:', error);
    return NextResponse.json({ error: 'Failed to create Razorpay order.' }, { status: 500 });
  }
}

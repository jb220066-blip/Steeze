import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, customerEmail, items, totalAmount, paypalOrderId } = body;

    if (!customerName || !customerEmail || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate order ID locally (no database needed on Vercel)
    const orderId = 'STZ-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();

    // Log order details for the store owner to process
    console.log('New order received:', { orderId, customerName, customerEmail, paypalOrderId, items, totalAmount });

    return NextResponse.json({ success: true, orderId }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

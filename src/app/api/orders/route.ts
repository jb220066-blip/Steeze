import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      shippingCity,
      shippingZip,
      shippingCountry,
      shippingMethod,
      paymentMethod,
      paypalOrderId,
      items,
      totalAmount,
    } = body;

    // Validate required fields
    if (!customerName || !customerEmail || !customerPhone ||
        !shippingAddress || !shippingCity || !shippingZip ||
        !shippingMethod || !paymentMethod || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate payment method
    if (!['swish', 'paypal'].includes(paymentMethod)) {
      return NextResponse.json(
        { error: 'Invalid payment method. Must be swish or paypal.' },
        { status: 400 }
      );
    }

    // If PayPal, verify we have a PayPal order ID
    if (paymentMethod === 'paypal' && !paypalOrderId) {
      return NextResponse.json(
        { error: 'PayPal order ID is required for PayPal payments.' },
        { status: 400 }
      );
    }

    // Validate shipping method
    if (!['standard', 'express'].includes(shippingMethod)) {
      return NextResponse.json(
        { error: 'Invalid shipping method. Must be standard or express.' },
        { status: 400 }
      );
    }

    // Create order with items
    const order = await db.order.create({
      data: {
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        shippingCity,
        shippingZip,
        shippingCountry: shippingCountry || 'Sweden',
        shippingMethod,
        paymentMethod,
        paypalOrderId: paypalOrderId || null,
        totalAmount,
        status: 'paid',
        items: {
          create: items.map((item: {
            productId: string;
            productName: string;
            size: string;
            color: string;
            quantity: number;
            price: number;
          }) => ({
            productId: item.productId,
            productName: item.productName,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ success: true, orderId: order.id }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

/**
 * POST /api/payments/verify
 * Verify a payment and create a download record
 * 
 * Request body:
 * - userId: string (email or ID)
 * - paperId: string
 * - amount: number (UGX)
 * - currency: string (UGX)
 * - paymentMethod: 'mtn' | 'airtel'
 * - referenceCode: string (optional - if provided, verify existing payment)
 */

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(auth);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { paperId, amount, currency, paymentMethod, referenceCode } = body;

    // Validation
    if (!paperId || !amount || !currency || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (amount !== 200 || currency !== 'UGX') {
      return NextResponse.json(
        { error: 'Invalid payment amount or currency' },
        { status: 400 }
      );
    }

    if (!['mtn', 'airtel'].includes(paymentMethod)) {
      return NextResponse.json(
        { error: 'Invalid payment method' },
        { status: 400 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify paper exists
    const paper = await prisma.paper.findUnique({
      where: { id: paperId },
    });

    if (!paper) {
      return NextResponse.json(
        { error: 'Paper not found' },
        { status: 404 }
      );
    }

    // Generate unique reference code if not provided
    const finalReferenceCode = referenceCode || generateReferenceCode();

    // Check if payment already exists with this reference code
    if (referenceCode) {
      const existingPayment = await prisma.payment.findUnique({
        where: { referenceCode: referenceCode },
      });

      if (!existingPayment) {
        return NextResponse.json(
          {
            error: 'Payment reference not found. Please verify you sent the correct amount to the phone number provided.',
          },
          { status: 404 }
        );
      }

      if (existingPayment.status === 'VERIFIED') {
        return NextResponse.json(
          {
            error: 'This payment has already been verified',
            referenceCode: existingPayment.referenceCode,
          },
          { status: 400 }
        );
      }

      if (existingPayment.status === 'FAILED') {
        return NextResponse.json(
          {
            error: 'This payment failed. Please try again with a new transfer',
          },
          { status: 400 }
        );
      }
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        userId: user.id,
        amount,
        currency,
        paymentMethod,
        referenceCode: finalReferenceCode,
        status: 'PENDING', // In production, this would be verified by payment provider
      },
    });

    // In a real implementation, you would:
    // 1. Call the MTN or Airtel API to verify the payment
    // 2. Check if the payment was actually received
    // 3. Update the payment status accordingly
    
    // For demo, mark as verified after 2 seconds (simulating API call)
    if (Math.random() > 0.1) { // 90% success rate for demo
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await prisma.payment.update({
        where: { id: payment.id },
        data: { 
          status: 'VERIFIED',
          verifiedAt: new Date(),
        },
      });

      // Create download record
      const clientIp = request.headers.get('x-forwarded-for') || 
                       request.headers.get('x-real-ip') || 
                       'unknown';
      const userAgent = request.headers.get('user-agent') || 'unknown';

      const download = await prisma.download.create({
        data: {
          userId: user.id,
          paperId: paper.id,
          ipAddress: clientIp,
          userAgent,
          paymentId: payment.id,
        },
      });

      // Increment paper views
      await prisma.paper.update({
        where: { id: paper.id },
        data: { views: { increment: 1 } },
      });

      // Create notification for user
      await prisma.notification.create({
        data: {
          userId: user.id,
          title: 'Payment Verified',
          message: `Your payment for ${paper.courseName} has been verified. You can now download the paper.`,
          type: 'PAYMENT',
          relatedId: download.id,
        },
      });

      // Log audit
      await prisma.auditLog.create({
        data: {
          action: 'PAYMENT_VERIFIED',
          entity: 'Payment',
          entityId: payment.id,
          userId: user.id,
          ipAddress: clientIp,
          userAgent,
          oldValues: { status: 'PENDING' },
          newValues: { status: 'VERIFIED' },
        },
      });

      return NextResponse.json(
        {
          success: true,
          message: 'Payment verified successfully',
          payment: {
            id: payment.id,
            referenceCode: payment.referenceCode,
            amount: payment.amount,
            status: 'VERIFIED',
          },
          download: {
            id: download.id,
            paperId: paper.id,
            downloadedAt: download.createdAt,
          },
        },
        { status: 200 }
      );
    } else {
      // Simulate failed verification
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED' },
      });

      return NextResponse.json(
        {
          error: 'Payment verification failed. The payment could not be confirmed. Please try again or contact support.',
          referenceCode: payment.referenceCode,
        },
        { status: 402 }
      );
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error during payment verification' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/payments/verify?referenceCode=XXX
 * Check payment status
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(auth);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const referenceCode = request.nextUrl.searchParams.get('referenceCode');
    if (!referenceCode) {
      return NextResponse.json(
        { error: 'Reference code required' },
        { status: 400 }
      );
    }

    const payment = await prisma.payment.findUnique({
      where: { referenceCode },
      include: {
        downloads: true,
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Verify this payment belongs to the logged-in user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (payment.userId !== user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        payment: {
          id: payment.id,
          referenceCode: payment.referenceCode,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
          paymentMethod: payment.paymentMethod,
          verifiedAt: payment.verifiedAt,
          createdAt: payment.createdAt,
        },
        downloads: payment.downloads.map((d) => ({
          id: d.id,
          paperId: d.paperId,
          createdAt: d.createdAt,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Payment check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Helper function to generate unique reference code
 * Format: UNIPAST-YYYYMMDD-XXXXX (e.g., UNIPAST-20240815-A7B9C2)
 */
function generateReferenceCode(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const randomStr = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `UNIPAST-${dateStr}-${randomStr}`;
}

/**
 * API Response Examples:
 * 
 * SUCCESS (200):
 * {
 *   "success": true,
 *   "message": "Payment verified successfully",
 *   "payment": {
 *     "id": "clv123...",
 *     "referenceCode": "UNIPAST-20240815-A7B9C2",
 *     "amount": 200,
 *     "status": "VERIFIED"
 *   },
 *   "download": {
 *     "id": "clv456...",
 *     "paperId": "clv789...",
 *     "downloadedAt": "2024-08-15T10:30:00Z"
 *   }
 * }
 * 
 * ERROR - Missing fields (400):
 * {
 *   "error": "Missing required fields"
 * }
 * 
 * ERROR - Invalid reference (404):
 * {
 *   "error": "Payment reference not found. Please verify you sent the correct amount to the phone number provided.",
 *   "referenceCode": "UNIPAST-20240815-A7B9C2"
 * }
 * 
 * ERROR - Already verified (400):
 * {
 *   "error": "This payment has already been verified",
 *   "referenceCode": "UNIPAST-20240815-A7B9C2"
 * }
 * 
 * ERROR - Unauthorized (401):
 * {
 *   "error": "Unauthorized - Please sign in"
 * }
 */

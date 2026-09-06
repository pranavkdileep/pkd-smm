import {NextRequest, NextResponse} from 'next/server';
import {getCurrentUser} from '@/actions/auth/session';
import {verifyAndProcessDeposit} from '@/lib/payments';

/**
 * GET /api/payments/status?deposit_id=...&session_id=...&payment_id=...
 *
 * Checks payment status with Dodo Payments API, finalizes the deposit
 * and credits the user balance if succeeded, without relying on webhooks.
 */
export async function GET(request: NextRequest) {
  const {searchParams} = request.nextUrl;
  const depositId = searchParams.get('deposit_id');
  const sessionId = searchParams.get('session_id');
  const paymentId = searchParams.get('payment_id');

  if (!depositId && !sessionId && !paymentId) {
    return NextResponse.json(
      {
        success: false,
        error: 'Please provide deposit_id, session_id, or payment_id to check status.',
      },
      {status: 400}
    );
  }

  // If a session exists, enforce ownership
  const user = await getCurrentUser();

  const result = await verifyAndProcessDeposit({
    depositId,
    sessionId,
    paymentId,
    expectedUserId: user ? user.id : undefined,
  });

  return NextResponse.json(
    {
      success: result.success,
      status: result.status,
      depositId: result.deposit?.id ?? depositId,
      amount: result.amount ?? result.deposit?.amount,
      currency: result.currency ?? result.deposit?.currency,
      transactionId: result.transactionId ?? result.deposit?.transactionId,
      gatewayTransactionId: result.deposit?.gatewayTransactionId,
      alreadyProcessed: result.alreadyProcessed,
      createdAt: result.deposit?.createdAt,
      completedAt: result.deposit?.completedAt,
      error: result.error,
      message: result.message,
    },
    {status: result.status === 'not_found' ? 404 : 200}
  );
}

/**
 * POST /api/payments/status
 *
 * JSON body: { depositId?: string, sessionId?: string, paymentId?: string }
 */
interface StatusRequestBody {
  depositId?: string;
  deposit_id?: string;
  sessionId?: string;
  session_id?: string;
  paymentId?: string;
  payment_id?: string;
}

export async function POST(request: NextRequest) {
  let body: StatusRequestBody = {};
  try {
    body = (await request.json()) as StatusRequestBody;
  } catch {
    return NextResponse.json(
      {success: false, error: 'Invalid JSON body.'},
      {status: 400}
    );
  }

  const depositId = body.depositId || body.deposit_id;
  const sessionId = body.sessionId || body.session_id;
  const paymentId = body.paymentId || body.payment_id;

  if (!depositId && !sessionId && !paymentId) {
    return NextResponse.json(
      {
        success: false,
        error: 'Please provide depositId, sessionId, or paymentId in request body.',
      },
      {status: 400}
    );
  }

  const user = await getCurrentUser();

  const result = await verifyAndProcessDeposit({
    depositId,
    sessionId,
    paymentId,
    expectedUserId: user ? user.id : undefined,
  });

  return NextResponse.json(
    {
      success: result.success,
      status: result.status,
      depositId: result.deposit?.id ?? depositId,
      amount: result.amount ?? result.deposit?.amount,
      currency: result.currency ?? result.deposit?.currency,
      transactionId: result.transactionId ?? result.deposit?.transactionId,
      gatewayTransactionId: result.deposit?.gatewayTransactionId,
      alreadyProcessed: result.alreadyProcessed,
      createdAt: result.deposit?.createdAt,
      completedAt: result.deposit?.completedAt,
      error: result.error,
      message: result.message,
    },
    {status: result.status === 'not_found' ? 404 : 200}
  );
}

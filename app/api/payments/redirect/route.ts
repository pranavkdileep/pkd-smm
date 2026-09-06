import {NextRequest, NextResponse} from 'next/server';
import {verifyAndProcessDeposit} from '@/lib/payments';

/**
 * Handles the redirect return from Dodo Payments after user checkout.
 * Verifies payment status directly with Dodo Payments API (not trusting query params),
 * updates database, credits user balance, and redirects the user to /user/add-funds.
 */
export async function GET(request: NextRequest) {
  const {searchParams} = request.nextUrl;
  const depositId = searchParams.get('deposit_id');
  const sessionId = searchParams.get('session_id');
  const paymentId = searchParams.get('payment_id');

  // Verify against Dodo Payments API and update database
  const result = await verifyAndProcessDeposit({
    depositId,
    sessionId,
    paymentId,
  });

  const acceptHeader = request.headers.get('accept') || '';
  if (acceptHeader.includes('application/json')) {
    return NextResponse.json(result, {status: result.success ? 200 : 400});
  }

  // Redirect browser to Add Funds page with status feedback
  const targetUrl = new URL('/user/add-funds', request.url);

  if (result.success && result.status === 'completed') {
    targetUrl.searchParams.set('payment', 'success');
    if (result.deposit?.id) {
      targetUrl.searchParams.set('deposit_id', result.deposit.id);
    }
    if (result.amount) {
      targetUrl.searchParams.set('amount', result.amount.toString());
    }
    if (result.alreadyProcessed) {
      targetUrl.searchParams.set('already_credited', '1');
    }
  } else if (result.status === 'cancelled') {
    targetUrl.searchParams.set('payment', 'cancelled');
  } else if (result.status === 'failed') {
    targetUrl.searchParams.set('payment', 'failed');
    if (result.error) {
      targetUrl.searchParams.set('error', result.error);
    }
  } else {
    targetUrl.searchParams.set('payment', 'pending');
    if (result.deposit?.id) {
      targetUrl.searchParams.set('deposit_id', result.deposit.id);
    }
  }

  return NextResponse.redirect(targetUrl);
}

import DodoPayments from 'dodopayments';

/**
 * Returns a configured instance of the DodoPayments SDK client.
 */
export function getDodoPaymentsClient(): DodoPayments {
  const apiKey = process.env.DODO_PAYMENTS_API_KEY;
  if (!apiKey) {
    throw new Error('DODO_PAYMENTS_API_KEY is not configured in environment variables');
  }

  const environment = (process.env.DODO_PAYMENTS_ENVIRONMENT as 'live_mode' | 'test_mode') || 'live_mode';

  return new DodoPayments({
    bearerToken: apiKey,
    environment,
  });
}

/**
 * Returns the default product ID for dynamic deposits in Dodo Payments.
 * Should point to a Pay-What-You-Want product in the merchant dashboard.
 */
export function getDefaultProductId(): string {
  return process.env.DODO_PAYMENTS_PRODUCT_ID || 'pdt_pPiLDyez8FmSVX7IEfUEG';
}

/**
 * Returns the default currency code for deposits.
 */
export function getDefaultCurrency(): string {
  return process.env.DODO_PAYMENTS_CURRENCY || 'INR';
}

/**
 * Resolves the base URL of the application for callbacks and redirects.
 */
export function getAppBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/+$/, '');
  }
  if (process.env.APP_URL) {
    return process.env.APP_URL.replace(/\/+$/, '');
  }
  return 'http://localhost:3000';
}

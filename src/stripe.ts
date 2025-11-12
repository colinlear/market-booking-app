import { getFunctions, httpsCallable } from "firebase/functions";

export interface StripeAccountResponse {
  account: string;
}

export const stripeAccountSetup = async () => {
  const functions = getFunctions();
  const stripeAccount = httpsCallable<never, StripeAccountResponse>(
    functions,
    "stripeAccount"
  );
  const result = await stripeAccount();
  return result.data.account;
};

export interface StripeStatusRequest {
  account: string;
}

export interface StripeStatusResponse {
  account: string;
  name: string;
  status: string;
  payments: boolean;
}

export const stripeAccountStatus = async (account: string) => {
  const functions = getFunctions();
  const stripeStatus = httpsCallable<StripeStatusRequest, StripeStatusResponse>(
    functions,
    "stripeStatus"
  );
  const result = await stripeStatus({ account });
  console.debug("Account", result.data);
  return result.data;
};

export interface StripeConnectRequest {
  marketCode: string;
  account: string;
}

export interface StripeConnectResponse {
  url: string;
  error: string;
}

export const stripeConnectSetup = async (
  marketCode: string,
  account: string
) => {
  const functions = getFunctions();

  const stripeConnect = httpsCallable<
    StripeConnectRequest,
    StripeConnectResponse
  >(functions, "stripeConnect");

  const result = await stripeConnect({ marketCode, account });

  const { url, error } = result.data;
  if (url) {
    return url;
  }
  if (error) {
    throw error;
  }
};

export interface StripePaymentRequest {
  marketCode: string;
  stall: string;
  bookings: string[];
}
export interface StripePaymentResponse {
  sessionId: string;
  url: string;
}

export const stripeCheckout = async (
  marketCode: string,
  stall: string,
  bookings: string[]
) => {
  const functions = getFunctions();
  const stripePayment = httpsCallable<
    StripePaymentRequest,
    StripePaymentResponse
  >(functions, "stripePayment");
  const result = await stripePayment({ marketCode, stall, bookings });
  const { sessionId, url } = result.data;
  if (sessionId) {
    return { sessionId, url };
  }
  return undefined;
};

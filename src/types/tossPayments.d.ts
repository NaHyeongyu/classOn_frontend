export type TossBillingAuthParams = {
  customerKey: string;
  successUrl: string;
  failUrl: string;
};

export type TossPayments = {
  requestPayment: (method: string, params: {
    amount: number;
    orderId: string;
    orderName: string;
    customerName?: string;
    customerEmail?: string;
    customerMobilePhone?: string;
    successUrl: string;
    failUrl: string;
    metadata?: Record<string, string>;
  }) => Promise<void>;
  requestBillingAuth: (method: string, params: TossBillingAuthParams) => Promise<unknown>;
};

export type TossPaymentsFactory = (clientKey: string) => TossPayments;

declare global {
  interface Window {
    TossPayments?: TossPaymentsFactory;
  }
}

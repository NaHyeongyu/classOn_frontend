type TossPayments = {
  requestPayment: (method: string, params: {
    amount: number;
    orderId: string;
    orderName: string;
    customerName?: string;
    customerEmail?: string;
    customerMobilePhone?: string;
    successUrl: string;
    failUrl: string;
  }) => Promise<void>;
};

type TossPaymentsFactory = (clientKey: string) => TossPayments;

declare global {
  interface Window {
    TossPayments?: TossPaymentsFactory;
  }
}

export {};

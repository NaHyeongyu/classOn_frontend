// Lightweight loader for TossPayments browser SDK without bundling the NPM package.
// It injects the official script and returns the TossPayments instance.

type BillingAuthParams = {
  customerKey: string;
  successUrl: string;
  failUrl: string;
};

type TossPaymentsInstance = {
  requestBillingAuth: (method: "카드" | string, params: BillingAuthParams) => Promise<unknown>;
};

declare global {
  interface Window {
    TossPayments?: (clientKey: string) => TossPaymentsInstance;
  }
}

const SCRIPT_SRC = "https://js.tosspayments.com/v1/payment";
let loadingPromise: Promise<void> | null = null;

async function ensureScript(): Promise<void> {
  if (typeof window === "undefined") return;
  if (window.TossPayments) return;
  if (loadingPromise) return loadingPromise;
  loadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load TossPayments SDK"));
    document.head.appendChild(script);
  });
  return loadingPromise;
}

export async function loadTossPayments(clientKey: string): Promise<TossPaymentsInstance> {
  await ensureScript();
  if (!window.TossPayments) {
    throw new Error("TossPayments SDK not available");
  }
  return window.TossPayments(clientKey);
}

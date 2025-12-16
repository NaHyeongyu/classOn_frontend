import type { PaymentDetail } from "@classon/shared-types";

export type DetailState =
  | {
      open: true;
      id: number;
      variant: "invoice" | "history";
      loading: boolean;
      data: PaymentDetail | null;
    }
  | { open: false };


import type { DiscountType } from "@classon/shared-types";

export type StudentOverride = {
  dueDate?: string;
  periodStart?: string;
  periodEnd?: string;
  cycleValue?: number;
  discountEnabled?: boolean;
  discountType?: DiscountType;
  discountValue?: number;
  discountStartDate?: string;
  discountEndDate?: string;
  memo?: string;
  managerMemo?: string;
  extraEnabled?: boolean;
  materialFee?: number;
  textbookFee?: number;
  extraStartDate?: string;
  extraEndDate?: string;
};

import { fetchJSON } from "@/lib/fetcher";

export type AcademyDetail = {
  id: number;
  name: string;
  bizNo?: string;
  address?: string;
  representativeName?: string;
  phone?: string;
  billingEmail?: string;
  category1: string;
  category2?: string;
  categoryEtc?: string;
  billingStatus?: string;
  billingCurrentPeriodEnd?: string;
  billingSubscriptionId?: string;
  stage?: "DEVELOPMENT" | "TEST" | "PRODUCTION";
};

export type PlanUsage = {
  planId: string;
  planName?: string | null;
  studentLimit?: number | null;
  studentCount: number;
  teacherLimit?: number | null;
  teacherCount: number;
  marketingLimit?: number | null;
};

export type SellerCompany = {
  name?: string;
  representativeName?: string;
  businessRegistrationNumber?: string;
  email?: string;
  phone?: string;
};

export type SellerAccount = {
  bankCode?: string;
  accountNumber?: string;
  holderName?: string;
};

export type SellerDetail = {
  id: number;
  tossSellerId?: string;
  refSellerId: string;
  businessType: "INDIVIDUAL" | "INDIVIDUAL_BUSINESS" | "CORPORATE";
  status?: string;
  company?: SellerCompany;
  individual?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  account?: SellerAccount;
  metadataJson?: string;
};

export type SellerRegistrationRequestDto = {
  tossSellerId: string;
  status: string;
  email?: string | null;
  academyId?: number | null;
  refSellerId?: string | null;
};

export type SellerStatusDto = {
  status: string;
  tossSellerId?: string | null;
  updatedAt?: string | null;
};

export type SellerUpsertPayload = {
  refSellerId: string;
  businessType: SellerDetail["businessType"];
  companyName?: string;
  representativeName?: string;
  businessRegistrationNumber?: string;
  companyEmail?: string;
  companyPhone?: string;
  individualName?: string;
  individualEmail?: string;
  individualPhone?: string;
  bankCode: string;
  accountNumber: string;
  accountHolderName: string;
  metadataJson?: string;
};

export async function apiGetMyAcademy(): Promise<AcademyDetail> {
  return fetchJSON<AcademyDetail>("/api/account/academy");
}

export async function apiGetPlanUsage(): Promise<PlanUsage> {
  return fetchJSON<PlanUsage>("/api/account/plan-usage");
}

export async function apiUpdateMyAcademy(payload: Partial<AcademyDetail> & { name: string; category1: string }): Promise<AcademyDetail> {
  return fetchJSON<AcademyDetail>("/api/account/academy", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function apiUpdateMyProfile(payload: { name?: string; phone?: string }): Promise<void> {
  await fetchJSON("/api/account/user", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function apiChangePassword(currentPassword: string, newPassword: string): Promise<void> {
  await fetchJSON("/api/account/password", {
    method: "PUT",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

export async function apiGetMySeller(): Promise<SellerDetail | null> {
  return fetchJSON<SellerDetail | null>("/api/account/seller");
}

export async function apiRequestSellerRegistration(payload: SellerUpsertPayload): Promise<SellerRegistrationRequestDto> {
  return fetchJSON<SellerRegistrationRequestDto>("/api/account/seller/request", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function apiGetSellerStatus(): Promise<SellerStatusDto> {
  return fetchJSON<SellerStatusDto>("/api/account/seller/status");
}

export async function apiUpdateSeller(payload: SellerUpsertPayload): Promise<SellerDetail> {
  return fetchJSON<SellerDetail>("/api/account/seller", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function apiSyncSeller(): Promise<SellerDetail> {
  return fetchJSON<SellerDetail>("/api/account/seller/sync", {
    method: "POST",
  });
}

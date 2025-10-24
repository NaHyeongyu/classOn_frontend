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
  stage?: "DEVELOPMENT" | "TEST" | "PRODUCTION";
};

export async function apiGetMyAcademy(): Promise<AcademyDetail> {
  return fetchJSON<AcademyDetail>("/api/account/academy");
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

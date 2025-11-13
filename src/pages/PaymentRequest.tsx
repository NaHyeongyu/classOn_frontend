import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useParams, useSearchParams } from "react-router-dom";
import { fetchJSON } from "@/lib/fetcher";
import { formatMoney } from "@/lib/format";
import { PrimaryButton } from "@/components/common/UI";
import { useToast } from "@/components/common/Toast";

type Payload = {
  academyName?: string;
  courseTitle?: string;
  studentName?: string;
  amount?: number;
  currency?: string; // default KRW
  checkoutUrl?: string; // optional payment gateway URL
};

export default function PaymentRequest() {
  const { token } = useParams<{ token?: string }>();
  const [sp] = useSearchParams();
  const { error: showError } = useToast();
  const [data, setData] = useState<Payload>({});

  // Derive initial values from query as fallback
  const fallback = useMemo<Payload>(() => {
    // Temporary sample defaults
    const SAMPLE = {
      academyName: "클래스온 어학원",
      courseTitle: "중2 심화반",
      studentName: "홍길동",
      amount: 120000,
    } as const;
    const academyName = sp.get("academy") || sp.get("a") || SAMPLE.academyName;
    const courseTitle = sp.get("course") || sp.get("c") || SAMPLE.courseTitle;
    const studentName = sp.get("student") || sp.get("s") || SAMPLE.studentName;
    const rawAmount = sp.get("amount") || sp.get("amt") || String(SAMPLE.amount);
    const amount = rawAmount ? Number(rawAmount) : SAMPLE.amount;
    const checkoutUrl = sp.get("checkoutUrl") || undefined;
    return { academyName, courseTitle, studentName, amount, currency: "KRW", checkoutUrl };
  }, [sp]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!token) {
        setData(fallback);
        return;
      }
      try {
        // Try public API; if not available, gracefully fall back to query
        const res = await fetchJSON<Payload>(`/api/public/pay/${encodeURIComponent(token)}`);
        if (!cancelled) setData({ currency: "KRW", ...fallback, ...res });
      } catch {
        if (!cancelled) setData(fallback);
      } finally { /* no-op */ }
    }
    void load();
    return () => { cancelled = true; };
  }, [token, fallback]);

  const academy = data.academyName || "학원명";
  const course = data.courseTitle || "수업명";
  const student = data.studentName || "수강생";
  const amount = data.amount ?? 0;

  const handlePay = async () => {
    // If checkoutUrl provided (via token API or query), redirect
    if (data.checkoutUrl) {
      try {
        const url = new URL(data.checkoutUrl, window.location.href).toString();
        window.location.href = url;
        return;
      } catch {
        // fall through to create session
      }
    }
    // Optional: try to create a checkout session if token exists
    if (token) {
      try {
        const res = await fetchJSON<{ url: string }>(`/api/public/pay/${encodeURIComponent(token)}/checkout`, { method: 'POST' });
        if (res?.url) {
          window.location.href = new URL(res.url, window.location.href).toString();
          return;
        }
      } catch (e) {
        // ignore and show fallback error
      }
    }
    showError("결제 페이지를 열 수 없습니다. 담당자에게 문의해 주세요.");
  };

  return (
    <Shell>
      <ContentWrap>
        <DataCard>
          <Top>
            <Badge>결제 요청</Badge>
            <Academy>{academy}</Academy>
            <Course>{course}</Course>
            <StudentRow>
              <SmallLabel>수강생</SmallLabel>
              <StudentChip>{student}</StudentChip>
            </StudentRow>
            <AmountBox>
              <AmountLabel>결제 금액</AmountLabel>
              <AmountValue>{formatMoney(amount)}</AmountValue>
            </AmountBox>
          </Top>

          <SectionTitle>결제 정보</SectionTitle>
          <DetailList>
            <DetailRow>
              <Label>학원명</Label>
              <Value>{academy}</Value>
            </DetailRow>
            <DetailRow>
              <Label>수업명</Label>
              <Value>{course}</Value>
            </DetailRow>
            <DetailRow>
              <Label>수강생</Label>
              <Value>{student}</Value>
            </DetailRow>
          </DetailList>

          <Note>결제 버튼을 누르면 안전한 결제 페이지로 이동합니다.</Note>
        </DataCard>
      </ContentWrap>

      <BottomBar>
        <BarAmount>{formatMoney(amount)}</BarAmount>
        <BigPayButton type="button" onClick={handlePay}>
          결제하기
        </BigPayButton>
      </BottomBar>
    </Shell>
  );
}

const Shell = styled.div`
  min-height: 100vh;
  background: #f6f7fb; /* 눈부심 줄인 연한 배경 */
  padding: 16px 12px calc(110px + env(safe-area-inset-bottom)); /* 더 큰 하단 영역 확보 */
`;

const ContentWrap = styled.div`
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
  padding: 4px 2px; /* 가벼운 내부 여백만 */
`;

const DataCard = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 14px 30px rgba(2, 6, 23, 0.06);
  padding: 18px;
`;

const Top = styled.div`
  display: grid;
  gap: 8px;
`;
const Badge = styled.span`
  align-self: start;
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  color: #4338ca;
  background: #eef2ff;
`;
const Academy = styled.div`
  color: #475569;
  font-size: 14px;
  font-weight: 700;
`;
const Course = styled.h1`
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
`;
const StudentRow = styled.div`
  display: flex; gap: 8px; align-items: center; margin-top: 2px;
`;
const SmallLabel = styled.div`
  color: #64748b; font-size: 12px; font-weight: 700;
`;
const SmallValue = styled.div`
  color: #0f172a; font-size: 13px; font-weight: 700;
`;
const StudentChip = styled.span`
  display: inline-flex; align-items: center; height: 26px; padding: 0 10px;
  border-radius: 999px; background: #eef2ff; color: #3730a3; font-size: 12px; font-weight: 800;
`;
const AmountBox = styled.div`
  margin-top: 8px; display: grid; gap: 6px;
  background: #f8fafc; border: 1px solid #eef2ff; border-radius: 12px; padding: 12px;
`;
const AmountLabel = styled.div`
  color: #64748b; font-size: 12px; font-weight: 700; letter-spacing: .1px;
`;
const AmountValue = styled.div`
  color: #0f172a; font-size: 28px; font-weight: 900; letter-spacing: -.2px;
`;

const Divider = styled.hr`
  border: none; border-top: 1px solid #f1f5f9; margin: 14px 0;
`;

const SectionTitle = styled.h2`
  margin: 16px 0 10px; font-size: 13px; color: #6b7280; font-weight: 800;
`;
const DetailList = styled.div`
  display: grid; border: 1px solid #f1f5f9; border-radius: 12px; overflow: hidden;
`;
const DetailRow = styled.div`
  display: grid; grid-template-columns: 1fr auto; gap: 12px; align-items: center; padding: 12px 14px; background: #fff;
  & + & { border-top: 1px solid #f1f5f9; }
`;
const Label = styled.div`
  color: #64748b;
  font-size: 14px;
`;
const Value = styled.div`
  color: #0f172a;
  font-size: 16px;
  font-weight: 700;
`;

const Note = styled.p`
  margin: 14px 0 0 0;
  color: #6b7280;
  font-size: 13px;
`;

const BottomBar = styled.div`
  position: fixed;
  left: 0; right: 0; bottom: 0;
  background: #ffffff;
  border-top: 1px solid #e5e7eb;
  padding: 14px 16px calc(20px + env(safe-area-inset-bottom));
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
`;
const BarAmount = styled.div`
  display: grid; align-content: center;
  min-width: 140px;
  font-size: 18px;
  font-weight: 800;
  color: #111827;
`;

const BigPayButton = styled(PrimaryButton)`
  height: 52px;
  font-size: 16px;
  border-radius: 12px;
`;

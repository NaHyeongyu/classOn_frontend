import styled from "styled-components";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { apiGetMyAcademy, apiUpdateMyAcademy, apiUpdateMyProfile, type AcademyDetail } from "@/api/account";
import { apiRequestPhoneCode, apiVerifyPhoneCode } from "@/api/auth";
import { useToast } from "@/components/common/Toast";

export default function MyAcademy() {
  const { user, validate, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [academy, setAcademy] = useState<AcademyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // Account (user) state
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const initialPhone = useMemo(() => user?.phone ?? "", [user?.phone]);
  const [code, setCode] = useState("");
  const [verified, setVerified] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => { const id = setInterval(() => setCooldown((s) => s>0 ? s-1 : 0), 1000); return () => clearInterval(id); }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const a = await apiGetMyAcademy();
        if (!alive) return;
        setAcademy(a);
      } catch (e: any) {
        // Graceful fallback: allow editing to create academy later
        setAcademy({
          id: 0,
          name: '',
          bizNo: '',
          address: '',
          representativeName: '',
          phone: '',
          billingEmail: '',
          category1: '',
          category2: '',
          categoryEtc: '',
        });
        setErr(e?.message || "학원 정보를 불러오지 못했습니다. 정보를 입력 후 저장해 주세요.");
      } finally {
        setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  // Phone helpers
  function normalizeMobile(input: string): string | null {
    const digits = (input || '').replace(/\D/g, "");
    if (digits.length === 11 && digits.startsWith("010")) return `010-${digits.slice(3,7)}-${digits.slice(7)}`;
    return null;
  }
  const phoneChanged = useMemo(() => (normalizeMobile(phone) ?? phone) !== initialPhone, [phone, initialPhone]);

  async function requestCode() {
    setErr(null);
    const normalized = normalizeMobile(phone);
    if (!normalized) { setErr("휴대폰 번호 형식을 확인해 주세요 (010-1234-5678)"); return; }
    try {
      await apiRequestPhoneCode(normalized);
      setCooldown(60);
    } catch (e: any) {
      setErr(e?.message || "인증코드 요청에 실패했습니다.");
    }
  }
  async function verifyCode() {
    setErr(null);
    const normalized = normalizeMobile(phone);
    if (!normalized) { setErr("휴대폰 번호 형식을 확인해 주세요"); return; }
    if (!code.trim()) { setErr("인증코드를 입력해 주세요"); return; }
    try {
      const res = await apiVerifyPhoneCode(normalized, code.trim());
      setVerified(!!res.success);
      if (!res.success) setErr("인증코드가 올바르지 않습니다.");
    } catch (e: any) {
      setErr(e?.message || "전화번호 인증에 실패했습니다.");
    }
  }

  async function saveProfile() {
    setErr(null);
    try {
      const body: { name?: string; phone?: string } = {};
      if (name && name !== user?.name) body.name = name;
      if (phoneChanged) body.phone = normalizeMobile(phone) ?? phone;
      await apiUpdateMyProfile(body);
      await validate();
      toast.success('프로필이 저장되었습니다.');
    } catch (e: any) {
      setErr(e?.message || "프로필 저장에 실패했습니다.");
    }
  }

  async function saveAcademy() {
    if (!academy) return;
    setErr(null);
    try {
      const payload = {
        id: academy.id,
        name: academy.name,
        bizNo: academy.bizNo,
        address: academy.address,
        representativeName: academy.representativeName,
        phone: academy.phone,
        billingEmail: academy.billingEmail,
        category1: academy.category1,
        category2: academy.category2,
        categoryEtc: academy.categoryEtc,
      };
      const updated = await apiUpdateMyAcademy(payload);
      setAcademy(updated);
      toast.success('학원 정보가 저장되었습니다.');
    } catch (e: any) {
      setErr(e?.message || "학원 정보 저장에 실패했습니다.");
    }
  }

  if (loading) return <Container><Header><h1>내 학원 정보</h1><p>불러오는 중…</p></Header></Container>;

  return (
    <Container>
      <Header>
        <div>
          <h1>내 학원 정보</h1>
          <p>계정 및 학원 정보를 확인하고 수정하세요.</p>
        </div>
        <HeaderActions>
          <OutlineBtn type="button" onClick={() => { logout(); navigate('/login', { replace: true }); }}>로그아웃</OutlineBtn>
        </HeaderActions>
      </Header>

      {err && <ErrorBox>{err}</ErrorBox>}

      <Card>
        <SectionTitle>계정 정보</SectionTitle>
        <Row>
          <Label>담당자 성함</Label>
          <Value><TextInput value={name} onChange={(e)=>setName(e.target.value)} placeholder="홍길동" /></Value>
        </Row>
        <Row>
          <Label>휴대폰 번호</Label>
          <Value>
            <PhoneRow>
              <TextInput style={{flex:1}} value={phone} onChange={(e)=> setPhone(e.target.value)} placeholder="010-1234-5678" />
              <SmallBtn type="button" disabled={cooldown>0} onClick={requestCode}>{cooldown>0? `${cooldown}s`: '코드요청'}</SmallBtn>
              <CodeInput value={code} onChange={(e)=> setCode(e.target.value)} placeholder="6자리" />
              <SmallBtn type="button" onClick={verifyCode}>인증</SmallBtn>
            </PhoneRow>
            {phoneChanged && !verified && <Hint>번호 변경 시 인증이 필요합니다.</Hint>}
            {verified && <Hint success>인증 완료</Hint>}
          </Value>
        </Row>
        <Actions>
          <Primary onClick={saveProfile} disabled={phoneChanged && !verified}>프로필 저장</Primary>
        </Actions>
      </Card>

      {academy && (
        <Card>
          <SectionTitle>학원 정보</SectionTitle>
          <Row>
            <Label>학원명</Label>
            <Value><TextInput value={academy.name} onChange={(e)=> setAcademy({...academy, name: e.target.value})} placeholder="오픈AI어학원" /></Value>
          </Row>
          <Row>
            <Label>카테고리</Label>
            <Value>
              <Pills>
                {(["교과목","예체능","기타"] as const).map(k => (
                  <PillButton key={k} type="button" data-active={academy.category1===k} onClick={()=> setAcademy({ ...academy, category1: k, category2: undefined, categoryEtc: undefined })}>{k}</PillButton>
                ))}
              </Pills>
            </Value>
          </Row>
          {academy.category1 && academy.category1 !== '기타' && (
            <Row>
              <Label>세부 카테고리 (선택)</Label>
              <Value>
                <Pills>
                  {secondCategories(academy.category1).map(c => (
                    <PillButton key={c} type="button" data-active={academy.category2===c} onClick={()=> setAcademy({ ...academy, category2: academy.category2===c? undefined : c })}>{c}</PillButton>
                  ))}
                </Pills>
              </Value>
            </Row>
          )}
          {academy.category1 === '기타' && (
            <Row>
              <Label>기타 분류</Label>
              <Value>
                <PillInputWrap>
                  <PillTextInput value={academy.categoryEtc ?? ''} onChange={(e)=> setAcademy({ ...academy, categoryEtc: e.target.value })} placeholder="예: 코딩, 바둑 등" />
                </PillInputWrap>
              </Value>
            </Row>
          )}
          <Row>
            <Label>주소</Label>
            <Value><TextInput value={academy.address ?? ''} onChange={(e)=> setAcademy({ ...academy, address: e.target.value })} placeholder="도로명 주소" /></Value>
          </Row>
          <Row>
            <Label>대표자명</Label>
            <Value><TextInput value={academy.representativeName ?? ''} onChange={(e)=> setAcademy({ ...academy, representativeName: e.target.value })} placeholder="대표자명" /></Value>
          </Row>
          <Row>
            <Label>학원 대표번호</Label>
            <Value><TextInput value={academy.phone ?? ''} onChange={(e)=> setAcademy({ ...academy, phone: e.target.value })} placeholder="021234567" /></Value>
          </Row>
          <Row>
            <Label>청구용 이메일</Label>
            <Value><TextInput value={academy.billingEmail ?? ''} onChange={(e)=> setAcademy({ ...academy, billingEmail: e.target.value })} placeholder="billing@example.com" /></Value>
          </Row>
          <Row>
            <Label>사업자번호</Label>
            <Value><TextInput value={maskBiz(academy.bizNo ?? '')} onChange={(e)=> setAcademy({ ...academy, bizNo: unmaskBiz(e.target.value) })} placeholder="###-##-#####" /></Value>
          </Row>
          <Actions>
            <Primary onClick={saveAcademy}>학원 정보 저장</Primary>
          </Actions>
        </Card>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  gap: 16px;
`;
const Header = styled.div`
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  h1 { margin: 0; font-size: 24px; color: #111827; }
  p { margin: 4px 0 0; color: #6b7280; }
`;
const Card = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: linear-gradient(180deg, #ffffff 0%, #f9fafb 100%);
  padding: 16px;
  display: grid;
  gap: 12px;
  box-shadow: 0 6px 18px rgba(15,23,42,0.04);
`;
const Row = styled.div`
  display: grid; grid-template-columns: 120px 1fr; gap: 12px; align-items: center;
  @media (max-width: 640px) { grid-template-columns: 1fr; gap: 6px; }
`;
const Label = styled.div`
  font-size: 12px; color: #6b7280; letter-spacing: .02em; text-transform: none;
`;
const Value = styled.div`
  font-size: 15px; color: #111827; font-weight: 600;
`;
const Subtle = styled.p`
  margin: 0; color: #9ca3af; font-size: 12px;
`;

const SectionTitle = styled.h3`
  margin: 0 0 8px; color: #374151; font-size: 14px;
`;
const TextInput = styled.input`
  height: 44px; border: 1px solid #e5e7eb; border-radius: 10px; padding: 0 12px; font-size: 14px; background: #ffffff; width: 100%;
  &:focus { outline: none; box-shadow: 0 0 0 3px rgba(79,70,229,0.16); }
`;
const PhoneRow = styled.div`
  display: flex; gap: 8px; align-items: center;
`;
const SmallBtn = styled.button`
  height: 44px; padding: 0 14px; border-radius: 10px; border: 1px solid #e5e7eb; background: #f8fafc; font-weight: 700; color: #374151;
`;
const CodeInput = styled.input`
  height: 44px; width: 90px; border: 1px solid #e5e7eb; border-radius: 10px; padding: 0 10px; font-size: 14px; text-align: center;
`;
const Actions = styled.div`
  display: flex; justify-content: flex-end; gap: 8px; margin-top: 6px;
`;
const Primary = styled.button`
  height: 44px; padding: 0 18px; border-radius: 10px; border: 1px solid transparent; background: #4f46e5; color: #fff; font-weight: 700;
  &:disabled { opacity: 0.6; }
`;
const OutlineBtn = styled.button`
  height: 40px; padding: 0 14px; border-radius: 10px; border: 1px solid #e5e7eb; background: #ffffff; font-weight: 700; color: #374151;
  &:hover { background: #f8fafc; }
`;
const HeaderActions = styled.div`
  display: flex; gap: 8px; align-items: center;
`;
const Hint = styled.div<{ success?: boolean }>`
  margin-top: 6px; font-size: 12px; color: ${({success})=> success? '#065f46' : '#6b7280'};
`;

const Pills = styled.div`
  display: flex; gap: 8px; flex-wrap: wrap;
`;
const PillButton = styled.button`
  height: 36px; padding: 0 12px; border-radius: 999px; border: 1px solid #e5e7eb; background: #f9fafb; color: #374151; font-weight: 600;
  &[data-active='true'] { background: #4f46e5; color: #fff; border-color: transparent; }
`;
const PillInputWrap = styled.div`
  display: inline-flex; align-items: center; min-height: 36px; padding: 0 12px; border-radius: 999px; border: 1px solid #e5e7eb; background: #f9fafb;
  &:focus-within { background: #eef2ff; box-shadow: 0 0 0 3px rgba(79,70,229,0.18); }
`;
const PillTextInput = styled.input`
  border: none; background: transparent; outline: none; font-size: 14px; width: 100%;
`;
const ErrorBox = styled.div`
  color: #b91c1c; background: #fee2e2; border-radius: 10px; padding: 10px 12px; font-size: 14px;
`;

function secondCategories(category1: string): string[] {
  if (category1 === '교과목') return ['국어','수학','사회','과학','영어'];
  if (category1 === '예체능') return ['스포츠','미술','음악'];
  return [];
}

function maskBiz(input: string) {
  const digits = (input||'').replace(/\D/g, '').slice(0, 10);
  const p1 = digits.slice(0,3), p2 = digits.slice(3,5), p3 = digits.slice(5,10);
  return [p1,p2,p3].filter(Boolean).join('-');
}
function unmaskBiz(input: string) {
  const d = (input||'').replace(/\D/g, '').slice(0,10);
  return d;
}

import type { FormEventHandler } from "react";
import { PrimaryButtonLg as UIPrimaryBtn } from "@/components/common/UI";
import type { UseRegisterFlowResult } from "@/features/register/useRegisterFlow";
import {
  Sub,
  Form,
  SectionTitle,
  Label,
  Input,
  Rules,
  Rule,
  Divider,
  Pills,
  PillButton,
  PillInputWrap,
  PillTextInput,
  Hint,
  ErrorText,
} from "./RegisterForm.styles";

type StepAccountFormProps = {
  flow: UseRegisterFlowResult;
  onSubmit: FormEventHandler<HTMLFormElement>;
};

export function StepAccountForm({ flow, onSubmit }: StepAccountFormProps) {
  const {
    username,
    setUsername,
    usernameAvailable,
    checkUsername,
    password,
    setPassword,
    password2,
    setPassword2,
    pwRuleLen,
    pwRuleMix,
    academyName,
    setAcademyName,
    category1,
    setCategory1,
    category2,
    setCategory2,
    categoryEtc,
    setCategoryEtc,
    secondCategories,
    phone,
    setPhone,
    name,
    setName,
    bizNo,
    bizNoAvailable,
    handleBizNoChange,
    maskBizNo,
    academyAddress,
    setAcademyAddress,
    representative,
    setRepresentative,
    academyPhone,
    setAcademyPhone,
    billingEmail,
    setBillingEmail,
    referral,
    setReferral,
    canProceedAccount,
    error,
    normalizeMobile,
  } = flow;

  const bizNoMasked = maskBizNo(bizNo);

  return (
    <>
      <Sub>아이디/비밀번호와 학원 정보를 입력해 주세요.</Sub>
      <Form onSubmit={onSubmit}>
        <SectionTitle>계정 정보</SectionTitle>
        <Label>
          아이디<span>*</span>
        </Label>
        <Input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          onBlur={() => {
            void checkUsername();
          }}
          placeholder="아이디"
          aria-invalid={Boolean(username) && usernameAvailable === false}
          required
        />
        {usernameAvailable === true && <Hint success>사용 가능한 아이디입니다.</Hint>}
        {usernameAvailable === false && <Hint danger>이미 사용중인 아이디입니다.</Hint>}

        <Label>
          비밀번호<span>*</span>
        </Label>
        <Input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="8–64자, 문자+숫자"
          aria-invalid={password !== "" && !(pwRuleLen && pwRuleMix)}
          required
        />
        <Rules>
          <Rule ok={pwRuleLen}>8–64자</Rule>
          <Rule ok={pwRuleMix}>문자+숫자 포함</Rule>
        </Rules>

        <Label>
          비밀번호 확인<span>*</span>
        </Label>
        <Input
          type="password"
          value={password2}
          onChange={(event) => setPassword2(event.target.value)}
          placeholder="비밀번호 다시 입력"
          aria-invalid={password2 !== "" && password !== password2}
          required
        />
        {password2 && password !== password2 && <Hint danger>비밀번호가 일치하지 않습니다.</Hint>}

        <Divider />
        <SectionTitle>학원 정보</SectionTitle>

        <Label>
          학원명<span>*</span>
        </Label>
        <Input value={academyName} onChange={(event) => setAcademyName(event.target.value)} aria-invalid={academyName !== "" && !academyName} required />

        <Label>
          카테고리<span>*</span>
        </Label>
        <Pills>
          {(["교과목", "예체능", "기타"] as const).map((opt) => (
            <PillButton key={opt} type="button" data-active={category1 === opt} onClick={() => setCategory1(opt)}>
              {opt}
            </PillButton>
          ))}
        </Pills>

        {category1 && category1 !== "기타" ? (
          <>
            <Label>세부 카테고리 (선택)</Label>
            <Pills>
              {secondCategories(category1).map((item) => (
                <PillButton
                  key={item}
                  type="button"
                  data-active={category2 === item}
                  aria-pressed={category2 === item}
                  onClick={() => setCategory2(category2 === item ? "" : item)}
                >
                  {item}
                </PillButton>
              ))}
            </Pills>
          </>
        ) : null}

        {category1 === "기타" ? (
          <>
            <Label>기타 분류</Label>
            <PillInputWrap>
              <PillTextInput value={categoryEtc} onChange={(event) => setCategoryEtc(event.target.value)} placeholder="예: 코딩, 바둑 등" />
            </PillInputWrap>
          </>
        ) : null}

        <Divider />
        <SectionTitle>담당자 및 청구 정보</SectionTitle>

        <Label>
          담당자 연락처<span>*</span>
        </Label>
        <Input
          value={phone}
          inputMode="tel"
          onChange={(event) => setPhone(event.target.value)}
          onBlur={(event) => {
            const normalized = normalizeMobile(event.target.value);
            if (normalized) setPhone(normalized);
          }}
          placeholder="010-1234-5678"
          aria-invalid={phone !== "" && !normalizeMobile(phone)}
          required
        />
        <Hint>회원가입 시 문자 인증을 진행한 담당자 연락처입니다.</Hint>

        <Label>담당자 성함 (선택)</Label>
        <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="홍길동" />

        <Label>사업자번호 (선택)</Label>
        <Input
          value={bizNoMasked.masked}
          onChange={(event) => {
            void handleBizNoChange(event.target.value);
          }}
          placeholder="###-##-#####"
          aria-invalid={bizNoMasked.raw.length > 0 && (bizNoMasked.raw.length !== 10 || bizNoAvailable === false)}
        />
        {bizNoAvailable === false && <Hint danger>이미 가입된 사업자번호입니다. 연결/문의를 진행해 주세요.</Hint>}

        <Label>학원 주소 (선택)</Label>
        <Input value={academyAddress} onChange={(event) => setAcademyAddress(event.target.value)} placeholder="도로명 주소" />

        <Label>대표자명 (선택)</Label>
        <Input value={representative} onChange={(event) => setRepresentative(event.target.value)} placeholder="대표자 성함" />

        <Label>학원 대표번호 (선택)</Label>
        <Input value={academyPhone} onChange={(event) => setAcademyPhone(event.target.value)} placeholder="02-1234-5678" />

        <Label>청구용 이메일 (선택)</Label>
        <Input value={billingEmail} onChange={(event) => setBillingEmail(event.target.value)} placeholder="billing@example.com" />

        <Label>가입 경로 (선택)</Label>
        <Input value={referral} onChange={(event) => setReferral(event.target.value)} placeholder="예: 친구 추천, 광고, 검색 등" />

        <Hint>다음 단계에서 원생 규모와 요금제를 선택합니다.</Hint>
        {error && <ErrorText>{error}</ErrorText>}

        <UIPrimaryBtn type="submit" disabled={!canProceedAccount}>
          다음
        </UIPrimaryBtn>
      </Form>
    </>
  );
}

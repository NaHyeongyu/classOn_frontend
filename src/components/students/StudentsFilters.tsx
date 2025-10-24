import styled from "styled-components";
import SelectBox from "@/components/common/SelectBox";
import { useEffect, useRef, useState } from "react";
import type { StudentsFiltersState } from "@/features/students/types";

export default function StudentsFilters({ value, onChange, onApply }: { value: StudentsFiltersState; onChange: (f: StudentsFiltersState) => void; onApply?: () => void }) {
  const v = value;
  const [composing, setComposing] = useState(false);
  const [qDraft, setQDraft] = useState(v.q);
  const inputRef = useRef<HTMLInputElement>(null);
  const [pendingEnter, setPendingEnter] = useState(false);
  useEffect(() => { setQDraft(v.q); }, [v.q]);
  function set<K extends keyof StudentsFiltersState>(k: K, val: StudentsFiltersState[K]) { onChange({ ...v, [k]: val }); }
  function reset() { onChange({ status: "", from: "", to: "", ageMin: "", ageMax: "", q: "" }); }

  function applySearch() {
    const current = (inputRef.current?.value ?? qDraft).trim();
    onChange({ ...v, q: current });
    onApply?.();
  }

  return (
    <Bar>
      <Group>
        <Label>상태</Label>
        <SelectBox ariaLabel="상태" value={v.status || ''} onChange={(val)=> set("status", val as StudentsFiltersState['status'])} placeholder="전체"
          options={[
            { label: '수강중', value: 'ENROLLED' },
            { label: '휴학', value: 'ON_LEAVE' },
            { label: '대기중', value: 'PENDING' },
          ]}
        />
      </Group>
      <Group>
        <Label>등록일</Label>
        <RangeWrap>
          <DateInput
            type="date"
            lang="ko-KR"
            data-placeholder="YYYY.MM.DD"
            data-has-value={Boolean(v.from)}
            value={v.from}
            onChange={(e) => set("from", e.target.value)}
          />
          <Sep>~</Sep>
          <DateInput
            type="date"
            lang="ko-KR"
            data-placeholder="YYYY.MM.DD"
            data-has-value={Boolean(v.to)}
            value={v.to}
            onChange={(e) => set("to", e.target.value)}
          />
        </RangeWrap>
      </Group>
      <Group>
        <Label>나이</Label>
        <RangeWrap>
          <Input type="number" placeholder="12" value={v.ageMin} onChange={(e) => set("ageMin", e.target.value)} />
          <Sep>~</Sep>
          <Input type="number" placeholder="16" value={v.ageMax} onChange={(e) => set("ageMax", e.target.value)} />
        </RangeWrap>
      </Group>
      <Group>
        <Label>검색</Label>
        <SearchBox>
        <SearchInput
          ref={inputRef}
          placeholder="학생명, 보호자, 연락처 등 검색"
          value={qDraft}
          onChange={(e) => setQDraft(e.target.value)}
          onCompositionStart={() => setComposing(true)}
          onCompositionEnd={() => { setComposing(false); if (pendingEnter) { setPendingEnter(false); applySearch(); } }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (composing) setPendingEnter(true);
              else applySearch();
            }
          }}
        />
        <SearchBtn
          type="button"
          onClick={applySearch}
        >검색</SearchBtn>
        <GhostBtn type="button" onClick={reset}>초기화</GhostBtn>
        </SearchBox>
      </Group>
    </Bar>
  );
}

const Bar = styled.div`
  display: grid; grid-template-columns: 0.6fr 1.2fr 1fr 2.7fr; gap: 12px; align-items: end;
  @media (max-width: 1080px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 720px) { grid-template-columns: 1fr; }
  /* Make filters sticky when scrolling under the header block */
  position: sticky;
  top: 64px; /* adjust if page header height differs */
  z-index: 37;
  background: #fff;
`;
const Group = styled.div`
  display: grid; gap: 8px; align-items: start;
`;
// (inline search layout)
const Label = styled.span`
  color: #6b7280; font-size: 12px; font-weight: 700;
`;
// unified via SelectBox
const Input = styled.input`
  height: 36px; border: 1px solid #e5e7eb; border-radius: 10px; padding: 0 10px; width: 100%;
`;

// Korean-friendly date placeholder (YYYY.MM.DD) for empty values
const DateInput = styled.input`
  height: 36px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 10px;
  width: 100%;
  position: relative;
  background: #fff;
  /* Show custom placeholder when no value and not focused */
  &::before {
    content: attr(data-placeholder);
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    pointer-events: none;
  }
  &:focus::before,
  &[data-has-value='true']::before {
    content: '';
  }
  /* Hide native empty ghost text on Safari */
  &::-webkit-datetime-edit { color: transparent; }
  &[data-has-value='true']::-webkit-datetime-edit { color: #111827; }
  &::-webkit-calendar-picker-indicator { opacity: 1; }
`;
const RangeWrap = styled.div`
  display: grid; grid-template-columns: 1fr auto 1fr; gap: 6px; align-items: center;
`;
const Sep = styled.span`
  color: #6b7280; font-size: 12px; text-align: center;
`;
const SearchBox = styled.div`
  display: grid; grid-template-columns: 1fr auto auto; gap: 8px; align-items: end;
`;
const SearchInput = styled.input`
  height: 36px; border: 1px solid #e5e7eb; border-radius: 10px; padding: 0 12px; width: 100%;
`;
const SearchBtn = styled.button`
  height: 40px; padding: 0 16px; border-radius: 10px; border: 1px solid #111827; background: #111827; color: #fff; font-weight: 700;
`;
const GhostBtn = styled.button`
  height: 40px; padding: 0 16px; border-radius: 10px; border: 1px solid #e5e7eb; background: #fff; color: #111827; font-weight: 700;
`;

/* segmented styles removed; using Select for status */

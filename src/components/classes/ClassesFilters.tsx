import styled from "styled-components";
import { useState, useRef, useEffect } from "react";

type Filters = {
  status: "" | "IN_PROGRESS" | "STOPPED" | "PENDING";
  q: string;
};

export default function ClassesFilters({
  value,
  onChange,
  onApply,
}: {
  value: Filters;
  onChange: (f: Filters) => void;
  onApply?: () => void;
}) {
  const v = value;
  const [qDraft, setQDraft] = useState(v.q);
  const inputRef = useRef<HTMLInputElement>(null);
  const [composing, setComposing] = useState(false);
  const [pendingEnter, setPendingEnter] = useState(false);
  useEffect(() => {
    setQDraft(v.q);
  }, [v.q]);
  function set<K extends keyof Filters>(k: K, val: Filters[K]) {
    onChange({ ...v, [k]: val });
  }
  function apply() {
    const current = (inputRef.current?.value ?? qDraft).trim();
    onChange({ ...v, q: current });
    onApply?.();
  }
  return (
    <Bar>
      <Group>
        <Label>상태</Label>
        <Select
          value={v.status}
          onChange={(e) => set("status", e.target.value as Filters["status"])}
        >
          <option value="">전체</option>
          <option value="IN_PROGRESS">진행중</option>
          <option value="STOPPED">중단</option>
          <option value="PENDING">대기</option>
        </Select>
      </Group>
      <Group>
        <Label>검색</Label>
        <SearchBox>
          <SearchInput
            ref={inputRef}
            placeholder="수업명, 코드, 설명 검색"
            value={qDraft}
            onChange={(e) => setQDraft(e.target.value)}
            onCompositionStart={() => setComposing(true)}
            onCompositionEnd={() => {
              setComposing(false);
              if (pendingEnter) {
                setPendingEnter(false);
                apply();
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (composing) setPendingEnter(true);
                else apply();
              }
            }}
          />
          <PrimaryBtn type="button" onClick={apply}>
            검색
          </PrimaryBtn>
        </SearchBox>
      </Group>
    </Bar>
  );
}

const Bar = styled.div`
  display: grid;
  grid-template-columns: 0.7fr 2.3fr;
  gap: 12px;
  align-items: end;
  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;
const Group = styled.div`
  display: grid;
  gap: 8px;
`;
const Label = styled.span`
  color: #6b7280;
  font-size: 12px;
  font-weight: 700;
`;
const Select = styled.select`
  height: 36px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 10px;
  width: 100%;
`;
const SearchBox = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
`;
const SearchInput = styled.input`
  height: 36px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 12px;
  width: 100%;
`;
const PrimaryBtn = styled.button`
  height: 40px;
  padding: 0 16px;
  border-radius: 10px;
  border: 1px solid #111827;
  background: #111827;
  color: #fff;
  font-weight: 700;
`;

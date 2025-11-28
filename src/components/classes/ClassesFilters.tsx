import styled from "styled-components";
import { useState, useRef, useEffect } from "react";
import SelectBox from "@/components/common/SelectBox";

type Filters = {
  status: "" | "IN_PROGRESS" | "STOPPED" | "PENDING";
  q: string;
};

type ClassesFiltersProps = {
  value: Filters;
  onChange: (f: Filters) => void;
  onApply?: () => void;
  hideStatusFilter?: boolean;
};

export default function ClassesFilters({
  value,
  onChange,
  onApply,
  hideStatusFilter = false,
}: ClassesFiltersProps) {
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
  const showStatus = !hideStatusFilter;
  return (
    <Bar $single={hideStatusFilter}>
      {showStatus && (
        <Group>
          <Label>상태</Label>
          <Select
            ariaLabel="수업 상태"
            placeholder="전체"
            value={v.status}
            onChange={(value) => set("status", value as Filters["status"])}
            options={[
              { label: "전체", value: "" },
              { label: "진행중", value: "IN_PROGRESS" },
              { label: "중단", value: "STOPPED" },
              { label: "대기", value: "PENDING" },
            ]}
          />
        </Group>
      )}
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
          <SearchButton type="button" onClick={apply}>
            검색
          </SearchButton>
        </SearchBox>
      </Group>
    </Bar>
  );
}

const Bar = styled.div<{ $single: boolean }>`
  display: grid;
  grid-template-columns: ${({ $single }) => ($single ? "1fr" : "0.7fr 2.3fr")};
  gap: ${(p) => p.theme.spacing.md};
  align-items: end;
  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;
const Group = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.xs};
`;
const Label = styled.span`
  color: ${(p) => p.theme.colors.textMuted};
  font-size: ${(p) => p.theme.font.size.sm};
  font-weight: ${(p) => p.theme.font.weight.bold};
`;
const Select = styled(SelectBox)`
  width: 100%;
`;
const SearchBox = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: ${(p) => p.theme.spacing.xs};
`;
const SearchInput = styled.input`
  height: 40px;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.sm};
  padding: 0 ${(p) => p.theme.spacing.sm};
  width: 100%;
`;
const SearchButton = styled.button`
  height: 40px;
  padding: 0 ${(p) => p.theme.spacing.md};
  border-radius: ${(p) => p.theme.radii.sm};
  border: 1px solid ${(p) => p.theme.colors.navy};
  background: ${(p) => p.theme.colors.navy};
  color: ${(p) => p.theme.colors.textInverted};
  font-weight: ${(p) => p.theme.font.weight.semiBold};
`;

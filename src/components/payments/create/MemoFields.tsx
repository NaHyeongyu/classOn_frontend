import { ReceiptSection, SectionTitle } from "@/components/payments/InvoiceLayout";
import { Textarea } from "./styles";

interface MemoFieldsProps {
  memo: string;
  onChange: (value: string) => void;
}

export function MemoFields({ memo, onChange }: MemoFieldsProps) {
  return (
    <ReceiptSection>
      <SectionTitle>메모</SectionTitle>
      <Textarea
        placeholder="청구서에 표시될 메모를 입력하세요."
        value={memo}
        onChange={(event) => onChange(event.target.value)}
      />
    </ReceiptSection>
  );
}

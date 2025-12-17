import { PrimaryButtonLg } from "@/components/common/UI";
import { TotalAmountSection } from "./styles";
import { formatMoney } from "@/lib/format";

interface InvoiceSummaryProps {
  amount: number;
  selectedCount: number;
  isPending: boolean;
  onSubmit: () => void;
}

export function InvoiceSummary({
  amount,
  selectedCount,
  isPending,
  onSubmit,
}: InvoiceSummaryProps) {
  return (
    <>
      <TotalAmountSection>
        <div className="label">최종 청구 금액</div>
        <div className="amount">{formatMoney(amount)}</div>
        <div className="desc">할인 및 추가 금액이 포함된 금액입니다.</div>
      </TotalAmountSection>

      <PrimaryButtonLg
        type="button"
        disabled={selectedCount === 0 || isPending}
        onClick={onSubmit}
        style={{ width: "100%", marginTop: "16px" }}
      >
        {selectedCount > 0 ? `${selectedCount}명 청구서 생성하기` : "학생을 선택하세요"}
      </PrimaryButtonLg>
    </>
  );
}

import { useState } from "react";
import { RepresentativeCard } from "@/components/payments/InvoiceLayout";
import { Input, EditButton } from "./styles";
import { formatPhoneKR } from "./utils";
import type { Student } from "@/api/students";

interface RepresentativeInfoProps {
  student: Student;
  courseTitles: string;
  recipientPhone: string | null;
  onPhoneChange: (phone: string | null) => void;
}

export function RepresentativeInfo({
  student,
  courseTitles,
  recipientPhone,
  onPhoneChange,
}: RepresentativeInfoProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <RepresentativeCard>
      <div className="row">
        <div className="label">학생 이름</div>
        <div className="value">{student.name}</div>
      </div>
      <div className="row">
        <div className="label">수강 수업</div>
        <div className="value">{courseTitles}</div>
      </div>
      <div className="row">
        <div className="label">발신 번호</div>
        <div className="input-wrap" style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px" }}>
          {isEditing ? (
            <Input
              autoFocus
              value={formatPhoneKR(recipientPhone)}
              placeholder="예: 010-1234-5678"
              onChange={(e) => {
                const digits = (e.target.value || "").replace(/[^0-9]/g, "");
                onPhoneChange(digits ? digits : null);
              }}
              onBlur={() => setIsEditing(false)}
              style={{ textAlign: "right", padding: "6px 10px" }}
            />
          ) : (
            <>
              <EditButton type="button" onClick={() => setIsEditing(true)}>
                수정하기
              </EditButton>
              <div className="value" style={{ fontWeight: 700 }}>
                {formatPhoneKR(recipientPhone) || "-"}
              </div>
            </>
          )}
        </div>
      </div>
    </RepresentativeCard>
  );
}

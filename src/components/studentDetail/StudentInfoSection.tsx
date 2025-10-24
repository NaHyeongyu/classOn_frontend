import {
  Card,
  CardActions,
  CardHead,
  InfoList,
  Muted,
  Name,
  Row,
  SectionTitle,
  SmallMuted,
  StatusChip,
  Avatar,
  Field,
  Label,
  Value,
} from "./StudentDetailStyles";
import {
  GhostBtn as UIGhostLink,
  GhostButton as UIGhostButton
} from "@/components/common/UI";
import type { Student } from "@/api/students";
import { formatPhone } from "@/lib/format";
import type { ReactNode } from "react";

type Props = {
  student: Student | null;
  intlAge?: number;
  deleting: boolean;
  editHref: string;
  onDelete: () => void | Promise<void>;
};

export function StudentInfoSection({
  student,
  intlAge,
  deleting,
  editHref,
  onDelete,
}: Props) {
  return (
    <>
      <Card>
        <CardHead>
          <SectionTitle>기본 정보</SectionTitle>
          <CardActions>
            <UIGhostLink to={editHref} data-variant="edit">
              수정
            </UIGhostLink>
            <UIGhostButton
              data-variant="danger"
              disabled={deleting}
              onClick={() => void onDelete()}
            >
              {deleting ? "삭제 중..." : "삭제"}
            </UIGhostButton>
          </CardActions>
        </CardHead>
        {student ? (
          <InfoList>
            <Row>
              <Avatar>{student.name.slice(0, 1)}</Avatar>
              <div>
                <Name>{student.name}</Name>
                <SmallMuted>
                  코드 {student.code} · ID {student.id}
                </SmallMuted>
              </div>
              <StatusChip data-type={student.status}>
                {student.status === "ENROLLED"
                  ? "수강중"
                  : student.status === "ON_LEAVE"
                  ? "휴학"
                  : "대기중"}
              </StatusChip>
            </Row>
            <DetailField label="연락처" value={formatPhone(student.phoneNumber)} />
            <DetailField
              label="생년월일"
              value={
                student.birthDate
                  ? `${student.birthDate}${
                      intlAge != null ? ` (만 ${intlAge}세)` : ""
                    }`
                  : "-"
              }
            />
            <DetailField label="주소" value={student.address || "-"} />
            <DetailField
              label="등록일"
              value={
                student.joinedDate ||
                student.createdAt?.slice(0, 10) ||
                "-"
              }
            />
          </InfoList>
        ) : (
          <Muted>원생 정보를 찾을 수 없습니다.</Muted>
        )}
      </Card>

      <Card>
        <CardHead>
          <SectionTitle>부모님 정보</SectionTitle>
        </CardHead>
        {student ? (
          <InfoList>
            <DetailField label="보호자 이름" value={student.parentName || "-"} />
            <DetailField
              label="보호자 연락처"
              value={formatPhone(student.guardianPhone)}
            />
          </InfoList>
        ) : (
          <Muted>부모님 정보를 찾을 수 없습니다.</Muted>
        )}
      </Card>
    </>
  );
}

function DetailField({ label, value }: { label: string; value: ReactNode }) {
  return (
    <Field>
      <Label>{label}</Label>
      <Value>{value || "-"}</Value>
    </Field>
  );
}

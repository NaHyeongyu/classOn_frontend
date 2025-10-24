import ConfirmDialog from "@/components/common/ConfirmDialog";
import type { StudentImportPreview } from "@/features/students/types";
import styled from "styled-components";

type Props = {
  open: boolean;
  preview: StudentImportPreview | null;
  onCancel: () => void;
  onConfirm: () => void;
};

const MAX_PREVIEW_ROWS = 20;
const MAX_ERROR_ITEMS = 5;

export default function StudentsImportPreviewModal({ open, preview, onCancel, onConfirm }: Props) {
  return (
    <ConfirmDialog
      open={open}
      title="업로드 미리보기"
      message={preview ? <PreviewContent preview={preview} /> : null}
      confirmLabel="확인 및 업로드"
      cancelLabel="취소"
      onCancel={onCancel}
      onConfirm={onConfirm}
      maxWidth={720}
    />
  );
}

function PreviewContent({ preview }: { preview: StudentImportPreview }) {
  const rows = preview.rows || [];
  const limitedRows = rows.slice(0, MAX_PREVIEW_ROWS);
  const hasExtraRows = rows.length > MAX_PREVIEW_ROWS;
  const errors = preview.errors || [];
  const displayedErrors = errors.slice(0, MAX_ERROR_ITEMS);
  const hasExtraErrors = errors.length > MAX_ERROR_ITEMS;

  return (
    <PreviewWrap>
      <Summary>
        <span>신규 {preview.created}건</span>
        <span>수정 {preview.updated}건</span>
        <span>건너뜀 {preview.skipped}건</span>
      </Summary>
      {errors.length > 0 && (
        <Warn>
          <strong>유의사항</strong>
          <ul>
            {displayedErrors.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
            {hasExtraErrors && <li>외 {errors.length - MAX_ERROR_ITEMS}건</li>}
          </ul>
        </Warn>
      )}
      <TableWrap>
        <table>
          <thead>
            <tr>
              <th>행</th>
              <th>이름</th>
              <th>상태</th>
              <th>등록일</th>
              <th>생년월일</th>
              <th>연락처</th>
              <th>보호자</th>
              <th>주소</th>
              <th>유형</th>
            </tr>
          </thead>
          <tbody>
            {limitedRows.map((row, index) => (
              <tr key={index}>
                <td>{row.row}</td>
                <td>{row.name}</td>
                <td>{row.status || ""}</td>
                <td>{row.joinedDate || ""}</td>
                <td>{row.birthDate || ""}</td>
                <td>{row.phoneNumber || ""}</td>
                <td>{row.guardianPhone || ""}</td>
                <td>{row.address || ""}</td>
                <td>{row.isNew ? "신규" : "수정"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrap>
      <Hint>
        표시된 내용이 맞는지 확인 후 업로드를 진행하세요. 최대 {MAX_PREVIEW_ROWS}행까지만 미리보기로 표시됩니다.
        {hasExtraRows && ` (외 ${rows.length - MAX_PREVIEW_ROWS}행)`}
      </Hint>
    </PreviewWrap>
  );
}

const PreviewWrap = styled.div`
  display: grid;
  gap: 10px;
`;

const Summary = styled.div`
  display: flex;
  gap: 10px;
  color: #374151;
  font-size: 13px;
  font-weight: 700;
  span {
    background: #f3f4f6;
    padding: 6px 8px;
    border-radius: 8px;
  }
`;

const Warn = styled.div`
  background: #fff7ed;
  color: #9a3412;
  border: 1px solid #fdba74;
  padding: 8px 10px;
  border-radius: 10px;
  font-size: 12px;
  ul {
    margin: 6px 0 0 16px;
  }
`;

const TableWrap = styled.div`
  max-height: 50vh;
  overflow: auto;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
  }
  th,
  td {
    padding: 8px 10px;
    border-bottom: 1px solid #f1f5f9;
    text-align: left;
    white-space: nowrap;
  }
  thead th {
    position: sticky;
    top: 0;
    background: #f9fafb;
    z-index: 1;
  }
`;

const Hint = styled.div`
  color: #6b7280;
  font-size: 12px;
`;

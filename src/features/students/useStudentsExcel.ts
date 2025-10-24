import { useCallback, useRef, useState, type ChangeEvent } from "react";
import {
  downloadStudentsExcel,
  downloadStudentsTemplate,
  importStudentsExcel,
  previewImportStudentsExcel,
} from "@/api/students";
import { useToast } from "@/components/common/Toast";
import { readableError } from "@/lib/errors";
import type {
  StudentImportPreview,
  StudentImportPreviewRow,
  StudentsFiltersState,
} from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toPreviewRow(raw: unknown): StudentImportPreviewRow {
  if (!isRecord(raw)) return {};
  const toOptionalString = (value: unknown) =>
    typeof value === "string" ? value : undefined;
  return {
    row: typeof raw.row === "number" ? raw.row : undefined,
    name: toOptionalString(raw.name),
    status: toOptionalString(raw.status),
    joinedDate: toOptionalString(raw.joinedDate),
    birthDate: toOptionalString(raw.birthDate),
    phoneNumber: toOptionalString(raw.phoneNumber),
    guardianPhone: toOptionalString(raw.guardianPhone),
    address: toOptionalString(raw.address),
    isNew: raw.isNew === true,
  };
}

function saveBlobAsFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

type UseStudentsExcelOptions = {
  filters: StudentsFiltersState;
  onRefresh: () => void;
};

export function useStudentsExcel({ filters, onRefresh }: UseStudentsExcelOptions) {
  const { show, success, error: showError } = useToast();
  const [guideOpen, setGuideOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [preview, setPreview] = useState<StudentImportPreview | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const closePreview = useCallback(() => {
    setPreviewOpen(false);
    setPreview(null);
    setPendingFile(null);
  }, []);

  const handleExport = useCallback(async () => {
    try {
      const blob = await downloadStudentsExcel({
        status: filters.status || undefined,
        q: filters.q || undefined,
        from: filters.from || undefined,
        to: filters.to || undefined,
        ageMin: filters.ageMin ? Number(filters.ageMin) : undefined,
        ageMax: filters.ageMax ? Number(filters.ageMax) : undefined,
      });
      saveBlobAsFile(blob, "students.xlsx");
      success("엑셀 추출이 완료되었습니다.");
    } catch (err) {
      showError(readableError(err, "엑셀 추출에 실패했습니다."));
    }
  }, [
    filters.ageMax,
    filters.ageMin,
    filters.from,
    filters.q,
    filters.status,
    filters.to,
    success,
    showError,
  ]);

  const handleTemplate = useCallback(async () => {
    try {
      const blob = await downloadStudentsTemplate();
      saveBlobAsFile(blob, "students_template.xlsx");
      success("템플릿을 다운로드했습니다.");
    } catch (err) {
      showError(readableError(err, "템플릿 다운로드에 실패했습니다."));
    }
  }, [success, showError]);

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      try {
        const res = await previewImportStudentsExcel(file);
        const rows = Array.isArray(res.rows)
          ? res.rows.map((row) => toPreviewRow(row))
          : [];
        setPendingFile(file);
        setPreview({
          created: res.created,
          updated: res.updated,
          skipped: res.skipped,
          errors: res.errors,
          rows,
        });
        setPreviewOpen(true);
      } catch (err) {
        showError(readableError(err, "미리보기 생성에 실패했습니다."));
      } finally {
        event.target.value = "";
      }
    },
    [showError]
  );

  const confirmUpload = useCallback(async () => {
    if (!pendingFile) return;
    try {
      const res = await importStudentsExcel(pendingFile);
      show(`생성 ${res.created}, 수정 ${res.updated}, 건너뜀 ${res.skipped}`);
      onRefresh();
    } catch (err) {
      showError(readableError(err, "엑셀 업로드에 실패했습니다."));
    } finally {
      closePreview();
    }
  }, [pendingFile, show, showError, onRefresh, closePreview]);

  const triggerFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return {
    guideOpen,
    openGuide: () => setGuideOpen(true),
    closeGuide: () => setGuideOpen(false),
    confirmGuide: () => {
      setGuideOpen(false);
      setTimeout(triggerFileDialog, 0);
    },
    fileInputRef,
    handleExport,
    handleTemplate,
    handleFileChange,
    previewOpen,
    preview,
    cancelPreview: closePreview,
    confirmUpload,
  };
}

export type UseStudentsExcelReturn = ReturnType<typeof useStudentsExcel>;

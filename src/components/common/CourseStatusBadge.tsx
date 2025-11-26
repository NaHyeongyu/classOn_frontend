import styled from "styled-components";
import type { CourseStatus } from "@classon/shared-types";

type StatusValue = CourseStatus | string | null | undefined;

const STATUS_LABELS: Record<string, string> = {
  IN_PROGRESS: "진행중",
  PENDING: "대기",
  STOPPED: "중단",
};

function formatCourseStatus(status: StatusValue): string {
  if (!status) return "-";
  const normalized = status.toString().trim().toUpperCase();
  return (STATUS_LABELS[normalized] ?? normalized) || "-";
}

function normalizeCourseStatus(status: StatusValue): string {
  if (!status) return "UNKNOWN";
  const normalized = status.toString().trim().toUpperCase();
  return normalized || "UNKNOWN";
}

type CourseStatusBadgeProps = {
  status: StatusValue;
  className?: string;
};

export function CourseStatusBadge({ status, className }: CourseStatusBadgeProps) {
  const normalized = normalizeCourseStatus(status);
  return (
    <Badge data-type={normalized} className={className}>
      {formatCourseStatus(status)}
    </Badge>
  );
}

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 60px;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.2;
  &[data-type="IN_PROGRESS"] {
    background: #dcfce7;
    color: #16a34a;
  }
  &[data-type="PENDING"] {
    background: #f3e8ff;
    color: #7c3aed;
  }
  &[data-type="STOPPED"] {
    background: #e5e7eb;
    color: #374151;
  }
  &[data-type="UNKNOWN"] {
    background: #e2e8f0;
    color: #475569;
  }
`;

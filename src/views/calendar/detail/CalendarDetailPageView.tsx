import type { ComponentProps, ReactNode } from "react";
import CalendarDetailHeader from "@/components/calendar/detail/CalendarDetailHeader";
import ClassTimetable from "@/components/calendar/detail/ClassTimetable";
import CounselList from "@/components/calendar/detail/CounselList";
import TodoList from "@/components/calendar/detail/TodoList";
import { PaymentPanel } from "@/components/calendar/detail/PaymentPanel";
import {
  DetailColumns,
  DetailLeft,
  DetailCenter,
  DetailPage,
  DetailRight,
} from "@/components/calendar/detail/DetailLayout";
import TodoModal from "@/components/calendar/detail/modals/TodoModal";
import CounselModal from "@/components/calendar/detail/modals/CounselModal";
import ClassCreateModal from "@/components/calendar/detail/modals/ClassCreateModal";
import type { TaskItem, CounselItem, ClassItem } from "@/types/calendarDetail";
import type { CalendarPaymentRow } from "@/features/calendar/useCalendarPaymentList";

type TodoModalProps = ComponentProps<typeof TodoModal>;
type CounselModalProps = ComponentProps<typeof CounselModal>;
type ClassModalProps = ComponentProps<typeof ClassCreateModal>;

type CalendarDetailPageViewProps = {
  confirmDialog: ReactNode;
  header: {
    label: string;
    onBack: () => void;
    onPrev: () => void;
    onNext: () => void;
    onToday: () => void;
  };
  todoList: {
    inProgress: TaskItem[];
    done: TaskItem[];
    onAdd: () => void;
    onDelete: (id: number) => void;
    onEdit: (id: number) => void;
  };
  counselList: {
    items: CounselItem[];
    onAdd: () => void;
    onDetail: (studentId: number) => void;
  };
  classList: {
    items: ClassItem[];
    onAdd?: () => void;
  };
  paymentPanel?: {
    rows: CalendarPaymentRow[];
    loading?: boolean;
    error?: string | null;
    onMore?: () => void;
  };
  todoModal: TodoModalProps;
  counselModal: CounselModalProps;
  classModal: ClassModalProps;
  todoErrorMessage: ReactNode;
};

export default function CalendarDetailPageView({
  confirmDialog,
  header,
  todoList,
  counselList,
  classList,
  paymentPanel,
  todoModal,
  counselModal,
  classModal,
  todoErrorMessage,
}: CalendarDetailPageViewProps) {
  return (
    <DetailPage>
      {confirmDialog}
      <CalendarDetailHeader
        label={header.label}
        onBack={header.onBack}
        onPrev={header.onPrev}
        onNext={header.onNext}
        onToday={header.onToday}
      />
      <DetailColumns>
        <DetailLeft>
          <TodoList
            inProgress={todoList.inProgress}
            done={todoList.done}
            onAdd={todoList.onAdd}
            onDelete={todoList.onDelete}
            onEdit={todoList.onEdit}
          />
          <CounselList
            items={counselList.items}
            onAdd={counselList.onAdd}
            onDetail={counselList.onDetail}
          />
        </DetailLeft>
        <DetailCenter>
          <ClassTimetable
            items={classList.items}
            onAdd={classList.onAdd}
          />
        </DetailCenter>
        <DetailRight>
          {paymentPanel ? (
            <PaymentPanel
              rows={paymentPanel.rows}
              loading={paymentPanel.loading}
              error={paymentPanel.error}
              onMore={paymentPanel.onMore}
            />
          ) : null}
        </DetailRight>
      </DetailColumns>
      <TodoModal {...todoModal} />
      <CounselModal {...counselModal} />
      <ClassCreateModal {...classModal} />
      {todoErrorMessage && (
        <div style={{ color: "#b91c1c", marginTop: 8 }}>
          {todoErrorMessage}
        </div>
      )}
    </DetailPage>
  );
}


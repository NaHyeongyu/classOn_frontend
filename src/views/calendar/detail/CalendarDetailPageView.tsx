import type { ComponentProps, ReactNode } from "react";
import CalendarDetailHeader from "@/components/calendar/detail/CalendarDetailHeader";
import ClassList from "@/components/calendar/detail/ClassList";
import CounselList from "@/components/calendar/detail/CounselList";
import TodoList from "@/components/calendar/detail/TodoList";
import { PaymentPanel } from "@/components/calendar/detail/PaymentPanel";
import {
  DetailColumns,
  DetailLeft,
  DetailPage,
  DetailRight,
} from "@/components/calendar/detail/DetailLayout";
import TodoModal from "@/components/calendar/detail/modals/TodoModal";
import CounselModal from "@/components/calendar/detail/modals/CounselModal";
import ClassCreateModal from "@/components/calendar/detail/modals/ClassCreateModal";
import type { TaskItem, CounselItem, ClassItem } from "@/types/calendarDetail";
import type { CalendarPaymentSection } from "@/features/calendar/useCalendarPaymentList";

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
    configured: boolean;
    sections: CalendarPaymentSection[];
    loading?: boolean;
    error?: string | null;
    periodLabel?: string;
    rangeLabel?: string;
    onOpenSchedule?: () => void;
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
        <DetailRight>
          <ClassList
            items={classList.items}
            titleMode="subject"
            showNotes={true}
            onAdd={classList.onAdd}
          />
          {paymentPanel ? (
            <PaymentPanel
              configured={paymentPanel.configured}
              sections={paymentPanel.sections}
              loading={paymentPanel.loading}
              error={paymentPanel.error}
              periodLabel={paymentPanel.periodLabel}
              rangeLabel={paymentPanel.rangeLabel}
              onOpenSchedule={paymentPanel.onOpenSchedule}
              onMore={paymentPanel.onMore}
            />
          ) : null}
          <TodoModal {...todoModal} />
          <CounselModal {...counselModal} />
          <ClassCreateModal {...classModal} />
          {todoErrorMessage && (
            <div style={{ color: "#b91c1c", marginTop: 8 }}>
              {todoErrorMessage}
            </div>
          )}
        </DetailRight>
      </DetailColumns>
    </DetailPage>
  );
}

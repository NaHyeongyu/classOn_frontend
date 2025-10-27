import { useToast } from "@/components/common/Toast";
import { AdminFeedbacksPageView } from "@/views/admin/AdminFeedbacksPageView";
import { useAdminFeedbacksPage } from "@/features/admin/useAdminFeedbacksPage";

export default function AdminFeedbacks() {
  const { success: toastSuccess, error: toastError } = useToast();
  const state = useAdminFeedbacksPage({ toastSuccess, toastError });

  return (
    <AdminFeedbacksPageView
      rows={state.rows}
      loading={state.loading}
      error={state.error}
      page={state.page}
      size={state.size}
      totalPages={state.totalPages}
      totalElements={state.totalElements}
      from={state.from}
      to={state.to}
      typeInput={state.typeInput}
      statusInput={state.statusInput}
      qInput={state.qInput}
      headerSubtitle={state.headerSubtitle}
      pageInfo={state.pageInfo}
      onChangeFrom={state.setFrom}
      onChangeTo={state.setTo}
      onChangeType={state.setTypeInput}
      onChangeStatus={state.setStatusInput}
      onChangeQuery={state.setQInput}
      onApplyFilters={state.handleApplyFilters}
      onChangeSize={state.handleChangeSize}
      onChangePage={state.handleChangePage}
      onUpdateStatus={state.handleUpdateStatus}
    />
  );
}

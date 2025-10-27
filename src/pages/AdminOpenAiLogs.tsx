import { useToast } from "@/components/common/Toast";
import { AdminOpenAiLogsPageView } from "@/views/admin/AdminOpenAiLogsPageView";
import { useAdminOpenAiLogsPage } from "@/features/admin/useAdminOpenAiLogsPage";

export default function AdminOpenAiLogs() {
  const { error: toastError } = useToast();
  const state = useAdminOpenAiLogsPage({ toastError });

  return (
    <AdminOpenAiLogsPageView
      rows={state.rows}
      loading={state.loading}
      error={state.error}
      page={state.page}
      size={state.size}
      totalPages={state.totalPages}
      totalElements={state.totalElements}
      from={state.from}
      to={state.to}
      modelInput={state.modelInput}
      successFilterInput={state.successFilterInput}
      modelQuery={state.modelQuery}
      successFilter={state.successFilter}
      rangeLabel={state.rangeLabel}
      displayedRange={state.displayedRange}
      pageInfo={state.pageInfo}
      onChangeFrom={state.setFrom}
      onChangeTo={state.setTo}
      onChangeModelInput={state.setModelInput}
      onChangeSuccessFilter={state.setSuccessFilterInput}
      onApplyFilters={state.handleApplyFilters}
      onChangeSize={state.handleChangeSize}
      onChangePage={state.handleChangePage}
    />
  );
}

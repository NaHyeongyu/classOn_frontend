import { useToast } from "@/components/common/Toast";
import { AdminApiLogsPageView } from "@/components/admin/AdminApiLogsPageView";
import { useAdminApiLogsPage } from "@/features/admin/useAdminApiLogsPage";

export default function AdminApiLogs() {
  const { error: toastError } = useToast();
  const state = useAdminApiLogsPage({ toastError });

  return (
    <AdminApiLogsPageView
      rows={state.rows}
      loading={state.loading}
      error={state.error}
      page={state.page}
      size={state.size}
      totalPages={state.totalPages}
      totalElements={state.totalElements}
      from={state.from}
      to={state.to}
      onChangeFrom={state.setFrom}
      onChangeTo={state.setTo}
      pathInput={state.pathInput}
      onChangePathInput={state.setPathInput}
      errorsFilterInput={state.errorsFilterInput}
      onChangeErrorsFilter={state.setErrorsFilterInput}
      pathQuery={state.pathQuery}
      errorsFilter={state.errorsFilter}
      rangeLabel={state.rangeLabel}
      displayedRange={state.displayedRange}
      pageInfo={state.pageInfo}
      onApplyFilters={state.handleApplyFilters}
      onChangeSize={state.handleChangeSize}
      onChangePage={state.handleChangePage}
    />
  );
}

import { useToast } from "@/components/common/Toast";
import { AdminPaymentsPageView } from "@/components/admin/AdminPaymentsPageView";
import { useAdminPaymentsPage } from "@/features/admin/useAdminPaymentsPage";

export default function AdminPayments() {
  const { error: toastError } = useToast();
  const state = useAdminPaymentsPage({ toastError });

  return (
    <AdminPaymentsPageView
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
      rangeLabel={state.rangeLabel}
      displayedRange={state.displayedRange}
      rangeSummary={state.rangeSummary}
      pageInfo={state.pageInfo}
      onApplyRange={state.handleApplyRange}
      onChangeSize={state.handleChangeSize}
      onChangePage={state.handleChangePage}
    />
  );
}

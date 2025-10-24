import { useToast } from "@/components/common/Toast";
import { AdminLoginsPageView } from "@/components/admin/AdminLoginsPageView";
import { useAdminLoginsPage } from "@/features/admin/useAdminLoginsPage";

export default function AdminLogins() {
  const { error: toastError } = useToast();
  const state = useAdminLoginsPage({ toastError });

  return (
    <AdminLoginsPageView
      rows={state.rows}
      loading={state.loading}
      error={state.error}
      page={state.page}
      size={state.size}
      totalPages={state.totalPages}
      totalElements={state.totalElements}
      searchInput={state.searchInput}
      searchQuery={state.searchQuery}
      onChangeSearchInput={state.setSearchInput}
      onSearch={state.handleSearch}
      onChangeSize={state.handleChangeSize}
      onChangePage={state.handleChangePage}
      rangeLabel={state.rangeLabel}
      pageInfo={state.pageInfo}
    />
  );
}

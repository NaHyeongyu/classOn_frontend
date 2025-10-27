import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { AdminAcademyDetailPageView } from "@/views/admin/AdminAcademyDetailPageView";
import { useAdminAcademyDetailPage } from "@/features/admin/hooks/useAdminAcademyDetailPage";

export default function AdminAcademyDetail() {
  const { id } = useParams();
  const academyId = useMemo(() => {
    if (!id) return null;
    const parsed = Number(id);
    return Number.isNaN(parsed) ? null : parsed;
  }, [id]);

  const detail = useAdminAcademyDetailPage(academyId);

  return <AdminAcademyDetailPageView {...detail} />;
}

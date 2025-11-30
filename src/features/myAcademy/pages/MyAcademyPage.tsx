import { MyAcademyPageView } from "@/views/myAcademy/MyAcademyPageView";
import { MyAcademyProfileModal } from "@/components/myAcademy/MyAcademyProfileModal";
import { MyAcademyPhoneModal } from "@/components/myAcademy/MyAcademyPhoneModal";
import { MyAcademyPasswordModal } from "@/components/myAcademy/MyAcademyPasswordModal";
import { MyAcademyAcademyModal } from "@/components/myAcademy/MyAcademyAcademyModal";
import { MyAcademySellerModal } from "@/components/myAcademy/MyAcademySellerModal";
import { useMyAcademyPage } from "@/features/myAcademy/hooks/useMyAcademyPage";

export default function MyAcademyPage() {
  const state = useMyAcademyPage();

  return (
    <>
      <MyAcademyPageView
        error={state.error}
        onDismissError={state.clearError}
        onLogout={state.handleLogout}
        account={state.account}
        academy={state.academy}
        billing={state.billing}
        seller={state.seller}
      />
      <MyAcademyProfileModal modal={state.profileModal} />
      <MyAcademyPhoneModal modal={state.phoneModal} />
      <MyAcademyPasswordModal modal={state.passwordModal} />
      <MyAcademyAcademyModal modal={state.academyModal} />
      <MyAcademySellerModal modal={state.sellerModal} />
    </>
  );
}

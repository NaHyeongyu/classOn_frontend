import { useCallback, useEffect, useState } from "react";
import {
  changeMyTeacherPassword,
  getMyTeacherProfile,
  updateMyTeacherProfile,
  type ChangeTeacherPasswordPayload,
  type TeacherProfile,
  type TeacherProfileUpdatePayload,
} from "@/api/teachers";
import { getErrorMessage } from "@/lib/errors";

type TeacherProfileData = {
  profile: TeacherProfile | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  setProfile: React.Dispatch<React.SetStateAction<TeacherProfile | null>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
};

function useTeacherProfileData(): TeacherProfileData {
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getMyTeacherProfile();
      setProfile(res);
    } catch (err) {
      setError(getErrorMessage(err, "강사 정보를 불러오지 못했습니다."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    profile,
    loading,
    error,
    refresh: load,
    setProfile,
    setError,
  };
}

export function useTeacherProfilePage() {
  const { profile, loading, error, refresh, setProfile, setError } = useTeacherProfileData();
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const saveProfile = useCallback(
    async (payload: TeacherProfileUpdatePayload) => {
      setSavingProfile(true);
      setError(null);
      try {
        const res = await updateMyTeacherProfile(payload);
        setProfile(res);
        return res;
      } finally {
        setSavingProfile(false);
      }
    },
    [setError, setProfile],
  );

  const changePassword = useCallback(
    async (payload: ChangeTeacherPasswordPayload) => {
      setChangingPassword(true);
      setError(null);
      try {
        await changeMyTeacherPassword(payload);
      } finally {
        setChangingPassword(false);
      }
    },
    [setError],
  );

  return {
    profile,
    loading,
    error,
    refresh,
    savingProfile,
    changePassword,
    saveProfile,
    changingPassword,
    clearError: () => setError(null),
  };
}

export function useTeacherHomePage() {
  const { profile, loading, error, refresh } = useTeacherProfileData();
  return { profile, loading, error, refresh };
}

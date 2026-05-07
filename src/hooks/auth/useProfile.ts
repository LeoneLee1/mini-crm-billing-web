import { getProfile, updateProfile } from "@/services/auth/authService";
import { useAuthStore } from "@/store/authStore";
import { getInitials } from "@/utils/formatters";
import { Toast } from "@/utils/sweet_alert_utils/Toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function useProfile() {
  const router = useRouter();
  const storeUser = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getProfile();
        const user = res.data ?? res;
        setName(user.name ?? "");
        setEmail(user.email ?? "");
        setCreatedAt(user.created_at ?? "");
        setUpdatedAt(user.updated_at ?? "");
      } catch {
        // fallback to store if API failed
        if (storeUser) {
          setName(storeUser.name);
          setEmail(storeUser.email);
          setCreatedAt(storeUser.created_at);
          setUpdatedAt(storeUser.updated_at);
        }
      } finally {
        setIsFetching(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateProfile({ name, email });

      // Refetch from server so that store (and Header) are immediately synced
      const fresh = await getProfile();
      const serverUser = fresh?.data ?? fresh;
      if (serverUser?.id) {
        updateUser(serverUser);
        setName(serverUser.name ?? name);
        setEmail(serverUser.email ?? email);
        if (serverUser.updated_at) setUpdatedAt(serverUser.updated_at);
        if (serverUser.created_at) setCreatedAt(serverUser.created_at);
      } else {
        updateUser({ name, email });
      }

      Toast.fire({ icon: "success", title: "Profile updated successfully!" });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to update profile. Please try again.";
      Toast.fire({ icon: "error", title: "Failed", text: msg });
    } finally {
      setIsSaving(false);
    }
  };

  const initials = getInitials(name || storeUser?.name || "?");

  return {
    isFetching,
    name,
    setName,
    email,
    setEmail,
    createdAt,
    isSaving,
    updatedAt,
    handleSave,
    initials,
    router,
  };
}

export default useProfile;

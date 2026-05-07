import { updatePassword } from "@/services/auth/authService";
import { Toast } from "@/utils/sweet_alert_utils/Toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface PasswordField {
  value: string;
}

function useUpdatePassword() {
  const router = useRouter();

  const [oldPassword, setOldPassword] = useState<PasswordField>({
    value: "",
  });
  const [newPassword, setNewPassword] = useState<PasswordField>({
    value: "",
  });
  const [confirmPassword, setConfirmPassword] = useState<PasswordField>({
    value: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (newPassword.value !== confirmPassword.value) {
      Toast.fire({
        icon: "error",
        title: "New password and confirmation do not match.",
      });
      return;
    }

    setIsLoading(true);
    try {
      await updatePassword({
        old_password: oldPassword.value,
        new_password: newPassword.value,
        confirm_password: confirmPassword.value,
      });
      Toast.fire({
        icon: "success",
        title: "Password updated successfully!",
      });
      router.push("/profile");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed change password. Please try again.";
      Toast.fire({ icon: "error", title: "Failed", text: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/profile");
  };

  return {
    handleSubmit,
    oldPassword,
    setOldPassword,
    isLoading,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    router,
    handleCancel,
  };
}

export default useUpdatePassword;

"use client";

import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useUpdatePassword from "@/hooks/auth/useUpdatePassword";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function UpdatePasswordFeatures() {
  const {
    handleSubmit,
    oldPassword,
    setOldPassword,
    isLoading,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    handleCancel,
  } = useUpdatePassword();

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="max-w-2xl mx-auto pb-10">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-5">
          Change Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Old Password */}
          <div className="space-y-1.5">
            <Label
              htmlFor="old_password"
              className="flex items-center gap-1.5 text-gray-600"
            >
              <Lock className="w-3.5 h-3.5" />
              Old Password
            </Label>
            <div className="relative">
              <Input
                id="old_password"
                type={showOld ? "text" : "password"}
                className="h-11 pr-10"
                placeholder="Enter old password"
                value={oldPassword.value}
                onChange={(e) =>
                  setOldPassword((p) => ({ ...p, value: e.target.value }))
                }
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowOld((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                aria-label={showOld ? "Hide password" : "Show password"}
              >
                {showOld ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <Label
              htmlFor="new_password"
              className="flex items-center gap-1.5 text-gray-600"
            >
              <Lock className="w-3.5 h-3.5" />
              New Password
            </Label>
            <div className="relative">
              <Input
                id="new_password"
                type={showNew ? "text" : "password"}
                className="h-11 pr-10"
                placeholder="Enter new password"
                value={newPassword.value}
                onChange={(e) =>
                  setNewPassword((p) => ({ ...p, value: e.target.value }))
                }
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowNew((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                aria-label={
                  showNew ? "Hide password" : "Show password"
                }
              >
                {showNew ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <Label
              htmlFor="confirm_password"
              className="flex items-center gap-1.5 text-gray-600"
            >
              <Lock className="w-3.5 h-3.5" />
              Confirmation New Password
            </Label>
            <div className="relative">
              <Input
                id="confirm_password"
                type={showConfirm ? "text" : "password"}
                className={cn(`h-11 pr-10 ${confirmPassword.value && confirmPassword.value !== newPassword.value ? "border-red-300 focus:ring-red-200" : ""}`)}
                placeholder="Repeat new password"
                value={confirmPassword.value}
                onChange={(e) =>
                  setConfirmPassword((p) => ({ ...p, value: e.target.value }))
                }
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {confirmPassword.value &&
              confirmPassword.value !== newPassword.value && (
                <p className="text-xs text-red-500 mt-1">Password not match.</p>
              )}
          </div>

          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-11 text-sm cursor-pointer"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-11 text-sm font-semibold cursor-pointer"
              disabled={
                isLoading ||
                (!!confirmPassword.value &&
                  confirmPassword.value !== newPassword.value)
              }
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </span>
              ) : (
                "Save Password"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

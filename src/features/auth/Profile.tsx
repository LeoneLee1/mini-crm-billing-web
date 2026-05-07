"use client";

import {
  Loader2,
  User,
  Mail,
  Calendar,
  RefreshCw,
  KeyRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useProfile from "@/hooks/auth/useProfile";
import { formatDate } from "@/utils/formatters";

export default function ProfileFeatures() {
  const {
    isFetching,
    name,
    setName,
    email,
    setEmail,
    createdAt,
    updatedAt,
    handleSave,
    isSaving,
    initials,
    router,
  } = useProfile();

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-10">
      {/* Profile summary card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-5">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0 select-none"
          style={{ backgroundColor: "#1d3494" }}
        >
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-lg font-semibold text-gray-800 truncate">{name}</p>
          <p className="text-sm text-gray-400 truncate">{email}</p>
          {createdAt && (
            <p className="text-xs text-gray-300 mt-1">
              Member Since {formatDate(createdAt)}
            </p>
          )}
        </div>
      </div>

      {/* Edit form card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-5">
          Edit Profile
        </h2>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Name */}
          <div className="space-y-1.5">
            <Label
              htmlFor="name"
              className="flex items-center gap-1.5 text-gray-600"
            >
              <User className="w-3.5 h-3.5" />
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              className="h-11"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isSaving}
              placeholder="Full name"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label
              htmlFor="email"
              className="flex items-center gap-1.5 text-gray-600"
            >
              <Mail className="w-3.5 h-3.5" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              className="h-11"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSaving}
              placeholder="Email address"
            />
          </div>

          {/* Timestamps — read only */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-gray-400 text-xs">
                <Calendar className="w-3.5 h-3.5" />
                Member Since
              </Label>
              <Input
                className="h-11 bg-gray-50 text-gray-400 cursor-default text-sm"
                value={createdAt ? formatDate(createdAt) : "—"}
                readOnly
                tabIndex={-1}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-gray-400 text-xs">
                <RefreshCw className="w-3.5 h-3.5" />
                Latest Updated
              </Label>
              <Input
                className="h-11 bg-gray-50 text-gray-400 cursor-default text-sm"
                value={updatedAt ? formatDate(updatedAt) : "—"}
                readOnly
                tabIndex={-1}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <Button
              type="submit"
              className="flex-1 h-11 text-sm font-semibold cursor-pointer"
              disabled={isSaving}
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </span>
              ) : (
                "Save"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 px-4 text-sm cursor-pointer flex items-center gap-2 shrink-0"
              onClick={() => router.push("/profile/update-password")}
              disabled={isSaving}
            >
              <KeyRound className="w-4 h-4" />
              Change Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import { Pencil, Trash2, Users as UsersIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Table, TableColumn } from "@/components/ui/table";
import { User } from "@/services/users/userTypes";

function RoleBadge({ role }: { role: string }) {
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap", role === "admin" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600")}>
      {role === "admin" ? "Admin" : "Staff"}
    </span>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

interface UserTableProps {
  users: User[];
  loading: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export default function UserTable({ users, loading, onEdit, onDelete }: UserTableProps) {
  const columns: TableColumn<User>[] = [
    {
      key: "no",
      header: "No",
      headerClassName: "w-10",
      cellClassName: "text-gray-400 font-medium",
      render: (_, index) => index + 1,
    },
    {
      key: "name",
      header: "Name",
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: "#4a6ee0" }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <span className="font-medium text-gray-800">{user.name}</span>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      cellClassName: "text-gray-500",
      render: (user) => user.email,
    },
    {
      key: "role",
      header: "Role",
      render: (user) => <RoleBadge role={user.role} />,
    },
    {
      key: "created_at",
      header: "Created At",
      headerClassName: "hidden lg:table-cell",
      cellClassName: "hidden lg:table-cell text-gray-500 whitespace-nowrap",
      render: (user) => formatDate(user.created_at),
    },
    {
      key: "actions",
      header: "Action",
      headerClassName: "text-center w-20",
      render: (user) => (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => onEdit(user)} className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors" title="Edit">
            <Pencil className="w-4 h-4" />
          </button>
          <button onClick={() => onDelete(user)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors" title="Hapus">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={users}
      keyExtractor={(u) => u.id}
      loading={loading}
      emptyText="No users found."
      emptyIcon={<UsersIcon className="w-10 h-10 text-gray-300" />}
      renderMobileItem={(user) => (
        <div className="flex items-center gap-3 px-4 py-3.5">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ backgroundColor: "#4a6ee0" }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-gray-800 text-sm truncate">{user.name}</span>
              <RoleBadge role={user.role} />
            </div>
            <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
          </div>
          <div className="flex items-center gap-0.5 shrink-0">
            <button onClick={() => onEdit(user)} className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 active:bg-blue-100 transition-colors" title="Edit">
              <Pencil className="w-4 h-4" />
            </button>
            <button onClick={() => onDelete(user)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 active:bg-red-100 transition-colors" title="Hapus">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    />
  );
}

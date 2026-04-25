"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Users as UsersIcon } from "lucide-react";
import Swal from "sweetalert2";
import { cn } from "@/lib/utils";
import { getUsers, deleteUser } from "@/services/users/userService";
import { User } from "@/services/users/userTypes";
import { Pagination, PaginationMeta } from "@/components/ui/pagination";
import UserTable from "./UserTable";
import UserModal from "./UserModal";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

type RoleFilter = "all" | "admin" | "staff";

const ROLE_FILTERS: { label: string; value: RoleFilter }[] = [
  { label: "Semua", value: "all" },
  { label: "Admin", value: "admin" },
  { label: "Staff", value: "staff" },
];

const LIMIT = 10;
const DEFAULT_META: PaginationMeta = { page: 1, totalPage: 1, total: 0, limit: LIMIT };

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META);

  // Derived loading: true whenever page/refreshKey changed but fetch hasn't resolved yet
  const [fetchedFor, setFetchedFor] = useState<{ page: number; key: number } | null>(null);
  const loading = fetchedFor?.page !== page || fetchedFor?.key !== refreshKey;

  const [searchName, setSearchName] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    let active = true;

    getUsers({ page, limit: LIMIT })
      .then((res) => {
        if (!active) return;
        const data = res?.data;
        const fetched: User[] = Array.isArray(data?.users) ? data.users : [];

        // Edge case: deleted last item on last page — go back one page
        if (fetched.length === 0 && page > 1) {
          setPage((p) => p - 1);
          return;
        }

        setUsers(fetched);
        setMeta({
          page: data?.page ?? 1,
          totalPage: data?.total_page ?? 1,
          total: data?.total ?? 0,
          limit: data?.limit ?? LIMIT,
        });
        setFetchedFor({ page, key: refreshKey });
      })
      .catch((err: unknown) => {
        if (!active) return;
        const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Gagal memuat data users.";
        Toast.fire({ icon: "error", title: "Gagal", text: msg });
        setFetchedFor({ page, key: refreshKey });
      });

    return () => {
      active = false;
    };
  }, [refreshKey, page]);

  const filteredUsers = users.filter((u) => {
    const matchName = u.name.toLowerCase().includes(searchName.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchName && matchRole;
  });

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchName(e.target.value);
    setPage(1);
  }

  function handleRoleFilter(value: RoleFilter) {
    setRoleFilter(value);
    setPage(1);
  }

  function openCreateModal() {
    setModalMode("create");
    setSelectedUser(null);
    setModalOpen(true);
  }

  function openEditModal(user: User) {
    setModalMode("edit");
    setSelectedUser(user);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setSelectedUser(null);
  }

  async function handleDelete(user: User) {
    const result = await Swal.fire({
      icon: "warning",
      title: "Hapus User?",
      text: `User "${user.name}" akan dihapus secara permanen.`,
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    });
    if (!result.isConfirmed) return;

    try {
      await deleteUser(user.id);
      Toast.fire({ icon: "success", title: "Berhasil!", text: "User berhasil dihapus." });
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Terjadi kesalahan. Silakan coba lagi.";
      Toast.fire({ icon: "error", title: "Gagal", text: msg });
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#1d3494" }}>
            <UsersIcon className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-bold text-gray-900 truncate">Manajemen Users</h1>
            <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Kelola akun pengguna sistem</p>
          </div>
        </div>
        <button onClick={openCreateModal} className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 shrink-0" style={{ backgroundColor: "#1d3494" }}>
          <Plus className="w-4 h-4" />
          <span>Tambah User</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama..."
            value={searchName}
            onChange={handleSearchChange}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500 bg-white transition-colors placeholder:text-gray-400"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {ROLE_FILTERS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => handleRoleFilter(value)}
              className={cn("px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-all border", roleFilter === value ? "text-white border-transparent" : "text-gray-600 border-gray-200 bg-white hover:bg-gray-50")}
              style={roleFilter === value ? { backgroundColor: "#1d3494", borderColor: "#1d3494" } : {}}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table + Pagination */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <UserTable users={filteredUsers} loading={loading} onEdit={openEditModal} onDelete={handleDelete} />
        <Pagination meta={meta} onPageChange={setPage} />
      </div>

      {/* Modal */}
      {modalOpen && <UserModal key={modalMode === "create" ? "create" : selectedUser?.id} mode={modalMode} user={selectedUser} onClose={closeModal} onSuccess={() => setRefreshKey((k) => k + 1)} />}
    </div>
  );
}

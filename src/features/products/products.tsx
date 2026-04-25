"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Package } from "lucide-react";
import Swal from "sweetalert2";
import { cn } from "@/lib/utils";
import { getProducts, deleteProduct } from "@/services/products/productService";
import { Product } from "@/services/products/productTypes";
import { Pagination, PaginationMeta } from "@/components/ui/pagination";
import ProductTable from "./ProductTable";
import ProductModal from "./ProductModal";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

type ActiveFilter = "all" | "active" | "inactive";

const ACTIVE_FILTERS: { label: string; value: ActiveFilter }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const LIMIT = 10;
const DEFAULT_META: PaginationMeta = { page: 1, totalPage: 1, total: 0, limit: LIMIT };

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META);

  const [fetchedFor, setFetchedFor] = useState<{ page: number; key: number } | null>(null);
  const loading = fetchedFor?.page !== page || fetchedFor?.key !== refreshKey;

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    let active = true;

    getProducts({ page, limit: LIMIT })
      .then((res) => {
        if (!active) return;
        const data = res?.data;
        const fetched: Product[] = Array.isArray(data?.products) ? data.products : [];

        if (fetched.length === 0 && page > 1) {
          setPage((p) => p - 1);
          return;
        }

        setProducts(fetched);
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
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          "Failed to load products.";
        Toast.fire({ icon: "error", title: "Failed", text: msg });
        setFetchedFor({ page, key: refreshKey });
      });

    return () => { active = false; };
  }, [refreshKey, page]);

  const uniqueCategories = [...new Set(products.map((p) => p.category).filter((c) => c?.trim()))];

  const filteredProducts = products.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    const matchCategory = !categoryFilter || p.category === categoryFilter;
    const matchActive =
      activeFilter === "all" || (activeFilter === "active" ? p.is_active : !p.is_active);
    return matchSearch && matchCategory && matchActive;
  });

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    setPage(1);
  }

  function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setCategoryFilter(e.target.value);
    setPage(1);
  }

  function handleActiveFilter(value: ActiveFilter) {
    setActiveFilter(value);
    setPage(1);
  }

  function openCreateModal() {
    setModalMode("create");
    setSelectedProduct(null);
    setModalOpen(true);
  }

  function openEditModal(product: Product) {
    setModalMode("edit");
    setSelectedProduct(product);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setSelectedProduct(null);
  }

  async function handleDelete(product: Product) {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete Product?",
      text: `Product "${product.name}" will be deleted permanently.`,
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    });
    if (!result.isConfirmed) return;

    try {
      await deleteProduct(product.id);
      Toast.fire({ icon: "success", title: "Success!", text: "Product deleted successfully." });
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Something went wrong. Please try again.";
      Toast.fire({ icon: "error", title: "Failed", text: msg });
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: "#1d3494" }}
          >
            <Package className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-bold text-gray-900 truncate">Product Management</h1>
            <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Manage your product catalog</p>
          </div>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 shrink-0"
          style={{ backgroundColor: "#1d3494" }}
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search name or description..."
            value={search}
            onChange={handleSearchChange}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500 bg-white transition-colors placeholder:text-gray-400"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={handleCategoryChange}
          className="w-full sm:w-auto px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500 bg-white transition-colors cursor-pointer text-gray-600"
        >
          <option value="">All Categories</option>
          {uniqueCategories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <div className="flex gap-2 flex-wrap">
          {ACTIVE_FILTERS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => handleActiveFilter(value)}
              className={cn(
                "px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-all border",
                activeFilter === value
                  ? "text-white border-transparent"
                  : "text-gray-600 border-gray-200 bg-white hover:bg-gray-50"
              )}
              style={activeFilter === value ? { backgroundColor: "#1d3494", borderColor: "#1d3494" } : {}}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table + Pagination */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <ProductTable
          products={filteredProducts}
          loading={loading}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />
        <Pagination meta={meta} onPageChange={setPage} />
      </div>

      {/* Modal */}
      {modalOpen && (
        <ProductModal
          key={modalMode === "create" ? "create" : selectedProduct?.id}
          mode={modalMode}
          product={selectedProduct}
          onClose={closeModal}
          onSuccess={() => setRefreshKey((k) => k + 1)}
        />
      )}
    </div>
  );
}

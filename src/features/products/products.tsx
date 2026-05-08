"use client";

import { Plus, Search, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { Pagination } from "@/components/ui/pagination";
import ProductTable from "./ProductTable";
import ProductModal from "./ProductModal";
import { SelectField } from "@/components/ui/select-field";
import { useListProducts, ActiveFilter } from "@/hooks/products/useListProducts";
import { useCreateProducts } from "@/hooks/products/useCreateProducts";
import { useUpdateProducts } from "@/hooks/products/useUpdateProducts";
import { useDeleteProducts } from "@/hooks/products/useDeleteProducts";

const ACTIVE_FILTERS: { label: string; value: ActiveFilter }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export default function Products() {
  const {
    filteredProducts, loading, setPage, meta,
    search, categoryFilter, activeFilter, uniqueCategories,
    handleSearchChange, handleCategoryChange, handleActiveFilter, refresh,
  } = useListProducts();

  const {
    createModalOpen, openCreateModal, closeCreateModal,
    form: createForm, errors: createErrors, submitting: createSubmitting,
    handleChange: createHandleChange, handleCategoryChange: createHandleCategoryChange, handleSubmit: createHandleSubmit,
  } = useCreateProducts(refresh);

  const {
    editModalOpen, selectedProduct, openEditModal, closeEditModal,
    form: editForm, errors: editErrors, submitting: editSubmitting,
    handleChange: editHandleChange, handleCategoryChange: editHandleCategoryChange,
    handleStatusChange: editHandleStatusChange, handleSubmit: editHandleSubmit,
  } = useUpdateProducts(refresh);

  const { handleDelete } = useDeleteProducts(refresh);

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

        <SelectField
          value={categoryFilter}
          onChange={handleCategoryChange}
          options={[
            { label: "All Categories", value: "" },
            ...uniqueCategories.map((cat) => ({ label: cat, value: cat })),
          ]}
          className="sm:w-auto"
        />

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
        <ProductTable products={filteredProducts} loading={loading} onEdit={openEditModal} onDelete={handleDelete} />
        <Pagination meta={meta} onPageChange={setPage} />
      </div>

      {/* Modals */}
      {createModalOpen && (
        <ProductModal
          key="create"
          mode="create"
          form={createForm}
          errors={createErrors}
          submitting={createSubmitting}
          onClose={closeCreateModal}
          handleChange={createHandleChange}
          handleCategoryChange={createHandleCategoryChange}
          handleSubmit={createHandleSubmit}
        />
      )}
      {editModalOpen && selectedProduct && (
        <ProductModal
          key={selectedProduct.id}
          mode="edit"
          form={editForm}
          errors={editErrors}
          submitting={editSubmitting}
          onClose={closeEditModal}
          handleChange={editHandleChange}
          handleCategoryChange={editHandleCategoryChange}
          handleStatusChange={editHandleStatusChange}
          handleSubmit={editHandleSubmit}
        />
      )}
    </div>
  );
}

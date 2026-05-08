import { useEffect, useState } from "react";
import { getProducts } from "@/services/products/productService";
import { Product } from "@/services/products/productTypes";
import { PaginationMeta } from "@/components/ui/pagination";
import { Toast } from "@/utils/sweet_alert_utils/Toast";

export type ActiveFilter = "all" | "active" | "inactive";

const LIMIT = 10;
const DEFAULT_META: PaginationMeta = { page: 1, totalPage: 1, total: 0, limit: LIMIT };

export function useListProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META);
  const [fetchedFor, setFetchedFor] = useState<{ page: number; key: number } | null>(null);
  const loading = fetchedFor?.page !== page || fetchedFor?.key !== refreshKey;

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("all");

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

    return () => {
      active = false;
    };
  }, [refreshKey, page]);

  const uniqueCategories = [...new Set(products.map((p) => p.category).filter((c) => c?.trim()))];

  const filteredProducts = products.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    const matchCategory = !categoryFilter || p.category === categoryFilter;
    const matchActive = activeFilter === "all" || (activeFilter === "active" ? p.is_active : !p.is_active);
    return matchSearch && matchCategory && matchActive;
  });

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    setPage(1);
  }

  function handleCategoryChange(value: string) {
    setCategoryFilter(value);
    setPage(1);
  }

  function handleActiveFilter(value: ActiveFilter) {
    setActiveFilter(value);
    setPage(1);
  }

  return {
    filteredProducts,
    loading,
    page,
    setPage,
    meta,
    search,
    categoryFilter,
    activeFilter,
    uniqueCategories,
    handleSearchChange,
    handleCategoryChange,
    handleActiveFilter,
    refresh: () => setRefreshKey((k) => k + 1),
  };
}

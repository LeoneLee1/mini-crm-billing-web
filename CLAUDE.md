@AGENTS.md

# CLAUDE.md — Mini CRM & Billing

## Stack
Next.js 16.2.4 (App Router) · React 19.2.4 (Compiler ON) · TS 5 strict · Tailwind 4 (`@import "tailwindcss"`) · shadcn/ui 4 (Base UI, `@base-ui/react`) · lucide-react · CVA 0.7.1 · `cn()` → `@/lib/utils`

## Folder Placement
| Path | Isi |
|---|---|
| `src/app/` | Routing only: page/layout/loading/error/not-found — **jangan** taruh komponen/logic |
| `src/components/ui/` | UI primitif reusable — CVA + cn(), named export, lowercase filename |
| `src/features/{fitur}/` | Komponen & logic per fitur bisnis — PascalCase, 1 folder per fitur |
| `src/layout/` | Header, Sidebar, Footer, MainLayout — **jangan** taruh di features/ui |
| `src/services/` | API calls — 1 file per domain, suffix `Service` |
| `src/hooks/` | Custom hooks — prefix `use`, camelCase |
| `src/redux/` | `store.ts` + `slices/{nama}Slice.ts` |
| `src/context/` | Context providers — PascalCase + suffix `Context` |
| `src/utils/` | Pure helper functions (formatter, validator, converter) |
| `src/lib/` | Lib config inti: axios instance, utils.ts |

## Konvensi
- **Import:** selalu `@/` alias — jangan relative lintas folder
- **Style:** selalu `cn()` untuk merge className; inline `style={{}}` hanya nilai dinamis
- **Brand:** Primary `#1d3494` · Secondary `#4a6ee0` · Font Poppins — CSS vars only, jangan hardcode di className

## Toast — WAJIB semua POST / PUT / PATCH / DELETE
```ts
const Toast = Swal.mixin({ toast: true, position: "top-end", showConfirmButton: false, timer: 3000, timerProgressBar: true });
// success → Toast.fire({ icon: "success", title: "Berhasil!", text: "..." })
// error   → Toast.fire({ icon: "error", title: "Gagal", text: res.data.message ?? "Terjadi kesalahan." })
// DELETE  → Swal.fire({ icon: "warning", showCancelButton: true }) konfirmasi dulu, lalu eksekusi
```

## Aturan Wajib
1. **Baca CLAUDE.md sebelum buat file baru** — pastikan placement folder benar
2. **Baca `node_modules/next/dist/docs/`** sebelum pakai fitur Next.js — ada breaking changes
3. Semua import wajib `@/` alias
4. UI baru → `/components/ui/` + CVA + `cn()`
5. Fitur baru → buat folder `/features/{nama-fitur}/`
6. Custom hook → `/hooks/` + prefix `use`
7. API calls WAJIB di `/services/` — jangan di dalam komponen
8. POST/PUT/PATCH/DELETE WAJIB toast SweetAlert2
9. Maks **250 baris per file** (toleransi 300) — jika lebih, pecah jadi beberapa file kecil

## Larangan
- ❌ `src/app/` hanya routing files; `/components/ui/` hanya UI primitif tanpa business logic
- ❌ Header/Sidebar/Footer di `/features/` atau `/components/ui/`
- ❌ Hardcode warna brand di className — gunakan CSS variables
- ❌ File langsung di root `src/` — semua wajib masuk subfolder

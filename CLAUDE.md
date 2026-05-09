@AGENTS.md

# CLAUDE.md — Mini CRM & Billing

## Stack

Next.js 16.2.4 (App Router) · React 19.2.4 (Compiler ON) · TS 5 strict · Tailwind 4 (`@import "tailwindcss"`) · shadcn/ui 4 (Base UI, `@base-ui/react`) · lucide-react · CVA 0.7.1 · `cn()` → `@/lib/utils`

## Folder Placement

| Path                    | Isi                                                                                 |
| ----------------------- | ----------------------------------------------------------------------------------- |
| `src/app/`              | Routing only: page/layout/loading/error/not-found — **jangan** taruh komponen/logic |
| `src/components/ui/`    | UI primitif reusable — CVA + cn(), named export, lowercase filename                 |
| `src/features/{fitur}/` | Komponen & logic per fitur bisnis — PascalCase, 1 folder per fitur                  |
| `src/layout/`           | Header, Sidebar, Footer, MainLayout — **jangan** taruh di features/ui               |
| `src/services/`         | API calls — 1 file per domain, suffix `Service`                                     |
| `src/hooks/`            | Custom hooks — prefix `use`, camelCase                                              |
| `src/redux/`            | `store.ts` + `slices/{nama}Slice.ts`                                                |
| `src/context/`          | Context providers — PascalCase + suffix `Context`                                   |
| `src/utils/`            | Pure helper functions (formatter, validator, converter)                             |
| `src/lib/`              | Lib config inti: axios instance, utils.ts                                           |

## Konvensi

- **Import:** selalu `@/` alias — jangan relative lintas folder
- **Style:** selalu `cn()` untuk merge className; inline `style={{}}` hanya nilai dinamis
- **Brand:** Primary `#1d3494` · Secondary `#4a6ee0` · Font Poppins — CSS vars only, jangan hardcode di className

## Toast — WAJIB semua POST / PUT / PATCH / DELETE

```ts
const Toast = Swal.mixin({ toast: true, position: "top-end", showConfirmButton: false, timer: 3000, timerProgressBar: true });
// success → Toast.fire({ icon: "success", title: "Success!", text: "..." })
// error   → Toast.fire({ icon: "error", title: "Failed", text: res.data.message ?? "Something went wrong." })
// DELETE  → Swal.fire({ icon: "warning", showCancelButton: true }) confirm first, then execute
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
10. **Semua teks UI wajib Bahasa Inggris** — label, placeholder, button, toast, error message, empty state, konfirmasi dialog, heading, tooltip — semua yang terlihat user harus English

## Form Input & Select Standard — WAJIB konsisten di semua modal/form

### Text input, textarea, date input

Gunakan 3 variabel ini di setiap modal/form. **Jangan variasikan padding/border/radius.**

```ts
const inputBase = "w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none transition-colors placeholder:text-gray-400";
const inputOk   = "border-gray-200 focus:border-blue-500 bg-white";
const inputErr  = "border-red-400 bg-red-50/30";

// Input/textarea → cn(inputBase, errors.field ? inputErr : inputOk)
// Date input     → cn(inputBase, errors.field ? inputErr : inputOk, "cursor-pointer")
```

### Dropdown/Select — WAJIB pakai `<SelectField>`

**Jangan gunakan native `<select>`** untuk dropdown di modal/form/filter. Selalu pakai komponen:

```ts
import { SelectField } from "@/components/ui/select-field";

// Penggunaan:
<SelectField
  value={value}
  onChange={(val) => setValue(val)}
  options={[{ label: "Label", value: "val" }]}
  placeholder="Select..."   // opsional
  error={!!errors.field}    // opsional, aktifkan border merah
/>
```

- `onChange` menerima `(value: string)` langsung — bukan event
- Referensi implementasi: `src/features/products/products.tsx`, `src/features/invoices/InvoiceModal.tsx`

## Larangan

- ❌ `src/app/` hanya routing files; `/components/ui/` hanya UI primitif tanpa business logic
- ❌ Header/Sidebar/Footer di `/features/` atau `/components/ui/`
- ❌ Hardcode warna brand di className — gunakan CSS variables
- ❌ File langsung di root `src/` — semua wajib masuk subfolder
- ❌ Gunakan `px-3 py-2` pada input di modal/form — standar wajib `px-3.5 py-2.5`
- ❌ Gunakan native `<select>` di modal/form/filter — wajib pakai `<SelectField>` dari `@/components/ui/select-field`

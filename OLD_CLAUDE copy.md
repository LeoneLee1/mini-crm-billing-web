@AGENTS.md

# CLAUDE.md — Panduan Kodebase Mini CRM & Billing

> **ATURAN WAJIB:** Setiap kali akan mengerjakan fitur baru atau menambah file, **BACA CLAUDE.md ini terlebih dahulu** dan sesuaikan penempatan file dengan aturan yang tertulis di bawah.

---

## Tech Stack

| Teknologi   | Versi                 | Catatan                                                                          |
| ----------- | --------------------- | -------------------------------------------------------------------------------- |
| Next.js     | 16.2.4                | App Router — **BUKAN Next.js standar**, baca `node_modules/next/dist/docs/` dulu |
| React       | 19.2.4                | React Compiler aktif (`reactCompiler: true` di next.config.ts)                   |
| TypeScript  | 5                     | Strict mode aktif                                                                |
| TailwindCSS | 4.0                   | Syntax baru: `@import "tailwindcss"` — **bukan** `@tailwind base`                |
| shadcn/ui   | 4.4.0                 | Pakai Base UI primitives (`@base-ui/react`), bukan Radix                         |
| Icons       | lucide-react 1.9.0    |                                                                                  |
| CVA         | 0.7.1                 | Untuk variant komponen (`class-variance-authority`)                              |
| cn()        | clsx + tailwind-merge | Import dari `@/lib/utils`                                                        |

---

## Peta Struktur Folder

```
src/
├── app/                  # Routing Next.js App Router (JANGAN taruh komponen di sini)
│   ├── (auth)/           # Route group autentikasi (tidak muncul di URL)
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── layout.tsx        # Root layout — font global, metadata
│   ├── page.tsx          # Halaman utama (/)
│   └── globals.css       # CSS global, variabel warna, Tailwind import
│
├── components/           # Komponen UI yang dapat digunakan ulang (reusable)
│   └── ui/               # Primitif UI: Button, Input, Card, Label, dll.
│
├── features/             # Modul berbasis fitur (business logic per fitur)
│   ├── auth/             # Fitur autentikasi (Login.tsx, Register.tsx)
│   └── Dashboard.tsx     # Komponen halaman dashboard
│
├── layout/               # Komponen layout global aplikasi
│   ├── MainLayout.tsx    # Wrapper layout utama
│   ├── Header.tsx        # Header atas
│   ├── Sidebar.tsx       # Navigasi sidebar
│   └── Footer.tsx        # Footer
│
├── lib/                  # Library/helper inti
│   └── utils.ts          # Fungsi cn() untuk merge className
│
├── context/              # React Context untuk state global
├── hooks/                # Custom React hooks
├── redux/                # Redux store, slices, dan logic state management
├── services/             # API calls dan integrasi layanan eksternal
└── utils/                # Fungsi helper dan utilitas umum
```

---

## Aturan Penempatan File

### `src/app/`

- **ISI:** File routing Next.js saja — `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`
- **JANGAN:** Taruh komponen React biasa, logic bisnis, atau utilitas di sini
- Gunakan **Route Groups** `(nama)/` untuk mengelompokkan rute tanpa memengaruhi URL

### `src/components/ui/`

- **ISI:** Komponen UI primitif yang reusable dan tidak memiliki logic bisnis
- **Contoh:** Button, Input, Card, Label, Modal, Badge, Tooltip, Select
- Komponen di sini harus bisa dipakai di seluruh aplikasi tanpa dependensi fitur tertentu
- Gunakan CVA untuk variant, gunakan `cn()` untuk merge className

### `src/features/`

- **ISI:** Komponen dan logic yang spesifik untuk satu fitur/domain bisnis
- Struktur: `features/{nama-fitur}/{NamaKomponen}.tsx`
- **Contoh:** `features/auth/Login.tsx`, `features/customers/CustomerList.tsx`
- Boleh memiliki sub-folder per fitur jika kompleks

### `src/layout/`

- **ISI:** Komponen yang membentuk kerangka/skeleton halaman (layout shell)
- **Contoh:** Header, Sidebar, Footer, Navbar, Breadcrumb
- Komponen di sini biasanya dipakai di `MainLayout.tsx`

### `src/lib/`

- **ISI:** Konfigurasi library pihak ketiga dan fungsi inti yang fundamental
- **Contoh:** `utils.ts` (cn), konfigurasi axios, konfigurasi auth

### `src/context/`

- **ISI:** React Context providers dan consumer hooks
- Satu file per context: `AuthContext.tsx`, `ThemeContext.tsx`

### `src/hooks/`

- **ISI:** Custom React hooks yang reusable lintas fitur
- Penamaan wajib prefix `use`: `useAuth.ts`, `useDebounce.ts`

### `src/redux/`

- **ISI:** Redux Toolkit store, slices, selectors, dan middleware
- Struktur: `redux/store.ts`, `redux/slices/{nama}Slice.ts`

### `src/services/`

- **ISI:** Fungsi API calls ke backend, fetch wrapper, integrasi third-party
- **Contoh:** `services/authService.ts`, `services/customerService.ts`
- Satu file per domain/resource

### `src/utils/`

- **ISI:** Fungsi helper murni (pure functions) yang tidak bergantung React
- **Contoh:** formatter tanggal, validator, converter, kalkulasi

---

## Konvensi Penamaan

### File & Folder

| Jenis                       | Konvensi                      | Contoh                                |
| --------------------------- | ----------------------------- | ------------------------------------- |
| Page (App Router)           | lowercase                     | `page.tsx`, `layout.tsx`              |
| Komponen (features, layout) | **PascalCase**                | `MainLayout.tsx`, `Dashboard.tsx`     |
| Komponen UI primitif        | **lowercase**                 | `button.tsx`, `card.tsx`, `input.tsx` |
| Custom hooks                | camelCase + prefix `use`      | `useAuth.ts`, `useDebounce.ts`        |
| Utilities / helpers         | camelCase                     | `utils.ts`, `formatDate.ts`           |
| Services                    | camelCase + suffix `Service`  | `authService.ts`                      |
| Redux slices                | camelCase + suffix `Slice`    | `authSlice.ts`                        |
| Context                     | PascalCase + suffix `Context` | `AuthContext.tsx`                     |
| Route groups                | lowercase dalam kurung        | `(auth)/`, `(dashboard)/`             |
| Folder fitur                | camelCase                     | `auth/`, `customers/`, `billing/`     |

### Komponen & Props

```tsx
// Props interface: NamaKomponenProps
interface HeaderProps {
  pageTitle?: string;
}

// Export default untuk komponen halaman/fitur
export default function Header({ pageTitle }: HeaderProps) { ... }

// Named export untuk komponen UI kecil
export { Button, buttonVariants }
```

### Import

```tsx
// Gunakan alias @/ untuk semua import dari src/
import { cn } from "@/lib/utils";
import Dashboard from "@/features/Dashboard";
import { Button } from "@/components/ui/button";

// Relative import hanya dalam folder yang sama
import Sidebar from "./Sidebar";
```

### Styling

```tsx
// Selalu gunakan cn() untuk merge className
import { cn } from "@/lib/utils";

className={cn("base-class", conditional && "extra-class", className)}

// Inline style hanya untuk nilai dinamis yang tidak bisa di-Tailwind
style={{ backgroundColor: brandColor }}
```

---

## Pola Komponen

### UI Primitif (`/components/ui/`)

```tsx
"use client"; // jika ada interaktivitas
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const componentVariants = cva("base-styles", {
  variants: { variant: { default: "...", outline: "..." } },
  defaultVariants: { variant: "default" },
});

interface ComponentProps extends React.ComponentProps<"element">, VariantProps<typeof componentVariants> {}

function Component({ variant, className, ...props }: ComponentProps) {
  return <element className={cn(componentVariants({ variant }), className)} {...props} />;
}
```

### Layout Components (`/layout/`)

```tsx
"use client"; // hampir selalu — navigasi, state, event
interface MainLayoutProps { children: React.ReactNode; pageTitle?: string; }

export default function MainLayout({ children, pageTitle }: MainLayoutProps) { ... }
```

### Feature Components (`/features/`)

```tsx
// Server Component by default (tanpa "use client") kecuali butuh interaktivitas
export default function CustomerList() { ... }
```

---

## Warna & Brand

| Token     | Nilai                                | Penggunaan                    |
| --------- | ------------------------------------ | ----------------------------- |
| Primary   | `#1d3494` / `oklch(0.395 0.148 264)` | Sidebar, tombol utama, avatar |
| Secondary | `#4a6ee0`                            | Aksen, dekorasi, highlight    |
| Font      | Poppins (via `next/font`)            | Seluruh aplikasi              |

Selalu gunakan CSS variables (`var(--primary)`) atau Tailwind utilities — jangan hardcode warna kecuali untuk nilai dinamis.

---

## Toast Alert (SweetAlert2)

Setiap aksi mutasi data **WAJIB** menampilkan feedback via toast SweetAlert2 — bukan inline error div.

### Setup mixin (tulis sekali di atas komponen, di luar fungsi)

```ts
import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});
```

### Kapan pakai toast

| Aksi HTTP | Trigger toast |
|-----------|--------------|
| `POST` | success saat data berhasil dibuat |
| `PUT` / `PATCH` | success saat data berhasil diupdate |
| `DELETE` | success saat data berhasil dihapus |
| Semua method | error jika request gagal (gunakan pesan dari `response.data.message`) |

### Pola try/catch standar

```ts
try {
  await someService.create(payload);
  Toast.fire({ icon: "success", title: "Berhasil!", text: "Data berhasil disimpan." });
} catch (err: unknown) {
  const msg =
    (err as { response?: { data?: { message?: string } } })?.response?.data?.message
    ?? "Terjadi kesalahan. Silakan coba lagi.";
  Toast.fire({ icon: "error", title: "Gagal", text: msg });
}
```

### Aturan

- **JANGAN** gunakan `alert()` atau `console.error()` sebagai pengganti toast
- **JANGAN** buat komponen toast custom — pakai SweetAlert2 mixin di atas
- Untuk aksi DELETE yang destruktif, gunakan `Swal.fire({ icon: "warning", showCancelButton: true })` sebagai konfirmasi sebelum eksekusi
- Pesan success: bahasa ramah pengguna ("Berhasil disimpan", "Data dihapus")
- Pesan error: tampilkan pesan dari API (`response.data.message`) jika ada, fallback ke pesan generik

---

## Aturan Wajib

1. **Baca CLAUDE.md ini sebelum membuat file baru** — pastikan file masuk ke folder yang tepat
2. **Baca `node_modules/next/dist/docs/`** sebelum menulis kode Next.js — versi ini memiliki breaking changes
3. Gunakan `@/` alias untuk semua import (bukan relative path lintas folder)
4. Semua komponen UI baru masuk ke `/components/ui/` dan gunakan CVA + `cn()`
5. Setiap fitur baru dibuatkan folder di `/features/{nama-fitur}/`
6. Custom hooks selalu prefix `use` dan masuk ke `/hooks/`
7. API calls dan fetch logic WAJIB masuk ke `/services/` — jangan taruh di komponen
8. **Setiap aksi POST/PUT/PATCH/DELETE WAJIB tampilkan toast SweetAlert2** — lihat seksi "Toast Alert" di atas
9. **Batas maksimal 250 baris per file** — jika mendekati atau melebihi 250 baris, pecah menjadi beberapa file yang lebih kecil. Toleransi maksimal 300 baris, tapi usahakan tetap di bawah 250

---

## Larangan

- **JANGAN** taruh komponen React di dalam `src/app/` (hanya file routing)
- **JANGAN** taruh logic bisnis atau API calls di dalam komponen UI (`/components/ui/`)
- **JANGAN** taruh layout shell (Header/Sidebar) di `/features/` atau `/components/ui/`
- **JANGAN** hardcode warna brand di className — gunakan CSS variables atau Tailwind tokens
- **JANGAN** gunakan relative path lintas folder (`../../features/`) — pakai `@/`
- **JANGAN** skip membaca doc di `node_modules/next/dist/docs/` sebelum pakai fitur Next.js baru
- **JANGAN** buat file langsung di root `src/` — semua harus masuk ke subfolder yang sesuai

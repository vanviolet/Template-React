# Frontend Development Rules

Gunakan stack berikut dan jangan mengganti library tanpa alasan teknis yang jelas:

- React
- React Router
- Zustand
- i18n
- shadcn/ui
- Tailwind CSS
- Lucide React
- TanStack Form
- Zod
- TanStack Query
- swagger-typescript-api
- react-number-format

## Frontend Rules

- **Routing:** gunakan React Router dengan struktur rapi dan modular. Semua page gunakan `React.lazy` + `Suspense`. Loading route gunakan progress bar di atas halaman.
- **State:** Zustand hanya untuk client/global state. TanStack Query untuk API/server state, caching, loading, mutation, refetch, dan invalidation.
- **Text:** semua text yang tampil ke user wajib menggunakan **i18n**. Jangan hardcode text UI.
- **UI:** prioritaskan **shadcn/ui** dan gunakan **Lucide React** untuk icon.
- **Responsive:** semua halaman wajib mobile-friendly.
- **Theme:** support Light/Dark Mode. Jangan hardcode warna. Gunakan semantic theme token seperti `success`, `warning`, `error`, `info`.
- **Form:** gunakan TanStack Form + Zod. Validation harus interactive dan error tampil di bawah input setelah field mulai diinteraksikan.
- **API:** selalu gunakan API client dan type dari `api-generated.ts`. Jangan membuat endpoint, request, response, atau type manual jika sudah tersedia. Jika Swagger berubah, jalankan:

```bash
npx codegen
```

- **Toast:** success/error backend yang membutuhkan feedback gunakan Toast. Error wajib menggunakan message dari backend, kecuali error `500` atau backend tidak memberikan message.
- **Table:** jika API menyediakan pagination, gunakan server-side pagination. Tambahkan kolom `No.` dengan urutan sesuai page dan page size.
- **Filter:** gunakan URL Search Params untuk filter, search, sorting, dan pagination. Filter aktif tampilkan sebagai Badge/Chip yang bisa dihapus.
- **Empty State:** bedakan data benar-benar kosong dengan data tidak ditemukan karena filter/search.
- **Select:** gunakan Combobox shadcn. Untuk data API besar gunakan server-side search + pagination/infinite loading.
- **Number Input:** gunakan `react-number-format` untuk No HP, NIK, Rupiah, currency, dan input numeric berformat.
- **Boolean:** untuk pilihan `true/false` yang membutuhkan penjelasan, gunakan Radio Group berbentuk Card.
- **Loading:** route → top progress, data → skeleton, mutation → loading pada button.

---

# UI Design Rules

Gunakan gaya UI **minimalis, clean, elegan, dan modern**.

- Hindari UI yang terlalu ramai, terlalu banyak warna, gradient, shadow, border, atau dekorasi yang tidak diperlukan.
- Gunakan whitespace dan spacing yang cukup agar layout terasa lega dan mudah dibaca.
- Gunakan visual hierarchy yang jelas untuk title, description, section, dan action.
- Gunakan typography yang sederhana dan konsisten.
- Gunakan border radius, shadow, border, dan background secara subtle.
- Prioritaskan warna neutral. Gunakan warna semantic hanya ketika memiliki fungsi seperti success, warning, error, dan info.
- Jangan menggunakan terlalu banyak variasi ukuran button, input, card, atau component.
- Gunakan icon hanya jika membantu memahami action, bukan sekadar dekorasi.
- Hindari card untuk setiap elemen jika grouping dapat dilakukan dengan layout sederhana.
- Hindari nested card berlebihan.
- Form harus rapi, memiliki spacing konsisten, label jelas, dan validation mudah dibaca.
- Table harus clean, tidak terlalu padat, dan action row sebaiknya menggunakan icon/dropdown jika jumlah action banyak.
- Dialog tidak boleh terlalu besar jika content sedikit.
- Empty state, loading state, dan error state harus memiliki tampilan konsisten.
- Light dan Dark Mode harus sama-sama nyaman dibaca.

Gunakan pola visual yang konsisten di seluruh aplikasi. Jangan membuat desain baru yang berbeda untuk setiap module.

---

# Folder Structure

Gunakan struktur dasar berikut:

```text
src/
├── app/
│   ├── router/
│   ├── providers/
│   └── store/
│
├── layouts/
│   ├── app/
│   ├── auth/
│   └── blank/
│
├── views/
├── components/
├── hooks/
├── services/
├── utils/
├── constants/
├── types/
├── i18n/
├── assets/
├── styles/
├── main.tsx
└── vite-env.d.ts
```

Fungsi folder:

- `app/` → router, provider, global store, konfigurasi inti aplikasi.
- `layouts/` → layout utama aplikasi.
- `views/` → module/halaman bisnis.
- `components/` → reusable component lintas module.
- `hooks/` → reusable custom hooks.
- `services/` → API client, `api-generated.ts`, query key, dan kebutuhan API.
- `utils/` → reusable helper/function.
- `constants/` → reusable constant.
- `types/` → reusable TypeScript types.
- `i18n/` → translation dan konfigurasi i18n.
- `assets/` → image/static asset.
- `styles/` → global CSS dan theme.

---

# File Naming

Gunakan **lowercase** untuk nama file.

Jika nama file terdiri dari lebih dari satu kata, pisahkan menggunakan titik (`.`).

Contoh yang benar:

```text
theme.provider.tsx
query.provider.tsx
admin.routes.tsx
auth.routes.tsx
action.table.tsx
user.store.ts
query.keys.ts
use.search.params.ts
```

Hindari:

```text
ThemeProvider.tsx
theme-provider.tsx
themeProvider.tsx
adminRoutes.tsx
admin_routes.tsx
```

Gunakan pola:

```text
<nama>.<jenis>.tsx
```

jika file memiliki responsibility khusus.

Contoh:

```text
theme.provider.tsx
auth.guard.tsx
user.store.ts
user.schema.ts
query.keys.ts
admin.routes.tsx
```

Untuk nama sederhana satu kata, tidak perlu tambahan titik:

```text
view.tsx
table.tsx
form.tsx
dialog.tsx
schema.ts
types.ts
utils.ts
constants.ts
```

Utamakan nama yang pendek dan mudah dipahami. Jangan mengulang nama module jika konteksnya sudah jelas dari folder.

---

# Layout Structure

Contoh:

```text
layouts/
├── app/
│   ├── layout.tsx
│   ├── header.tsx
│   ├── sidebar.tsx
│   └── footer.tsx
│
├── auth/
│   └── layout.tsx
│
└── blank/
    └── layout.tsx
```

Gunakan React Router layout agar Header, Sidebar, Footer, dan wrapper tidak diduplikasi di setiap halaman.

---

# Module Structure

Setiap module/view harus memiliki folder sendiri.

Contoh module `pengguna`:

```text
src/views/pengguna/
├── view.tsx
├── table.tsx
├── action.tsx
├── action.table.tsx
├── form.tsx
├── dialog.tsx
├── schema.ts
├── types.ts
├── constants.ts
└── utils.ts
```

Gunakan file hanya jika memang diperlukan.

- `view.tsx` → root/orchestrator halaman.
- `table.tsx` → table/list data.
- `action.tsx` → action di atas table seperti tambah, search, filter.
- `action.table.tsx` → action setiap row seperti edit, detail, hapus.
- `form.tsx` → form tambah/edit.
- `dialog.tsx` → dialog pembungkus form/action.
- `schema.ts` → Zod schema.
- `types.ts` → type khusus module.
- `constants.ts` → constant khusus module.
- `utils.ts` → helper khusus module.

`view.tsx` hanya digunakan untuk menyusun component, bukan menampung seluruh implementasi halaman.

```tsx
export function PenggunaView() {
  return (
    <>
      <PenggunaAction />
      <PenggunaTable />
      <PenggunaDialog />
    </>
  )
}
```

---

# Split File & Reusability

- Jangan membuat satu file terlalu besar.
- Pisahkan file berdasarkan responsibility.
- Pisahkan table, form, dialog, action, schema, type, constant, dan helper jika mulai kompleks.
- Jangan melakukan over-splitting untuk code kecil yang hanya digunakan sekali.
- Jangan copy-paste code yang sama.

Jika reusable hanya di satu module, simpan di module tersebut.

Jika digunakan lintas module, pindahkan ke:

```text
components/
hooks/
utils/
constants/
types/
```

Contoh:

- reusable UI → `components/`
- reusable hook → `hooks/`
- reusable function → `utils/`
- reusable constant → `constants/`
- reusable type → `types/`

---

# Important

Sebelum membuat sesuatu yang baru:

1. Cek implementasi existing project.
2. Cek component, hook, helper, constant, dan type yang sudah tersedia.
3. Reuse jika memungkinkan.
4. Jangan mengarang API, endpoint, field, type, response, atau business rule.
5. Selalu jadikan `api-generated.ts` dan existing code sebagai source of truth.
6. Jangan mengubah stack, pattern, atau struktur project tanpa kebutuhan yang jelas.
7. Jika sesuatu tidak jelas, jangan berasumsi.
8. Jaga seluruh UI tetap **minimalis, clean, elegan, modern, dan konsisten**.
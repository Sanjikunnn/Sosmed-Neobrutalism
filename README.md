# 🧃 Sosmed Neobrutalism – React + Vite

Yo! Selamat datang di **Sosmed Neobrutalism**, proyek keren dengan vibes **neobrutalism UI** yang nyentrik tapi tetap estetik. Dibangun pakai **React + Vite**, super ringan & cepet! ⚡

> 🧠 Udah di-mix sama Tailwind, Vite, React, dan (kalau mau) Supabase juga bisa langsung connect buat backend-nya.

---

## 💎 Fitur-fitur yang Bikin Kamu Makin Keren

- ⚛️ **React 18** – UI modern dan kekinian
- ⚡ **Vite** – Build ngebut parah
- 💅 **Tailwind CSS** – Styling tinggal ketik, gak pake ribet
- 🔁 **Fast Refresh** – Ngoding tanpa takut ilangin state
- 🧼 **ESLint** – Auto bantuin kodingan kamu tetep rapi
- 🛠️ **Supabase Ready** – Kalo butuh backend tinggal connect
- 🎨 **Desain Neobrutalism** – Estetik yang gak pasaran

---

## 🛠️ Stack Tech-nya Nih

| Teknologi     | Fungsi Kerennya                  |
|---------------|----------------------------------|
| React         | Framework UI utama               |
| Vite          | Dev server & bundler kilat       |
| Tailwind CSS  | Buat styling kece & konsisten    |
| ESLint        | Linter biar koding tetep rapi    |
| Supabase      | (Opsional) Backend & DB instan   |
| SweetAlert2   | Buat pop-up alert cantik banget  |

---

## 🗂️ Folder Structure-nya

```txt
sosmed-neobrutalism/
├── public/                 # File publik
├── src/
│   ├── assets/             # Gambar, ikon, dsb
│   ├── components/         # UI parts kayak Header, dsb
│   ├── middleware/         # Middleware kaya withAuth
│   ├── pages/              # Halaman utama
│   ├── utils/              # Function helper & config
│   ├── App.jsx             # Komponen utama
│   └── main.jsx            # Entry point app
├── .eslintrc.cjs           # Config ESLint
├── index.html              # HTML base-nya
├── package.json            # Dependency & script
├── vite.config.js          # Vite config
└── tailwind.config.js      # Tailwind setup
```

---

## 🧬 Struktur DB Supabase

### 🔐 Tabel `users`

| Kolom      | Tipe Data               | Default              | Keterangan               |
|------------|-------------------------|----------------------|--------------------------|
| id         | UUID (PK)              | `gen_random_uuid()`  | ID user unik             |
| username   | Varchar (nullable)      | `'null'`             | Nama user                |
| badge      | Varchar (nullable)      | `'null'`             | Badge atau status        |
| bio        | Varchar (nullable)      | `'null'`             | Bio singkat              |
| email      | Varchar                 | -                    | Email user               |
| password   | Varchar (nullable)      | -                    | Password (di-hash)       |
| created_at | Timestamp with timezone | `now()`              | Tanggal daftar           |

---

### 📮 Tabel `posts`

| Kolom         | Tipe Data               | Default             | Keterangan               |
|---------------|-------------------------|---------------------|--------------------------|
| id            | Bigint (PK)             | Auto increment      | ID post                  |
| content       | Text                    | `''`                | Isi post                 |
| id_user       | UUID                    | `gen_random_uuid()` | Link ke tabel users      |
| like_count    | Bigint                  | `0`                 | Total likes              |
| comment_count | Bigint (nullable)       | -                   | Total komentar           |
| created_at    | Timestamp with timezone | `now()`             | Tanggal posting          |

🧷 Relasi:  
`id_user` → `users(id)`

---

### 💬 Tabel `comments`

| Kolom      | Tipe Data               | Default              | Keterangan                  |
|------------|-------------------------|----------------------|------------------------------|
| id         | Bigint (PK)             | Auto increment       | ID komen                    |
| post_id    | Bigint                  | `'8'`                | Link ke post                |
| content    | Text                    | `'null'`             | Isi komentar                |
| id_user    | UUID                    | `gen_random_uuid()`  | Link ke user yang komen     |
| created_at | Timestamp with timezone | `now()`              | Tanggal komen               |

🧷 Relasi:
- `post_id` → `posts(id)`
- `id_user` → `users(id)`

⚡ Trigger:
- `trg_update_comment_count` – Otomatis update jumlah komentar

---

### ❤️ Tabel `posts_likes`

| Kolom      | Tipe Data               | Default              | Keterangan                  |
|------------|-------------------------|----------------------|------------------------------|
| id         | Bigint (PK)             | Auto increment       | ID like                     |
| post_id    | Bigint                  | `'8'`                | Link ke post                |
| id_user    | UUID                    | `gen_random_uuid()`  | Link ke user yang like      |
| created_at | Timestamp with timezone | `now()`              | Tanggal nge-like            |

🧷 Relasi:
- `post_id` → `posts(id)`
- `id_user` → `users(id)`

⚡ Trigger:
- `trg_like_added` – Naikin counter like otomatis
- `trg_like_removed` – Nurunin counter like otomatis

---

> Semua tabel ada di schema `public`.  
> Jangan lupa aktifin `pgcrypto` di Supabase biar `gen_random_uuid()` bisa jalan gas pol ⚙️

---

## 🏁 Cara Running Proyek-nya

```bash
# 1. Clone repo ini dulu
git clone https://github.com/Sanjikunnn/Sosmed-Neobrutalism.git
cd Sosmed-Neobrutalism

# 2. Install semua package
npm install

# 3. Bikin file .env dan isi ini:
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# 4. Start development mode
npm run dev
```

---

## 🙋‍♂️ Author

Dibuat dengan 💙 sama [@Sanjikunnn](https://github.com/Sanjikunnn)  
Jangan malu-malu buat fork, kasih bintang, atau collab bareng 😎

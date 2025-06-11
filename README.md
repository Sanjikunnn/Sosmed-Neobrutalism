# ⚡ Sosmed Neobrutalism – React + Vite

Welcome to **Sosmed Neobrutalism**, a minimalist yet bold frontend built using **React + Vite**. 
Mengusung desain **neobrutalism** yang mencolok namun tetap elegan. 🚀

> 🔥 Powered by Vite for blazing fast development, React for dynamic UIs, and styled with TailwindCSS.

---

## ✨ Fitur Utama

- ⚛️ **React 18** – Komponen dinamis dan modern
- ⚡ **Vite** – Development server super cepat
- 💨 **Tailwind CSS** – Styling praktis dan konsisten
- 🔁 **Fast Refresh** – Auto reload tanpa kehilangan state
- 🧹 **ESLint** – Linter siap pakai biar kodingan tetap bersih
- 🔐 **Supabase (opsional)** – Realtime backend dan autentikasi
- 🎨 **Desain Neobrutalism** – Gaya UI yang nyentrik dan beda

---

## 🛠️ Stack Teknologi

| Tech         | Deskripsi                           |
|--------------|--------------------------------------|
| React        | Framework utama UI                  |
| Vite         | Development server + bundler        |
| Tailwind CSS | Styling responsif berbasis utility  |
| ESLint       | Untuk menjaga konsistensi koding    |
| Supabase     | (Opsional) BaaS untuk backend dan DB|
| SweetAlert2  | Alert cantik dan interaktif         |

---

## 📁 Struktur Folder
sosmed-neobrutalism/
├── public/                 # File publik
├── src/
│   ├── assets/             # Gambar, ikon, dll
│   ├── components/         # Komponen UI reusable (Header, Footer, dsb)
│   ├── middleware/         # HOC seperti withAuth
│   ├── pages/              # Komponen level halaman
│   ├── utils/              # Fungsi utilitas seperti konfigurasi Supabase
│   ├── App.jsx             # Root component
│   └── main.jsx            # Entry point aplikasi
├── .eslintrc.cjs           # Konfigurasi ESLint
├── index.html              # Template HTML
├── package.json            # Dependency dan scripts
└── vite.config.js          # Konfigurasi Vite
└── tailwind.config.js      # Konfigurasi Tailwind

---

## 📊 Struktur Database Supabase

Berikut ini adalah struktur tabel yang digunakan pada proyek ini:

### 🧑‍💻 Tabel `users`

| Kolom      | Tipe Data                 | Default                | Keterangan          |
|------------|---------------------------|------------------------|----------------------|
| id         | UUID (PK)                | `gen_random_uuid()`    | ID unik pengguna    |
| username   | Varchar (nullable)        | `'null'`               | Nama pengguna       |
| badge      | Varchar (nullable)        | `'null'`               | Badge/status        |
| bio        | Varchar (nullable)        | `'null'`               | Bio profil          |
| email      | Varchar                   | -                      | Email pengguna      |
| password   | Varchar (nullable)        | -                      | Password hash       |
| created_at | Timestamp with timezone   | `now()`                | Tanggal dibuat      |

---

### 📝 Tabel `posts`

| Kolom         | Tipe Data                 | Default           | Keterangan                |
|---------------|---------------------------|-------------------|----------------------------|
| id            | Bigint (PK)               | Auto increment    | ID post                   |
| content       | Text                      | `''`              | Isi post                  |
| id_user       | UUID                      | `gen_random_uuid()`| Referensi ke `users`      |
| like_count    | Bigint                    | `0`               | Jumlah likes              |
| comment_count | Bigint (nullable)         | -                 | Jumlah komentar           |
| created_at    | Timestamp with timezone   | `now()`           | Tanggal post dibuat       |

🔗 Foreign Key:
- `id_user` → `users(id)`

---

### 💬 Tabel `comments`

| Kolom      | Tipe Data                 | Default               | Keterangan                  |
|------------|---------------------------|------------------------|------------------------------|
| id         | Bigint (PK)               | Auto increment         | ID komentar                  |
| post_id    | Bigint                    | `'8'`                  | Referensi ke post            |
| content    | Text                      | `'null'`               | Isi komentar                 |
| id_user    | UUID                      | `gen_random_uuid()`    | Referensi ke `users`         |
| created_at | Timestamp with timezone   | `now()`                | Tanggal komentar dibuat      |

🔗 Foreign Key:
- `post_id` → `posts(id)`
- `id_user` → `users(id)`

⚡ Trigger:
- `trg_update_comment_count`: Memperbarui jumlah komentar di `posts` saat komentar ditambah/dihapus/dipindah

---

### ❤️ Tabel `posts_likes`

| Kolom      | Tipe Data                 | Default               | Keterangan                  |
|------------|---------------------------|------------------------|------------------------------|
| id         | Bigint (PK)               | Auto increment         | ID like                     |
| post_id    | Bigint                    | `'8'`                  | Referensi ke post           |
| id_user    | UUID                      | `gen_random_uuid()`    | Referensi ke `users`        |
| created_at | Timestamp with timezone   | `now()`                | Tanggal like dibuat         |

🔗 Foreign Key:
- `post_id` → `posts(id)`
- `id_user` → `users(id)`

⚡ Trigger:
- `trg_like_added`: Update jumlah like saat like ditambahkan
- `trg_like_removed`: Update jumlah like saat like dihapus

---

Semua tabel berjalan dalam **namespace `public`**, dan sudah dilengkapi dengan foreign key serta trigger untuk update otomatis saat komentar/like ditambah/dihapus.

Jika lo pakai Supabase, pastikan sudah mengaktifkan **PostgreSQL Extension `pgcrypto`** untuk `gen_random_uuid()` agar bisa berjalan lancar.


## 🚀 Cara Menjalankan Proyek

```bash
# 1. Clone repositori
git clone https://github.com/Sanjikunnn/Sosmed-Neobrutalism.git
cd Sosmed-Neobrutalism

# 2. Install dependencies
npm install

# 3. Buat vite .env supabase anda
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# 4. Jalankan development server
npm run dev








## 👤 Author
Made with ❤️ by @Sanjikunnn
Feel free to fork & contribute!
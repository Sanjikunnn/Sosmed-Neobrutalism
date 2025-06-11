# 🧃 Sosmed Neobrutalism – React + Vite + Supabase

Selamat datang di **Sosmed Neobrutalism**, proyek gabut dengan vibes **neobrutalism UI** yang nyentrik tapi tetap estetik. Dibuat pake **React + Supabase**, super ringan & cepet! ⚡

---

## 💎 Halaman yang Ada Disini

- ⚛️ **Halaman Daftar** – Ya fungsinya buat daftar akun ya pake email otomatis tar u dapet kodenya
- ⚡ **Halaman Login** – Login pake email & password yg udh lu daftarin tadi, ga autocomplete ya, biar ingetan lu makin kuat
- 💅 **Halaman Home** – Ya kaya Fesnuk intinya, Disini lu bisa posting status, nontonin status orang laen, bisa lu like, komen & subscribe anjay kek yutub ae maderfaked, (boong ko gada subs)
- 🛠️ **Halaman Profile** – Ini halaman buat nampilin profil user sih kek fesnuk gitu lah, ya semua kek fesnuk karna gw fesnuk lovers
- Dah segitu doang halamannya, kalo mau lebih ya kontribusi toddd
---

## 💎 Fitur-fitur yang Ada Disini

- ⚛️ **Tema Neobrutalism** – Tema alay, font gede kebo, warna norak, pokonya gada yg bisa di nilai nying
- ⚡ **Auth** – Daftar cukup pake email ae tar lu otomatis dapet email buat verifikasi nya, klik dah linknya 
- 💅 **Postingan** – Gw bikin ini ya karna gw muak dengan sosmed diluar sana yang ada post gambar/video, bokep mulu yg lewat anying, maka dari itu gw bikin sosmed yg cuma bisa post teks doang, still halal brother
- 🛠️ **Badge** – Nah ini yang bikin seru (menurut gw), badge ini u dapetin kalo lu terkenal (when ya),karna ya berdasarkan antusiasme orang gabut dari like dan komen postingan lo
- Dah segitu aja fiturnya, kalo mau tau lebih ya lu coba aja sndiri badjingan
---

## 🛠️ Stack Tech-nya Nih

| Teknologi     | Fungsi ga gunanya                |
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

## 🏁 Cara Running Proyek nya

```bash
# 1. Clone repo ini dulu todd
git clone https://github.com/Sanjikunnn/Sosmed-Neobrutalism.git
cd Sosmed-Neobrutalism

# 2. Install semua package lu
npm install

# 3. Bikin file .env dan isi ini:
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# 4. Start development mode
npm run dev
```

---

---

## 📸 Preview

Berikut beberapa cuplikan dari tampilan aplikasinya. Desainnya clean dengan vibes **neobrutalism** yang bold tapi tetap aesthetic ✨:

### 🏠 Status Bar & Navbar
![Status Bar & Navbar](https://imgur.com/diIwq2K)

### 👤 Postingan
![Postingan](https://imgur.com/sIqMJHE)

### 📝 Komentar
![Komentar](https://imgur.com/8B7YmVu)

### 👤 Halaman Profil
![Halaman Profil](https://imgur.com/VRFVU2P)

### 👤 Komentar & Postingan User di Halaman Profil
![Komentar & Postingan User di Halaman Profil](https://imgur.com/uNnbpk1)


---



---

## 🙋‍♂️ Author

Dibuat dengan 💙 sama [@Sanjikunnn](https://github.com/Sanjikunnn)  
Jangan malu-malu buat fork, kasih bintang, atau collab bareng 😎
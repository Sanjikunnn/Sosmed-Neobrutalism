import { ShieldCheck, Lock, Info } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brutalYellow via-pink-100 to-white py-12">
      <div className="max-w-4xl mx-auto p-6 md:p-12 bg-white rounded-2xl shadow-lg border-4 border-brutalPink">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-pink-700 flex items-center gap-2 font-brutal">
            <ShieldCheck className="w-7 h-7" /> Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Terakhir diperbarui: 15 Mei 2025
          </p>
        </div>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2 text-pink-600 font-brutal">
            <Lock className="w-5 h-5" /> Data yang Kami Kumpulkan
          </h2>
          <p>
            Kami mengumpulkan data seperti <strong>nama pengguna</strong>,{" "}
            <strong>alamat email</strong>, serta <strong>aktivitas Anda</strong> di dalam
            platform (seperti komentar dan likes). Semua informasi dikumpulkan
            hanya untuk meningkatkan pengalaman pengguna.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2 text-pink-600 font-brutal">
            <Lock className="w-5 h-5" /> Keamanan Data
          </h2>
          <p>
            Data Anda disimpan dengan enkripsi tingkat lanjut. Kami menggunakan
            protokol keamanan modern untuk menjaga informasi pribadi Anda tetap
            aman dari akses tidak sah.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2 text-pink-600 font-brutal">
            <Info className="w-5 h-5" /> Penggunaan Data
          </h2>
          <p>
            Informasi Anda tidak akan kami jual atau sebarluaskan ke pihak ketiga.
            Data hanya digunakan untuk:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Mengembangkan dan meningkatkan fitur platform</li>
            <li>Memberikan pengalaman pengguna yang lebih personal</li>
            <li>Mencegah penyalahgunaan sistem</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2 text-pink-600 font-brutal">
            🤝 Persetujuan Anda
          </h2>
          <p>
            Dengan menggunakan platform ini, Anda menyetujui seluruh kebijakan
            privasi yang telah kami tetapkan. Jika Anda memiliki pertanyaan, jangan
            ragu untuk menghubungi tim kami.
          </p>
        </section>

        <p className="text-sm text-center text-gray-500 mt-12 font-brutal">
          &copy; 2025 Sosmed Neobrutalism — Semua Hak Dilindungi
        </p>
      </div>
    </div>
  );
}

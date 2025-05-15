import { ShieldCheck, Lock, Info } from "lucide-react"; 
export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 text-gray-800 leading-relaxed">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-pink-700 flex items-center gap-2">
          <ShieldCheck className="w-7 h-7" /> Privacy Policy
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Terakhir diperbarui: 15 Mei 2025
        </p>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <Lock className="w-5 h-5 text-pink-600" /> Data yang Kami Kumpulkan
        </h2>
        <p>
          Kami mengumpulkan data seperti <strong>nama pengguna</strong>,{" "}
          <strong>alamat email</strong>, serta <strong>aktivitas Anda</strong> di dalam
          platform (seperti komentar dan likes). Semua informasi dikumpulkan
          hanya untuk meningkatkan pengalaman pengguna.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <Lock className="w-5 h-5 text-pink-600" /> Keamanan Data
        </h2>
        <p>
          Data Anda disimpan dengan enkripsi tingkat lanjut. Kami menggunakan
          protokol keamanan modern untuk menjaga informasi pribadi Anda tetap
          aman dari akses tidak sah.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <Info className="w-5 h-5 text-pink-600" /> Penggunaan Data
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
        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
          🤝 Persetujuan Anda
        </h2>
        <p>
          Dengan menggunakan platform ini, Anda menyetujui seluruh kebijakan
          privasi yang telah kami tetapkan. Jika Anda memiliki pertanyaan, jangan
          ragu untuk menghubungi tim kami.
        </p>
      </section>

      <p className="text-sm text-center text-gray-500 mt-12">
        &copy; 2025 Sosmed Neobrutalism — Semua Hak Dilindungi
      </p>
    </div>
  );
}

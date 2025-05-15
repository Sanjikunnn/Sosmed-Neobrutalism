// src/pages/TermsOfService.jsx

import { Ban, AlertTriangle, Gavel, ShieldAlert, MessageSquareWarning, Users } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="max-w-3xl mx-auto p-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Gavel className="text-pink-700" /> Terms of Service
      </h1>

      <div className="mb-4 flex items-start gap-3">
        <AlertTriangle className="mt-1 text-pink-700" />
        <p>
          Dengan menggunakan layanan kami, Anda <strong>menyetujui syarat dan ketentuan</strong> yang berlaku dan bersedia mematuhi aturan yang ditetapkan.
        </p>
      </div>

      <div className="mb-4 flex items-start gap-3">
        <ShieldAlert className="mt-1 text-pink-700" />
        <p>
          Anda bertanggung jawab atas keamanan akun Anda. Jangan pernah membagikan kata sandi atau informasi sensitif kepada pihak lain.
        </p>
      </div>

      <div className="mb-4 flex items-start gap-3">
        <Users className="mt-1 text-pink-700" />
        <p>
          Jaga etika dan sopan santun saat berinteraksi dengan pengguna lain. Komentar yang bersifat <strong>ujaran kebencian, diskriminasi, atau pelecehan</strong> akan ditindak tegas.
        </p>
      </div>

      <div className="mb-4 flex items-start gap-3">
        <MessageSquareWarning className="mt-1 text-pink-700" />
        <p>
          Dilarang keras melakukan <strong>spam, promosi berlebihan, aktivitas bot, atau penipuan</strong> dalam bentuk apapun.
        </p>
      </div>

      <div className="mb-4 flex items-start gap-3">
        <Ban className="mt-1 text-pink-700" />
        <p>
          Pelanggaran terhadap syarat layanan ini dapat menyebabkan <strong>sanksi berupa pembatasan akses atau penghapusan akun</strong> tanpa pemberitahuan terlebih dahulu.
        </p>
      </div>

      <div className="mb-4 flex items-start gap-3">
        <Gavel className="mt-1 text-pink-700" />
        <p>
          Kami berhak melakukan perubahan terhadap syarat dan ketentuan ini sewaktu-waktu. Perubahan akan diinformasikan melalui halaman ini.
        </p>
      </div>

      <p className="mt-6 text-sm text-center text-gray-600">
        Terima kasih telah menjadi bagian dari komunitas kami. Gunakan platform ini secara bijak dan positif!
      </p>
      <p className="text-sm text-center text-gray-500 mt-12">
        &copy; 2025 Sosmed Neobrutalism — Semua Hak Dilindungi
      </p>
    </div>
  );
}

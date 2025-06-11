import {
  Ban,
  AlertTriangle,
  Gavel,
  ShieldAlert,
  MessageSquareWarning,
  Users,
} from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brutalYellow via-pink-100 to-white p-5">
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg border-4 border-brutalPink">
        <h1 className="text-3xl font-extrabold mb-6 flex items-center gap-2 text-pink-700 font-brutal">
          <Gavel className="text-pink-700" size={32} /> Terms of Service
        </h1>

        <div className="mb-4 flex items-start gap-3">
          <AlertTriangle className="mt-1 text-pink-700" size={32} />
          <p className="text-gray-700">
            Dengan menggunakan layanan kami, Anda{" "}
            <strong>menyetujui syarat dan ketentuan</strong> yang berlaku dan
            bersedia mematuhi aturan yang ditetapkan.
          </p>
        </div>

        <div className="mb-4 flex items-start gap-3">
          <ShieldAlert className="mt-1 text-pink-700" size={32} />
          <p className="text-gray-700">
            Anda bertanggung jawab atas keamanan akun Anda. Jangan pernah
            membagikan kata sandi atau informasi sensitif kepada pihak lain.
          </p>
        </div>

        <div className="mb-4 flex items-start gap-3">
          <Users className="mt-1 text-pink-700" size={32} />
          <p className="text-gray-700">
            Jaga etika dan sopan santun saat berinteraksi dengan pengguna lain.
            Komentar yang bersifat <strong>ujaran kebencian, diskriminasi, atau pelecehan</strong>{" "}
            akan ditindak tegas.
          </p>
        </div>

        <div className="mb-4 flex items-start gap-3">
          <MessageSquareWarning className="mt-1 text-pink-700" size={32} />
          <p className="text-gray-700">
            Dilarang keras melakukan <strong>spam, promosi berlebihan, aktivitas bot, atau penipuan</strong>{" "}
            dalam bentuk apapun.
          </p>
        </div>

        <div className="mb-4 flex items-start gap-3">
          <Ban className="mt-1 text-pink-700" size={32} />
          <p className="text-gray-700">
            Pelanggaran terhadap syarat layanan ini dapat menyebabkan{" "}
            <strong>
              sanksi berupa pembatasan akses atau penghapusan akun
            </strong>{" "}
            tanpa pemberitahuan terlebih dahulu.
          </p>
        </div>

        <div className="mb-4 flex items-start gap-3">
          <Gavel className="mt-1 text-pink-700" size={32} />
          <p className="text-gray-700">
            Kami berhak melakukan perubahan terhadap syarat dan ketentuan ini
            sewaktu-waktu. Perubahan akan diinformasikan melalui halaman ini.
          </p>
        </div>

        <p className="mt-6 text-sm text-center text-gray-600 font-brutal">
          Terima kasih telah menjadi bagian dari komunitas kami. Gunakan
          platform ini secara bijak dan positif!
        </p>
        <p className="text-sm text-center text-gray-500 mt-12 font-brutal">
          &copy; 2025 Sosmed Neobrutalism — Semua Hak Dilindungi
        </p>
      </div>
    </div>
  );
}

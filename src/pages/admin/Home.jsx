import React from 'react';
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const AdminHome = () => {
  return (
    <div className="bg-[#fdfdfd] text-black font-mono min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 p-6 text-center">
        <h1 className="text-3xl font-bold text-[#FF4D6E] mb-4 drop-shadow-[2px_2px_0px_#000]">
          Selamat Datang di Dashboard Admin 🎉
        </h1>
        <p className="text-gray-700 text-base mb-6">
          Kamu berhasil login! Silakan pilih menu yang tersedia di bawah untuk mulai menggunakan aplikasi.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <div className="bg-yellow-200 border-4 border-black shadow-[4px_4px_0px_#000] px-6 py-4 rounded-none w-[260px]">
            <h2 className="text-xl font-bold text-black mb-2">Profil Kamu</h2>
            <p className="text-sm text-gray-800">Lihat dan edit informasi akun kamu.</p>
          </div>

          <div className="bg-yellow-200 border-4 border-black shadow-[4px_4px_0px_#000] px-6 py-4 rounded-none w-[260px]">
            <h2 className="text-xl font-bold text-black mb-2">Riwayat</h2>
            <p className="text-sm text-gray-800">Cek riwayat pemesanan atau aktivitas kamu.</p>
          </div>

          <div className="bg-yellow-200 border-4 border-black shadow-[4px_4px_0px_#000] px-6 py-4 rounded-none w-[260px]">
            <h2 className="text-xl font-bold text-black mb-2">Bantuan</h2>
            <p className="text-sm text-gray-800">Butuh bantuan? Kunjungi halaman support kami.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminHome;

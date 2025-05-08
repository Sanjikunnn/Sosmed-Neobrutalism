// src/pages/user/Home.jsx
import React from 'react';
import Header from "../../components/Header";
import Footer from "../../components/Footer";


const UserHome = () => {
  return (
        <div className="bg-[#fdfdfd] text-black font-mono min-h-screen flex flex-col">
          <Header />
          
          <main className="flex-1 p-6 text-center text-gray-600">
            <p className="italic">[ Konten utama kamu di sini user]</p>
          </main>
          
          <Footer />
        </div>
  );
};

export default UserHome; 
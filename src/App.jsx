import './App.css';
import { FaPlus, FaRegCommentDots, FaUserFriends, FaCompass, FaBell, FaHashtag } from 'react-icons/fa';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';

// Import halaman kebijakan privasi dan syarat ketentuan
import PrivacyPolicy from './pages/privacyPolicy';
import TermsCondition from './pages/termsCondition';

// Import halaman user
import UserHome from './pages/user/Home';
import UserPost from './pages/user/Post';
import Profile from './pages/user/Profile';

// Import halaman auth
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

// Komponen utama aplikasi
function App() {
  return (
    <Router>
      <Routes>
        {/* Routing untuk halaman login dan signup */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Routing untuk halaman kebijakan dan ketentuan */}
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsCondition />} />

        {/* Routing untuk halaman user */}
        <Route path="/user/home" element={<UserHome />} />
        <Route path="/user/post" element={<UserPost />} />
        <Route path="/user/profile/:userId" element={<Profile />} />

        {/* Routing untuk halaman utama layout */}
        <Route path="/" element={<MainLayout />} />
      </Routes>
    </Router>
  );
}

// Komponen fitur (digunakan untuk menampilkan icon dan deskripsi fitur)
function FeatureItem({ icon, title, description }) {
  return (
    <div className="bg-white p-4 border-4 border-black shadow-[4px_4px_0_0_black]">
      {icon}
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-sm">{description}</p>
    </div>
  );
}

// Komponen News Feed
function NewsFeedSection() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 w-full">
      <h2 className="text-3xl font-bold col-span-full">News Feed</h2>
      {['Aulia baru saja memposting foto!', 'Bima sedang berbagi pengalaman dalam pengelolaan ternak lele!', 'Iqbal sedang berbagi pengalaman dalam pengembangan web!'].map((text, index) => (
        <div key={index} className="bg-white p-4 border-4 border-black shadow-[6px_6px_0_0_black] mb-6">
          <p className="text-base">“{text}”</p>
          <p className="text-xs text-gray-600">{index === 0 ? '2 hours ago' : index === 1 ? '1 day ago' : '2 days ago'}</p>
        </div>
      ))}
    </section>
  );
}

// Komponen Suggestions (saran teman)
function SuggestionsSection() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 w-full">
      <h2 className="text-3xl font-bold col-span-full">Suggestions</h2>
      {['Aulia', 'Bima', 'Iqbal'].map((name, index) => (
        <div key={index} className="bg-white p-4 border-4 border-black shadow-[6px_6px_0_0_black] mb-6">
          <h3 className="font-bold">Suggested Friend: {name}</h3>
          <button className="bg-blue-500 text-white py-2 px-4 mt-2 rounded-full">Follow</button>
        </div>
      ))}
    </section>
  );
}

// Komponen Trending (trending topik)
function TrendingSection() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 w-full">
      <h2 className="text-3xl font-bold col-span-full">Trending</h2>
      {['#WebDesign', '#TechNews', '#Coding'].map((tag, index) => (
        <div key={index} className="bg-white p-4 border-4 border-black shadow-[6px_6px_0_0_black] mb-6">
          <h3 className="text-xl font-bold">
            <FaHashtag className="inline mr-2" />
            {tag}
          </h3>
          <p className="text-sm">Web design is taking the digital world by storm!</p>
        </div>
      ))}
    </section>
  );
}

// Komponen Friend Requests (permintaan pertemanan)
function FriendRequestsSection() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 w-full">
      <h2 className="text-3xl font-bold col-span-full">Friend Requests</h2>
      {['Aulia', 'Bima', 'Iqbal'].map((name, index) => (
        <div key={index} className="bg-white p-4 border-4 border-black shadow-[6px_6px_0_0_black] mb-6">
          <h3 className="font-bold">{name} sent you a friend request!</h3>
          <button className="bg-green-500 text-white py-2 px-4 mt-2 rounded-full">Accept</button>
        </div>
      ))}
    </section>
  );
}

// Komponen ini menampilkan notifikasi terbaru
function NotificationsSection() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 w-full">
      <h2 className="text-3xl font-bold col-span-full">Notifications</h2>
      {['New comment on your post', 'You have a new follower', 'Your story was liked by 10 people'].map((notif, index) => (
        <div key={index} className="bg-white p-4 border-4 border-black shadow-[6px_6px_0_0_black] mb-6">
          <p className="text-base">{notif}</p>
          <p className="text-xs text-gray-600">{index === 0 ? '3 mins ago' : index === 1 ? '1 hour ago' : '5 hours ago'}</p>
        </div>
      ))}
    </section>
  );
}

// Komponen ini menampilkan sorotan cerita pengguna
function StoryHighlightsSection() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 w-full mb-10">
      <h2 className="text-3xl font-bold col-span-full">Story Highlights</h2>
      {['Holiday in Bali 🌴', 'My Web Dev Journey 💻', 'Graduation Day 🎓'].map((story, index) => (
        <div key={index} className="bg-white p-4 border-4 border-black shadow-[6px_6px_0_0_black] mb-6">
          <p className="text-base">{story}</p>
          <button className="bg-purple-500 text-white py-2 px-4 mt-2 rounded-full">View Story</button>
        </div>
      ))}
    </section>
  );
}

// Komponen layout utama yang ditampilkan di halaman /

function MainLayout() {
  const [showJoinUs, setShowJoinUs] = React.useState(true);

  return (
    <div className="flex flex-col min-h-screen bg-yellow-100 text-black font-brutal">

      {/* Header */}
      <header className="w-full border-b-4 border-black px-4 py-3 flex items-center justify-center gap-6">
        {/* Logo kiri */}
        <a href="#" className="shadow-[6px_6px_0_0_black] border-4 border-black hover:scale-105 transition-transform">
          <img
            src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgLgU6l8ALe6nVwFMS4aBc0XIrzBXr7_tvSmKAnAzrb78HmXKKjTZRUXF81AleLrgtwemCFmO0EaWbZ-DA8xL7pXBDivgk0rndhHQjdh_9ZigKZ4Ua-2Xv1FPTfiSr5sXqpzfFJDXO9Cb8/s1600-rw/Media-Sosial.jpg"
            alt="Sosmed Logo"
            className="w-28 h-16 object-cover"
          />
        </a>

        {/* Tombol tambah */}
        <div className="w-14 h-14 flex items-center justify-center bg-white border-4 border-black text-3xl shadow-[4px_4px_0_0_black]">
          <FaPlus />
        </div>

        {/* Logo kanan */}
        <a href="#" className="shadow-[6px_6px_0_0_black] border-4 border-black hover:scale-105 transition-transform">
          <img
            src="https://cdn.svgator.com/images/2024/08/what-is-the-neubrutalism-web-design-trend.png"
            alt="Neo Logo"
            className="w-28 h-16 object-cover"
          />
        </a>
      </header>

      {/* Konten utama */}
      <main className="flex-grow w-full max-w-4xl mx-auto flex flex-col items-center justify-center gap-10 px-4 py-8 text-center">
        {/* Judul dan deskripsi */}
      <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
        Sosmed <span className="text-brutalPink">Neobrutalism</span>
      </h1>

      <p className="max-w-xl text-4xl text-gray-800">(🧠➡️⌨️➡️🌍)</p>

      <div className="bg-white border-4 border-black shadow-[4px_4px_0_0_black] px-4 py-5 rounded-xl text-justify">
        <p className="text-2xl text-gray-800 mb-4 text-center">
          <strong>🚫Foto || 🚫Video</strong>
        </p>
        <p className="text-2xl text-gray-800 mb-4">
          Di sini lo cuma bisa update status teks doang, murni ngebacot. mirip nulis diary, tapi bisa dibaca satu dunia.
        </p>

        <p className="text-2xl text-gray-800 mb-4">
          ✍️ Ganti username & bio? Bisa banget. Hari ini lo "lovedaisy" besok bisa jadi "iamglamourous". Gak ada yang larang.
        </p>
      </div>

      <div className="bg-yellow-200 border-4 border-black shadow-[4px_4px_0_0_black] px-4 py-5 rounded-xl text-justify mt-6">
        <p className="text-2xl text-gray-800 mb-4">
          💬 Interaksi seru? Jelas. Lo bisa like & komen postingan siapa aja. Makin rame postingan lo, makin tinggi level badge lo. 
        </p>

        <p className="text-2xl text-gray-800">
          🏅 Dari “<strong>Nolep</strong>” sampe “<strong>Titik Kumpul</strong>”, badge lo nunjukin seberapa aktif lo di tongkrongan digital ini.
        </p>
      </div>

      <div className="bg-pink-100 border-4 border-black shadow-[4px_4px_0_0_black] px-4 py-5 rounded-xl text-justify mt-6">
        <p className="text-2xl text-gray-800">
          🌈 Desain? Udah pasti <strong>neobrutalism,</strong> warna-warni ngejreng, tebel, dan beda dari yang lain. No more UI yang *too clean* dan boring.
        </p>

        <p className="text-2xl text-gray-800 mt-4">
          🎉 Join sekarang, update status suka-suka lo, dan jadi bagian dari movement ini. Sosmed baru buat yang pengen ngebacot, bukan buat yang flexing-flexing tai anj*ng.
        </p>
      </div>


      {/* Join Us Sticky Bawah, muncul dari bawah dengan animasi */}
      {showJoinUs && (
        <div
          className="
            fixed bottom-2 left-1/2 transform -translate-x-1/2
            bg-yellow-100 border-4 border-black px-6 py-1 shadow-[6px_6px_0_0_black]
            max-w-md w-full rounded-2xl
            animate-slideUp float-shadow
            z-50
          "
        >
          <button
            onClick={() => setShowJoinUs(false)}
            className="absolute top-1 right-3 w-8 h-10 flex items-center justify-center border-4 border-black rounded-full bg-yellow-300 hover:bg-red-500 hover:text-white transition-colors duration-200 font-bold"
            aria-label="Close Join Us Card"
          >
            ×
          </button>

          <h2 className="text-2xl font-extrabold mt-1 mb-3">Join Us</h2>

          <div className="grid grid-cols-2 gap-4">
            <Link to="/signup">
              <button className="w-full border-4 border-black bg-yellow-200 text-2xl font-bold rounded-lg hover:bg-fuchsia-500 hover:text-white transition-all duration-200">
                Signup
              </button>
            </Link>

            <Link to="/login">
              <button className="w-full border-4 border-black bg-yellow-300 text-2xl font-bold rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200">
                Login
              </button>
            </Link>
          </div>

          <p className="mt-2 text-sm text-gray-600 font-medium">
            Post your daily & share your story 🚀
          </p>
        </div>
      )}

        {/* Fitur utama */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 w-full">
          <h2 className="text-3xl font-bold col-span-full">Features</h2>
          <FeatureItem icon={<FaRegCommentDots />} title="Post Anything" description="Unggah cerita dan ekspresikan dirimu." />
          <FeatureItem icon={<FaUserFriends />} title="Connect" description="Follow teman-teman dan saling support." />
          <FeatureItem icon={<FaCompass />} title="Explore" description="Temukan hal-hal menarik tiap hari." />
        </section>

        <SuggestionsSection />
        <TrendingSection />
        <FriendRequestsSection />
        <NotificationsSection />
        <StoryHighlightsSection />
      </main>

      {/* Footer */}
      <footer className="w-full bg-transparent text-black py-1 mt-6 underline-offset-4">
        <div className="flex justify-center gap-6">
          <a href="#" className="text-sm">Privacy Policy</a>
          <a href="#" className="text-sm">Terms of Service</a>
        </div>
        <p className="text-center text-sm mt-4">&copy; 2025 Sosmed Neobrutalism</p>
      </footer>
       {/* Style animasi tambahan */}
      <style>{`
        @keyframes slideUp {
          0% {
            transform: translate(-50%, 100%) translateZ(0);
            opacity: 0;
          }
          100% {
            transform: translate(-50%, 0) translateZ(0);
            opacity: 1;
          }
        }

        .animate-slideUp {
          animation: slideUp 0.5s ease forwards;
        }

        /* Efek melayang */
        .float-shadow {
          box-shadow:
            6px 6px 0 0 black,
            0 10px 10px rgba(0,0,0,0.15);
          transition: box-shadow 0.3s ease;
        }
        .float-shadow:hover {
          box-shadow:
            8px 8px 0 0 black,
            0 15px 15px rgba(0,0,0,0.25);
          transform: translateY(-3px);
        }
      `}</style>
    </div>
  );
}

export default App;

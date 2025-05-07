import { useState } from 'react';
import './App.css';
import { FaPlus, FaRegCommentDots, FaUserFriends, FaCompass, FaBell, FaHashtag } from 'react-icons/fa';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AdminHome from './pages/admin/home';
import AdminUsers from './pages/admin/users';
import AdminProfile from './pages/admin/profile';

import UserHome from './pages/user/home';
import UserPost from './pages/user/post';
import UserProfile from './pages/user/profile';

import Login from './pages/auth/login';
import Signup from './pages/auth/signup';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-yellow-100 text-black font-brutal">
        {/* Header */}
        <header className="w-full border-b-4 border-black px-4 py-3 flex items-center justify-center gap-6">
          <a href="#" className="shadow-[6px_6px_0_0_black] border-4 border-black hover:scale-105 transition-transform">
            <img
              src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgLgU6l8ALe6nVwFMS4aBc0XIrzBXr7_tvSmKAnAzrb78HmXKKjTZRUXF81AleLrgtwemCFmO0EaWbZ-DA8xL7pXBDivgk0rndhHQjdh_9ZigKZ4Ua-2Xv1FPTfiSr5sXqpzfFJDXO9Cb8/s1600-rw/Media-Sosial.jpg"
              alt="Sosmed Logo"
              className="w-28 h-16 object-cover"
            />
          </a>

          <div className="w-14 h-14 flex items-center justify-center bg-white border-4 border-black text-3xl shadow-[4px_4px_0_0_black]">
            <FaPlus />
          </div>

          <a href="#" className="shadow-[6px_6px_0_0_black] border-4 border-black hover:scale-105 transition-transform">
            <img
              src="https://cdn.svgator.com/images/2024/08/what-is-the-neubrutalism-web-design-trend.png"
              alt="Neo Logo"
              className="w-28 h-16 object-cover"
            />
          </a>
        </header>

        {/* Main Content */}
        <main className="flex-grow w-full max-w-4xl mx-auto flex flex-col items-center justify-center gap-10 px-4 py-8 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Sosmed <span className="text-brutalPink">Neobrutalism</span>
          </h1>
          <p className="max-w-xl text-4xl text-gray-800">(🧠➡️⌨️➡️🌍)</p>

          {/* Features Section */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 w-full">
            <h2 className="text-3xl font-bold col-span-full">Features</h2>
            <FeatureItem icon={<FaRegCommentDots />} title="Post Anything" description="Unggah cerita dan ekspresikan dirimu." />
            <FeatureItem icon={<FaUserFriends />} title="Connect" description="Follow teman-teman dan saling support." />
            <FeatureItem icon={<FaCompass />} title="Explore" description="Temukan hal-hal menarik tiap hari." />
          </section>

          {/* News Feed Section */}
          <NewsFeedSection />

          {/* Suggestions Section */}
          <SuggestionsSection />

          {/* Trending Section */}
          <TrendingSection />

          {/* Friend Requests Section */}
          <FriendRequestsSection />

          {/* Account Button */}
          <div className="bg-white border-4 border-black px-2 py-6 shadow-[6px_6px_0_0_black] max-w-md w-full mt-6">
            <button
              onClick={() => setCount(count + 1)}
              className="w-full border-4 border-black bg-yellow-200 py-3 text-lg font-bold hover:bg-fuchsia-500 hover:text-white transition-all duration-200"
            >
              Create Your Account ({count})
            </button>
            <p className="mt-4 text-sm">Post your daily and share your story 🚀</p>
          </div>

          {/* Notifications Section */}
          <NotificationsSection />

          {/* Story Highlights Section */}
          <StoryHighlightsSection />
        </main>

        {/* Footer */}
        <Footer />
      </div>

      <Routes>
        {/* Routing for Admin */}
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/profile" element={<AdminProfile />} />

        {/* Routing for User */}
        <Route path="/user" element={<UserHome />} />
        <Route path="/user/post" element={<UserPost />} />
        <Route path="/user/profile" element={<UserProfile />} />

        {/* Routing for Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

      </Routes>
    </Router>
  );
}

// Component for Feature Items
function FeatureItem({ icon, title, description }) {
  return (
    <div className="bg-white p-4 border-4 border-black shadow-[4px_4px_0_0_black]">
      {icon}
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-sm">{description}</p>
    </div>
  );
}

// News Feed Section Component
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

// Suggestions Section Component
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

// Trending Section Component
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

// Friend Requests Section Component
function FriendRequestsSection() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 w-full">
      <h2 className="text-3xl font-bold col-span-full">Friend Requests</h2>
      {['Aulia', 'Bima', 'Iqbal'].map((name, index) => (
        <div key={index} className="bg-white p-4 border-4 border-black shadow-[6px_6px_0_0_black] mb-6">
          <h3 className="font-bold">Request from: {name}</h3>
          <button className="bg-green-500 text-white py-2 px-4 mt-2 rounded-full">Accept</button>
          <button className="bg-red-500 text-white py-2 px-4 mt-2 ml-2 rounded-full">Decline</button>
        </div>
      ))}
    </section>
  );
}

// Notifications Section Component
function NotificationsSection() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 w-full">
      <h2 className="text-3xl font-bold col-span-full">Notifications</h2>
      {['Your post received 10 likes!', 'New follower: Aulia!', 'New comment from Bima!'].map((text, index) => (
        <div key={index} className="bg-white p-4 border-4 border-black shadow-[6px_6px_0_0_black] mb-6">
          <p className="text-sm">{text}</p>
        </div>
      ))}
    </section>
  );
}

// Story Highlights Section Component
function StoryHighlightsSection() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 w-full">
      <h2 className="text-3xl font-bold col-span-full">Story Highlights</h2>
      {['Birthday Party', 'Vacation to Bali', 'Coding Journey'].map((highlight, index) => (
        <div key={index} className="bg-white p-4 border-4 border-black shadow-[6px_6px_0_0_black] mb-6">
          <h3 className="font-bold">{highlight}</h3>
          <p className="text-sm">Highlights from {highlight}</p>
        </div>
      ))}
    </section>
  );
}

// Footer Component
function Footer() {
  return (
    <footer className="w-full bg-transparent text-black py-1 mt-6 underline-offset-4">
      <div className="flex justify-center gap-6">
        <a href="#" className="text-sm">Privacy Policy</a>
        <a href="#" className="text-sm">Terms of Service</a>
      </div>
      <p className="text-center text-sm mt-4">&copy; 2025 Sosmed Neobrutalism</p>
    </footer>
  );
}

export default App;

import { useState } from 'react';
import './App.css';
import { FaPlus, FaRegCommentDots, FaUserFriends, FaCompass, FaBell, FaHashtag } from 'react-icons/fa';

function App() {
  const [count, setCount] = useState(0);

  return (
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
        <p className="max-w-xl text-4xl text-gray-800">
        (🧠➡️⌨️➡️🌍)        
        </p>

        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 w-full">
          <h2 className="text-3xl font-bold col-span-full">Features</h2>
          <div className="bg-white p-4 border-4 border-black shadow-[4px_4px_0_0_black]">
            <FaRegCommentDots className="text-3xl mb-2" />
            <h3 className="font-bold text-lg">Post Anything</h3>
            <p className="text-sm">Unggah cerita dan ekspresikan dirimu.</p>
          </div>
          <div className="bg-white p-4 border-4 border-black shadow-[4px_4px_0_0_black]">
            <FaUserFriends className="text-3xl mb-2" />
            <h3 className="font-bold text-lg">Connect</h3>
            <p className="text-sm">Follow teman-teman dan saling support.</p>
          </div>
          <div className="bg-white p-4 border-4 border-black shadow-[4px_4px_0_0_black]">
            <FaCompass className="text-3xl mb-2" />
            <h3 className="font-bold text-lg">Explore</h3>
            <p className="text-sm">Temukan hal-hal menarik tiap hari.</p>
          </div>
        </section>

        {/* News Feed Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 w-full">
          <h2 className="text-3xl font-bold col-span-full">News Feed</h2>
          <div className="bg-white p-4 border-4 border-black shadow-[6px_6px_0_0_black] mb-6">
            <p className="text-base">“Aulia baru saja memposting foto!”</p>
            <p className="text-xs text-gray-600">2 hours ago</p>
          </div>
          <div className="bg-white p-4 border-4 border-black shadow-[6px_6px_0_0_black] mb-6">
            <p className="text-base">“Bima sedang berbagi pengalaman dalam pengelolaan ternak lele!”</p>
            <p className="text-xs text-gray-600">1 day ago</p>
          </div>
          <div className="bg-white p-4 border-4 border-black shadow-[6px_6px_0_0_black] mb-6">
            <p className="text-base">Iqbal sedang berbagi pengalaman dalam pengembangan web!”</p>
            <p className="text-xs text-gray-600">2 day ago</p>
          </div>
        </section>

        {/* Suggestions Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 w-full">
          <h2 className="text-3xl font-bold col-span-full">Suggestions</h2>
          <div className="bg-white p-4 border-4 border-black shadow-[6px_6px_0_0_black] mb-6">
            <h3 className="font-bold">Suggested Friend: Aulia</h3>
            <button className="bg-blue-500 text-white py-2 px-4 mt-2 rounded-full">Follow</button>
          </div>
          <div className="bg-white p-4 border-4 border-black shadow-[6px_6px_0_0_black] mb-6">
            <h3 className="font-bold">Suggested Friend: Bima</h3>
            <button className="bg-blue-500 text-white py-2 px-4 mt-2 rounded-full">Follow</button>
          </div>
          <div className="bg-white p-4 border-4 border-black shadow-[6px_6px_0_0_black] mb-6">
            <h3 className="font-bold">Suggested Friend: Iqbal</h3>
            <button className="bg-blue-500 text-white py-2 px-4 mt-2 rounded-full">Follow</button>
          </div>
        </section>

        {/* Trending Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 w-full">
          <h2 className="text-3xl font-bold col-span-full">Trending</h2>
          <div className="bg-white p-4 border-4 border-black shadow-[6px_6px_0_0_black] mb-6">
            <h3 className="text-xl font-bold">
              <FaHashtag className="inline mr-2" />
              #WebDesign
            </h3>
            <p className="text-sm">Web design is taking the digital world by storm!</p>
          </div>
          <div className="bg-white p-4 border-4 border-black shadow-[6px_6px_0_0_black] mb-6">
            <h3 className="text-xl font-bold">
              <FaHashtag className="inline mr-2" />
              #TechNews
            </h3>
            <p className="text-sm">Latest trends in technology and software development.</p>
          </div>
          <div className="bg-white p-4 border-4 border-black shadow-[6px_6px_0_0_black] mb-6">
            <h3 className="text-xl font-bold">
              <FaHashtag className="inline mr-2" />
              #AINews
            </h3>
            <p className="text-sm">Latest trends AI in technology and software development.</p>
          </div>
        </section>

        {/* Friend Requests Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 w-full">
          <h2 className="text-3xl font-bold col-span-full">Friend Requests</h2>
          <div className="bg-white p-4 border-4 border-black shadow-[6px_6px_0_0_black] mb-6">
            <h3 className="font-bold">Request from: Aulia</h3>
            <button className="bg-green-500 text-white py-2 px-4 mt-2 rounded-full">Accept</button>
            <button className="bg-red-500 text-white py-2 px-4 mt-2 ml-2 rounded-full">Reject</button>
          </div>
          <div className="bg-white p-4 border-4 border-black shadow-[6px_6px_0_0_black] mb-6">
            <h3 className="font-bold">Request from: Bima</h3>
            <button className="bg-green-500 text-white py-2 px-4 mt-2 rounded-full">Accept</button>
            <button className="bg-red-500 text-white py-2 px-4 mt-2 ml-2 rounded-full">Reject</button>
          </div>
          <div className="bg-white p-4 border-4 border-black shadow-[6px_6px_0_0_black] mb-6">
            <h3 className="font-bold">Request from: Iqbal</h3>
            <button className="bg-green-500 text-white py-2 px-4 mt-2 rounded-full">Accept</button>
            <button className="bg-red-500 text-white py-2 px-4 mt-2 ml-2 rounded-full">Reject</button>
          </div>
        </section>

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
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 w-full">
          <h2 className="text-3xl font-bold col-span-full">Notifications</h2>
          <div className="bg-white p-4 border-4 border-black shadow-[4px_4px_0_0_black]">
            <FaBell className="text-2xl mb-2" />
            <p className="text-base">Kamu punya 3 notifikasi baru!</p>
            <p className="text-sm text-gray-600">Cek sekarang untuk melihat update dari temanmu.</p>
          </div>
        </section>

        {/* Story Highlights Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 w-full">
          <h2 className="text-3xl font-bold mb-4 col-span-full">Story Highlights</h2>
          <div className="flex justify-center gap-4 pb-2 border-b-4 border-black">
            {['Aulia', 'Bima', 'Iqbal'].map((name, index) => (
              <div key={index} className="min-w-[100px] flex-shrink-0 border-4 border-black bg-white shadow-[4px_4px_0_0_black] p-2 text-center">
                <div className="w-20 h-20 rounded-full bg-yellow-200 mb-2"></div>
                <p className="text-sm font-bold">{name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call To Action Section */}
        <section className="w-full mt-8 text-center">
          <h2 className="text-4xl font-extrabold">Gabung dan Ekspresikan Dirimu 🎉</h2>
          <p className="text-gray-700 mt-2 mb-4">Yuk mulai berbagi cerita hari ini!</p>
          <button className="bg-green-600 hover:bg-fuchsia-700 text-white py-2 px-2 text-lg font-bold border-4 border-black shadow-[6px_6px_0_0_black] rounded-full transition-all duration-200">
            Get Started
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-sm underline decoration-dashed underline-offset-4 text-center p-4 border-t-4 border-black">
        Created with ❤️ by{' '}
        <a
          href="https://github.com/sanjikunnn"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-black hover:text-blue-600 transition-colors duration-300"
        >
          Faizmuhiq
        </a>
      </footer>
    </div>
  );
}

export default App;

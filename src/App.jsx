import { useState } from 'react'
import './App.css'
import { FaPlus, FaRegCommentDots, FaUserFriends, FaCompass, FaBell, FaHashtag } from 'react-icons/fa'

function App() {
  const [count, setCount] = useState(0)

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
        <p className="max-w-xl text-lg text-gray-800">
          Tempat berbagi cerita, curhat, dan berkoneksi dengan gaya baru yang unik dan bold. Yuk gabung!
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 w-full">
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
        </div>

        {/* News Feed Section */}
        <section className="w-full max-w-4xl mx-auto mt-10 px-4">
          <h2 className="text-2xl font-bold mb-6 underline decoration-dashed underline-offset-4 text-center">
            News Feed
          </h2>
          <div className="bg-white p-4 border-4 border-black shadow-[6px_6px_0_0_black] mb-6">
            <p className="text-base">“Aulia baru saja memposting foto!”</p>
            <p className="text-xs text-gray-600">2 hours ago</p>
          </div>
          <div className="bg-white p-4 border-4 border-black shadow-[6px_6px_0_0_black] mb-6">
            <p className="text-base">“Bima sedang berbagi pengalaman dalam pengembangan web!”</p>
            <p className="text-xs text-gray-600">1 day ago</p>
          </div>
        </section>

        {/* Suggestions Section */}
        <section className="w-full max-w-4xl mx-auto mt-10 px-4">
          <h2 className="text-2xl font-bold mb-6 underline decoration-dashed underline-offset-4 text-center">
            Suggestions
          </h2>
          <div className="bg-white p-4 border-4 border-black shadow-[6px_6px_0_0_black] mb-6">
            <h3 className="font-bold">Suggested Friend: Aulia</h3>
            <button className="bg-blue-500 text-white py-2 px-4 mt-2 rounded-full">Follow</button>
          </div>
          <div className="bg-white p-4 border-4 border-black shadow-[6px_6px_0_0_black] mb-6">
            <h3 className="font-bold">Suggested Friend: Bima</h3>
            <button className="bg-blue-500 text-white py-2 px-4 mt-2 rounded-full">Follow</button>
          </div>
        </section>

        {/* Trending Section */}
        <section className="w-full max-w-4xl mx-auto mt-10 px-4">
          <h2 className="text-2xl font-bold mb-6 underline decoration-dashed underline-offset-4 text-center">
            Trending Topics
          </h2>
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
        </section>

        {/* Friend Requests Section */}
        <section className="w-full max-w-4xl mx-auto mt-10 px-4">
          <h2 className="text-2xl font-bold mb-6 underline decoration-dashed underline-offset-4 text-center">
            Friend Requests
          </h2>
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
        </section>

        {/* Account Button */}
        <div className="bg-white border-4 border-black px-2 py-6 shadow-[6px_6px_0_0_black] max-w-md w-full mt-6">
          <button
            onClick={() => setCount(count + 1)}
            className="w-full border-4 border-black bg-yellow-200 py-3 text-lg font-bold hover:bg-black hover:text-white transition-all duration-200"
          >
            Create Your Account ({count})
          </button>
          <p className="mt-4 text-sm">Post your daily and share your story 🚀</p>
        </div>
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
  )
}

export default App

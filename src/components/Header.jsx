import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from "../utils/supabase";
import Swal from 'sweetalert2';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollDir, setScrollDir] = useState('up'); // track arah scroll
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    Swal.fire({
      icon: 'success',
      title: 'Berhasil logout!',
    }).then(() => {
      navigate('/login');
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // scroll ke bawah
        setScrollDir('down');
      } else if (currentScrollY < lastScrollY) {
        // scroll ke atas
        setScrollDir('up');
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`
        sticky top-0 z-50 p-4 bg-[#FFF3F7] border-b-[3px] border-black shadow-[6px_6px_0px_#000] 
        transform transition-transform duration-300
        ${scrollDir === 'down' ? '-translate-y-full' : 'translate-y-0'}
      `}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-extrabold tracking-widest text-black underline underline-offset-4 decoration-pink-600 drop-shadow-[4px_4px_0px_white]">
          🚀 Sosmed-Neobrutalism
        </h1>

        {/* Hamburger untuk mobile */}
        <button
          className="md:hidden text-black text-sm"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        {/* Menu desktop */}
        <nav className="hidden md:flex space-x-4">
          <Link
            to="/user/home"
            className="bg-white text-black text-sm font-extrabold px-4 py-2 border-4 border-black shadow-[4px_4px_0px_#000] hover:bg-pink-400 hover:text-black hover:shadow-[6px_6px_0px_#000] transition-all duration-200 active:scale-95"
          >
            🏠 Home
          </Link>
          <Link
            to="/user/profile"
            className="bg-white text-black text-sm font-extrabold px-4 py-2 border-4 border-black shadow-[4px_4px_0px_#000] hover:bg-pink-400 hover:text-black hover:shadow-[6px_6px_0px_#000] transition-all duration-200 active:scale-95"
          >
            🙍‍♂️ Profile
          </Link>
          <button
            onClick={handleLogout}
            className="bg-white text-black text-sm font-extrabold px-4 py-2 border-4 border-black shadow-[4px_4px_0px_#000] hover:bg-red-500 hover:text-black hover:shadow-[6px_6px_0px_#000] transition-all duration-200 active:scale-95"
          >
            🔓 Logout
          </button>
        </nav>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="mt-4 flex flex-col space-y-2 md:hidden">
          <Link
            to="/user/home"
            className="bg-white text-black font-extrabold px-4 py-2 border-4 border-black shadow-[3px_3px_0px_#000] hover:bg-pink-400 hover:text-black"
            onClick={() => setMenuOpen(false)}
          >
            🏠 Home
          </Link>
          <Link
            to="/user/profile"
            className="bg-white text-black font-extrabold px-4 py-2 border-4 border-black shadow-[3px_3px_0px_#000] hover:bg-pink-400 hover:text-black"
            onClick={() => setMenuOpen(false)}
          >
            🙍‍♂️ Profile
          </Link>
          <button
            onClick={() => {
              setMenuOpen(false);
              handleLogout();
            }}
            className="bg-white text-black font-extrabold px-4 py-2 border-4 border-black shadow-[3px_3px_0px_#000] hover:bg-red-500 hover:text-black"
          >
            🔓 Logout
          </button>
        </div>
      )}
    </header>
  );
}

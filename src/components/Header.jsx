import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from "../utils/supabase";
import Swal from 'sweetalert2';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    Swal.fire({
      icon: 'success',
      title: 'Berhasil logout!',
    }).then(() => {
      navigate('/login');
    });
  };

  return (
    <header className="p-4 bg-[#fff200] border-b-[6px] border-black shadow-[6px_6px_0px_#000]">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-extrabold tracking-widest text-black underline underline-offset-4 decoration-pink-600 drop-shadow-[4px_4px_0px_white]">
          🚀 Sosmed-Neobrutalism
        </h1>

        {/* Hamburger untuk mobile */}
        <button
          className="md:hidden text-black text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* Menu desktop */}
        <nav className="hidden md:flex space-x-4">
          <Link
            to="/user/home"
            className="bg-white text-black text-sm font-extrabold px-4 py-2 border-4 border-black shadow-[4px_4px_0px_#000] hover:bg-pink-400 hover:text-white hover:shadow-[6px_6px_0px_#000] transition-all duration-200 active:scale-95"
          >
            🏠 Home
          </Link>
          <Link
            to="/user/profile"
            className="bg-white text-black text-sm font-extrabold px-4 py-2 border-4 border-black shadow-[4px_4px_0px_#000] hover:bg-pink-400 hover:text-white hover:shadow-[6px_6px_0px_#000] transition-all duration-200 active:scale-95"
          >
            🙍‍♂️ Profile
          </Link>
          <button
            onClick={handleLogout}
            className="bg-white text-black text-sm font-extrabold px-4 py-2 border-4 border-black shadow-[4px_4px_0px_#000] hover:bg-red-500 hover:text-white hover:shadow-[6px_6px_0px_#000] transition-all duration-200 active:scale-95"
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
            className="bg-white text-black font-extrabold px-4 py-2 border-4 border-black shadow-[3px_3px_0px_#000] hover:bg-pink-400 hover:text-white"
            onClick={() => setMenuOpen(false)}
          >
            🏠 Home
          </Link>
          <Link
            to="/user/profile"
            className="bg-white text-black font-extrabold px-4 py-2 border-4 border-black shadow-[3px_3px_0px_#000] hover:bg-pink-400 hover:text-white"
            onClick={() => setMenuOpen(false)}
          >
            🙍‍♂️ Profile
          </Link>
          <button
            onClick={() => {
              setMenuOpen(false);
              handleLogout();
            }}
            className="bg-white text-black font-extrabold px-4 py-2 border-4 border-black shadow-[3px_3px_0px_#000] hover:bg-red-500 hover:text-white"
          >
            🔓 Logout
          </button>
        </div>
      )}
    </header>
  );
}

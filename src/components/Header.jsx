import { Link, useNavigate } from 'react-router-dom';
import { supabase } from "../utils/supabase";
import Swal from 'sweetalert2';

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    Swal.fire({
      icon: 'success',
      title: 'Berhasil logout!',
    }).then(() => {
      navigate('/login'); // arahkan ke halaman login
    });
  };

  return (
    <header className="flex justify-between items-center p-4 border-b-4 border-black bg-[#fdfdfd]">
      <h1 className="text-sm text-left font-extrabold tracking-widest text-black underline underline-offset-2 decoration-[#FF1D1E] drop-shadow-[3px_3px_0px_#FF1D4E]">
        Sosmed-Neobrutalism
      </h1>
      <nav className="space-x-4">
        <Link
          to="/user/home"
          className="bg-transparent text-black text-sm font-bold px-2 py-1 border-2 border-black shadow-[3px_3px_0px_#000] rounded-none hover:bg-pink-500 hover:text-white transition-all duration-200 underline-offset-2"
        >
          Home
        </Link>
        <Link
          to="/user/profile"
          className="bg-transparent text-black text-sm font-bold px-2 py-1 border-2 border-black shadow-[3px_3px_0px_#000] rounded-none hover:bg-pink-500 hover:text-white transition-all duration-200 underline-offset-2"
        >
          Profile
        </Link>
        <button
          onClick={handleLogout}
          className="bg-transparent text-black text-sm font-bold px-2 py-1 shadow-[3px_3px_0px_#000] rounded-none hover:bg-red-600 transition-all duration-200"
        >
          Logout
        </button>
      </nav>
    </header>
  );
}

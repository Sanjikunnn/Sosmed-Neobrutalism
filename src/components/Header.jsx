import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 border-b-4 border-black bg-yellow-300">
      <h1 className="text-sm text-left font-extrabold tracking-widest text-black underline underline-offset-2 decoration-[#FF1D1E] drop-shadow-[3px_3px_0px_#FF1D4E]">
        Sosmed-Neobrutalism
      </h1>
      <nav className="space-x-4">
        <Link
          to="/user/profile"
          className="bg-transparent text-black text-sm font-bold px-2 py-1 border-2 border-black shadow-[3px_3px_0px_#000] rounded-none hover:bg-pink-500 hover:text-white transition-all duration-200 underline-offset-2"
        >
          Profile
        </Link>
      </nav>
    </header>
  );
}

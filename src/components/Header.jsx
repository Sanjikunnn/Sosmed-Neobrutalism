export default function Header() {
    return (
      <header className="flex justify-between items-center p-4 border-b-4 border-black bg-yellow-300">
        <h1 className="text-2xl font-bold uppercase">NeoBrutal</h1>
        <nav className="space-x-4">
          <a href="#" className="border-2 border-black px-3 py-1 hover:bg-black hover:text-white">Home</a>
          <a href="#" className="border-2 border-black px-3 py-1 hover:bg-black hover:text-white">Profile</a>
        </nav>
      </header>
    );
  }
  
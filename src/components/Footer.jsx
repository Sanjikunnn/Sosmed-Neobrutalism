import { Link } from "react-router-dom"; // Kalau pakai React Router

export default function Footer() {
  return (
    <footer className="w-full bg-transparent text-black py-1 mt-6 underline-offset-4">
      <div className="flex justify-center gap-6">
        <Link to="/privacy" className="text-sm">Privacy Policy</Link>
        <Link to="/terms" className="text-sm">Terms of Service</Link>
      </div>
      <p className="text-center text-sm mt-4">&copy; 2025 Sosmed Neobrutalism</p>
    </footer>
  );
}

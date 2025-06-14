import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../../utils/supabase';  // Assuming supabase is correctly configured
import Swal from 'sweetalert2';

const Login = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = form;
  
    if (!/\S+@\S+\.\S+/.test(email)) {
      showAlert('Email Error', 'Email tidak valid!');
      return;
    }
  
    if (password.length < 6) {
      showAlert('Password Error', 'Password minimal 6 karakter!');
      return;
    }
  
    try {
      setLoading(true);
  
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      if (error) {
        showAlert('Login Gagal', error.message);
        setLoading(false);
        return;
      }
  
      Swal.fire({
        title: 'Login Berhasil!',
        icon: 'success',
        text: 'Selamat datang kembali!',
        timer: 1500,
        showConfirmButton: false,
        background: '#fff',
        color: '#000',
        customClass: {
          popup: 'border-4 border-black shadow-[6px_6px_0px_#000] rounded-none',
          title: 'text-2xl font-bold drop-shadow-[2px_2px_0px_#FF4D6E]',
        }
      });
  
      setTimeout(() => {
        navigate('/user/home');
      }, 1600);
    } catch (err) {
      console.error(err);
      showAlert('Oops!', 'Terjadi kesalahan saat login.');
      setLoading(false);
    }
  };
  
  const showAlert = async (title, text, icon = 'error') => {
    await Swal.fire({
      title: `<strong class="text-2xl font-bold underline underline-offset-2 tracking-wide">${title}</strong>`,
      html: `<p class="text-base font-medium text-black drop-shadow-[1px_1px_0px_#FF4D6E]">${text}</p>`,
      icon: icon,
      confirmButtonText: 'SIAP🚀!',
      background: '#FFFBCC',
      color: '#000',
      buttonsStyling: false,
      customClass: {
        popup: 'w-[360px] border-[4px] border-black shadow-[6px_6px_0px_#000] rounded-none px-4 py-5',
        confirmButton: 'bg-[#FF4D6E] text-black text-sm font-bold px-6 py-2 border-2 border-black shadow-[3px_3px_0px_#000] rounded-none hover:bg-fuchsia hover:text-white transition-all duration-200',
        title: '',
      }
    });
  
    window.location.reload();
  };
  
  
  
  // Custom function to handle back navigation with fallback
  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate('/'); // If there's a history entry, go back
    } else {
      navigate('/'); // No history entry, go to the home page
    }
  };

  // Navigate to signup page
  const handleSignupRedirect = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-yellow-200 px-4 relative">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="absolute top-3 left-3 text-sm text-blue-800 hover:text-white z-10 group"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        <span className="text-sm hidden group-hover:inline-block">Back</span>
      </button>

      {/* Login Form */}
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md bg-white border-[6px] border-black p-6 rounded-lg shadow-[8px_8px_0px_#000]">
          <h2 className="text-4xl font-extrabold mb-6 text-center text-black drop-shadow-[3px_3px_0px_#FF4D6E] tracking-widest">
            Login to Your Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="bg-yellow-100 border-4 border-black text-black font-bold py-3 px-4 -mb-4 rounded-none shadow-[4px_4px_0px_#000] focus:outline-none focus:ring-4 focus:ring-[#FF4D6E]"
            />
            <InputField
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="bg-yellow-100 border-4 border-black text-black font-bold py-3 px-4 mb-4 rounded-none shadow-[4px_4px_0px_#000] focus:outline-none focus:ring-4 focus:ring-[#FF4D6E]"
            />
            <Button
              type="submit"
              label={loading ? 'Logging in...' : 'Login'}
              className="bg-[#FF4D6E] text-black border-4 border-black py-3 font-bold text-xl shadow-[4px_4px_0px_#000] rounded-none hover:bg-fuchsia hover:text-white transition"
              disabled={loading}
            />
          </form>

          {/* Already have an account? Link */}
          <div className="text-center mt-4">
            <p className="text-sm">
              Don't have an account?{' '}
              <a
                onClick={handleSignupRedirect}
                className="text-blue-600 hover:underline"
                style={{ cursor: 'pointer' }}
              >
                Signup
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-transparent text-black py-1 mt-6 underline-offset-4">
        <div className="flex justify-center gap-6">
          <a href="#" className="text-sm">Privacy Policy</a>
          <a href="#" className="text-sm">Terms of Service</a>
        </div>
        <p className="text-center text-sm mt-4">&copy; 2025 Sosmed Neobrutalism</p>
      </footer>
    </div>
  );
};

export default Login;

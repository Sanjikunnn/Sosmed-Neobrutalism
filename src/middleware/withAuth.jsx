import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';

const withAuth = (Component) => {
  return function AuthComponent(props) {
    const navigate = useNavigate();

    useEffect(() => {
      let interval;

      const checkAuth = async () => {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error || !session || !session.user) {
          navigate('/login'); // ke halaman login kalau ga ada session
        } else {
          const now = Math.floor(Date.now() / 1000); // waktu sekarang dalam detik
          if (session.expires_at && session.expires_at < now) {
            await supabase.auth.signOut(); // keluarin user
            navigate('/login');
          }
        }
      };

      checkAuth(); // cek langsung waktu pertama kali

      // Cek tiap 1 menit (bisa kamu sesuaikan waktunya)
      interval = setInterval(checkAuth, 60000);

      // Bersihin interval waktu komponen dibuang
      return () => clearInterval(interval);
    }, [navigate]);

    return <Component {...props} />;
  };
};

export default withAuth;

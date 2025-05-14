import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';

const withAuth = (Component) => {
  return function AuthComponent(props) {
    const navigate = useNavigate();

    useEffect(() => {
      const checkAuth = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/login'); // arahkan ke halaman login
        }
      };
      checkAuth();
    }, [navigate]);

    return <Component {...props} />;
  };
};

export default withAuth;

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Nav () {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get('user');
        if (data.Data) {
          setName(`${data.Data.first_name} ${data.Data.last_name}`);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  const logout = async () => {
    await api.post('logout');
    navigate('/login');
  };

  return (
    <header className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
      <Link className="navbar-brand col-md-3 col-lg-2 mr-0 px-3" to="/">
        React And Go Voucher Management
      </Link>

      <nav className="my-2 my-md-0 mr-md-3">
        <Link to="/profile" className="p-2 text-white text-decoration-none">
          {name}
        </Link>
        <Link to="/login" className="p-2 text-white text-decoration-none" onClick={logout}>
          Sign out
        </Link>
      </nav>
    </header>
  );
}
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';
import Menu from '../components/Menu';
import api from '../services/api';

export default function Wrapper () {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get('user');
      } catch (error) {
        console.error("Authentication error:", error);
        navigate('/login');
      }
    };
    checkAuth();
  }, [navigate]);

  return (
    <>
      <Nav />
      <div className="container-fluid">
        <div className="row">
          <Menu />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}
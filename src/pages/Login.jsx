import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Login () {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('login', form);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <main className="form-signin w-100 m-auto">
      <form onSubmit={submit}>
        <h1 className="h3 mb-3 fw-normal">Please sign-in</h1>

        <input
          name="email"
          type="email"
          className="form-control"
          placeholder="name@example.com"
          required
          value={form.email}
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          className="form-control"
          placeholder="Password"
          required
          value={form.password}
          onChange={handleChange}
        />

        <button className="w-100 btn btn-primary py-2" type="submit">
          Sign in
        </button>
      </form>
    </main>
  );
}
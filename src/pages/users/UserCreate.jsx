import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const UserCreate = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    role_id: ''
  });

  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await api.get('roles');

        console.log("Fetched roles:", response.data.Data);
        if (response.data && Array.isArray(response.data.Data)) {
          setRoles(response.data.Data);
        } else {
          setRoles([]);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
        setRoles([]);
      }
    };

    fetchRoles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: name === 'role_id' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('users', form);
      console.log("User created:", response.data);
      alert("User created successfully");
      navigate('/users');
    } catch (error) {
      console.error("Error creating user:", error);
      if (error.response?.data?.Data?.error) {
        alert(error.response.data.Data.error);
      } else {
        alert("Failed to create user. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="h3 mb-3 fw-normal">Add New User</h1>

      <div className="mb-3">
        <label>First Name</label>
        <input
          name="first_name"
          value={form.first_name}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>

      <div className="mb-3">
        <label>Last Name</label>
        <input
          name="last_name"
          value={form.last_name}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>

      <div className="mb-3">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>

      <div className="mb-3">
        <label>Role</label>
        <select
          name="role_id"
          value={form.role_id}
          onChange={handleChange}
          className="form-control"
          required
        >
          <option value="" disabled>Select Role</option>
          {roles.length === 0 ? (
            <option disabled>Loading or No Roles</option>
          ) : (
            roles.map(role => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))
          )}
        </select>
      </div>

      <button className="btn btn-outline-secondary" type="submit">
        Save
      </button>
    </form>
  );
};

export default UserCreate;

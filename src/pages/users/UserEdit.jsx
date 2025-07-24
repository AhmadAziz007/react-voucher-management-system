import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const UserEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    role_id: ''
  });

  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchUserAndRoles = async () => {
      try {
        // Fetch user detail
        const userResponse = await api.get(`users/${id}`);
        const userData = userResponse.data.Data;

        setForm({
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          role_id: userData.role_id,
        });

        // Fetch roles
        const rolesResponse = await api.get('roles');
        if (rolesResponse.data && Array.isArray(rolesResponse.data.Data)) {
          setRoles(rolesResponse.data.Data);
        }

      } catch (error) {
        console.error("Error fetching user or roles:", error);
        alert("Failed to load data. Please try again.");
      }
    };

    fetchUserAndRoles();
  }, [id]);

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
      const response = await api.put(`users/${id}`, form);
      console.log("User updated:", response.data);
      alert("User updated successfully");
      navigate('/users');
    } catch (error) {
      console.error("Error updating user:", error);
      if (error.response?.data?.Data?.error) {
        alert(error.response.data.Data.error);
      } else {
        alert("Failed to update user. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="h3 mb-3 fw-normal">Edit User</h1>

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
          {roles.map(role => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
      </div>

      <button className="btn btn-outline-primary" type="submit">
        Update
      </button>
    </form>
  );
};

export default UserEdit;

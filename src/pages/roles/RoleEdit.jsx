import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const RoleEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // ambil ID dari URL

  const [formData, setFormData] = useState({
    name: '',
    permissions: [] // array of permission ID dalam bentuk string
  });

  const [permissionList, setPermissionList] = useState([]);

  // Fetch permission list dan detail role by id
  useEffect(() => {
    const fetchData = async () => {
      try {
        const permRes = await api.get('/permissions');
        const roleRes = await api.get(`/roles/${id}`);

        const role = roleRes.data.Data;
        setPermissionList(permRes.data);
        setFormData({
          name: role.name,
          permissions: role.permissions.map((p) => String(p.id))
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to load data. Please try again.");
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      name: e.target.value
    });
  };

  const handleCheckboxChange = (permissionId, checked) => {
    const pid = String(permissionId);
    setFormData((prev) => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, pid]
        : prev.permissions.filter((p) => p !== pid)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        permissions: formData.permissions
      };
      const response = await api.put(`/roles/${id}`, payload);
      console.log("Role updated:", response.data);
      alert("Role updated successfully");
      navigate('/roles');
    } catch (error) {
      console.error("Error updating role:", error);
      if (error.response?.data?.Data?.error) {
        alert(error.response.data.Data.error);
      } else {
        alert("Failed to update role. Please try again.");
      }
    }
  };

  const isChecked = (pid) => formData.permissions.includes(String(pid));

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="h3 mb-3 fw-normal">Edit Role</h1>

      <div className="mb-3 mt-3 row">
        <label className="col-sm-2 col-form-label">Name</label>
        <div className="col-sm-10">
          <input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
      </div>

      <div className="mb-3 row">
        <label className="col-sm-2 col-form-label">Permission</label>
        <div className="col-sm-10">
          {permissionList.map((permission) => (
            <div
              className="form-check form-check-inline col-3"
              key={permission.id}
            >
              <input
                className="form-check-input"
                type="checkbox"
                value={permission.id}
                checked={isChecked(permission.id)}
                onChange={(e) =>
                  handleCheckboxChange(permission.id, e.target.checked)
                }
              />
              <label className="form-check-label">{permission.name}</label>
            </div>
          ))}
        </div>
      </div>

      <button className="btn btn-outline-secondary" type="submit">
        Save
      </button>
    </form>
  );
};

export default RoleEdit;

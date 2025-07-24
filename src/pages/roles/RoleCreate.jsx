import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const RoleCreate = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    permissions: []
  });

  const [permissionList, setPermissionList] = useState([]);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await api.get('permissions');
        console.log("Fetched permissions:", response.data);

        setPermissionList(response.data);
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    };

    fetchPermissions();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      name: e.target.value
    });
  };

  const handleCheckboxChange = (id, checked) => {
    setFormData(prevState => ({
      ...prevState,
      permissions: checked
        ? [...prevState.permissions, String(id)]
        : prevState.permissions.filter(p => p !== String(id))
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('roles', formData);
      console.log("Role created:", response.data);
      alert('Role created successfully');
      navigate('/roles');
    } catch (error) {
      console.error("Error creating role:", error);
      if (error.response?.data?.Data?.error) {
        alert(error.response.data.Data.error);
      } else {
        alert("Failed to create role. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="h3 mb-3 fw-normal">Add New Role</h1>

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
          {permissionList.map(permission => (
            <div
              className="form-check form-check-inline col-3"
              key={permission.id}
            >
              <input
                className="form-check-input"
                type="checkbox"
                value={permission.id}
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

export default RoleCreate;

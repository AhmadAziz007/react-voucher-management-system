import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function Roles () {
  const [roles, setRoles] = useState([]);

  const loadRoles = async () => {
    try {
      const { data } = await api.get('roles');
      setRoles(data.Data);
    } catch (error) {
      console.error("Error fetching roles:", error);
      alert("Failed to load roles");
    }
  };

  const deleteRole = async (id) => {
    if (!confirm('Are you sure you want to delete this role?')) return;

    try {
      await api.delete(`roles/${id}`);
      setRoles(roles.filter(role => role.id !== id));
      alert("Role deleted successfully");
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  return (
    <>
      <h1 className="h3 mb-3 fw-normal">Table Roles</h1>
      <div className="pt-3 pb-3 mb-3 border-bottom">
        <Link to="/roles/create" className="btn btn-sm btn-outline-secondary">
          Add
        </Link>
      </div>

      <div className="table-responsive small">
        <table className="table table-striped table-sm">
          <thead>
            <tr>
              <th>No</th>
              <th>ID</th>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role, index) => (
              <tr key={role.id}>
                <td>{index + 1}</td>
                <td>{role.id}</td>
                <td>{role.name}</td>
                <td>
                  <div className="btn-group mr-2">
                    <Link
                      to={`/roles/${role.id}/edit`}
                      className="btn btn-sm btn-primary"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-sm btn-danger ms-1"
                      onClick={() => deleteRole(role.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
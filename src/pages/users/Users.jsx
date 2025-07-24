import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';

export default function Users () {
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({ last_page: 0, page: 1, total: 0 });
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const currentPage = parseInt(queryParams.get('page')) || 1;

  const perPage = meta.total && meta.last_page ? Math.ceil(meta.total / meta.last_page) : 5;

  const fetchUsers = async (page = 1) => {
    try {
      const { data } = await api.get('/users', { params: { page } });
      setUsers(data.Data);
      setMeta(data.Meta);
      navigate(`?page=${page}`, { replace: true });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const getRowNumber = (index) => {
    return (meta.page - 1) * perPage + index + 1;
  };

  const changePage = (page) => {
    if (page < 1 || page > meta.last_page) return;
    fetchUsers(page);
  };

  const deleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await api.delete(`users/${id}`);
      setUsers(users.filter(user => user.id !== id));
      alert("User deleted successfully");
      setMeta({ ...meta, total: meta.total - 1 });

      if (users.length === 1 && currentPage > 1) {
        fetchUsers(currentPage - 1);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Please try again.");
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, []);

  return (
    <>
      <h1 className="h3 mb-3 fw-normal">Table Users</h1>
      <div className="pt-3 pb-3 mb-3 border-bottom">
        <Link to="/users/create" className="btn btn-sm btn-outline-secondary">
          Add
        </Link>
      </div>

      <div className="table-responsive small">
        <table className="table table-striped table-sm">
          <thead>
            <tr>
              <th>No</th>
              <th>ID USER</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>{getRowNumber(index)}</td>
                <td>{user.id}</td>
                <td>{`${user.first_name} ${user.last_name}`}</td>
                <td>{user.email}</td>
                <td>{user.role?.name || 'N/A'}</td>
                <td>
                  <Link
                    to={`/users/${user.id}/edit`}
                    className="btn btn-sm btn-primary"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-sm btn-danger ms-1"
                    onClick={() => deleteUser(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {meta.last_page > 1 && (
          <nav>
            <ul className="pagination">
              <li className={`page-item ${meta.page === 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => changePage(meta.page - 1)}
                >
                  Previous
                </button>
              </li>

              {[...Array(meta.last_page)].map((_, i) => (
                <li
                  key={i}
                  className={`page-item ${meta.page === i + 1 ? 'active' : ''}`}
                >
                  <button
                    className="page-link"
                    onClick={() => changePage(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}

              <li className={`page-item ${meta.page === meta.last_page ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => changePage(meta.page + 1)}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </>
  );
}
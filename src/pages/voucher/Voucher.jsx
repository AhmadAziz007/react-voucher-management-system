import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';

export default function Vouchers () {
  const [vouchers, setVouchers] = useState([]);
  const [meta, setMeta] = useState({ last_page: 0, page: 1, total: 0 });
  const [searchCode, setSearchCode] = useState('');
  const [debouncedSearchCode, setDebouncedSearchCode] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const mounted = useRef(false);

  const queryParams = new URLSearchParams(location.search);
  const initialSearchCode = queryParams.get('voucher_code') || '';
  const currentPage = parseInt(queryParams.get('page')) || 1;

  const perPage = meta.total && meta.last_page
    ? Math.ceil(meta.total / meta.last_page)
    : 5;

  const fetchVouchers = useCallback(async (page = 1, code = '') => {
    try {
      const { data } = await api({
        method: 'post',
        url: 'vouchers/search',
        params: { page },
        data: { voucher_code: code }
      });

      setVouchers(data.Data);
      setMeta(data.Meta);

      const query = new URLSearchParams();
      query.set('page', page);
      if (code) query.set('voucher_code', code);

      navigate(`?${query.toString()}`, { replace: true });
    } catch (error) {
      console.error('Error fetching vouchers:', error);
    }
  }, [navigate]);

  const getRowNumber = (index) => {
    return (meta.page - 1) * perPage + index + 1;
  };

  const changePage = (page) => {
    if (page < 1 || page > meta.last_page) return;
    fetchVouchers(page, debouncedSearchCode);
  };

  const deleteVoucher = async (id) => {
    if (!confirm('Are you sure you want to delete this voucher?')) return;

    try {
      await api.delete(`vouchers/${id}`);
      fetchVouchers(currentPage, debouncedSearchCode);
      alert('Voucher deleted successfully');
    } catch (error) {
      console.error('Error deleting voucher:', error);
      alert('Failed to delete voucher. Please try again.');
    }
  };

  // Debounce searchCode ke debouncedSearchCode
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchCode(searchCode);
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchCode]);

  // Fetch saat debouncedSearchCode atau currentPage berubah
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      setSearchCode(initialSearchCode);
      setDebouncedSearchCode(initialSearchCode);
    }
    fetchVouchers(currentPage, debouncedSearchCode);
  }, [debouncedSearchCode, currentPage, fetchVouchers]);

  return (
    <>
      <h1 className="h3 mb-3 fw-normal">Table Vouchers</h1>

      <div className="pt-3 pb-3 mb-3 border-bottom d-flex justify-content-between align-items-center">
        <Link to="/vouchers/create" className="btn btn-sm btn-outline-secondary">
          Add
        </Link>
        <div className="d-flex">
          <input
            type="text"
            placeholder="Search by code"
            className="form-control form-control-sm me-2"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
          />
        </div>
      </div>

      <div className="table-responsive small">
        <table className="table table-striped table-sm">
          <thead>
            <tr>
              <th>No</th>
              <th>ID</th>
              <th>Voucher Code</th>
              <th>Discount</th>
              <th>Expiry Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.map((v, index) => (
              <tr key={v.id}>
                <td>{getRowNumber(index)}</td>
                <td>{v.id}</td>
                <td>{v.voucher_code}</td>
                <td>{v.discount}%</td>
                <td>{new Date(v.expiry_date).toLocaleDateString()}</td>
                <td>
                  <Link
                    to={`/vouchers/${v.id}/edit`}
                    className="btn btn-sm btn-primary"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-sm btn-danger ms-1"
                    onClick={() => deleteVoucher(v.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Tampilkan pagination jika lebih dari 1 halaman */}
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
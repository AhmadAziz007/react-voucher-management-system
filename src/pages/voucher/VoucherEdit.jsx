import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

export default function VoucherEdit () {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    voucher_code: '',
    discount: '',
    expiry_date: ''
  });

  useEffect(() => {
    const fetchVoucher = async () => {
      try {
        const { data } = await api.get(`vouchers/${id}`);
        const voucher = data;

        setFormData({
          voucher_code: voucher.voucher_code,
          discount: voucher.discount,
          expiry_date: voucher.expiry_date
        });
      } catch (error) {
        console.error('Error fetching voucher:', error);
        alert('Failed to fetch voucher');
      }
    };

    fetchVoucher();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        discount: Number(formData.discount)
      };

      const response = await api.put(`vouchers/${id}`, payload);
      console.log("Voucher updated:", response.data);

      alert('Voucher updated successfully');
      navigate('/vouchers');
    } catch (error) {
      console.error('Error updating voucher:', error);
      alert('Failed to update voucher. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="h3 mb-3 fw-normal">Edit Voucher</h1>

      <div className="mb-3">
        <label className="form-label">Voucher Code</label>
        <input
          type="text"
          name="voucher_code"
          value={formData.voucher_code}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Discount (%)</label>
        <input
          type="number"
          name="discount"
          value={formData.discount}
          onChange={handleChange}
          className="form-control"
          required
          min="1"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Expiry Date</label>
        <input
          type="date"
          name="expiry_date"
          value={formData.expiry_date}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>

      <button type="submit" className="btn btn-outline-secondary">
        Save
      </button>
    </form>
  );
}

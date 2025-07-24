import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function VoucherCreate () {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    voucher_code: '',
    discount: '',
    expiry_date: ''
  });

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

      const response = await api.post('vouchers', payload);
      console.log("Voucher created:", response.data);

      alert('Voucher created successfully');
      navigate('/vouchers');
    } catch (error) {
      console.error('Error creating voucher:', error);
      alert('Failed to create voucher. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="h3 mb-3 fw-normal">Create Voucher</h1>

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

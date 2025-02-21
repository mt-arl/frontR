import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Make sure Bootstrap CSS is imported

const CreateTransaction = () => {
  const [formData, setFormData] = useState({
    stockSymbol: '',
    quantity: '',
    purchasePrice: '',
    purchaseTransFee: '',
    saleTransFee: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      stockSymbol: formData.stockSymbol,
      quantity: parseInt(formData.quantity),
      purchasePrice: parseInt(formData.purchasePrice),
      purchaseTransFee: parseInt(formData.purchaseTransFee),
      saleTransFee: parseInt(formData.saleTransFee)
    };

    try {
      const response = await fetch('http://localhost:3000/api/stocks/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });
      const result = await response.json();
      if (response.ok) {
        setMessage('Transaction created successfully. ID: ' + result.transactionId);
        setFormData({
          stockSymbol: '',
          quantity: '',
          purchasePrice: '',
          purchaseTransFee: '',
          saleTransFee: ''
        });
      } else {
        setMessage('Error: ' + result.message);
      }
    } catch (error) {
      console.error(error);
      setMessage('Server error.');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Create Transaction</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Stock Symbol:</label>
          <input
            type="text"
            className="form-control"
            name="stockSymbol"
            value={formData.stockSymbol}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Quantity:</label>
          <input
            type="number"
            className="form-control"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Purchase Price :</label>
          <input
            type="number"
            className="form-control"
            name="purchasePrice"
            value={formData.purchasePrice}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Purchase Fee :</label>
          <input
            type="number"
            className="form-control"
            name="purchaseTransFee"
            value={formData.purchaseTransFee}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Sale Fee :</label>
          <input
            type="number"
            className="form-control"
            name="saleTransFee"
            value={formData.saleTransFee}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Create Transaction</button>
      </form>
      {message && <p className="mt-3">{message}</p>}
    </div>
  );
};

export default CreateTransaction;

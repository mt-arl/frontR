import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

const TransactionsTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/stocks/purchase/transactions');
      const data = await response.json();
      setTransactions(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  if (loading) {
    return <p>Loading transactions...</p>;
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Transactions</h2>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Symbol</th>
            <th>Quantity</th>
            <th>Purchase Price</th>
            <th>Purchase Fee</th>
            <th>Sale Fee</th>
            <th>Investment</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.transaction_id}>
              <td>{t.transaction_id}</td>
              <td>{t.stock_symbol}</td>
              <td>{t.quantity}</td>
              <td>{t.purchase_price}</td>
              <td>{t.purchase_trans_fee}</td>
              <td>{t.sale_trans_fee}</td>
              <td>{t.investment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;

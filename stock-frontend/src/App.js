// src/App.js
import React, { useState } from 'react';
import CreateTransaction from './components/CreateTransaction';
import TransactionsTable from './components/TransactionsTable';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de importar Bootstrap aquí



function App() {
  const [activeTab, setActiveTab] = useState('create');

  return (
    <div className="container mt-4">
        <h1 className="text-center text-primary mb-4">Stock Transaction Management</h1>

        <nav className="d-flex justify-content-center mb-3">
            <button className={`btn me-2 ${activeTab === 'create' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setActiveTab('create')}>
                Create Transaction
            </button>
            <button className={`btn ${activeTab === 'table' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setActiveTab('table')}>
                View Transactions
            </button>
        </nav>


        <div className="card shadow p-4">
            {activeTab === 'create' && <CreateTransaction />}
            {activeTab === 'table' && <TransactionsTable />}
        </div>
    </div>
);
}

export default App;

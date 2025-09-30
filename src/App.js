// import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './component/Dashboard';
import Orders from './component/Orders';
import Expenses from './component/Expenses';
import Reports from './component/Reports';
import NotFound from './component/NotFound';
import Sidebar from './component/Sidebar';
import { useState } from 'react';

function App() {
  const [orders, setOrders] = useState([]);
  const [expenses, setExpenses] = useState([]);

  return (
    <div className="d-flex">
      <Sidebar />

      <div className="flex-grow-1 p-4">
        <Routes>
          <Route
            path="/"
            element={<Dashboard orders={orders} expenses={expenses} />}
          />
          <Route
            path="/orders"
            element={<Orders orders={orders} setOrders={setOrders} />}
          />
          <Route
            path="/expenses"
            element={<Expenses expenses={expenses} setExpenses={setExpenses} />}
          />
          <Route
            path="/reports"
            element={<Reports orders={orders} expenses={expenses} />}
          />
          <Route path="/dashboard" element={<Navigate to="/" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

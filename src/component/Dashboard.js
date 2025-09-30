// Dashboard.js
import React, { useState } from 'react';

const Dashboard = ({ orders, expenses }) => {
  const now = new Date();
  const today = now.toISOString().split('T')[0]; // format YYYY-MM-DD

  const [period, setPeriod] = useState('month'); // default = current month
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  // Handle period selection
  const handlePeriodChange = (e) => setPeriod(e.target.value);

  // Apply filtering
  const filterByPeriod = (itemDate) => {
    const date = new Date(itemDate);

    if (period === 'month') {
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    }

    if (period === 'year') {
      return date.getFullYear() === now.getFullYear();
    }

    if (period === 'range') {
      return date >= new Date(startDate) && date <= new Date(endDate);
    }

    return true; // all
  };

  // Filter orders and expenses
  const filteredOrders = orders.filter((order) => filterByPeriod(order.date));
  const filteredExpenses = expenses.filter((exp) => filterByPeriod(exp.date));

  // Calculate metrics
  const totalOrders = filteredOrders.length;
  const totalIncome = filteredOrders.reduce(
    (acc, order) => acc + Number(order.price),
    0
  );
  const totalExpenses = filteredExpenses.reduce(
    (acc, exp) => acc + Number(exp.amount),
    0
  );
  const netProfit = totalIncome - totalExpenses;
  const totalBalance =
    filteredOrders
      .filter((o) => o.paid)
      .reduce((acc, o) => acc + Number(o.price), 0) - totalExpenses;
  const totalPending = filteredOrders
    .filter((o) => !o.paid)
    .reduce((acc, o) => acc + Number(o.price), 0);

  // Card styling
  const cardStyle = (bgColor) => ({
    backgroundColor: bgColor,
    color: '#fff',
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center',
  });

  const descriptionStyle = {
    fontSize: '0.7rem',
    marginTop: '8px',
    color: '#f0f0f0',
  };

  return (
    <div>
      <h2 style={{ color: '#2C3E50' }}>Dashboard</h2>

      {/* Filter Dropdown */}
      <div className="d-flex flex-wrap align-items-center mb-3">
        <label className="me-2" style={{ fontWeight: 'bold' }}>
          Filter by:
        </label>
        <select
          className="form-select w-auto me-3"
          value={period}
          onChange={handlePeriodChange}
        >
          <option value="all">All Time</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
          <option value="range">Custom Range</option>
        </select>

        {period === 'range' && (
          <div className="d-flex flex-wrap gap-2 mt-2 mt-md-0">
            <div>
              <label className="form-label mb-0 me-2">Start:</label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="form-label mb-0 me-2">End:</label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Dashboard Cards */}
      <div className="row mt-4">
        <div className="col-md-4 mb-3">
          <div style={cardStyle('#3498DB')}>
            <h5>Total Orders</h5>
            <p style={descriptionStyle}>Number of orders added to the system</p>
            <p>{totalOrders}</p>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div style={cardStyle('#1ABC9C')}>
            <h5>Total Income</h5>
            <p style={descriptionStyle}>
              Total revenue from all orders (paid or unpaid)
            </p>
            <p>₦{totalIncome}</p>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div style={cardStyle('#E74C3C')}>
            <h5>Total Expenses</h5>
            <p style={descriptionStyle}>
              Total money spent on running the business
            </p>
            <p>₦{totalExpenses}</p>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div style={cardStyle('#F39C12')}>
            <h5>Net Profit</h5>
            <p style={descriptionStyle}>
              Income minus expenses (ignores pending payments)
            </p>
            <p>₦{netProfit}</p>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div style={cardStyle('#9B59B6')}>
            <h5>Total Balance</h5>
            <p style={descriptionStyle}>
              Available money from paid orders minus expenses
            </p>
            <p>₦{totalBalance}</p>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div style={cardStyle('#16A085')}>
            <h5>Total Pending</h5>
            <p style={descriptionStyle}>Money expected from unpaid orders</p>
            <p>₦{totalPending}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

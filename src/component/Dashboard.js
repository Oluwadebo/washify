import React, { useState } from 'react';

const Dashboard = ({ orders, expenses }) => {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const [filterType, setFilterType] = useState('today');
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [startDate, setStartDate] = useState(today.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(today.toISOString().split('T')[0]);

  const months = [
    { value: 1, label: 'January' }, { value: 2, label: 'February' },
    { value: 3, label: 'March' }, { value: 4, label: 'April' },
    { value: 5, label: 'May' }, { value: 6, label: 'June' },
    { value: 7, label: 'July' }, { value: 8, label: 'August' },
    { value: 9, label: 'September' }, { value: 10, label: 'October' },
    { value: 11, label: 'November' }, { value: 12, label: 'December' },
  ];
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

  const filterByType = (itemDate) => {
    const date = new Date(itemDate);
    if (filterType === 'today') return date.toDateString() === new Date().toDateString();
    if (filterType === 'month') return date.getMonth() + 1 === selectedMonth && date.getFullYear() === selectedYear;
    if (filterType === 'custom') {
      if (!startDate || !endDate) return true;
      const onlyDate = date.toISOString().split('T')[0];
      return onlyDate >= startDate && onlyDate <= endDate;
    }
    return true;
  };

  const filteredOrders = orders.filter((o) => filterByType(o.date));
  const filteredExpenses = expenses.filter((e) => filterByType(e.date));

  const totalOrders = filteredOrders.length;
  const totalIncome = filteredOrders.reduce((acc, o) => acc + Number(o.price), 0);
  const totalExpenses = filteredExpenses.reduce((acc, e) => acc + Number(e.amount), 0);
  const netProfit = totalIncome - totalExpenses;
  const totalBalance = filteredOrders.filter(o => o.paymentStatus === 'Paid').reduce((acc, o) => acc + Number(o.price), 0) - totalExpenses;
  const totalPending = filteredOrders.filter(o => o.paymentStatus === 'Pending').reduce((acc, o) => acc + Number(o.price), 0);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);

  const cards = [
    { title: 'Total Orders', value: totalOrders, bgColor: '#3498DB', description: 'Number of orders added' },
    { title: 'Total Income', value: formatCurrency(totalIncome), bgColor: '#1ABC9C', description: 'Revenue from all orders' },
    { title: 'Total Expenses', value: formatCurrency(totalExpenses), bgColor: '#E74C3C', description: 'Business running costs' },
    { title: 'Net Profit', value: formatCurrency(netProfit), bgColor: '#F39C12', description: 'Income - Expenses' },
    { title: 'Total Balance', value: formatCurrency(totalBalance), bgColor: '#9B59B6', description: 'Money from PAID orders minus expenses' },
    { title: 'Total Pending', value: formatCurrency(totalPending), bgColor: '#16A085', description: 'Expected money from pending orders' },
  ];

  return (
    <div>
      <h2 className="mb-3" style={{ color: '#2C3E50' }}>Dashboard</h2>

      {/* Filter Section */}
      <div className="card p-3 mb-4 shadow-sm">
        <div className="row g-3 align-items-end">
          <div className="col-md-3">
            <label className="form-label">Filter By</label>
            <select className="form-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="today">Today</option>
              <option value="month">By Month</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          {filterType === 'month' && (
            <>
              <div className="col-md-3">
                <label className="form-label">Select Month</label>
                <select className="form-select" value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
                  {months.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Select Year</label>
                <select className="form-select" value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
                  {years.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </>
          )}
          {filterType === 'custom' && (
            <>
              <div className="col-md-3">
                <label className="form-label">Start Date</label>
                <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className="col-md-3">
                <label className="form-label">End Date</label>
                <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="row mt-4">
        {cards.map((card) => (
          <div className="col-md-4" key={card.title}>
            <div className="dashboard-card" style={{ backgroundColor: card.bgColor }}>
              <h5>{card.title}</h5>
              <p className="dashboard-card-description">{card.description}</p>
              <p>{card.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

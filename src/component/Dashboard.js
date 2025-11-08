import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useDateFilter from './useDateFilter';
import FilterControl from './FilterControl';
import { formatCurrency } from './formatCurrency';
import { ORDERS, EXPENSES } from './endpoint';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, expensesRes] = await Promise.all([
          axios.get(`${ORDERS}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${EXPENSES}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setOrders(ordersRes.data);
        setExpenses(expensesRes.data);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const {
    filterType,
    setFilterType,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    months,
    years,
    filterByDate,
  } = useDateFilter();

  // ✅ Filtered data (by date only — user already filtered on backend)
  const filteredOrders = orders.filter((o) => filterByDate(o.date));
  const filteredExpenses = expenses.filter((e) => filterByDate(e.date));

  // ✅ Dashboard Calculations
  const totalOrders = filteredOrders.length;
  const totalIncome = filteredOrders.reduce(
    (acc, o) => acc + Number(o.price || 0),
    0
  );
  const totalExpenses = filteredExpenses.reduce(
    (acc, e) => acc + Number(e.amount || 0),
    0
  );
  const netProfit = totalIncome - totalExpenses;
  const totalPaid = filteredOrders
    .filter((o) => o.paymentStatus === 'Paid')
    .reduce((acc, o) => acc + Number(o.price || 0), 0);
  const totalBalance = totalPaid - totalExpenses;
  const totalPending = filteredOrders
    .filter((o) => o.paymentStatus === 'Pending')
    .reduce((acc, o) => acc + Number(o.price || 0), 0);

  // ✅ Dashboard Cards
  const cards = [
    {
      title: 'Total Orders',
      value: totalOrders,
      bgColor: '#3498DB',
      description: 'Number of orders received',
    },
    {
      title: 'Total Income',
      value: formatCurrency(totalIncome),
      bgColor: '#1ABC9C',
      description: 'Revenue from all orders',
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(totalExpenses),
      bgColor: '#E74C3C',
      description: 'Business running costs',
    },
    {
      title: 'Net Profit',
      value: formatCurrency(netProfit),
      bgColor: netProfit >= 0 ? '#1ABC9C' : '#863a32ff',
      description: 'Income - Expenses',
    },
    {
      title: 'Total Balance',
      value: formatCurrency(totalBalance),
      bgColor: totalBalance >= 0 ? '#9B59B6' : '#863a32ff',
      description: 'Paid orders - expenses',
    },
    {
      title: 'Total Paid',
      value: formatCurrency(totalPaid),
      bgColor: '#1f7967ff',
      description: 'Completed orders',
    },
    {
      title: 'Total Pending',
      value: formatCurrency(totalPending),
      bgColor: '#F39C12',
      description: 'Pending orders',
    },
  ];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div
          className="spinner-border text-success"
          role="status"
          style={{ width: '4rem', height: '4rem' }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-3" style={{ color: '#2C3E50' }}>
        Dashboard
      </h2>

      {/* ✅ Filter Section */}
      <div className="card p-3 mb-4 shadow-sm">
        <FilterControl
          filterType={filterType}
          setFilterType={setFilterType}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          months={months}
          years={years}
        />
      </div>

      {/* ✅ Dashboard Cards */}
      <div className="row mt-4 text-center">
        {cards.map((card) => (
          <div className="col-12 col-md-3 mb-3" key={card.title}>
            <div
              className="dashboard-card p-3 text-white rounded shadow-sm"
              style={{
                backgroundColor: card.bgColor,
                minHeight: '140px',
              }}
            >
              <h5>{card.title}</h5>
              <p className="mb-1 small">{card.description}</p>
              <h4>{card.value}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

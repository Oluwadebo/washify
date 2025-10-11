import React, { useEffect, useState } from 'react';
import useDateFilter from './useDateFilter';
import FilterControl from './FilterControl';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [expenses, setExpenses] = useState([]);

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

  // ✅ Get logged-in user email
  let currentUserEmail = null;
  try {
    const storedUser = JSON.parse(localStorage.getItem('authUser'));
    currentUserEmail = storedUser?.email;
  } catch {
    currentUserEmail = null;
    localStorage.removeItem('authUser');
  }

  // ✅ Load user's orders & expenses from localStorage
  useEffect(() => {
    if (currentUserEmail) {
      const savedOrders = JSON.parse(localStorage.getItem(`orders`)) || [];
      const savedExpenses = JSON.parse(localStorage.getItem(`expenses`)) || [];

      setOrders(savedOrders);
      setExpenses(savedExpenses);
    }
  }, [currentUserEmail]);

  // ✅ Filtered data for logged-in user
  const filteredOrders = orders.filter(
    (o) => o.userEmail === currentUserEmail && filterByDate(o.date)
  );
  const filteredExpenses = expenses.filter(
    (e) => e.userEmail === currentUserEmail && filterByDate(e.date)
  );

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
  const totalBalance =
    filteredOrders
      .filter((o) => o.paymentStatus === 'Paid')
      .reduce((acc, o) => acc + Number(o.price || 0), 0) - totalExpenses;

  const totalPending = filteredOrders
    .filter((o) => o.paymentStatus === 'Pending')
    .reduce((acc, o) => acc + Number(o.price || 0), 0);

  // ✅ Currency formatter
  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);

  // ✅ Dashboard Cards
  const cards = [
    {
      title: 'Total Orders',
      value: totalOrders,
      bgColor: '#3498DB',
      description: 'Number of orders recieved',
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
      bgColor:  netProfit >= 0 ? '#1ABC9C' : '#863a32ff',
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
    },{
      title: 'Total Pending',
      value: formatCurrency(totalPending),
      bgColor: '#F39C12',
      description: 'Pending orders',
    },
  ];

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
          <div className="col-6 col-md-3 mb-3" key={card.title}>
            <div
              className="p-3 text-white rounded shadow-sm"
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

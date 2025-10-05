import React from 'react';
import useDateFilter from './useDateFilter';
import FilterControl from './FilterControl';

const Dashboard = ({ orders, expenses }) => {
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

  // ✅ Get current logged-in user email
  const storedUser = JSON.parse(localStorage.getItem('authUser'));
  const currentUserEmail = storedUser?.email;

  // ✅ Filter data by date AND by logged-in user email
  const filteredOrders = orders.filter(
    (o) => o.userEmail === currentUserEmail && filterByDate(o.date)
  );

  const filteredExpenses = expenses.filter(
    (e) => e.userEmail === currentUserEmail && filterByDate(e.date)
  );

  // ✅ Calculations
  const totalOrders = filteredOrders.length;
  const totalIncome = filteredOrders.reduce((acc, o) => acc + Number(o.price), 0);
  const totalExpenses = filteredExpenses.reduce((acc, e) => acc + Number(e.amount), 0);
  const netProfit = totalIncome - totalExpenses;

  const totalBalance =
    filteredOrders
      .filter((o) => o.paymentStatus === 'Paid')
      .reduce((acc, o) => acc + Number(o.price), 0) - totalExpenses;

  const totalPending = filteredOrders
    .filter((o) => o.paymentStatus === 'Pending')
    .reduce((acc, o) => acc + Number(o.price), 0);

  // ✅ Currency formatter
  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);

  // ✅ Dashboard Cards
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

      {/* ✅ Filter Section (Reused Component) */}
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
      <div className="row mt-4">
        {cards.map((card) => (
          <div className="col-md-4 mb-3" key={card.title}>
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

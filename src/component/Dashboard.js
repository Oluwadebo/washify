import React, { useState } from "react";

const Dashboard = ({ orders, expenses }) => {
  const today = new Date().toISOString().split("T")[0];

  // same filter states as Orders
  const [filterType, setFilterType] = useState("today"); 
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  // ✅ Filtering Logic (same as Orders.js)
  const filterByType = (itemDate) => {
    const date = new Date(itemDate);

    if (filterType === "today") {
      return date.toDateString() === new Date().toDateString();
    }

    if (filterType === "monthly") {
      return (
        date.getMonth() === new Date().getMonth() &&
        date.getFullYear() === new Date().getFullYear()
      );
    }

    if (filterType === "yearly") {
      return date.getFullYear() === new Date().getFullYear();
    }

    if (filterType === "custom") {
      if (!startDate || !endDate) return true;

      const onlyDate = new Date(date).toISOString().split("T")[0];
      return onlyDate >= startDate && onlyDate <= endDate;
    }

    return true;
  };

  // ✅ Apply filters
  const filteredOrders = orders.filter((order) => filterByType(order.date));
  const filteredExpenses = expenses.filter((exp) => filterByType(exp.date));

  // ✅ Calculations
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
      .filter((o) => o.paymentStatus === "Paid")
      .reduce((acc, o) => acc + Number(o.price), 0) - totalExpenses;
  const totalPending = filteredOrders
    .filter((o) => o.paymentStatus === "Pending")
    .reduce((acc, o) => acc + Number(o.price), 0);

  // ✅ Card style
  const cardStyle = (bgColor) => ({
    backgroundColor: bgColor,
    color: "#fff",
    borderRadius: "8px",
    padding: "20px",
    textAlign: "center",
  });

  const descriptionStyle = {
    fontSize: "0.7rem",
    marginTop: "8px",
    color: "#f0f0f0",
  };

  return (
    <div>
      <h2 style={{ color: "#2C3E50" }}>Dashboard</h2>

      {/* 🔹 Filter Section */}
      <div className="card p-3 mb-4 shadow-sm">
        <div className="row g-3 align-items-end">
          <div className="col-md-3">
            <label className="form-label">Filter By</label>
            <select
              className="form-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="monthly">This Month</option>
              <option value="yearly">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {filterType === "custom" && (
            <>
              <div className="col-md-3">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* 🔹 Dashboard Cards */}
      <div className="row mt-4">
        <div className="col-md-4 mb-3">
          <div style={cardStyle("#3498DB")}>
            <h5>Total Orders</h5>
            <p style={descriptionStyle}>Number of orders added</p>
            <p>{totalOrders}</p>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div style={cardStyle("#1ABC9C")}>
            <h5>Total Income</h5>
            <p style={descriptionStyle}>
              Revenue from all orders (paid + pending)
            </p>
            <p>₦{totalIncome}</p>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div style={cardStyle("#E74C3C")}>
            <h5>Total Expenses</h5>
            <p style={descriptionStyle}>Business running costs</p>
            <p>₦{totalExpenses}</p>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div style={cardStyle("#F39C12")}>
            <h5>Net Profit</h5>
            <p style={descriptionStyle}>Income - Expenses</p>
            <p>₦{netProfit}</p>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div style={cardStyle("#9B59B6")}>
            <h5>Total Balance</h5>
            <p style={descriptionStyle}>
              Money from PAID orders minus expenses
            </p>
            <p>₦{totalBalance}</p>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div style={cardStyle("#16A085")}>
            <h5>Total Pending</h5>
            <p style={descriptionStyle}>
              Expected money from pending orders
            </p>
            <p>₦{totalPending}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

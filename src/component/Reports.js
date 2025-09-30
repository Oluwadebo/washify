// Reports.js
import React from "react";

const Reports = ({ orders, expenses }) => {
  const totalOrders = orders.length;
  const totalIncome = orders.reduce((acc, order) => acc + Number(order.price), 0);
  const totalExpenses = expenses.reduce((acc, exp) => acc + Number(exp.amount), 0);
  const netProfit = totalIncome - totalExpenses;

  const cardStyle = { backgroundColor: "#ECF0F1", color: "#2C3E50", borderRadius: "5px" };

  return (
    <div>
      <h2 style={{ color: "#2C3E50" }}>Reports</h2>
      <div className="card p-3 mt-3" style={cardStyle}>
        <h5>Monthly Summary</h5>
        <p>Total Orders: {totalOrders}</p>
        <p>Total Income: ₦{totalIncome}</p>
        <p>Total Expenses: ₦{totalExpenses}</p>
        <p>Net Profit: ₦{netProfit}</p>
        <div className="row mt-3">
          <div className="col-12 col-md-6 mb-2">
            <button className="btn btn-success w-100">Export PDF</button>
          </div>
          <div className="col-12 col-md-6 mb-2">
            <button className="btn btn-primary w-100">Export Excel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;

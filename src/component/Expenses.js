// Expenses.js
import React, { useState } from "react";

const Expenses = ({ expenses, setExpenses }) => {
  const [type, setType] = useState("Detergent");
  const [amount, setAmount] = useState("");

  const addExpense = () => {
    if (amount) {
      setExpenses([...expenses, { id: Date.now(), type, amount: Number(amount) }]);
      setAmount("");
    }
  };

  const cardStyle = { backgroundColor: "#ECF0F1", color: "#2C3E50", borderRadius: "5px" };

  return (
    <div>
      <h2 style={{ color: "#2C3E50" }}>Expenses</h2>
      <div className="card p-3 mb-4" style={cardStyle}>
        <h5>Add New Expense</h5>
        <select className="form-select mb-2" value={type} onChange={(e) => setType(e.target.value)}>
          <option>Detergent</option>
          <option>Fuel</option>
          <option>Staff Salary</option>
          <option>Other</option>
        </select>
        <input
          type="number"
          className="form-control mb-2"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button className="btn btn-primary">Add Expense</button>
      </div>

      <h5>Expenses List</h5>
      <table className="table table-bordered" style={{ backgroundColor: "#fff" }}>
        <thead style={{ backgroundColor: "#3498DB", color: "#fff" }}>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp) => (
            <tr key={exp.id}>
              <td>{exp.id}</td>
              <td>{exp.type}</td>
              <td>₦{exp.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Expenses;

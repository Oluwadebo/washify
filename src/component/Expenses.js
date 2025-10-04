import React, { useState } from "react";
import useDateFilter from "./useDateFilter";
import FilterControl from "./FilterControl";

const Expenses = ({ expenses, setExpenses }) => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Rent");
  const [customCategory, setCustomCategory] = useState("");
  const [description, setDescription] = useState("");

  // ✅ Use custom filter hook
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

  // ✅ Apply filter to expenses
  const filteredExpenses = expenses.filter((exp) => filterByDate(exp.date));

  // ✅ Add new expense
  const handleAddExpense = (e) => {
    e.preventDefault();

    const newExpense = {
      id: Date.now(),
      amount: Number(amount),
      category: category === "Other" ? customCategory : category,
      description,
      date: new Date().toISOString(),
    };

    setExpenses([newExpense, ...expenses]);

    // Reset form fields
    setAmount("");
    setCategory("Rent");
    setCustomCategory("");
    setDescription("");
  };

  return (
    <div>
      <h2 style={{ color: "#2C3E50" }}>Expenses</h2>

      {/* ✅ Reusable Filter Section */}
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

      {/* ✅ Add Expense Form */}
      <form onSubmit={handleAddExpense} className="row g-3 mb-4">
        <div className="col-md-3">
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Rent">Rent</option>
            <option value="Salary">Salary</option>
            <option value="Utilities">Utilities</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {category === "Other" && (
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Enter custom category"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              required
            />
          </div>
        )}

        <div className="col-md-2">
          <input
            type="number"
            className="form-control"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="col-md-2">
          <button type="submit" className="btn btn-primary w-100">
            Add
          </button>
        </div>
      </form>

      {/* ✅ Expenses Table */}
      <h5>Expenses List</h5>
      <table className="table table-bordered table-striped table-hover shadow-sm text-center table-responsive">
        <thead>
          <tr>
            <th style={{ backgroundColor: "#34495E", color: "#ECF0F1" }}>ID</th>
            <th style={{ backgroundColor: "#34495E", color: "#ECF0F1" }}>Amount</th>
            <th style={{ backgroundColor: "#34495E", color: "#ECF0F1" }}>Category</th>
            <th style={{ backgroundColor: "#34495E", color: "#ECF0F1" }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredExpenses.map((exp) => (
            <tr key={exp.id}>
              <td>{exp.id}</td>
              <td>₦{exp.amount}</td>
              <td>{exp.category}</td>
              <td>{new Date(exp.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Expenses;

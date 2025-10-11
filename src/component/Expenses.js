import React, { useState, useEffect } from 'react';
import useDateFilter from './useDateFilter';
import FilterControl from './FilterControl';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Rent');
  const [customCategory, setCustomCategory] = useState('');

  // 🔹 Reusable date filter hook
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

  // 🔹 Get logged-in user
  let currentUserEmail = null;
  try {
    const storedUser = JSON.parse(localStorage.getItem('authUser'));
    currentUserEmail = storedUser?.email;
  } catch {
    currentUserEmail = null;
    localStorage.removeItem('authUser');
  }
  // 🔹 Load all expenses from localStorage
  useEffect(() => {
    const allExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const userExpenses = allExpenses.filter(
      (exp) => exp.userEmail === currentUserEmail
    );
    setExpenses(userExpenses);
  }, [currentUserEmail]);

  // 🔹 Add new expense
  const handleAddExpense = (e) => {
    e.preventDefault();

    const newExpense = {
      id: Date.now(),
      amount: Number(amount),
      category: category === 'Other' ? customCategory : category,
      date: new Date().toISOString(),
      userEmail: currentUserEmail,
    };

    // 🔹 Update both local state and localStorage
    const allExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const updatedExpenses = [newExpense, ...allExpenses];
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));

    // 🔹 Filter user-specific
    const userExpenses = updatedExpenses.filter(
      (exp) => exp.userEmail === currentUserEmail
    );
    setExpenses(userExpenses);

    // 🔹 Reset form
    setAmount('');
    setCategory('Rent');
    setCustomCategory('');
  };

  // 🔹 Apply date filtering
  const filteredExpenses = expenses.filter((exp) => filterByDate(exp.date));

  return (
    <div>
      <h2 style={{ color: '#2C3E50' }}>Expenses</h2>

      {/* 🔹 Filter Section */}
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

      {/* 🔹 Add Expense Form */}
      <form onSubmit={handleAddExpense} className="row g-3 mb-4">
        <div className="col-6 col-md-3">
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

        {category === 'Other' && (
          <div className="col-6 col-md-3">
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

        <div className="col-6 col-md-2">
          <input
            type="number"
            className="form-control"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="col-md-1">
          <button type="submit" className="btn btn-primary w-100">
            Add
          </button>
        </div>
      </form>

      {/* 🔹 Expenses Table */}
      <h5>Expenses List</h5>
      <table className="table table-bordered table-striped table-hover shadow-sm text-center table-responsive">
        <thead>
          <tr>
            <th style={{ backgroundColor: '#34495E', color: '#ECF0F1' }}>
              Amount
            </th>
            <th style={{ backgroundColor: '#34495E', color: '#ECF0F1' }}>
              Category
            </th>
            <th style={{ backgroundColor: '#34495E', color: '#ECF0F1' }}>
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredExpenses.length > 0 ? (
            filteredExpenses.map((exp) => (
              <tr key={exp.id}>
                <td>₦{exp.amount.toLocaleString()}</td>
                <td>{exp.category}</td>
                <td>{new Date(exp.date).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-muted">
                No expenses found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Expenses;

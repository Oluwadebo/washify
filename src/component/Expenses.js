import React, { useState } from 'react';

const Expenses = ({ expenses, setExpenses }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Rent');
  const [customCategory, setCustomCategory] = useState('');
  const [description, setDescription] = useState('');

  // 🔹 Filter states
   const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();
  const [filterType, setFilterType] = useState('today');
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [startDate, setStartDate] = useState(today.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(today.toISOString().split('T')[0]);
  

      const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

  // 🔹 Filtering Logic
  const filterByType = (itemDate) => {
    const date = new Date(itemDate);

    if (filterType === 'today') {
      return date.toDateString() === new Date().toDateString();
    }

    if (filterType === 'month') {
      return (
        date.getMonth() + 1 === Number(selectedMonth) &&
        date.getFullYear() === Number(selectedYear)
      );
    }

    if (filterType === 'custom') {
      if (!startDate || !endDate) return true;
      const onlyDate = new Date(date).toISOString().split('T')[0];
      return onlyDate >= startDate && onlyDate <= endDate;
    }

    return true;
  };

  const filteredExpenses = expenses.filter((exp) => filterByType(exp.date));

  // 🔹 Add expense
  const handleAddExpense = (e) => {
    e.preventDefault();

    const newExpense = {
      id: Date.now(),
      amount: Number(amount),
      category: category === 'Other' ? customCategory : category,
      description,
      date: new Date().toISOString(),
    };

    setExpenses([newExpense, ...expenses]);

    // reset
    setAmount('');
    setCategory('Rent');
    setCustomCategory('');
    setDescription('');
  };

  return (
    <div>
      <h2 style={{ color: '#2C3E50' }}>Expenses</h2>

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
              <option value="month">By Month</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

 {filterType === 'month' && (
            <>
              <div className="col-md-3">
                <label className="form-label">Select Month</label>
                <select
                  className="form-select"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                >
                  {months.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Select Year</label>
                <select
                  className="form-select"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                >
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
          {filterType === 'custom' && (
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

      {/* 🔹 Add Expense Form */}
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

        {category === 'Other' && (
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

      {/* 🔹 Expenses Table */}
      <h5>Expenses List</h5>
      <table className="table table-bordered table-striped table-hover shadow-sm text-center">
        <thead>
          <tr>
            <th style={{ backgroundColor: '#34495E', color: '#ECF0F1' }}>ID</th>
            <th style={{ backgroundColor: '#34495E', color: '#ECF0F1' }}>Amount</th>
            <th style={{ backgroundColor: '#34495E', color: '#ECF0F1' }}>Category</th>
            <th style={{ backgroundColor: '#34495E', color: '#ECF0F1' }}>Date</th>
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

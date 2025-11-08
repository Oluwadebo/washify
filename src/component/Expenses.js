import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useDateFilter from './useDateFilter';
import FilterControl from './FilterControl';
import { EXPENSES } from './endpoint';

const Expenses = ({ user }) => {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Rent');
  const [customCategory, setCustomCategory] = useState('');
  const [loading, setLoading] = useState(false);
const token = localStorage.getItem('token');

  // Date filter hook
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

  const API_URL = EXPENSES;

  // Load expenses from backend
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` }}); // ✅ no userId query
        setExpenses(response.data);
      } catch (error) {
        console.error('Failed to fetch expenses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  // Add new expense
  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      const newExpense = {
        amount: Number(amount),
        category: category === 'Other' ? customCategory : category,
        date: new Date().toISOString(),
      };

      const res = await axios.post(API_URL, newExpense, {
        withCredentials: true,
      }); // ✅ secure post
      setExpenses([res.data, ...expenses]);

      setAmount('');
      setCategory('Rent');
      setCustomCategory('');
    } catch (err) {
      console.error('Failed to add expense:', err);
    }
  };

  const filteredExpenses = expenses.filter((exp) => filterByDate(exp.date));

  return (
    <div>
      <h2 style={{ color: '#2C3E50' }}>Expenses</h2>

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

      <h5>Expenses List</h5>
      {loading ? (
        <p>Loading expenses...</p>
      ) : (
      <table className="table table-bordered table-striped table-hover shadow-sm text-center table-responsive">
        <thead>
          <tr>
            <th style={{ backgroundColor: '#34495E', color: '#ECF0F1' }}>
              Category
            </th>
            <th style={{ backgroundColor: '#34495E', color: '#ECF0F1' }}>
              Amount
            </th>
            <th style={{ backgroundColor: '#34495E', color: '#ECF0F1' }}>
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredExpenses.length > 0 ? (
            filteredExpenses.map((exp) => (
              <tr key={exp._id}>
                <td>{exp.category}</td>
                <td>₦{exp.amount.toLocaleString()}</td>
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
      )}
    </div>
  );
};

export default Expenses;

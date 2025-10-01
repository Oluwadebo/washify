// src/components/Filter.js
import React, { useState } from 'react';

const Filter = ({ onFilterChange }) => {
  const today = new Date().toISOString().split('T')[0];
  const [filterType, setFilterType] = useState('today');
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  // Notify parent when filter changes
  const handleFilterChange = (type, start = startDate, end = endDate) => {
    setFilterType(type);
    onFilterChange({ type, start, end });
  };

  return (
    <div className="card p-3 mb-4 shadow-sm">
      <div className="row g-3 align-items-end">
        <div className="col-md-3">
          <label className="form-label">Filter By</label>
          <select
            className="form-select"
            value={filterType}
            onChange={(e) => handleFilterChange(e.target.value)}
          >
            <option value="today">Today</option>
            <option value="monthly">This Month</option>
            <option value="yearly">This Year</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        {filterType === 'custom' && (
          <>
            <div className="col-md-3">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  handleFilterChange(filterType, e.target.value, endDate);
                }}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  handleFilterChange(filterType, startDate, e.target.value);
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Filter;

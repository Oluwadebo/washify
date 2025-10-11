import React, { useEffect } from 'react';

const FilterControl = ({
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
}) => {
  // Auto-reset dates when filterType changes
  useEffect(() => {
    const todayString = new Date().toISOString().split('T')[0];
    if (filterType === 'today') {
      setStartDate(todayString);
      setEndDate(todayString);
    } else if (filterType === 'month') {
      setStartDate('');
      setEndDate('');
    } else if (filterType === 'year') {
      setStartDate('');
      setEndDate('');
    }
  }, [filterType, setStartDate, setEndDate]);

  return (
    <div className="row g-3 align-items-end mb-3">
      {/* Filter Type */}
      <div className="col-4 col-md-3">
        <label className="form-label fw-semibold">Filter By</label>
        <select
          className="form-select"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="today">Today</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
          <option value="custom">Custom Range</option>
        </select>
      </div>

      {/* Month & Year Selection */}
      {filterType === 'month' && (
        <>
          <div className="col-4 col-md-3">
            <label className="form-label fw-semibold">Month</label>
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
          <div className="col-4 col-md-3">
            <label className="form-label fw-semibold">Year</label>
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

      {/* Year Only */}
      {filterType === 'year' && (
        <div className="col-md-3">
          <label className="form-label fw-semibold">Year</label>
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
      )}

      {/* Custom Date Range */}
      {filterType === 'custom' && (
        <>
          <div className="col-md-3">
            <label className="form-label fw-semibold">Start Date</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label fw-semibold">End Date</label>
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
  );
};

export default FilterControl;

import React from "react";

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
  return (
    <div className="row g-3 align-items-end mb-3">
      <div className="col-md-3">
        <label className="form-label">Filter By</label>
        <select
          className="form-select"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="today">Today</option>
          <option value="month">By Month</option>
          <option value="year">By Year</option>
          <option value="custom">Custom Range</option>
        </select>
      </div>

      {filterType === "month" && (
        <>
          <div className="col-md-3">
            <label className="form-label">Month</label>
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
            <label className="form-label">Year</label>
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

      {filterType === "year" && (
        <div className="col-md-3">
          <label className="form-label">Year</label>
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
  );
};

export default FilterControl;

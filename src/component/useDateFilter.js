import { useState } from 'react';

const useDateFilter = () => {
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

  // ✅ Get current logged-in user email
  const storedUser = JSON.parse(localStorage.getItem('authUser'));
  const currentUserEmail = storedUser?.email;

  const filterByDate = (itemDate, itemEmail) => {
    const date = new Date(itemDate);

    // ✅ Filter by logged-in user email
    if (itemEmail && itemEmail !== currentUserEmail) return false;
    if (filterType === 'today') {
      return date.toDateString() === today.toDateString();
    }
    if (filterType === 'month') {
      return (
        date.getMonth() + 1 === Number(selectedMonth) &&
        date.getFullYear() === Number(selectedYear)
      );
    }
    if (filterType === 'year') {
      return date.getFullYear() === Number(selectedYear);
    }
    if (filterType === 'custom') {
      if (!startDate || !endDate) return true;
      const onlyDate = date.toISOString().split('T')[0];
      return onlyDate >= startDate && onlyDate <= endDate;
    }

    return true;
  };

  return {
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
  };
};

export default useDateFilter;

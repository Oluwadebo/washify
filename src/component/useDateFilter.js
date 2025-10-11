import { useState, useEffect, useMemo, useCallback } from 'react';

const useDateFilter = () => {
  // ✅ Initialize today and refresh at midnight
  const [today, setToday] = useState(new Date());

  useEffect(() => {
    const now = new Date();
    const msUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) - now;

    const timer = setTimeout(() => setToday(new Date()), msUntilMidnight);
    return () => clearTimeout(timer);
  }, [today]);

  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const [filterType, setFilterType] = useState('month');
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [startDate, setStartDate] = useState(today.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(today.toISOString().split('T')[0]);

  // ✅ Reset startDate & endDate if filterType is 'today'
  useEffect(() => {
    if (filterType === 'month') {
      const todayString = today.toISOString().split('T')[0];
      setStartDate(todayString);
      setEndDate(todayString);
    }
  }, [filterType, today]);

  const months = useMemo(
    () => [
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
    ],
    []
  );

  const years = useMemo(() => Array.from({ length: 6 }, (_, i) => currentYear - i), [currentYear]);

  let storedUser;
  try {
    storedUser = JSON.parse(localStorage.getItem('authUser'));
  } catch {
    storedUser = null;
  }
  const currentUserEmail = storedUser?.email || '';

  const filterByDate = useCallback(
    (itemDate, itemEmail) => {
      if (!itemDate) return false;
      const date = new Date(itemDate);
      if (isNaN(date)) return false;

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
    },
    [filterType, selectedMonth, selectedYear, startDate, endDate, currentUserEmail, today]
  );

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

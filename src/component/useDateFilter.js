import { useState, useEffect, useMemo, useCallback } from 'react';
import useUserProfile from './useUserProfile.js';

const useDateFilter = () => {
  const [today, setToday] = useState(new Date());
  const [currentUserEmail, setCurrentUserEmail] = useState('');

  // ✅ Fetch logged-in user from backend
  const user = useUserProfile();
  useEffect(() => {
    setCurrentUserEmail(user?.email || '');
  }, [user]);

  // ✅ Refresh at midnight
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

  useEffect(() => {
    if (filterType === 'today') {
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

  const years = useMemo(
    () => Array.from({ length: 6 }, (_, i) => currentYear - i),
    [currentYear]
  );

  const filterByDate = useCallback(
    (itemDate, itemEmail) => {
      if (!itemDate) return false;
      const date = new Date(itemDate);
      if (isNaN(date)) return false;

      // ✅ match logged-in user's email
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
    [
      filterType,
      selectedMonth,
      selectedYear,
      startDate,
      endDate,
      currentUserEmail,
      today,
    ]
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

import React, { useState, useRef, useEffect } from 'react';
import useDateFilter from './useDateFilter';
import FilterControl from './FilterControl';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import axios from 'axios';
import autoTable from 'jspdf-autotable';
import { Pie, Bar } from 'react-chartjs-2';
import { ORDERS, EXPENSES } from './endpoint';
import useUserProfile from './useUserProfile';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  ChartDataLabels
);

const Reports = () => {
  const [orders, setOrders] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

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

  // ✅ Fetch user's orders and expenses from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, expensesRes] = await Promise.all([
          axios.get(`${ORDERS}`, { withCredentials: true }),
          axios.get(`${EXPENSES}`, { withCredentials: true }),
        ]);
        setOrders(ordersRes.data);
        setExpenses(expensesRes.data);
      } catch (error) {
        console.error('❌ Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const pieRef = useRef(null);
  const barRef = useRef(null);

  const { user } = useUserProfile();

  const shopName = user?.shopName || 'Shop Admin';
  const tell = user?.tell || 'Shop Phone number';
  const address = user?.address || 'Shop adress';
  const logo = user?.logo || '/favicon.png';
  const admin = user?.LastName || 'Admin';

  // ✅ Filtered data (by date only — user already filtered on backend)
  const filteredOrders = orders.filter((o) => filterByDate(o.date));
  const filteredExpenses = expenses.filter((e) => filterByDate(e.date));

  // Totals
  const completedOrders = filteredOrders.filter(
    (o) => o.paymentStatus === 'Paid'
  );
  const pendingOrders = filteredOrders.filter(
    (o) => o.paymentStatus === 'Pending'
  );
  const totalIncome = completedOrders.reduce((sum, o) => sum + o.price, 0);
  const totalPending = pendingOrders.reduce((sum, o) => sum + o.price, 0);
  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalBalance = totalIncome - totalExpenses;

  // Currency formatter
  const formatCurrency = (num) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(num);
  const formatCurrencyPDF = (num) => `NGN ${num.toLocaleString()}`;
  // Chart Data
  const incomeExpenseData = {
    labels: ['Completed Income', 'Pending Income', 'Expenses'],
    datasets: [
      {
        data: [totalIncome, totalPending, totalExpenses],
        backgroundColor: ['#2ecc71', '#f1c40f', '#e74c3c'],
      },
    ],
  };
  const pieOptions = {
    plugins: {
      legend: {
        position: 'top',
      },
      datalabels: {
        color: '#fff',
        font: {
          weight: 'bold',
        },
        formatter: (value, context) => {
          if (value === 0) return ''; // 🔥 Hide labels for zero amounts

          const label = context.chart.data.labels[context.dataIndex];
          const total = context.chart.data.datasets[0].data.reduce(
            (a, b) => a + b,
            0
          );
          const percentage = ((value / total) * 100).toFixed(1) + '%';
          const formattedValue = formatCurrency(value);

          return `${label}\n${formattedValue}\n(${percentage})`;
        },
      },
    },
  };

  const allDates = Array.from(
    new Set([
      ...filteredOrders.map((o) => new Date(o.date).toLocaleDateString()),
      ...filteredExpenses.map((e) => new Date(e.date).toLocaleDateString()),
    ])
  ).sort((a, b) => new Date(a) - new Date(b));

  const mergedBarData = {
    labels: allDates,
    datasets: [
      {
        label: 'Expenses',
        data: allDates.map((date) =>
          filteredExpenses
            .filter((e) => new Date(e.date).toLocaleDateString() === date)
            .reduce((sum, e) => sum + e.amount, 0)
        ),
        backgroundColor: '#e74c3c',
      },
      {
        label: 'Completed Orders',
        data: allDates.map((date) =>
          completedOrders
            .filter((o) => new Date(o.date).toLocaleDateString() === date)
            .reduce((sum, o) => sum + o.price, 0)
        ),
        backgroundColor: '#3498db',
      },
      {
        label: 'Pending Orders',
        data: allDates.map((date) =>
          pendingOrders
            .filter((o) => new Date(o.date).toLocaleDateString() === date)
            .reduce((sum, o) => sum + o.price, 0)
        ),
        backgroundColor: '#f1c40f',
      },
    ],
  };
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      datalabels: {
        color: '#fff',
        font: {
          weight: 'bold',
        },
        formatter: (value, context) => {
          if (value === 0) return ''; // 🔥 Hide labels for zero amounts
          const formattedValue = formatCurrency(value);

          return `${formattedValue}`;
        },
      },
    },
  };

  // Export to Excel
  const exportToExcel = async () => {
    setLoading(true);
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Business Report');

    ws.mergeCells('A1:E1');
    ws.getCell('A1').value = 'My Laundry Shop - Business Report';
    ws.getCell('A1').font = { size: 16, bold: true };
    ws.getCell('A1').alignment = { horizontal: 'center' };

    ws.addRow([]);
    ws.addRow(['Metric', 'Amount']);
    ws.addRow(['Total Income', totalIncome]);
    ws.addRow(['Total Expenses', totalExpenses]);
    ws.addRow(['Net Profit', totalBalance]);

    ws.addRow([]);
    ws.addRow(['Orders']);
    ws.addRow(['ID', 'Customer', 'Service', 'Price', 'Date']);
    filteredOrders.forEach((o) =>
      ws.addRow([
        o.id,
        o.customer,
        o.service,
        o.price,
        new Date(o.date).toLocaleDateString(),
      ])
    );

    ws.addRow([]);
    ws.addRow(['Expenses']);
    ws.addRow(['ID', 'Category', 'Amount', 'Date']);
    filteredExpenses.forEach((e) =>
      ws.addRow([
        e.id,
        e.category,
        e.amount,
        new Date(e.date).toLocaleDateString(),
      ])
    );

    ws.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        if (
          rowNumber === 2 ||
          row.getCell(1).value === 'Orders' ||
          row.getCell(1).value === 'Expenses'
        )
          cell.font = { bold: true };
      });
    });

    const buf = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buf]), 'Report.xlsx');
    setLoading(false);
  };

  // Export to PDF
  const exportToPDF = async () => {
    setLoading(true);
    const doc = new jsPDF();

    // Watermark across all pages
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Logo
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    // Validate logo path — fallback if broken
    img.src =
      logo && logo.startsWith('data:')
        ? logo // base64 data image
        : logo && logo !== '/favicon.png'
        ? logo
        : '/favicon.png';

    // Wait for the image to load or fail safely
    await new Promise((resolve) => {
      img.onload = () => {
        try {
          doc.addImage(img, 'PNG', 14, 15, 30, 15);
        } catch (err) {
          console.warn('⚠️ Could not add image:', err);
        }
        resolve();
      };
      img.onerror = () => {
        console.warn('⚠️ Image load failed, using default logo.');
        try {
          const fallback = new Image();
          fallback.src = '/favicon.png';
          fallback.onload = () => {
            doc.addImage(fallback, 'PNG', 14, 15, 30, 15);
            resolve();
          };
        } catch (err) {
          console.warn('⚠️ Fallback logo also failed.');
          resolve();
        }
      };
    });
    // ✅ Small delay to ensure image rendering finishes
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Header
    doc.setFontSize(18).setFont('helvetica', 'bold');
    doc.text(shopName.toUpperCase().substring(0, 30), 60, 25);
    doc.setFontSize(10).setFont('helvetica', 'normal');
    doc.text(address, 196, 21, {
      align: 'right',
    });
    doc.text(tell, 196, 27, { align: 'right' });
    doc.line(14, 32, 196, 32);

    doc.setFontSize(13).setFont('helvetica', 'bold');
    doc.text('BUSINESS REPORT', 105, 40, { align: 'center' });
    const reportPeriod =
      filterType === 'custom'
        ? `${startDate} to ${endDate}`
        : filterType === 'month'
        ? `${
            months.find((m) => m.value === Number(selectedMonth)).label
          } ${selectedYear}`
        : filterType.charAt(0).toUpperCase() + filterType.slice(1);
    doc.setFontSize(10);
    doc.text(`Report Period: ${reportPeriod}`, 105, 46, { align: 'center' });
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 52, {
      align: 'center',
    });
    // Metrics Table
    doc.setFontSize(12).setFont('helvetica', 'bold');
    doc.text('Business Metrics Summary', 14, 56);
    autoTable(doc, {
      startY: 60,
      theme: 'grid',
      head: [['Metric', 'Amount']],
      body: [
        ['Total Income', formatCurrencyPDF(totalIncome)],
        ['Pending Income', formatCurrencyPDF(totalPending)],
        ['Total Expenses', formatCurrencyPDF(totalExpenses)],
        ['Total Balance', formatCurrencyPDF(totalBalance)],
      ],
      headStyles: { fillColor: [52, 73, 94], textColor: [255, 255, 255] },
      bodyStyles: { textColor: 50 },
    });
    let currentY = doc.lastAutoTable.finalY + 13;
    // Charts
    const pieImg =
      pieRef.current && pieRef.current.toBase64Image
        ? pieRef.current.toBase64Image()
        : null;
    const barImg =
      barRef.current && barRef.current.toBase64Image
        ? barRef.current.toBase64Image()
        : null;
    doc.setFontSize(12).setFont('helvetica', 'bold');
    doc.text('Business Performance Charts', 105, currentY - 6, {
      align: 'center',
    });
    doc.setDrawColor(52, 73, 94);
    doc.line(14, currentY - 4, 196, currentY - 4);
    currentY += 4;
    if (pieImg) {
      doc.setFontSize(10).setFont('helvetica', 'normal');
      doc.text('Income Distribution', 35, currentY - 2);
      doc.addImage(pieImg, 'PNG', 35, currentY, 70, 70); // Pie chart on left
    }
    if (barImg) {
      doc.setFontSize(10).setFont('helvetica', 'normal');
      doc.text('Monthly Income vs Expenses', 110, currentY - 2);
      doc.addImage(barImg, 'PNG', 110, currentY, 70, 70); // Bar chart on right
    }
    currentY += 78; // move below charts
    // Charts Note
    doc.setFontSize(9).setFont('helvetica', 'italic');
    doc.setTextColor(100);
    doc.text(
      'Note: Charts are based on available data for the selected reporting period.',
      105,
      currentY,
      { align: 'center' }
    );
    doc.setTextColor(0, 0, 0);
    currentY += 7;
    // Orders Table
    doc.setFontSize(12).setFont('helvetica', 'bold');
    doc.text('Orders (Income Records)', 14, currentY);
    currentY += 4;
    autoTable(doc, {
      startY: currentY,
      head: [['ID', 'Customer', 'Service', 'Price', 'Status', 'Date']],
      body: filteredOrders.length
        ? filteredOrders.map((o) => [
            o.id,
            o.customer,
            o.service,
            formatCurrencyPDF(o.price),
            o.paymentStatus || '-',
            new Date(o.date).toLocaleDateString(),
          ])
        : [['-', 'No orders available', '-', '-', '-', '-']],
      theme: 'grid',
      headStyles: { fillColor: [52, 73, 94], textColor: [255, 255, 255] },
      styles: { fontSize: 9 },
    });
    currentY = doc.lastAutoTable.finalY + 10;
    // Expenses Table
    doc.setFontSize(12).setFont('helvetica', 'bold');
    doc.text('Expenses Records', 14, currentY);
    currentY += 4;
    autoTable(doc, {
      startY: currentY,
      head: [['ID', 'Category', 'Amount', 'Date']],
      body: filteredExpenses.length
        ? filteredExpenses.map((e) => [
            e.id,
            e.category,
            formatCurrencyPDF(e.amount),
            new Date(e.date).toLocaleDateString(),
          ])
        : [['-', 'No expenses available', '-', '-']],
      theme: 'grid',
      headStyles: { fillColor: [52, 73, 94], textColor: [255, 255, 255] },
      styles: { fontSize: 9 },
    });
    // Signature
    let lastTableY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 260;
    if (lastTableY > 270) {
      doc.addPage();
      lastTableY = 20;
    }
    const signatureY = lastTableY + 20;
    doc.line(20, signatureY, 80, signatureY);
    doc.text(
      `Prepared By: ${(shopName || 'SHOP').toUpperCase()}`,
      20,
      signatureY + 5
    );
    doc.line(130, signatureY, 190, signatureY);
    doc.text(
      `Approved By: ${(admin || 'ADMIN').toUpperCase()}`,
      180,
      signatureY + 5,
      { align: 'right' }
    );
    // Page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      if (doc.GState && doc.setGState) {
        const gState = doc.GState({ opacity: 0.2 });
        doc.setGState(gState);
      } else {
        doc.setTextColor(180); // fallback dim color
      }
      doc.setFontSize(50);
      doc.setTextColor(150);
      doc.text(
        shopName.toUpperCase().substring(0, 30),
        pageWidth / 2,
        pageHeight / 2,
        {
          angle: 30,
          align: 'center',
        }
      );
      if (doc.GState && doc.setGState) {
        const gState = doc.GState({ opacity: 1 });
        doc.setGState(gState);
      }
      doc.setTextColor(0, 0, 0);

      doc.setFontSize(9);
      doc.setTextColor(100);
      doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
    }
    doc.save(`Report_${reportPeriod}.pdf`);
    setLoading(false);
  };

  // Summary cards
  const cards = [
    {
      title: 'Total Income',
      value: formatCurrency(totalIncome),
      bgColor: '#1ABC9C',
    },
    {
      title: 'Total Pending',
      value: formatCurrency(totalPending),
      bgColor: '#F39C12',
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(totalExpenses),
      bgColor: '#e73c4aff',
    },
    {
      title: 'Total Balance',
      value: formatCurrency(totalBalance),
      bgColor: totalBalance >= 0 ? '#1ABC9C' : '#863a32ff',
    },
  ];

  return (
    <div>
      <h2 style={{ color: '#2C3E50' }}>Reports</h2>

      {/* ✅ Filter Section */}
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
        <div className="row g-3 align-items-end">
          <div className="col-3">
            <button
              className="btn btn-success w-100 d-flex align-items-center justify-content-center "
              onClick={exportToExcel}
              disabled={
                loading ||
                (filteredOrders.length === 0 && filteredExpenses.length === 0)
              }
              aria-label="Export report to Excel"
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Exporting...
                </>
              ) : (
                <>
                  <i className="bi bi-file-earmark-excel me-1"></i> Excel
                </>
              )}
            </button>
          </div>
          <div className="col-3">
            <button
              className="btn btn-danger w-100 d-flex align-items-center justify-content-center"
              onClick={() => exportToPDF()}
              disabled={
                loading ||
                (filteredOrders.length === 0 && filteredExpenses.length === 0)
              }
              aria-label="Export report to PDF"
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Exporting...
                </>
              ) : (
                <>
                  <i className="bi bi-file-earmark-pdf me-2"></i> PDF
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row mt-4 text-center">
        {cards.map((card) => (
          <div className="col-6 col-md-3 mb-3" key={card.title}>
            <div
              className="p-3 text-white rounded shadow-sm"
              style={{
                backgroundColor: card.bgColor,
                minHeight: '140px',
              }}
            >
              <h5>{card.title}</h5>
              <h4>{card.value}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="row mt-4">
        <div className="col-md-6 col-12 mb-3">
          <h6 className="fw-bold text-center text-secondary mb-2">
            Income vs Pending vs Expenses
          </h6>
          <div
            className="p-2 border rounded text-center"
            style={{
              height: '45vh',
              minHeight: '250px',
              position: 'relative',
            }}
          >
            <Pie
              data={incomeExpenseData}
              options={{
                ...pieOptions,
                responsive: true,
                maintainAspectRatio: false,
              }}
              plugins={[ChartDataLabels]}
              ref={pieRef}
            />
          </div>
        </div>
        <div className="col-md-6 col-12 mb-3">
          <h6 className="fw-bold text-center text-secondary mb-2">
            Daily Breakdown
          </h6>
          <div
            className="p-2 border rounded"
            style={{
              height: '45vh',
              minHeight: '250px',
              position: 'relative',
            }}
          >
            <Bar
              ref={barRef}
              data={mergedBarData}
              // options={{ responsive: true, maintainAspectRatio: false }}
              options={{
                ...barOptions,
                responsive: true,
                maintainAspectRatio: false,
              }}
              plugins={[ChartDataLabels]}
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <h5>Orders</h5>
      <div className="table-responsive">
        <table className="table table-bordered table-striped text-center table-hover">
          <thead style={{ backgroundColor: '#34495E', color: '#ECF0F1' }}>
            <tr>
              <th style={{ backgroundColor: '#34495E', color: '#ECF0F1' }}>
                Customer
              </th>
              <th style={{ backgroundColor: '#34495E', color: '#ECF0F1' }}>
                Service
              </th>
              <th style={{ backgroundColor: '#34495E', color: '#ECF0F1' }}>
                Price
              </th>
              <th style={{ backgroundColor: '#34495E', color: '#ECF0F1' }}>
                Status
              </th>
              <th style={{ backgroundColor: '#34495E', color: '#ECF0F1' }}>
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((o) => (
                <tr key={o.id}>
                  <td>{o.customer}</td>
                  <td>{o.service}</td>
                  <td>{formatCurrency(o.price)}</td>
                  <td>
                    <span
                      className={`badge ${
                        o.paymentStatus === 'Paid'
                          ? 'bg-success'
                          : o.paymentStatus === 'Pending'
                          ? 'bg-warning text-dark'
                          : 'bg-secondary'
                      }`}
                    >
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td>{new Date(o.date).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-muted">
                  No orders available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Expenses Table */}
      <h5>Expenses</h5>
      <div className="table-responsive">
        <table className="table table-bordered table-striped text-center table-hover">
          <thead style={{ backgroundColor: '#34495E', color: '#ECF0F1' }}>
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
              filteredExpenses.map((e) => (
                <tr key={e.id}>
                  <td>{e.category}</td>
                  <td>{formatCurrency(e.amount)}</td>
                  <td>{new Date(e.date).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-muted">
                  No expenses available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;

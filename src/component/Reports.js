import React, { useState, useRef } from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Pie, Bar } from 'react-chartjs-2';
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
  BarElement
);

const Reports = ({ orders, expenses }) => {
  const pieRef = useRef(null);
  const barRef = useRef(null);

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();
  const [filterType, setFilterType] = useState('month');
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [startDate, setStartDate] = useState(today.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(today.toISOString().split('T')[0]);

  const [loading, setLoading] = useState(false);

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

  // Filtering Logic
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

  // Apply filters
  const filteredOrders = orders.filter((o) => filterByType(o.date));
  const filteredExpenses = expenses.filter((e) => filterByType(e.date));

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
  const netProfit = totalIncome - totalExpenses;

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
    ws.addRow(['Net Profit', netProfit]);

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
    img.src = '/images/brand.png';
    await new Promise((resolve) => (img.onload = resolve));
    doc.addImage(img, 'PNG', 14, 15, 30, 15);

    // Header
    doc.setFontSize(18).setFont('helvetica', 'bold');
    doc.text('My Laundry Shop', 60, 25);
    doc.setFontSize(10).setFont('helvetica', 'normal');
    doc.text('40, Jomowoye Street, Irele, Ondo State', 196, 21, {
      align: 'right',
    });
    doc.text('Tel: 09044796430', 196, 27, { align: 'right' });
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
        ['Net Profit', formatCurrencyPDF(netProfit)],
      ],
      headStyles: { fillColor: [52, 73, 94], textColor: [255, 255, 255] },
      bodyStyles: { textColor: 50 },
    });

    let currentY = doc.lastAutoTable.finalY + 13;

    // Charts
    const pieImg = pieRef.current?.toBase64Image();
    const barImg = barRef.current?.toBase64Image();
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
    const signatureY = doc.lastAutoTable.finalY + 20;
    doc.line(20, signatureY, 80, signatureY);
    doc.text('Prepared By: ANTHONY', 20, signatureY + 5);
    doc.line(130, signatureY, 190, signatureY);
    doc.text('Approved By: DEBO', 180, signatureY + 5, { align: 'right' });

    // Page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      if (doc.setGState) {
        const gState = doc.GState({ opacity: 0.2 }); // 10% visible
        doc.setGState(gState);
      }
      doc.setFontSize(50);
      doc.setTextColor(150);
      doc.text('My Laundry Shop', pageWidth / 2, pageHeight / 2, {
        angle: 30,
        align: 'center',
      });
      if (doc.setGState) {
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

  return (
    <div>
      <h2 style={{ color: '#2C3E50' }}>Reports</h2>

      {/* Filters */}
      <div className="card p-3 mb-4 shadow-sm">
        <div className="row g-3 align-items-end">
          <div className="col-md-3 col-12">
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

          {/* Month + Year Dropdown */}
          {filterType === 'month' && (
            <>
              <div className="col-md-2">
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
              <div className="col-md-2">
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
          <div className="col-md-2 col-6">
            <button
              className="btn btn-success w-100 d-flex align-items-center justify-content-center "
              onClick={exportToExcel}
              disabled={loading}
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
          <div className="col-md-2 col-6">
            <button
              className="btn btn-danger w-100 d-flex align-items-center justify-content-center"
              onClick={exportToPDF}
              disabled={loading}
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
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm border-0 bg-light">
            <div className="card-body text-center">
              <h5>Total Income</h5>
              <h3 className="text-success">{formatCurrency(totalIncome)}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 bg-light">
            <div className="card-body text-center">
              <h5>Pending Income</h5>
              <h3 className="text-warning">{formatCurrency(totalPending)}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 bg-light">
            <div className="card-body text-center">
              <h5>Total Expenses</h5>
              <h3 className="text-danger">{formatCurrency(totalExpenses)}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div
            className={`card shadow-sm border-0 ${
              netProfit >= 0 ? 'bg-light' : 'bg-danger bg-opacity-10'
            }`}
          >
            <div className="card-body text-center">
              <h5>Net Profit</h5>
              <h3 className={netProfit >= 0 ? 'text-success' : 'text-danger'}>
                {formatCurrency(netProfit)}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row mt-4">
        <div className="col-md-6 col-12 mb-3">
          <h6>Income vs Pending vs Expenses</h6>
          <div className="p-2 border rounded" style={{ minHeight: '280px' }}>
            <Pie
              ref={pieRef}
              data={incomeExpenseData}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>
        <div className="col-md-6 col-12 mb-3">
          <h6>Daily Breakdown</h6>
          <div className="p-2 border rounded" style={{ minHeight: '280px' }}>
            <Bar
              ref={barRef}
              data={mergedBarData}
              options={{ responsive: true, maintainAspectRatio: false }}
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
                ID
              </th>
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
                  <td>{o.id}</td>
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
                ID
              </th>
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
                  <td>{e.id}</td>
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

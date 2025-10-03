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
  const today = new Date().toISOString().split('T')[0];
  const currentMonth = today.toLocaleDateString('default',{month:'long'});
  const currentYear = today.getFullYear();
  const [filterType, setFilterType] = useState('monthly');
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [loading, setLoading] = useState(false);

  // Filtering Logic
  const filterByType = (itemDate) => {
    const date = new Date(itemDate);
    if (filterType === 'today')
      return date.toDateString() === new Date().toDateString();
    if (filterType === 'monthly')
      return (
        date.getMonth() === new Date().getMonth() &&
        date.getFullYear() === new Date().getFullYear()
      );
    if (filterType === 'yearly')
      return date.getFullYear() === new Date().getFullYear();
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
  const totalIncome = filteredOrders.reduce((sum, o) => sum + o.price, 0);
  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalIncome - totalExpenses;

  // Currency formatter
  const formatCurrency = (num) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(num);

  // Chart Data
  const incomeExpenseData = {
    labels: ['Total Income', 'Total Expenses'],
    datasets: [
      {
        data: [totalIncome, totalExpenses],
        backgroundColor: ['#2ecc71', '#e74c3c'],
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
        label: 'Orders (Income)',
        data: allDates.map((date) =>
          filteredOrders
            .filter((o) => new Date(o.date).toLocaleDateString() === date)
            .reduce((sum, o) => sum + o.price, 0)
        ),
        backgroundColor: '#3498db',
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

    // Watermark
    doc.setFontSize(80);
    doc.setTextColor(230, 230, 230);
    doc.text('My Laundry Shop', 105, 150, { angle: 0, align: 'center' });
    doc.setTextColor(0, 0, 0);

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
        : filterType.charAt(0).toUpperCase() + filterType.slice(1);
    doc.setFontSize(10);
    doc.text(`Report Period: ${reportPeriod}`, 105, 46, { align: 'center' });
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 52, {
      align: 'center',
    });

    // Metrics Table
    autoTable(doc, {
      startY: 60,
      theme: 'grid',
      head: [['Metric', 'Amount']],
      body: [
        ['Total Income', formatCurrency(totalIncome)],
        ['Total Expenses', formatCurrency(totalExpenses)],
        ['Net Profit', formatCurrency(netProfit)],
      ],
      headStyles: { fillColor: [52, 73, 94], textColor: [255, 255, 255] },
      bodyStyles: { textColor: 50 },
    });

    let currentY = doc.lastAutoTable.finalY + 10;

    // Charts
    const pieImg = pieRef.current?.toBase64Image();
    const barImg = barRef.current?.toBase64Image();

    if (pieImg) {
      doc.addImage(pieImg, 'PNG', 35, currentY, 70, 70); // Pie chart on left
    }

    if (barImg) {
      doc.addImage(barImg, 'PNG', 110, currentY, 70, 70); // Merged bar chart on right
    }

    currentY += 80; // move below charts

    // Orders Table
    autoTable(doc, {
      startY: currentY,
      head: ["Income ",['ID', 'Customer', 'Service', 'Price', 'Date']],
      body: filteredOrders.length
        ? filteredOrders.map((o) => [
            o.id,
            o.customer,
            o.service,
            formatCurrency(o.price),
            new Date(o.date).toLocaleDateString(),
          ])
        : [['-', 'No orders available', '-', '-', '-']],
      theme: 'grid',
      headStyles: { fillColor: [52, 73, 94], textColor: [255, 255, 255] },
      styles: { fontSize: 9 },
    });

    currentY = doc.lastAutoTable.finalY + 10;

    // Expenses Table
    autoTable(doc, {
      startY: currentY,
      head: [['ID', 'Category', 'Amount', 'Date']],
      body: filteredExpenses.length
        ? filteredExpenses.map((e) => [
            e.id,
            e.category,
            formatCurrency(e.amount),
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
    doc.text('Prepared By: ANTHONY', 30, signatureY + 5);
    doc.line(130, signatureY, 190, signatureY);
    doc.text('Approved By: DEBO', 178, signatureY + 5, { align: 'right' });

    // Page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(100);
      doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
    }

    doc.save('Report.pdf');
    setLoading(false);
  };

  return (
    <div>
      <h2 style={{ color: '#2C3E50' }}>Reports</h2>

      {/* Filters */}
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
              <option value="monthly">{'This Month (${888})'}</option>
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

          {/* Export Buttons */}
          <button
            className="btn btn-success w-25 d-flex align-items-center justify-content-center mx-1"
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
              'Excel'
            )}
          </button>

          <button
            className="btn btn-danger w-25 d-flex align-items-center justify-content-center mx-1"
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
              'PDF'
            )}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 bg-light">
            <div className="card-body text-center">
              <h5>Total Income</h5>
              <h3 className="text-success">{formatCurrency(totalIncome)}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 bg-light">
            <div className="card-body text-center">
              <h5>Total Expenses</h5>
              <h3 className="text-danger">{formatCurrency(totalExpenses)}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
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
        <div className="col-md-6">
          <h6>Income vs Expenses</h6>
          <Pie ref={pieRef} data={incomeExpenseData} />
        </div>
        <div className="col-md-6">
          <h6>Orders vs Expenses Overview</h6>
          <Bar
            ref={barRef}
            data={mergedBarData}
            options={{ responsive: true }}
          />
        </div>
      </div>

      {/* Orders Table */}
      <h5>Orders</h5>
      <div className="table-responsive">
        <table className="table table-bordered table-striped text-center">
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
                  <td>{new Date(o.date).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-muted">
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
        <table className="table table-bordered table-striped text-center">
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

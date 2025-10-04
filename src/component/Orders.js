import React, { useState } from 'react';

const Orders = ({ orders, setOrders }) => {
  const [customer, setCustomer] = useState('');
  const [service, setService] = useState('Washing');
  const [price, setPrice] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('Pending');

  // 🔹 Edit state
  const [editingOrder, setEditingOrder] = useState(null);

  // 🔹 Filter states
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

  // ✅ Add order
  const handleAddOrder = (e) => {
    e.preventDefault();

    const newOrder = {
      id: Date.now(),
      customer,
      price: Number(price),
      service,
      paymentStatus,
      date: new Date().toISOString(), // store order date
    };

    setOrders([newOrder, ...orders]);

    setCustomer('');
    setPrice('');
    setPaymentStatus('Pending');
  };

  // ✅ Save edited order
  const handleSaveEdit = () => {
    const updatedOrders = orders.map((order) =>
      order.id === editingOrder.id ? editingOrder : order
    );
    setOrders(updatedOrders);
    setEditingOrder(null);
  };

  // ✅ Delete order
  const deleteOrder = (id) => {
    setOrders(orders.filter((order) => order.id !== id));
  };

  // ✅ Filtering Logic
  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.date);
    if (filterType === 'today') {
      return orderDate.toDateString() === new Date().toDateString();
    }
    if (filterType === 'month') {
      return (
        orderDate.getMonth() + 1 === Number(selectedMonth) &&
        orderDate.getFullYear() === Number(selectedYear)
      );
    }
    if (filterType === 'custom') {
      if (!startDate || !endDate) return true;
      const orderDateOnly = new Date(order.date).toISOString().split('T')[0];
      return orderDateOnly >= startDate && orderDateOnly <= endDate;
    }
    return true;
  });

  return (
    <div>
      <h2 style={{ color: '#2C3E50' }}>Orders</h2>

      {/* 🔹 Filter Section */}
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
              <option value="month">By Month</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

{filterType === 'month' && (
            <>
              <div className="col-md-3">
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
              <div className="col-md-3">
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
        </div>
      </div>

      {/* 🔹 Add Order Form */}
      <form onSubmit={handleAddOrder} className="row g-3 mb-4">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Customer Name"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            required
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={service}
            onChange={(e) => setService(e.target.value)}
          >
            <option value="Washing">Washing</option>
            <option value="Ironing">Ironing</option>
            <option value="Dry Cleaning">Dry Cleaning</option>
          </select>
        </div>
        <div className="col-md-2">
          <input
            type="number"
            className="form-control"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
          >
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
        <div className="col-md-2">
          <button type="submit" className="btn btn-primary w-100">
            Add Order
          </button>
        </div>
      </form>

      {/* 🔹 Orders Table */}
      <h5>Orders List</h5>
      <table className="table table-bordered table-striped table-hover shadow-sm text-center">
        <thead>
          <tr>
            <th style={{ backgroundColor: '#34495E', color: '#ECF0F1' }}>ID</th>
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
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr
              key={order.id}
              style={{
                backgroundColor:
                  order.paymentStatus === 'Paid' ? '#E8F8F5' : '#FEF9E7',
              }}
            >
              <td>{order.id}</td>
              <td>{order.customer}</td>
              <td>{order.service}</td>
              <td>₦{order.price}</td>
              <td>
                {order.paymentStatus === 'Paid' ? (
                  <span className="badge bg-success">
                    <i className="bi bi-check-circle me-1"></i> Paid
                  </span>
                ) : (
                  <span className="badge bg-warning text-dark">
                    <i className="bi bi-hourglass-split me-1"></i> Pending
                  </span>
                )}
              </td>
              <td>
                <button
                  className="btn btn-sm btn-info me-2"
                  onClick={() => setEditingOrder(order)}
                >
                  <i className="bi bi-pencil-square"></i> Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => deleteOrder(order.id)}
                >
                  <i className="bi bi-trash"></i> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔹 Edit Modal */}
      {editingOrder && (
        <div className="modal show fade d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content shadow-lg">
              <div className="modal-header">
                <h5 className="modal-title">Edit Order</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditingOrder(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Customer</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingOrder.customer}
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editingOrder.price}
                    onChange={(e) =>
                      setEditingOrder({
                        ...editingOrder,
                        price: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Payment Status</label>
                  <select
                    className="form-select"
                    value={editingOrder.paymentStatus}
                    onChange={(e) =>
                      setEditingOrder({
                        ...editingOrder,
                        paymentStatus: e.target.value,
                      })
                    }
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditingOrder(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleSaveEdit}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;

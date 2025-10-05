import React, { useState } from 'react';
import useDateFilter from './useDateFilter';
import FilterControl from './FilterControl';

const Orders = ({ orders, setOrders }) => {
  const [customer, setCustomer] = useState('');
  const [service, setService] = useState('Washing');
  const [price, setPrice] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('Pending');

  // 🔹 Edit state
  const [editingOrder, setEditingOrder] = useState(null);

  // 🔹 Use the reusable date filter hook
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

  // ✅ Get current logged-in user email
  const storedUser = JSON.parse(localStorage.getItem('authUser'));
  const currentUserEmail = storedUser?.email;

  // ✅ Add new order
  const handleAddOrder = (e) => {
    e.preventDefault();

    const newOrder = {
      id: Date.now(),
      customer,
      service,
      price: Number(price),
      paymentStatus,
      date: new Date().toISOString(),
      userEmail: currentUserEmail, // 🔹 attach user email
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

  // ✅ Apply date filtering AND user filtering
  const filteredOrders = orders.filter(
    (order) => order.userEmail === currentUserEmail && filterByDate(order.date)
  );

  return (
    <div>
      <h2 style={{ color: '#2C3E50' }}>Orders</h2>

      {/* 🔹 Reusable Filter Section */}
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
      <table className="table table-bordered table-striped table-hover shadow-sm text-center table-responsive">
        <thead>
          <tr>
            <th style={{ backgroundColor: '#34495E', color: '#ECF0F1' }}>ID</th>
            <th style={{ backgroundColor: '#34495E', color: '#ECF0F1' }}>Customer</th>
            <th style={{ backgroundColor: '#34495E', color: '#ECF0F1' }}>Service</th>
            <th style={{ backgroundColor: '#34495E', color: '#ECF0F1' }}>Price</th>
            <th style={{ backgroundColor: '#34495E', color: '#ECF0F1' }}>Status</th>
            <th style={{ backgroundColor: '#34495E', color: '#ECF0F1' }}>Actions</th>
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

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useDateFilter from './useDateFilter';
import FilterControl from './FilterControl';
import { ORDERS } from './endpoint';

const Orders = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [customer, setCustomer] = useState('');
  const [service, setService] = useState('Washing');
  const [price, setPrice] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('Pending');
  const [editingOrder, setEditingOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
const token = localStorage.getItem('token');

  // 🔹 Date filter hook
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

  // 🔹 Backend base URL
  const API_URL = ORDERS; // replace with your backend endpoint

  // 🔹 Load orders from backend

 useEffect(() => {
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` }});
      setOrders(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  fetchOrders();
}, [API_URL, token]);

  // 🔹 Add new order
 const handleAddOrder = async (e) => {
  e.preventDefault();
  try {
    const newOrder = {
      customer,
      service,
      price: Number(price),
      paymentStatus,
      date: new Date().toISOString(),
    };
      setLoading(true);
    const response = await axios.post(API_URL, newOrder, { headers: { Authorization: `Bearer ${token}` }});
    setOrders([response.data, ...orders]);
    setCustomer('');
    setPrice('');
    setPaymentStatus('Pending');
      setLoading(false);

  } catch (error) {
    setError(error.message);
  }
};

  // 🔹 Save edited order
  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(
        `${API_URL}/${editingOrder._id}`,
        editingOrder,{ headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(
        orders.map((order) =>
          order._id === response.data._id ? response.data : order
        )
      );
      setEditingOrder(null);
    } catch (error) {
      setError(error.message);
    }
  };

  // 🔹 Delete order
 const deleteOrder = async (order) => {
  try {
    await axios.delete(`${API_URL}/${order._id}`,{ headers: { Authorization: `Bearer ${token}` }});
    setOrders(orders.filter((o) => o._id !== order._id));
  } catch (error) {
    console.error('Delete failed:', error);
    setError(error.message);
  }
};

  // 🔹 Filtered orders
  const filteredOrders = orders.filter((order) => filterByDate(order.date));

  return (
    <div>
      <h2 style={{ color: '#2C3E50' }}>Orders</h2>

      {/* 🔹 Filter Section */}
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
      {error && <div className="alert alert-danger py-2">{error}</div>}

      <form onSubmit={handleAddOrder} className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Customer Name"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            required
          />
        </div>
        <div className="col-6 col-md-3">
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
        <div className="col-6 col-md-2">
          <input
            type="number"
            className="form-control"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="col-6 col-md-2">
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
          <button
            type="submit"
            className="btn w-100"
            style={{ backgroundColor: '#2C3E50', color: '#ECF0F1' }}
          >
            Add Order
          </button>
        </div>
      </form>

      {/* 🔹 Orders Table */}
      <h5>Orders List</h5>
      {loading ? (
        <p className='mt-3'>Loading orders, please wait...</p>
      ) : (
        <table className="table table-bordered table-striped table-hover shadow-sm text-center table-responsive">
          <thead>
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
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  style={{
                    backgroundColor:
                      order.paymentStatus === 'Paid' ? '#E8F8F5' : '#FEF9E7',
                  }}
                >
                  <td>{order.customer}</td>
                  <td>{order.service}</td>
                  <td>₦{order.price.toLocaleString()}</td>
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
                      onClick={() => deleteOrder(order)}
                    >
                      <i className="bi bi-trash"></i> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-muted">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

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

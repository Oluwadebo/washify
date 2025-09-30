// Orders.js
import React, { useState } from "react";

const Orders = ({ orders, setOrders }) => {
  const [customer, setCustomer] = useState("");
  const [service, setService] = useState("Washing");
  const [price, setPrice] = useState("");

  const addOrder = () => {
    if (customer && price) {
      setOrders([...orders, { id: Date.now(), customer, service, price: Number(price) }]);
      setCustomer("");
      setPrice("");
    }
  };

  const cardStyle = { backgroundColor: "#ECF0F1", color: "#2C3E50", borderRadius: "5px" };

  return (
    <div>
      <h2 style={{ color: "#2C3E50" }}>Orders</h2>
      <div className="card p-3 mb-4" style={cardStyle}>
        <h5>Add New Order</h5>
        <input
          className="form-control mb-2"
          placeholder="Customer Name"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
        />
        <select className="form-select mb-2" value={service} onChange={(e) => setService(e.target.value)}>
          <option>Washing</option>
          <option>Ironing</option>
          <option>Dry Cleaning</option>
        </select>
        <input
          type="number"
          className="form-control mb-2"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button className="btn btn-primary">Add Order</button>
      </div>

      <h5>Orders List</h5>
      <table className="table table-bordered" style={{ backgroundColor: "#fff" }}>
        <thead style={{ backgroundColor: "#3498DB", color: "#fff" }}>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Service</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer}</td>
              <td>{order.service}</td>
              <td>₦{order.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;

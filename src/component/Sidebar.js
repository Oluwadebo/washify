// Sidebar.js
import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div
      className="vh-100 p-3"
      style={{ width: "230px", position: "sticky", top: 0, backgroundColor: "#2C3E50", color: "#fff" }}
    >
      <h3 className="text-center mb-4" style={{ color: "#1ABC9C" }}>Admin Panel</h3>
      <ul className="nav flex-column">
        {[
          { name: "Dashboard", path: "/" },
          { name: "Orders", path: "/orders" },
          { name: "Expenses", path: "/expenses" },
          { name: "Reports", path: "/reports" },
        ].map((link) => (
          <li className="nav-item mb-2" key={link.name}>
            <NavLink
              to={link.path}
              style={({ isActive }) => ({
                backgroundColor: isActive ? "#3498DB" : "#34495E",
                color: "#fff",
                borderRadius: "5px",
                padding: "8px 12px",
                display: "block",
                textDecoration: "none",
              })}
            >
              {link.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;

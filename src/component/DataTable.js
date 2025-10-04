import React from "react";

const DataTable = ({ columns, data, actions }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">No data available</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-bordered table-striped table-hover shadow-sm text-center align-middle">
        <thead className="table-dark">
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            {actions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={idx}>
              {columns.map((col) => {
                const value = item[col.key];
                if (col.type === "currency") {
                  return <td key={col.key}>₦{value.toLocaleString()}</td>;
                } else if (col.type === "date") {
                  return (
                    <td key={col.key}>
                      {new Date(value).toLocaleDateString()}
                    </td>
                  );
                } else if (col.type === "status") {
                  return (
                    <td key={col.key}>
                      {value === "Paid" ? (
                        <span className="badge bg-success">
                          <i className="bi bi-check-circle me-1"></i> Paid
                        </span>
                      ) : (
                        <span className="badge bg-warning text-dark">
                          <i className="bi bi-hourglass-split me-1"></i> Pending
                        </span>
                      )}
                    </td>
                  );
                } else {
                  return <td key={col.key}>{value}</td>;
                }
              })}
              {actions && (
                <td>
                  {actions.map((action, i) => (
                    <button
                      key={i}
                      className={`btn btn-sm me-2 ${action.className}`}
                      onClick={() => action.onClick(item)}
                      title={action.title}
                    >
                      <i className={action.icon}></i>
                    </button>
                  ))}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;

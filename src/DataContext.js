import { createContext, useState, useContext } from "react";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [expenses, setExpenses] = useState([]);

  return (
    <DataContext.Provider value={{ orders, setOrders, expenses, setExpenses }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);

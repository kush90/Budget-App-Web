// DataContext.js
import React, { createContext, useState, useContext } from 'react';

// Create a context with an initial value
const DataContext = createContext();

// Create a provider component that will wrap your application
export const DataProvider = ({ children }) => {
  const [sharedData, setSharedData] = useState({type:'',data:null});

  const updateData = (newData) => {
    setSharedData(newData);
  };

  // Provide the context value to the entire app
  return (
    <DataContext.Provider value={{ sharedData, updateData }}>
      {children}
    </DataContext.Provider>
  );
};

// Create a custom hook to easily access the context value in components
export const useDataContext = () => {
  return useContext(DataContext);
};

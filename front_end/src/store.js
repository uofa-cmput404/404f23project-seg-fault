import React, { createContext, useReducer, useContext } from 'react';

const initialState = {
  user: null,
  token: null,
};

export const StoreContext = createContext();

// Reducer function to handle state updates
const storeReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    default:
      return state;
  }
};

const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(storeReducer, initialState);

  return (
    // Provides the state and dispatchs functions through the StoreContext, wraps the entire app
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

// Hook for accessing the store's state and dispatch functions
const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

export { StoreProvider, useStore };

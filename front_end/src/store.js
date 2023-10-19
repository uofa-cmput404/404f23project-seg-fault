import React, { createContext, useReducer, useContext, useEffect } from 'react';

const initialState = {
  user: null,
  token: null,
};

export const StoreContext = createContext();

const storeReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    case 'RESET_APPSTATE':
      localStorage.removeItem('appState')
      return initialState;
    default:
      return state;
  }
};

const StoreProvider = ({ children }) => {
  const storedState = JSON.parse(localStorage.getItem('appState')) || initialState;
  
  const [state, dispatch] = useReducer(storeReducer, storedState);

  useEffect(() => {
    localStorage.setItem('appState', JSON.stringify(state));
  }, [state]);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

export { StoreProvider, useStore };

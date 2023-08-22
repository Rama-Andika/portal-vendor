import { createContext, useContext, useState } from "react";

const StateContext = createContext();

export const ContextProvider = ({ children }) => {
  const [activeMenu, setActiveMenu] = useState(true);
  const [isRegistration, setIsRegistration] = useState(true);

  const [screenSize, setScreenSize] = useState(undefined);

  return (
    <StateContext.Provider
      value={{ activeMenu, setActiveMenu, screenSize, setScreenSize, isRegistration, setIsRegistration }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);

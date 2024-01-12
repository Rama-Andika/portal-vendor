import { createContext, useContext, useState } from "react";

const StateContext = createContext();

export const ContextProvider = ({ children }) => {
  const [activeMenu, setActiveMenu] = useState(true);
  const [openSidebar, setOpenSidebar] = useState([]);
  const [isRegistration, setIsRegistration] = useState(true);

  const [screenSize, setScreenSize] = useState(undefined);
  const [open, setOpen] = useState(false);

  return (
    <StateContext.Provider
      value={{ activeMenu, setActiveMenu, screenSize, setScreenSize, isRegistration, setIsRegistration, openSidebar, setOpenSidebar, open, setOpen }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);

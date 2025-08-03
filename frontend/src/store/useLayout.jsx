import React, { createContext, useContext, useState } from "react";

const LayoutContext = createContext();

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
};

export const LayoutProvider = ({ children }) => {
  const [activePanel, setActivePanel] = useState("chats"); // 'chats', 'profile', 'groups', 'contacts', 'settings', null

  const value = {
    activePanel,
    setActivePanel,
  };

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
};

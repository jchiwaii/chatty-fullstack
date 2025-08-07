import React from "react";

const MainContent = ({ children }) => {
  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-black">
      {children}
    </div>
  );
};

export default MainContent;

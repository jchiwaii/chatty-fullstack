import React from "react";

const MainContent = ({ children }) => {
  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
};

export default MainContent;

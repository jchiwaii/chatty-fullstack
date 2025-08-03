import React from "react";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 flex-shrink-0">
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <MainContent>
        {children}
      </MainContent>
    </div>
  );
};

export default MainLayout;

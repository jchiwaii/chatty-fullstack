import React from "react";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex pb-16 md:pb-0">
      {" "}
      {/* Icon Sidebar */} <Sidebar /> {/* Main Content */}{" "}
      <MainContent> {children} </MainContent>{" "}
    </div>
  );
};
export default MainLayout;

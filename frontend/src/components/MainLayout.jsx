import React from "react";
import Navbar from "./Navbar";

const MainLayout = ({ children }) => {
  return (
    <div className="flex">
      <Navbar />
      <main className="flex-1 pl-20">{children}</main>
    </div>
  );
};

export default MainLayout;

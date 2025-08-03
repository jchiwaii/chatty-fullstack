import React from "react";
import MainLayout from "../components/Layout/MainLayout";

const Settingspage = () => {
  return (
    <MainLayout>
      <div className="flex items-center justify-center min-h-full bg-gray-50 p-6">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
            <p className="mt-2 text-gray-600">
              Manage your application preferences
            </p>
          </div>

          <div className="mt-8">
            <p className="text-gray-500">Settings page coming soon...</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settingspage;

// DashboardPage.js

import React, { useEffect, useState } from "react";
import { useAuth } from "../auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import DashboardTab from "../components/DashboardTab";
import EquipmentTab from "../components/EquipmentTab";
import InboxTab from "../components/InboxTab";
import TeamTab from "../components/TeamTab";
import CreateTab from "../components/CreateTab";
import AdminTab from "../components/AdminTab";

const DashboardPage = () => {
  const user = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard"); // State to track the active tab


  
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };
  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
      console.log("Logout successful.");
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  if (!user) {
    // Redirect to login if user is not authenticated
    navigate("/login");
    return null; 
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case "inbox":
        return <InboxTab />;
      case "team":
        return <TeamTab  />;
      case "equipment":
        return <EquipmentTab />;
      case "create":
        return <CreateTab />;
      case "admin":
        return <AdminTab />;
      default:
        return <DashboardTab />;
    }
  };
  return (
    <div>
      <nav class="fixed top-0 z-50 w-full bg-gray-800 border-b border-gray-700 dark:bg-gray-800 dark:border-gray-700">
        <div class="px-3 py-3 lg:px-5 lg:pl-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center justify-start rtl:justify-end">
              <button
                data-drawer-target="logo-sidebar"
                data-drawer-toggle="logo-sidebar"
                aria-controls="logo-sidebar"
                type="button"
                class="inline-flex items-center p-2 text-sm text-white rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <span class="sr-only">Open sidebar</span>
                <svg
                  class="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clip-rule="evenodd"
                    fill-rule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  ></path>
                </svg>
              </button>
              <a href="" class="flex ms-2 md:me-24">
                <span class=" text-white self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                  Fabrication Console
                </span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      <aside
        id="logo-sidebar"
        class="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-gray-800 border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidebar"
      >
        <div class="h-full px-3 pb-4 overflow-y-auto bg-gray-800 dark:bg-gray-800">
          <ul class="space-y-2 font-medium">
            <li>
              <a
                className={`flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-700 dark:hover:bg-gray-700 group ${
                  activeTab === "dashboard"
                    ? "bg-blue-700 dark:bg-blue-700"
                    : ""
                }`}
                onClick={() => handleTabChange("dashboard")}
              >
                <span class="ms-3">Dashboard</span>
              </a>
            </li>
            <li>
            <a
                className={`flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-700 dark:hover:bg-gray-700 group ${
                  activeTab === "inbox"
                    ? "bg-blue-700 dark:bg-blue-700"
                    : ""
                }`}
                onClick={() => handleTabChange("inbox")}
              >
                <span class="flex-1 ms-3 whitespace-nowrap">Inbox</span>
                <span class="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-300 bg-blue-900 rounded-full dark:bg-blue-900 dark:text-blue-300">
                  3
                </span>
              </a>
            </li>
            <li>
            <a
                className={`flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-700 dark:hover:bg-gray-700 group ${
                  activeTab === "team"
                    ? "bg-blue-700 dark:bg-blue-700"
                    : ""
                }`}
                onClick={() => handleTabChange("team")}
              >
                <span class="flex-1 ms-3 whitespace-nowrap">Team</span>
              </a>
            </li>
            <li>
            <a
                className={`flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-700 dark:hover:bg-gray-700 group ${
                  activeTab === "equipment"
                    ? "bg-blue-700 dark:bg-blue-700"
                    : ""
                }`}
                onClick={() => handleTabChange("equipment")}
              >
                <span class="flex-1 ms-3 whitespace-nowrap">Equipment</span>
              </a>
            </li>

            <li>
            <a
                className={`flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-700 dark:hover:bg-gray-700 group ${
                  activeTab === "create"
                    ? "bg-blue-700 dark:bg-blue-700"
                    : ""
                }`}
                onClick={() => handleTabChange("create")}
              >
                <span class="flex-1 ms-3 whitespace-nowrap text-green-300">+ Create </span>
              </a>
            </li>

            <div
              id="dropdown-cta"
              class="p-4 mt-6 rounded-lg bg-blue-900 dark:bg-blue-900"
              role="alert"
            >
              <div class="flex items-center mb-3">
                <span class="bg-orange-200 text-orange-900 text-sm font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-orange-200 dark:text-orange-900">
                  Welcome
                </span>
               
              </div>
              <p class="mb-3 text-sm text-blue-400 dark:text-blue-400">
                You are currently logged in as {user.email || "User"}. If you
                are an admin, you can manage your organization and team members
                by clicking the button below.
              </p>
              <a
                onClick={() => handleTabChange("admin")}
                class="text-sm text-blue-400 underline font-medium hover:text-blue-300 dark:text-blue-400 dark:hover:text-blue-300"
                href="#"
              >
                Admin Page
              </a>
            </div>
            <li>
              <button
                onClick={handleLogout}
                class="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-700 dark:hover:bg-gray-700 group"
              >
                <svg
                  class="flex-shrink-0 w-5 h-5 text-gray-400 transition duration-75 dark:text-gray-400 "
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 16"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
                  />
                </svg>
                <span class="flex-1 ms-3 whitespace-nowrap">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>
      {renderActiveTab()}
      <footer class="fixed bottom-0 left-0 w-full bg-gray-800 dark:bg-gray-800">
    <div class="w-full max-w-screen-xl p-4 flex items-center justify-center">
        <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">Fabrication Console Created By: Nathan Aruna Montreal, QC 2024</span>
    </div>
</footer>

    </div>
  );
};

export default DashboardPage;

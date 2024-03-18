import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../auth";

import Incoming from "./admin/Incoming";
import Completed from "./admin/Completed";
import Failed from "./admin/Failed";

const AdminTab = () => {
  const [userRole, setUserRole] = useState(null);
  const [requestData, setRequestData] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard"); // State to track the active tab

  const user = useAuth();

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        if (user) {
          const userRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserRole(userData.role);
          } else {
            console.error(`User with ID ${user.uid} does not exist.`);
          }
        }
      } catch (error) {
        console.error("Error fetching user role:", error.message);
      }
    };

    fetchUserRole();
  }, [user]);

  return (
    <div>
      {userRole === "admin" ? (
        <div className="p-4 pt-20 sm:ml-64 dark:bg-gray-800">
          <h1 className="pb-3 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Admin Panel
          </h1>
          <ul class="space-y-2 font-medium">
            <div className="flex mb-4">
              <li>
                <a
                  onClick={() => handleTabChange("Incoming")}
                  className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                    activeTab === "Incoming"
                      ? "bg-blue-200 dark:bg-blue-700"
                      : ""
                  }`}
                >
                  <span class="px-2">Incoming Requests</span>
                </a>
              </li>
              <div class="p-2"></div>

              <li>
                <a
                  onClick={() => handleTabChange("Completed")}
                  className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                    activeTab === "Completed"
                      ? "bg-blue-200 dark:bg-blue-700"
                      : ""
                  }`}
                >
                  <span class="px-2">Completed Requests ✔</span>
                </a>
              </li>

              <div class="p-2"></div>

              <li>
                <a
                  onClick={() => handleTabChange("Failed")}
                  className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                    activeTab === "Failed" ? "bg-blue-200 dark:bg-blue-700" : ""
                  }`}
                >
                  <span class="px-2">Failed Requests ✖</span>
                </a>
              </li>
            </div>
          </ul>
          {activeTab === "Incoming" && (
            <Incoming
              onRequestData={(data) => {
                console.log("Request data in Incoming:", data);
                setRequestData(data);
              }}
            />
          )}
          {activeTab === "Completed" && (
            <Completed
              onRequestData={(data) => {
                console.log("Request data in Completed:", data);
                setRequestData(data);
              }}
            />
          )}
          {activeTab === "Failed" && (
            <Failed
              onRequestData={(data) => {
                console.log("Request data in Failed:", data);
                setRequestData(data);
              }}
            />
          )}
        </div>
      ) : (
        <p>You do not have permission to access this page.</p>
      )}
    </div>
  );
};

export default AdminTab;

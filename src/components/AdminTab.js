import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Adjust the path accordingly
import RequestCard from "./subcomps/RequestCard";
import { collection, doc, getDoc } from "firebase/firestore"; // Import individual Firestore methods
import { useAuth } from "../auth"; // Adjust the path accordingly

const AdminTab = () => {
  const [userRole, setUserRole] = useState(null);
  const user = useAuth();

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

  // Dummy data for requested prints
  const requestsData = [
    {
      id: 1,
      email: "nathanaruna07@gmail.com",
      date: "3/14/2024 12:00 PM",
      files: ["file1.stl", "file2.stl"],
    },
    {
      id: 2,
      email: "example@gmail.com",
      date: "3/14/2024 12:00 PM",
      files: ["file3.stl", "file4.stl"],
    },
  ];

  return (
    <div>
      {userRole === "admin" ? (
        <RequestCard requests={requestsData} />
      ) : (
        <p>You do not have permission to access this page.</p>
      )}
    </div>
  );
};

export default AdminTab;

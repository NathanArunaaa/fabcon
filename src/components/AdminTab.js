import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Adjust the path accordingly
import RequestCard from "./subcomps/RequestCard";
import { doc, getDoc } from "firebase/firestore"; // Import individual Firestore methods
import { useAuth } from "../auth"; // Adjust the path accordingly

const AdminTab = () => {
  const [userRole, setUserRole] = useState(null);
  const [requestData, setRequestData] = useState([]);
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

  useEffect(() => {
    const fetchRequestsData = async () => {
      try {
        if (!user) return; // Ensure user is authenticated
        
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        
        if (!userDoc.exists()) {
          console.error(`User with ID ${user.uid} does not exist.`);
          return;
        }
        
        const userData = userDoc.data();
        let orgIds = userData.organizationCode;

        if (!orgIds || orgIds.length === 0) {
          console.log("No organizations found for the user.");
          return;
        }
        
        // If orgIds is a string, split it into an array
        if (typeof orgIds === 'string') {
          orgIds = orgIds.split(',').map(id => id.trim());
        }
        
        console.log("Organization IDs:", orgIds); // Log on IDs
        
        const allRequestsData = [];
        
        for (const orgId of orgIds) {
          const orgDoc = await getDoc(doc(db, "organizations", orgId));
          if (!orgDoc.exists()) {
            console.error(`Organization with ID ${orgId} does not exist.`);
            continue;
          }
          
          const orgData = orgDoc.data();
          const requestIds = orgData.requestIds;
          
          console.log("Request IDs for organization", orgId, ":", requestIds); // Log request IDs
          
          for (const requestId of requestIds) {
            const requestDoc = await getDoc(doc(db, "requests", requestId));
            if (!requestDoc.exists()) {
              console.error(`Request with ID ${requestId} does not exist.`);
              continue;
            }
            
            const requestData = requestDoc.data();
            allRequestsData.push(requestData);
          }
        }
        
        console.log("All Requests Data:", allRequestsData); // Log all requests data
        
        setRequestData(allRequestsData);
      } catch (error) {
        console.error("Error fetching requests data:", error.message);
      }
    };

    fetchRequestsData();
  }, [user]);

  return (
    <div>
      {userRole === "admin" ? (
        <div className="p-4 pt-20 sm:ml-64 dark:bg-gray-800">
          {requestData.length > 0 ? (
            requestData.map((request, index) => (
              <RequestCard key={index} request={request} />
            ))
          ) : (
            <p>Loading...</p>
          )}
        </div>
      ) : (
        <p>You do not have permission to access this page.</p>
      )}
    </div>
  );
};

export default AdminTab;

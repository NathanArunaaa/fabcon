import React, { useState, useEffect } from "react";
import { db } from "../../firebase"; 
import RequestCardBlank from "../subcomps/RequestCardBlank";
import { doc, getDoc } from "firebase/firestore"; 
import { useAuth } from "../../auth"; 

const Failed = () => {
  const [requestData, setRequestData] = useState([]);

  const user = useAuth();


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
        if (typeof orgIds === "string") {
          orgIds = orgIds.split(",").map((id) => id.trim());
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
          const failedIds = orgData.failedIds;

          console.log("Request IDs for organization", orgId, ":", failedIds); // Log request IDs

          for (const failedId of failedIds) {
            const requestDoc = await getDoc(doc(db, "requests", failedId));
            if (!requestDoc.exists()) {
              console.error(`Request with ID ${failedId} does not exist.`);
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
        <div className="  dark:bg-gray-800">
          
          {requestData.length > 0 ? (
            requestData.map((request, index) => (
              <RequestCardBlank key={index} request={request} />
            ))
          ) : (
            <h1 className="pb-3 text-md font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-gray">
            No results found..
          </h1>
          )}
        </div>
     
    </div>
  );
};

export default Failed;

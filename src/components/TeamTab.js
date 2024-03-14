import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import ProfileCard from "./subcomps/ProfileCard";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
import { useAuth } from "../auth";

const TeamTab = ({ currentUser }) => {
  const [users, setUsers] = useState([]);
  const [orgId, setOrgId] = useState(null);
  const [orgName, setOrgName] = useState(""); // State to store organization name
  const user = useAuth();

  useEffect(() => {
    const fetchUserOrgId = async () => {
      try {
        const usersRef = collection(db, "users");
        const userQuery = query(usersRef, where("userId", "==", user.uid));
        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data();
          setOrgId(userData.organizationCode);
        } else {
          console.error(`User with ID ${user.uid} not found.`);
        }
      } catch (error) {
        console.error("Error fetching user organization ID:", error.message);
      }
    };

    if (user) {
      fetchUserOrgId();
    }
  }, [user]);

  useEffect(() => {
    const fetchOrganizationData = async () => {
      try {
        if (orgId) {
          const orgRef = doc(db, "organizations", orgId);
          const orgDoc = await getDoc(orgRef);

          if (orgDoc.exists()) {
            const orgData = orgDoc.data();
            console.log("Organization Data:", orgData);

            // Set organization name in state
            setOrgName(orgData.organizationName);

            // Ensure users is an array or set it as an empty array
            const orgUsers = orgData.users || [];
            console.log("Organization Users:", orgUsers);

            setUsers(orgUsers);
          } else {
            console.error(`Organization with ID ${orgId} does not exist.`);
          }
        }
      } catch (error) {
        console.error("Error fetching organization data:", error.message);
      }
    };

    if (orgId) {
      fetchOrganizationData();
    }
  }, [orgId]);


  return (
    <div class="p-4 pt-20 sm:ml-64 dark:bg-gray-800">
      <h1 className="pb-3 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
        {orgName} 
      </h1>
      {users.map((user) => (
        <ProfileCard key={user.userId} user={user} />
      ))}
    </div>
  );
};

export default TeamTab;

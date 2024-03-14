import React, { useState, useEffect } from "react";
import { db, storage } from "../firebase";
import { collection, addDoc, updateDoc, arrayUnion, doc, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../auth";

// Custom hook to fetch user's organization ID
const useUserOrgId = () => {
  const [orgId, setOrgId] = useState(null);
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

  return orgId;
};

const CreateTab = () => {
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("");
  const [equipmentType, setEquipmentType] = useState("3DP");
  const [fileUrl, setFileUrl] = useState("");
  const orgId = useUserOrgId(); // Fetch orgId using custom hook

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!orgId) {
        console.error("Organization ID is undefined.");
        return;
      }

      // Add the request to the Firestore collection
      const requestRef = collection(db, "requests");
      const newRequestDocRef = await addDoc(requestRef, {
        itemName,
        description,
        department,
        equipmentType,
        fileUrl,
        timestamp: new Date(),
      });

      // Obtain the document ID of the newly created request
      const requestId = newRequestDocRef.id;

      // Add the request ID to the organization document's requestIds array
      const orgRef = doc(db, "organizations", orgId);
      await updateDoc(orgRef, {
        requestIds: arrayUnion(requestId),
      });

      // Clear form fields after successful submission
      setTimeout(() => {
        setItemName("");
        setDescription("");
        setDepartment("");
        setEquipmentType("3DP");
        setFileUrl("");

        // Display success message
        window.alert("Request submitted successfully!");
      }, 100);

    } catch (error) {
      console.error("Error adding document: ", error);
      // Handle error - show error message to the user, etc.
    }
  };

  const handleFileChange = (event) => {
    // Handle file upload and obtain the file URL
  };


  return (
    <div className="p-4 pt-20 sm:ml-64 dark:bg-gray-800">
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-6">
          <label htmlFor="itemName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Name
          </label>
          <input
            type="text"
            id="itemName"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Name of the item"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Description
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="A description of the item"
            required
          />
        </div>

        {/* Department */}
        <div className="mb-6">
          <label htmlFor="department" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Department
          </label>
          <input
            type="text"
            id="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Department requesting the item"
            required
          />
        </div>

        {/* Equipment Type */}
        <div className="mb-6">
          <label htmlFor="equipmentType" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Equipment Type
          </label>
          <select
            id="equipmentType"
            value={equipmentType}
            onChange={(e) => setEquipmentType(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="3DP">Ender P1s</option>
            <option value="CNC">CNC Router</option>
          </select>
        </div>

        {/* File Input */}
        <div className="mb-6">
          <label htmlFor="fileInput" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Upload file
          </label>
          <input
            id="fileInput"
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          />
        </div>

        {/* File URL */}
        <div className="mb-6">
          <label htmlFor="fileUrl" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            File URL
          </label>
          <input
            id="fileUrl"
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Url to files if they exceed 10MB"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateTab;

import React, { useState } from "react";
import { useAuth } from "../auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import {
  addDoc,
  collection,
  updateDoc,
  doc,
} from "firebase/firestore";

const CreateOrganizationPage = () => {
  const user = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');

  const createOrganization = async (e) => {
    e.preventDefault();

    try {
      // Check if the user is authenticated
      const user = auth.currentUser;
      if (!user) {
        console.error("User not authenticated.");
        return;
      }

      // Add organization to Firestore
      const organizationRef = await addDoc(collection(db, "organizations"), {
        name,
        dateCreated: new Date(),
        joinCode: generateRandomJoinCode(),
      });

      // Update the user's document with the organization ID
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        organizationId: organizationRef.id,
      });

      console.log("Organization created and added to user document.");

      // Redirect or perform other actions as needed
    } catch (error) {
      console.error("Error creating organization:", error.message);
    }
  };

  const generateRandomJoinCode = () => {
    // Generate a random alphanumeric join code
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const codeLength = 6;
    let joinCode = '';
    for (let i = 0; i < codeLength; i++) {
      joinCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return joinCode;
  };

  if (!user) {
    // Redirect to login if user is not authenticated
    navigate("/login");
    return null; // Prevent rendering the rest of the component
  }

  return (
    <div>
      <h1>Create Organization</h1>
      <form onSubmit={createOrganization}>
        <label htmlFor="organizationName">Organization Name:</label>
        <input
          type="text"
          id="organizationName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit">Create Organization</button>
      </form>
    </div>
  );
};

export default CreateOrganizationPage;

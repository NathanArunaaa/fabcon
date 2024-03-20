
import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged } from 'firebase/auth';
import { collection, setDoc, doc, getDocs, getDoc, query, where, updateDoc, arrayUnion } from 'firebase/firestore';
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [orgCode, setOrgCode] = useState(''); // Added state for organization code
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [error, setError] = useState(null); // New state for error message
  const navigate = useNavigate();

  const addUserDocument = async (userId, userEmail, userRole, orgCode) => {
    try {
      const usersCollection = collection(db, 'users');
      const docRef = await setDoc(doc(usersCollection, userId), {
        userId: userId,
        email: userEmail,
        role: userRole,
        organizationCode: orgCode, // Add the organization code to the document
      });
  
      console.log('User document added with ID: ', docRef.id);
    } catch (error) {
      console.error('Error adding user document:', error.message);
    }
  };


  const addUserToOrganization = async (orgId, userId, userEmail) => {
    try {
      const organizationRef = doc(db, 'organizations', orgId);
      const organizationDoc = await getDoc(organizationRef);
  
      if (organizationDoc.exists()) {
        const usersArray = organizationDoc.data().users || [];
        const updatedUsersArray = arrayUnion(...usersArray, { userId, email: userEmail });
  
        await updateDoc(organizationRef, { users: updatedUsersArray });
  
        console.log('User added to the organization.');
      } else {
        console.error(`Organization with ID ${orgId} does not exist.`);
      }
    } catch (error) {
      console.error('Error adding user to organization:', error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.emailVerified) {
        // If user is signed in and email is verified, create the user document
        await addUserDocument(user.uid, user.email, 'user');
      }
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      setError('Password Does not Match');
      return;
    }

  
  
    // Check if organization code exists
    const organizationCode = e.target.elements['org-code'].value;
    const organizationsCollection = collection(db, 'organizations');
    const organizationsQuery = query(organizationsCollection, where('orgId', '==', organizationCode));
    const organizationsSnapshot = await getDocs(organizationsQuery);
  
    if (organizationsSnapshot.empty) {
      console.error('Organization code does not exist.');
      setError('Organization code does not exist.');
      return;
    }
  
    // Assuming you have only one organization with the given code, get its ID
    const organizationId = organizationsSnapshot.docs[0].id;
  
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      setRegistrationSuccess(true); // Set registration success state
  
      // Send email verification
      await sendEmailVerification(user);
  
      // Wait for the user to verify the email before updating the state
      const intervalId = setInterval(async () => {
        const updatedUser = auth.currentUser;
        await updatedUser.reload();
        console.log('User after reload:', user);
        if (updatedUser && updatedUser.emailVerified) {
          clearInterval(intervalId);
  
          // Add user to the users collection
          await addUserDocument(updatedUser.uid, updatedUser.email, 'user', organizationCode);
  
          // Add user to the organization
          await addUserToOrganization(organizationId, updatedUser.uid, updatedUser.email);
  
          console.log('User added to the users collection and organization.');
          navigate('/dashboard');
        }
      }, 3000); // Check every second
  
      console.log('Verification email sent. Please check your inbox.');
    } catch (error) {
      console.error('Registration error:', error.message);
    }
  };

  // Render different views based on registration success state
  if (registrationSuccess) {
    return (
      <section className="bg-gray-900 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Registration successful!
            </h1>
            <p class="text-white">Please check your email address for your verification link. Once verified you will be automatically redirected to the login page.</p>
          </div>
        </div>
      </div>
    </section>
    );
  }
  

  return (
    <section className="bg-gray-900 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        
        <div className="w-full bg-gray-800 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl dark:text-white">
              Create an account
              <h1 class='text-rose-700 text-xl'>{error} </h1>

            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleRegister}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-white dark:text-white">Your email</label>
                <input
                  value={email}
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-700 border border-gray-600 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required=""
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-white dark:text-white">Password</label>
                <input
                  value={password}
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-700 border border-gray-600 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required=""
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-white dark:text-white">Confirm password</label>
                <input
                  value={confirmPassword}
                  type="password"
                  name="confirm-password"
                  id="confirm-password"
                  placeholder="••••••••"
                  className="bg-gray-700 border border-gray-600 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required=""
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-white dark:text-white">Organization Code</label>
                <input
                  value={orgCode}
                  type="text"
                  name="org-code"
                  id="org-code"
                  placeholder=""
                  className="bg-gray-700 border border-gray-600 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required=""
                  onChange={(e) => setOrgCode(e.target.value)} 
                />
              </div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    aria-describedby="terms"
                    type="checkbox"
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    required=""
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">
                    I accept the <a className="font-medium text-primary-600 hover:underline dark:text-primary-500" href="#">Terms and Conditions</a>
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 border"
              >
                Create an account
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account? <a href="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterForm;

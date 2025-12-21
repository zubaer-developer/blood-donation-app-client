import { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import app from "../firebase/firebase.config";
import axios from "axios";

export const AuthContext = createContext(null);

// Initialize Firebase Auth
const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Create User (Registration)
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Sign In User
  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Sign Out User
  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  // Update User Profile
  const updateUserProfile = (name, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
  };

  // Observer - For Track Auth State Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      console.log("Current User:", currentUser);

      if (currentUser) {
        // Get token from server and store in localStorage
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/jwt`,
            { email: currentUser.email }
          );

          if (response.data.token) {
            localStorage.setItem("access-token", response.data.token);
          }
        } catch (error) {
          console.error("Error getting token:", error);
        }
      } else {
        // Remove token if user is logged out
        localStorage.removeItem("access-token");
      }

      console.log("Current User:", currentUser?.email || "No user");
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Auth Information to be shared
  const authInfo = {
    user,
    loading,
    createUser,
    signIn,
    logOut,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;

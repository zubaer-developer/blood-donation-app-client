import { createContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import app from "../firebase/firebase.config";
import axios from "axios";

export const AuthContext = createContext(null);
const auth = getAuth(app);

// Configure Google Provider with proper scopes
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("https://www.googleapis.com/auth/userinfo.email");
googleProvider.addScope("https://www.googleapis.com/auth/userinfo.profile");
googleProvider.setCustomParameters({ prompt: "select_account" });

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const googleSignIn = async () => {
    setLoading(true);
    const result = await signInWithPopup(auth, googleProvider);

    // Get email from multiple sources
    const email =
      result.user.email ||
      result.user.providerData?.[0]?.email ||
      result._tokenResponse?.email;

    const displayName =
      result.user.displayName ||
      result.user.providerData?.[0]?.displayName ||
      result._tokenResponse?.displayName;

    const photoURL =
      result.user.photoURL ||
      result.user.providerData?.[0]?.photoURL ||
      result._tokenResponse?.photoUrl;

    console.log("Google result:", { email, displayName, photoURL });

    // Return enhanced result
    return {
      ...result,
      user: {
        ...result.user,
        email,
        displayName,
        photoURL,
      },
    };
  };

  const logOut = async () => {
    setLoading(true);
    localStorage.removeItem("access-token");
    await signOut(auth);
    setLoading(false);
  };

  const updateUserProfile = async (name, photo) => {
    await updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
    setUser({ ...auth.currentUser, displayName: name, photoURL: photo });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("Auth state:", currentUser?.email || "No user");

      if (currentUser) {
        // Get email from providerData if main email is null
        const email = currentUser.email || currentUser.providerData?.[0]?.email;

        const enrichedUser = {
          ...currentUser,
          email,
          displayName:
            currentUser.displayName ||
            currentUser.providerData?.[0]?.displayName,
          photoURL:
            currentUser.photoURL || currentUser.providerData?.[0]?.photoURL,
        };

        setUser(enrichedUser);

        if (email) {
          try {
            const res = await axios.post(
              `${import.meta.env.VITE_API_URL}/jwt`,
              {
                email,
              },
            );
            if (res.data.token) {
              localStorage.setItem("access-token", res.data.token);
              console.log("JWT saved for:", email);
            }
          } catch (err) {
            console.error("JWT Error:", err);
          }
        }
      } else {
        setUser(null);
        localStorage.removeItem("access-token");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    createUser,
    signIn,
    googleSignIn,
    logOut,
    updateUserProfile,
    theme,
    toggleTheme,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;

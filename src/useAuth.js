import { useState, useEffect } from "react";
import { auth } from "./firebase";  // Your Firebase config
import { onAuthStateChanged } from "firebase/auth";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      console.log("Auth state changed:", user);  // Log the user object
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
};

export default useAuth;

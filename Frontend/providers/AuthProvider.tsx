import { default as auth } from "@react-native-firebase/auth";
import { PropsWithChildren, useEffect, useState } from "react";
import { AuthContext, User } from "../contexts/FirebaseAuthContext";

interface AuthProviderProps {}

export const AuthProvider: React.FC<PropsWithChildren<AuthProviderProps>> = ({
  children
}) => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User>(null);
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    console.log("I was called", user);
    setUser(user);
    return subscriber; // unsubscribe on unmount
  }, []);

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }
  return (
    <AuthContext.Provider
      value={{
        initializing,
        user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

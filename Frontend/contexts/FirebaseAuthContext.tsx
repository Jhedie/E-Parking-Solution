/* eslint-disable @typescript-eslint/no-empty-function */
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { createContext, useContext } from "react";

// Define a type for the user state
export type User = FirebaseAuthTypes.User | null;
interface AuthContextType {
  user: User;
  initializing: boolean;
}
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

//can be used to access user information
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

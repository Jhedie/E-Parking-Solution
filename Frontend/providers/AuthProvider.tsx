import { PropsWithChildren, useState } from "react";
import { AuthContext, User } from "../contexts/FirebaseAuthContext";

interface AuthProviderProps {}

export const AuthProvider: React.FC<PropsWithChildren<AuthProviderProps>> = ({
  children
}) => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User>(null);

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

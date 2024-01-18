/* eslint-disable @typescript-eslint/no-empty-function */
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import {
  router,
  useRootNavigationState,
  useRouter,
  useSegments
} from "expo-router";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

// Define a type for the user state
export type User = FirebaseAuthTypes.User | null;
interface AuthContextInterface {
  user: User | null;
  initializing: boolean;
  signIn: React.Dispatch<React.SetStateAction<User>>;
  signOut: () => void;
}
const AuthContextInitialState: AuthContextInterface = {
  user: auth().currentUser,
  initializing: true,
  signIn: () => {},
  signOut: () => {}
};

const AuthContext = createContext<AuthContextInterface>(
  AuthContextInitialState
);

//can be used to access user information
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

function userProtectedRouter(user: User) {
  const segments = useSegments(); // hook that allows all navigation routes defined.

  const rootNavigationState = useRootNavigationState(); // hook allows to determine if the router is ready to be used.

  const [hasNavigated, setHasNavigated] = useState(false); // state to avoid navigating before the navigator is ready. It also avoids having to add a listener to the navigation state.

  const router = useRouter(); // hook that allows to navigate to a route.

  useEffect(() => {
    if (!rootNavigationState?.key || hasNavigated) return;
    const inTabsGroup = segments[0] === "(auth)"; // these routes in the auth group
    if (!user?.uid && !inTabsGroup) {
      // if user is not logged in and not in the auth group then redirect to the auth group
      setHasNavigated(true);
      console.log("routing to sign-up");
      router.replace("/(public)/welcome");
    } else if (user && inTabsGroup) {
      // if user is logged in and in the auth group then redirect to the auth group
      setHasNavigated(true);
      console.log("routing to main");
      router.replace("/(auth)/home");
    }
  }, [user?.uid, rootNavigationState?.key, segments]);
}

interface AuthProviderProps {}

export function AuthProvider({
  children
}: PropsWithChildren<AuthProviderProps>) {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User>(null);

  userProtectedRouter(user); // this function will redirect the user to the correct route based on the user state. Every time the user state changes, this function will be called.

  useEffect(() => {
    const unsubscribeAuth = auth().onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        setInitializing(false);
        router.replace("/(auth)/home");
      } else {
        console.log("user is not logged in");
        setUser(null);
        setInitializing(true);
        router.replace("/(public)/welcome");
      }
    });
    return () => unsubscribeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        initializing,
        user,
        signIn: setUser,
        signOut: () => {
          setUser(null);
          auth().signOut();
        }
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

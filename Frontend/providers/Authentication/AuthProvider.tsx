/* eslint-disable @typescript-eslint/no-empty-function */
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { useToastController } from "@tamagui/toast";
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
  signIn: (email: string, password: string) => void;
  signOut: () => void;
  signUp: (email: string, password: string) => void;
}
const AuthContextInitialState: AuthContextInterface = {
  user: auth().currentUser,
  signIn: () => {},
  signOut: () => {},
  signUp: () => {}
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
    } else return;
  }, [user?.uid, rootNavigationState?.key, segments]);
}

interface AuthProviderProps {}

export function AuthProvider({
  children
}: PropsWithChildren<AuthProviderProps>) {
  const toaster = useToastController();
  const [user, setUser] = useState<User>(null);
  userProtectedRouter(user); // this function will redirect the user to the correct route based on the user state. Every time the user state changes, this function will be called.

  useEffect(() => {
    const unsubscribeAuth = auth().onAuthStateChanged(async (user) => {
      user?.reload();
      if (user) {
        console.log("The user previously registered with", user.email);
        console.log("is verified?", user.emailVerified);
        if (user.emailVerified) {
          setUser(user);
          router.replace("/(auth)/home");
        } else {
          toaster.show("Please verify your email!");
          router.replace("/(public)/verification");
        }
      } else {
        console.log("user is not logged in");
        setUser(null);
        router.replace("/(public)/welcome");
      }
    });
    return () => unsubscribeAuth();
  }, []);

  function signUpUserOnPress(email: string, password: string) {
    try {
      auth()
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          toaster.show("User account created");
          userCredential.user
            ?.sendEmailVerification()
            .then(() => {
              toaster.show("Verification email sent!");
              console.log("Verification email sent!");
              router.replace("/(public)/verification");
            })
            .catch((error) => {
              console.log("Failed to send verification email: ", error);
            });
        })
        .catch((error) => {
          if (error.code === "auth/email-already-in-use") {
            toaster.show("That email address is already in use!");
          }

          if (error.code === "auth/invalid-email") {
            toaster.show("That email address is invalid!");
          }
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }

  function signInUserOnPress(email: string, password: string) {
    try {
      auth()
        .signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          if (userCredential.user?.emailVerified) {
            setUser(userCredential.user);
            toaster.show("Welcome back!");
            router.replace("/(auth)/home");
          } else {
            toaster.show("Please verify your email!");
            router.replace("/(public)/verification");
          }
        })
        .catch((error) => {
          if (error.code === "auth/invalid-email") {
            toaster.show("That email address is invalid!");
          }

          if (error.code === "auth/user-not-found") {
            toaster.show("There is no user with that email address!");
          }

          if (error.code === "auth/wrong-password") {
            toaster.show("That password is incorrect!");
          }
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <AuthContext.Provider
      value={{
        user,
        signIn: signInUserOnPress,
        signOut: () => {
          setUser(null);
          auth().signOut();
        },
        signUp: signUpUserOnPress
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

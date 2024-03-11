/* eslint-disable @typescript-eslint/no-empty-function */
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { useToastController } from "@tamagui/toast";
import axios, { AxiosError } from "axios";
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
import { storage } from "../../utils/asyncStorage";

const BASE_URL = process.env.FRONTEND_SERVER_BASE_URL;

// Define a type for the user state
export type User = FirebaseAuthTypes.User | null;
interface AuthContextInterface {
  user: User | null;
  signIn: (email: string, password: string) => void;
  signOut: () => void;
  signUp: (email: string, password: string) => void;
  signUpBackend: (
    email: string,
    password: string,
    userName: string,
    phoneNumber: string
  ) => void;
  resetPassword: (email: string) => void;
}
const AuthContextInitialState: AuthContextInterface = {
  user: auth().currentUser,
  signIn: () => {},
  signOut: () => {},
  signUp: () => {},
  signUpBackend: () => {},
  resetPassword: () => {}
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

// function userProtectedRouter(user: User) {
//   const segments = useSegments(); // hook that allows all navigation routes defined.
//   const rootNavigationState = useRootNavigationState(); // hook allows to determine if the router is ready to be used.
//   const [hasNavigated, setHasNavigated] = useState(false); // state to avoid navigating before the navigator is ready. It also avoids having to add a listener to the navigation state.
//   const router = useRouter(); // hook that allows to navigate to a route.

//   useEffect(() => {
//     if (!rootNavigationState?.key || hasNavigated) return;

//     const inTabsGroup = segments[0] === "(auth)"; // these routes in the auth group
//     const inPublicGroup = segments[0] === "(public)"; // these routes in the public group
//     const isUSerAuthenticated = user?.uid; // user is logged in

//     const checkOnboardingStatus = async () => {
//       const onboarded = await storage.getItem("onboarding");
//       console.log(onboarded, "onboarded");

//       const hasDoneOnboarding = onboarded === 1;
//       console.log(hasDoneOnboarding, "hasDoneOnBoarding");

//       if (!isUSerAuthenticated && !hasDoneOnboarding) {
//         // if user is not logged in and not in the auth group then redirect to the auth group
//         // setHasNavigated(true);
//         console.log("routing to onboarding");
//         router.replace("/(public)/onBoarding");
//       } else if (!isUSerAuthenticated && !inTabsGroup && hasDoneOnboarding) {
//         router.replace("/(public)/welcome");
//       } else if (isUSerAuthenticated && !inTabsGroup) {
//         // if user is logged in and not in the auth group then redirect to the auth group
//         setHasNavigated(true);
//         console.log("routing to main");
//         router.replace("/(auth)/home");
//       } else return;
//     };
//     // checkOnboardingStatus();
//   }, [user?.uid, rootNavigationState?.key, segments]);
// }
async function getOnboardingStatus(): Promise<boolean> {
  const onboarded = await storage.getItem("onboarding");
  console.log(onboarded, "onboarded");

  const hasDoneOnboarding = onboarded === 1;
  console.log(hasDoneOnboarding, "hasDoneOnBoarding");
  return hasDoneOnboarding;
}
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
      getOnboardingStatus().then((hasDoneOnboarding) => {
        if (hasDoneOnboarding) {
          router.replace("/(public)/welcome");
        } else {
          router.replace("/(public)/onBoarding");
        }
      });
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

  userProtectedRouter(user);
  // this function will redirect the user to the correct route based on the user state. Every time the user state changes, this function will be called.

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
              console.log("Failed to send verification email here: ", error);
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

  // Define an interface for the response data if you know the structure,
  // otherwise use any or define a more generic type
  interface SignUpResponse {
    email: string;
    name: string;
    phoneNumber: string;
    customToken: string;
    token: string;
  }

  async function signUpUserOnPressBackend(
    email: string,
    password: string,
    userName: string,
    phoneNumber: string
  ): Promise<void> {
    try {
      await axios
        .post<SignUpResponse>(`${BASE_URL}/account/driver`, {
          email,
          password,
          name: userName,
          phoneNumber
        })
        .then((userFromBackend) => {
          toaster.show("User account created");
          console.log(userFromBackend.data);
          toaster.show("User account created. Please verify your email!");

          auth()
            .signInWithCustomToken(userFromBackend.data.customToken)
            .then((userCredential) => {
              //get the token from the userCredential
              // make verification request
              setUser(userCredential.user);
              userCredential.user.getIdToken().then((idtoken) => {
                console.log("idtoken", idtoken);
                console.log("Bearer ${idtoken}");
                axios
                  .post(
                    `${BASE_URL}/account/verify`,
                    {
                      email: userCredential.user.email
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${idtoken}`
                      }
                    }
                  )
                  .then(() => {
                    router.replace("/(public)/verification");
                    console.log("Verification email sent!");
                  })
                  .catch((error) => {
                    console.log("Failed to send verification email: ", error);
                  });
              });
            });
        });
    } catch (error) {
      const axiosError = error as AxiosError;

      // Log the error details based on the type of error
      if (axiosError.response) {
        // Server responded with a status code outside the 2xx range
        console.error("Server Response Error:", {
          data: axiosError.response.data,
          status: axiosError.response.status,
          headers: axiosError.response.headers
        });
      } else if (axiosError.request) {
        // Request was made but no response was received
        console.error("No Response:", axiosError.request);
      } else {
        // An error occurred in setting up the request
        console.error("Request Setup Error:", axiosError.message);
      }

      // Display a generic error message to the user
      toaster.show("Failed to sign up. Please try again!");
      console.error("Failed to sign up:", axiosError);
    }
  }

  //TODO Deprecated using signUpUserOnPressBackend
  function signInUserOnPress(email: string, password: string) {
    try {
      auth()
        .signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          setUser(userCredential.user);
          if (userCredential.user?.emailVerified) {
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

  function resetPasswordOnPress(email: string): void {
    try {
      auth()
        .sendPasswordResetEmail(email)
        .then(() => {
          toaster.show("Password reset email sent!");
          console.log("Password reset email sent!");

          setTimeout(() => {
            router.replace("/(public)/sign-in");
          }, 3000);
        })
        .catch((error) => {
          console.log("Failed to send password reset email: ", error);
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
        signUp: signUpUserOnPress,
        signUpBackend: signUpUserOnPressBackend,
        resetPassword: resetPasswordOnPress
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

import { useModeController } from "@firecms/core";
import { FirebaseAuthController } from "@firecms/firebase";
import axios, { AxiosError } from "axios";
import { FirebaseApp } from "firebase/app";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useConfig } from "../../providers/Config/ConfigProvider";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

interface AuthViewProps {
  authController: FirebaseAuthController;
  firebaseApp: FirebaseApp;
  notAllowedError?: any;
  logo?: string;
}

export default function AuthComponent({
  authController,
  firebaseApp,
  notAllowedError,
  logo,
}: AuthViewProps) {
  const modeState = useModeController();
  const logoComponent = (
    <img
      src={logo}
      style={{
        height: "100%",
        width: "100%",
        objectFit: "contain",
      }}
      alt={"Logo"}
    />
  );
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleAuthView = () => {
    setIsSignUp(!isSignUp);
  };

  const { BASE_URL } = useConfig();
  const navigate = useNavigate();

  async function signInUserOnPress(email: string, password: string) {
    if (email && password) {
      console.log("Signing in user...");
      authController.emailPasswordLogin(email, password);
    }
  }

  async function signUpUserOnPressBackend(
    email: string,
    password: string,
    userName: string,
    phoneNumber: string
  ): Promise<void> {
    try {
      setIsLoading(true);
      console.log(`${BASE_URL}/account/parkingOwner`);
      await axios
        .post(`${BASE_URL}/account/parkingOwner`, {
          email,
          password,
          name: userName,
          phoneNumber,
        })
        .then((userFromBackend) => {
          alert("User account created. Please verify your email!");
          console.log(userFromBackend.data.user.email);
          //auto sign in user
          authController.emailPasswordLogin(email, password);
        });
    } catch (error) {
      const axiosError = error as AxiosError;

      // Log the error details based on the type of error
      if (axiosError.response) {
        // Server responded with a status code outside the 2xx range
        console.error("Server Response Error:", {
          data: axiosError.response.data,
          status: axiosError.response.status,
          headers: axiosError.response.headers,
        });
      } else if (axiosError.request) {
        // Request was made but no response was received
        console.error("No Response:", axiosError.request);
      } else {
        // An error occurred in setting up the request
        console.error("Request Setup Error:", axiosError.message);
      }
      console.log("Failed to sign up. Please try again!");
      console.error("Failed to sign up:", axiosError);
    }
    setIsLoading(false);
  }

  return (
    <div className="flex flex-col items-center justify-center  p-4 min-h-screen ">
      {isLoading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : (
        <>
          <div className="">{logoComponent}</div>
          {isSignUp ? (
            <div className="w-[35vw]">
              <SignUp
                switch={toggleAuthView}
                signUpUserOnPressBackend={signUpUserOnPressBackend}
              />
            </div>
          ) : (
            <div className="w-[30vw]">
              <SignIn
                switch={toggleAuthView}
                signInUserOnPress={signInUserOnPress}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

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

  const toggleAuthView = () => {
    setIsSignUp(!isSignUp);
  };

  const { BASE_URL } = useConfig();
  const navigate = useNavigate();

  const handleSignIn = (email: string, password: string) => {
    if (email && password) {
      authController.emailPasswordLogin(email, password);
    }
  };

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
      // await axios
      //   .post<SignUpResponse>(`${BASE_URL}/account/parkingOwner`, {
      //     email,
      //     password,
      //     name: userName,
      //     phoneNumber,
      //   })
      //   .then((userFromBackend) => {
      //     alert("User account created. Please verify your email!");
      //     console.log(userFromBackend.data);
      //     console.log("User account created. Please verify your email!");
      //   });

      navigate("/app/verify-email", {
        state: { email, password, userName, phoneNumber },
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

      // Display a generic error message to the user
      console.log("Failed to sign up. Please try again!");
      console.error("Failed to sign up:", axiosError);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center  p-4 min-h-screen min-w-[40vw]">
      <div className="">{logoComponent}</div>
      {isSignUp ? (
        <div className="w-[25vw]">
          <SignUp
            switch={toggleAuthView}
            signUpUserOnPressBackend={signUpUserOnPressBackend}
          />
        </div>
      ) : (
        <div className="w-[25vw]">
          <SignIn switch={toggleAuthView} />
        </div>
      )}
    </div>
  );
}

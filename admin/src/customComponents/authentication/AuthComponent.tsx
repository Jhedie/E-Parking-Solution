import { useModeController } from "@firecms/core";
import { FirebaseAuthController } from "@firecms/firebase";
import { Brightness5Icon, DarkModeIcon } from "@firecms/ui";
import axios, { AxiosError } from "axios";
import { FirebaseApp } from "firebase/app";
import {
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import Modal from "../../helpers/Modal";
import { useConfig } from "../../providers/Config/ConfigProvider";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

interface AuthViewProps {
  authController: FirebaseAuthController;
  firebaseApp: FirebaseApp;
  logo?: string;
}

export default function AuthComponent({
  authController,
  firebaseApp,
  logo,
}: AuthViewProps) {
  const modeState = useModeController();
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);
  const [resetEmail, setResetEmail] = useState<string | null>(null);
  const navigate = useNavigate();

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

  const toggleResetPasswordModal = () => {
    console.log("Toggling reset password modal", isResetPasswordModalOpen);
    setIsResetPasswordModalOpen(!isResetPasswordModalOpen);
  };

  const { BASE_URL } = useConfig();
  const auth = getAuth();

  async function signInUserOnPress(email: string, password: string) {
    if (email && password) {
      setIsLoading(true);

      setTimeout(() => {
        signInWithEmailAndPassword(auth, email, password)
          .then(async (userCredential) => {
            const idTokenResult = await userCredential.user.getIdTokenResult();
            const { approved, rejected } = idTokenResult?.claims || {};

            if (rejected === true) {
              toast.error(
                "Your account has been rejected. Please contact support"
              );
              setIsLoading(false);
              return;
            }

            if (approved === false) {
              toast.error("Your account is not approved yet.");
              setIsLoading(false);
              return;
            }
            navigate("/app", { replace: true });
            toast.success("Signed in successfully!");
            toast.success(`Welcome, ${userCredential.user.displayName}!`);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error("Failed to sign in: ", error);
            if (error.code === "auth/user-not-found") {
              toast.error("User not found. Please sign up!");
            }
            if (error.code === "auth/wrong-password") {
              toast.error("Wrong password. Please try again!");
            }
            if (error.code === "auth/invalid-credential") {
              toast.error("Invalid credentials. Please try again!");
            }
            if (error.code === "auth/too-many-requests") {
              toast.error("Too many requests. Please try again later!");
            }
            setIsLoading(false);
          });
      }, 1000);
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
      await axios
        .post(`${BASE_URL}/account/parkingOwner`, {
          email,
          password,
          name: userName,
          phoneNumber,
        })
        .then((userFromBackend) => {
          toast.success("User account created. Please verify your email!");

          console.log(userFromBackend);

          navigate("/verify-email", {
            state: {
              user: userFromBackend.data.user,
              token: userFromBackend.data.token,
              customToken: userFromBackend.data.customToken,
            },
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
          headers: axiosError.response.headers,
        });
        toast.error("Failed to sign up. Please try again!");
      } else if (axiosError.request) {
        // Request was made but no response was received
        console.error("No Response:", axiosError.request);
        toast.error(
          "Failed to sign up. No response received. Please try again!"
        );
      } else {
        // An error occurred in setting up the request
        console.error("Request Setup Error:", axiosError.message);
        toast.error(
          "Failed to sign up. Error setting up the request. Please try again!"
        );
      }
    }
    setIsLoading(false);
  }

  const handlePasswordReset = async (email: string) => {
    if (!email) {
      toast.error("Please enter an email address.");
      return;
    }
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setIsResetPasswordModalOpen(false);
        toast.success(
          "Password reset email sent. If your email exists, you will receive a password reset link."
        );
      })
      .catch((error) => {
        toast.error(`Failed to send password reset email: ${error.message}`);
      });
  };

  return (
    <div
      className={
        "relative flex flex-col items-center justify-center p-4 min-h-screen overflow-hidden"
      }
    >
      <div className="absolute top-1 -right-1">
        <button
          className="btn btn-ghost tooltip tooltip-bottom"
          data-tip="Toggle Mode"
          onClick={() => modeState.toggleMode()}
        >
          {modeState.mode === "dark" ? <DarkModeIcon /> : <Brightness5Icon />}
        </button>
      </div>
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
                toggleResetPasswordModal={toggleResetPasswordModal}
              />
            </div>
          )}
          {isResetPasswordModalOpen && (
            <Modal
              open={isResetPasswordModalOpen}
              onClose={toggleResetPasswordModal}
            >
              <h3 className="font-bold text-lg">Reset Password</h3>
              <p className="py-4">
                Please enter your email address to receive a password reset
                link.
              </p>
              <input
                type="email"
                placeholder="Enter your email"
                className="input input-bordered w-full mb-4"
                onChange={(e) => {
                  setResetEmail(e.target.value);
                }}
                value={resetEmail || ""}
              />
              <div className="modal-action">
                <button className="btn" onClick={toggleResetPasswordModal}>
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => handlePasswordReset(resetEmail || "")}
                >
                  Send Reset Email
                </button>
              </div>
            </Modal>
          )}
        </>
      )}
    </div>
  );
}

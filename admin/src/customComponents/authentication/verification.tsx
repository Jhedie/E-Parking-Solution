import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router";
import { useConfig } from "../../providers/Config/ConfigProvider";
interface VerificationProps {}
const Verification: React.FC<VerificationProps> = ({}: VerificationProps) => {
  const location = useLocation();
  const { BASE_URL } = useConfig();
  const { user, token } = location.state;
  const [isResending, setIsResending] = useState(false);
  console.log("user: ", user);

  const navigate = useNavigate();

  function sendEmailVerification(): void {
    setIsResending(true);
    toast.loading("Sending verification email...", { duration: 5000 });
    axios
      .post(
        `${BASE_URL}/account/verify`,
        {
          email: user.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        console.log("sending Verification email sent!");
        setIsResending(false);
        toast.success("Verification email sent!");
      })
      .catch((error) => {
        console.log("Failed to send verification email: ", error);
        toast.error("Failed to send verification email:", error.message);
        setIsResending(false);
      });
  }

  return (
    <div>
      <div className="flex items-center justify-center min-h-screen ">
        <div className="max-w-xl p-8 text-center shadow-xl lg:max-w-3xl rounded-3xl lg:p-12 bg-white text-black">
          <h3 className="text-2xl">
            Thanks for registering. Your Parking Owner Journey Begins!
          </h3>
          {isResending && (
            <div className="flex justify-center">
              <span className="loading loading-spinner loading-lg m-10"></span>
            </div>
          )}
          <p>
            We&apos;re happy you&apos;re here. Let&apos;s get your email address
            verified
          </p>
          <div className="m-5">
            <button
              disabled={isResending}
              onClick={() => sendEmailVerification()}
              className="btn  m-2 btn-primary"
            >
              Click to Verify Email
            </button>
            <button
              className="btn btn-outline m-2 text-black"
              onClick={() => navigate("/app")}
            >
              Go back to Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verification;

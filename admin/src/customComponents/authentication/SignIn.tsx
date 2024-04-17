import { useModeController } from "@firecms/core";
import { Formik } from "formik";
import { z } from "zod";

interface SignInProps {
  switch: () => void;
  signInUserOnPress: (email: string, password: string) => void;
  toggleResetPasswordModal: () => void;
}

const SignIn: React.FC<SignInProps> = ({
  switch: toggleAuthView,
  signInUserOnPress,
  toggleResetPasswordModal,
}: SignInProps) => {
  const modeState = useModeController();

  const SignInValidationSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
  });
  type FormValues = z.infer<typeof SignInValidationSchema>;
  const validateForm = (values: FormValues) => {
    try {
      SignInValidationSchema.parse(values);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.formErrors.fieldErrors;
      }
    }
  };
  const initialValues = {
    email: "",
    password: "",
  };
  return (
    <div className={"card bg-base-100 shadow-xl p-10 mt-10 text-black"}>
      <div className="card-body">
        <Formik
          initialValues={initialValues}
          validate={validateForm}
          onSubmit={(values: FormValues) => {
            signInUserOnPress(values.email, values.password);
          }}
        >
          {(formikProps) => (
            <div>
              <label
                className={`input input-bordered flex items-center gap-2 ${
                  formikProps.touched.email && formikProps.errors.email
                    ? "input-error"
                    : ""
                } mb-5
                ${
                  formikProps.touched.email &&
                  !formikProps.errors.email &&
                  "input-success"
                }
                `}
              >
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  value={formikProps.values.email}
                  className="w-full"
                />
                {formikProps.touched.email && formikProps.errors.email && (
                  <div
                    className="tooltip tooltip-open tooltip-warning tooltip-right"
                    data-tip={formikProps.errors.email}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5 text-red-500 ml-auto"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 00-2 0v3a1 1 0 002 0V6zm-1 8a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
                {formikProps.touched.email && !formikProps.errors.email && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5 text-green-500 ml-auto"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 0a10 10 0 110 20 10 10 0 010-20zm4.5 7.5a.75.75 0 00-1.06-1.06l-4.5 4.5-2.25-2.25a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l5-5z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </label>
              {/* Password */}
              <label
                className={`input input-bordered flex items-center gap-2 ${
                  formikProps.touched.password && formikProps.errors.password
                    ? "input-error"
                    : ""
                } mb-5
                ${
                  formikProps.touched.password &&
                  !formikProps.errors.password &&
                  "input-success"
                }
                `}
              >
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  value={formikProps.values.password}
                  className="w-full"
                />

                {formikProps.touched.password &&
                  formikProps.errors.password && (
                    <div
                      className="tooltip tooltip-open tooltip-warning tooltip-right"
                      data-tip={formikProps.errors.password}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5 text-red-500 ml-auto"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 00-2 0v3a1 1 0 002 0V6zm-1 8a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                {formikProps.touched.password &&
                  !formikProps.errors.password && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5 text-green-500 ml-auto"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 0a10 10 0 110 20 10 10 0 010-20zm4.5 7.5a.75.75 0 00-1.06-1.06l-4.5 4.5-2.25-2.25a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l5-5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
              </label>

              <p
                className={`text-center text-sm ${
                  modeState.mode === "dark" ? "text-gray-300" : "text-gray-500"
                } m-4`}
              >
                <button
                  className="text-blue-500"
                  onClick={toggleResetPasswordModal}
                >
                  Forgot your password?
                </button>
              </p>

              <button
                type="submit"
                className="btn w-full"
                onClick={() => formikProps.handleSubmit()}
              >
                Login
              </button>
            </div>
          )}
        </Formik>
        <p
          className={`text-center text-sm ${
            modeState.mode === "dark" ? "text-gray-300" : "text-gray-500"
          }`}
        >
          Not a member?{" "}
          <button className="text-blue-500" onClick={toggleAuthView}>
            Create an account
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignIn;

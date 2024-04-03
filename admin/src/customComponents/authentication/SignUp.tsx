import { Formik } from "formik";
import React from "react";
import { z } from "zod";

interface SignUpProps {
  switch: () => void;
  signUpUserOnPressBackend: (
    email: string,
    password: string,
    username: string,
    phoneNumber: string
  ) => void;
}

const SignUp: React.FC<SignUpProps> = ({
  switch: toggleAuthView,
  signUpUserOnPressBackend,
}) => {
  const SignupValidationSchema = z
    .object({
      username: z.string().min(3, "Username is required"),
      email: z.string().email("Invalid email address"),
      password: z.string().min(8, "Password must be at least 8 characters"),
      confirmPassword: z.string(),
      phoneNumber: z
        .string()
        .min(10, "Phone number must be at least 10 digits"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const initialValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  };
  type FormValues = z.infer<typeof SignupValidationSchema>;

  const validateForm = (values: FormValues) => {
    try {
      SignupValidationSchema.parse(values);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.formErrors.fieldErrors;
      }
    }
  };
  return (
    <div className="card bg-base-100 shadow-xl p-10 mt-10 text-white">
      <div className="card-body">
        <Formik
          initialValues={initialValues}
          validate={validateForm}
          onSubmit={(values: FormValues) => {
            signUpUserOnPressBackend(
              values.email,
              values.password,
              values.username,
              values.phoneNumber
            );
          }}
        >
          {(formikProps) => (
            <div>
              <label
                className={`input input-bordered flex items-center gap-2 ${
                  formikProps.touched.username && formikProps.errors.username
                    ? "input-error"
                    : ""
                } mb-5
                ${
                  formikProps.touched.username &&
                  !formikProps.errors.username &&
                  "input-success"
                }
                `}
              >
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  value={formikProps.values.username}
                  className="w-full"
                />
                {formikProps.touched.username &&
                  formikProps.errors.username && (
                    <div
                      className="tooltip tooltip-open tooltip-warning tooltip-right"
                      data-tip={formikProps.errors.username}
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
                {formikProps.touched.username &&
                  !formikProps.errors.username && (
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

              {/* Email */}
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
                } w-full mb-5
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

              {/* Confirm Password */}
              <label
                className={`input input-bordered flex items-center gap-2 ${
                  formikProps.values.password &&
                  formikProps.touched.confirmPassword &&
                  formikProps.errors.confirmPassword
                    ? "input-error"
                    : ""
                } mb-5
                ${
                  formikProps.values.password &&
                  formikProps.errors.password &&
                  formikProps.touched.confirmPassword &&
                  !formikProps.errors.confirmPassword &&
                  "input-success"
                }
                `}
              >
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  value={formikProps.values.confirmPassword}
                  className="w-full"
                />
                {formikProps.values.password &&
                  formikProps.touched.confirmPassword &&
                  formikProps.errors.confirmPassword && (
                    <div
                      className="tooltip tooltip-open tooltip-warning tooltip-right"
                      data-tip={formikProps.errors.confirmPassword}
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
                {formikProps.values.password &&
                  formikProps.touched.confirmPassword &&
                  !formikProps.errors.confirmPassword && (
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

              {/* Phone Number */}
              <label
                className={`input input-bordered flex items-center gap-2 ${
                  formikProps.touched.phoneNumber &&
                  formikProps.errors.phoneNumber
                    ? "input-error"
                    : ""
                } w-full mb-5
                ${
                  formikProps.touched.phoneNumber &&
                  !formikProps.errors.phoneNumber &&
                  "input-success"
                }
                `}
              >
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  value={formikProps.values.phoneNumber}
                  className="w-full"
                />
                {formikProps.touched.phoneNumber &&
                  formikProps.errors.phoneNumber && (
                    <div
                      className="tooltip tooltip-open tooltip-warning tooltip-right"
                      data-tip={formikProps.errors.phoneNumber}
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
                {formikProps.touched.phoneNumber &&
                  !formikProps.errors.phoneNumber && (
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

              <button
                onClick={() => formikProps.handleSubmit()}
                className="btn btn-primary w-full"
              >
                Sign Up
              </button>
            </div>
          )}
        </Formik>
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <button onClick={toggleAuthView} className="text-blue-500">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;

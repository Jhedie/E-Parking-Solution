import { useAuthController, useModeController } from "@firecms/core";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Form, Formik, FormikErrors, FormikHelpers } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import { useConfig } from "../../providers/Config/ConfigProvider";
import ParkingLotAddressForm, {
  ParkingLotAddressFormSchema,
} from "./ParkingLotAddressForm/ParkingLotAddressForm";
import ParkingLotDetailsForm, {
  ParkingLotDetailsFormSchema,
} from "./ParkingLotDetailsForm/ParkingLotDetailsForm";
import ParkingRatesForm, {
  ParkingRatesFormSchema,
} from "./ParkingRatesForm/ParkingRatesForm";
import ParkingSlotsForm, {
  ParkingSlotsFormSchema,
} from "./ParkingSlotsFrom/ParkingSlotsForm";
import ReviewAndConfirm from "./ReviewAndConfirm/ReviewAndConfirm";

import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { ZodError } from "zod";
import Modal from "../../helpers/Modal";

export interface ComprehensiveFormValues {
  LotName: string;
  Description: string;
  OperatingHours: Array<{
    day: string;
    start: string;
    end: string;
  }>;
  Images: string[];
  Facilities: string[];
  Address: {
    streetNumber?: string;
    unitNumber?: string;
    streetName: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    formattedAddress?: string;
  };
  Coordinates?: {
    Latitude: number;
    Longitude: number;
  };
  SlotsConfig: Array<{
    row: string;
    columns: number;
  }>;
  SlotTypes: {
    disabled?: string;
    electric?: string;
  };
  Capacity: number;
  Rates: Array<{
    rateType: string;
    rate: number;
    duration: number;
  }>;
}

export default function MultiStepCreateParkingLotForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const modeState = useModeController();

  const stepComponents = [
    {
      component: ParkingLotDetailsForm,
      validationSchema: ParkingLotDetailsFormSchema,
      name: "Parking Lot Details",
    },
    {
      component: ParkingLotAddressForm,
      validationSchema: ParkingLotAddressFormSchema,
      name: "Parking Lot Address",
    },
    {
      component: ParkingSlotsForm,
      validationSchema: ParkingSlotsFormSchema,
      name: "Parking Slots",
    },
    {
      component: ParkingRatesForm,
      validationSchema: ParkingRatesFormSchema,
      name: "Parking Rates",
    },
    { component: ReviewAndConfirm, validationSchema: null, name: "Review" },
  ];

  const currentComponent = stepComponents[currentStep - 1].component;
  const currentValidationSchema =
    stepComponents[currentStep - 1].validationSchema;

  const validateForm = async (values: any) => {
    try {
      currentValidationSchema?.parse(values);
      return {}; // Return an empty object if no validation errors
    } catch (error) {
      if (error instanceof ZodError) {
        console.error("Validation error: ", error);
        // Convert ZodError to FormikErrors format
        const formikErrors: FormikErrors<any> = {};
        for (const [key, value] of Object.entries(
          error.formErrors.fieldErrors
        )) {
          // Assuming error messages are in an array, take the first message
          if (value?.length)
            formikErrors[key as keyof ComprehensiveFormValues] = value[0];
        }
        return formikErrors;
      }
      return {}; // Return an empty object if the error is not a ZodError
    }
  };

  const initialValues = {
    // Step 1: Basic Parking Lot Information
    LotName: "",
    Description: "",
    Facilities: [], // Array of facilities like 'EV Charging', 'CCTV' etc.
    OperatingHours: [], // [day: Monday: start: "09:00", end: "17:00"...]
    Images: [],

    //Step 2: Parking Location Configuration
    Address: {
      streetNumber: "",
      unitNumber: "",
      streetName: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      formattedAddress: "",
    },
    Coordinates: {
      Latitude: 0,
      Longitude: 0,
    },
    // Step 3: Parking Slot Configuration
    Capacity: 0,
    SlotsConfig: [],
    SlotTypes: {
      disabled: "",
      electric: "",
    },
    // Step 4: Parking Rates
    Rates: [], // Array of rates like { rateType: "hour", rate: "5", duration: "1" }
  };
  const { BASE_URL } = useConfig();
  const authController = useAuthController();
  const navigate = useNavigate();
  const [token, setToken] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  const getAuthDetails = useCallback(() => {
    setUserName(authController.user?.displayName ?? `user_${Date.now()}`);
    authController.getAuthToken().then((fetchedToken) => {
      setToken(fetchedToken);
    });
  }, [authController]);

  useEffect(() => {
    getAuthDetails();
  }, [getAuthDetails]);

  const storage = getStorage();

  const uploadImages = async (images: string[]): Promise<string[] | false> => {
    if (!images.length) {
      toast.error("No images to upload");
      return [];
    }
    const generateFileName = (index: number) =>
      `${userName}/parkingLots/parkingLotPhoto_${index}.jpg`;

    try {
      const uploadPromises = images.map(async (image, index) => {
        const fileName = generateFileName(index);
        const response = await fetch(image);
        const blob = await response.blob(); // Convert the image URL to a Blob
        const storageRef = ref(storage, fileName);
        const snapshot = await uploadBytes(storageRef, blob); // Upload the Blob
        return getDownloadURL(snapshot.ref);
      });

      const urls = await Promise.all(uploadPromises);
      console.log("All images uploaded successfully: ", urls);
      return urls; // Returns an array of URLs
    } catch (error) {
      console.error("Error uploading image: ", error);
      return false; // At least one upload failed
    }
  };
  //Handle the loading state of the form
  const [isUploading, setIsUploading] = useState(false);

  const LoadingOverlay = () => (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <span className="text-white loading loading-spinner loading-lg"></span>
    </div>
  );

  //Modal for submission completion
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 mt-10">
      {isUploading && <LoadingOverlay />}
      <div
        className={`items-center justify-center ${
          modeState.mode === "dark" ? "text-white" : "text-black"
        }`}
      >
        <ol className="items-center justify-center w-full space-y-4 sm:flex sm:space-x-8 sm:space-y-0 rtl:space-x-reverse">
          {stepComponents.map((step, index) => (
            <li
              key={index}
              className={`flex items-center cursor-pointer ${
                currentStep === index + 1
                  ? "text-black dark:text-white"
                  : "text-gray-400 dark:text-gray-400"
              } space-x-2.5 rtl:space-x-reverse`}
              onClick={() => setCurrentStep(index + 1)}
            >
              <span
                className="flex items-center justify-center w-8 h-8 border rounded-full shrink-0"
                style={{
                  borderColor:
                    currentStep === index + 1 ? "#3b82f6" : "#d1d5db",
                }}
              >
                {index + 1}
              </span>
              <span>
                <h3 className="font-medium leading-tight">{step.name}</h3>
              </span>
            </li>
          ))}
        </ol>
        <Formik
          initialValues={initialValues}
          onSubmit={function (
            values: ComprehensiveFormValues,
            actions: FormikHelpers<ComprehensiveFormValues>
          ): void | Promise<any> {
            if (currentStep < stepComponents.length) {
              setCurrentStep(currentStep + 1);
            } else {
              if (!isUploading) {
                setIsUploading(true);
                console.log(values);
                uploadImages(values.Images).then((urls) => {
                  if (urls) {
                    toast.success("Images uploaded successfully");
                    axios
                      .post(
                        `${BASE_URL}/create-parkingLot`,
                        {
                          body: {
                            ...values,
                            Images: urls,
                          },
                        },
                        {
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                          },
                        }
                      )
                      .then((response) => {
                        console.log(response);
                        toast.success("Parking Lot Created Successfully");
                        setShowSubmissionModal(true); // Show the modal here
                        setIsUploading(false);
                      })
                      .catch((error) => {
                        console.error(error);
                        toast.error("Error creating parking lot");
                        setIsUploading(false);
                      });
                    actions.setSubmitting(false);
                  } else {
                    toast.error("Error uploading images");
                    setIsUploading(false);
                  }
                });
              }
            }
            actions.setSubmitting(false);
          }}
          // Use zod resolver if a validation schema is provided
          validate={validateForm}
        >
          {(formikProps) => (
            <Form>
              <div className="flex flex-col  justify-center space-y-4 p-5">
                <div className="p-3">
                  {React.createElement(currentComponent)}
                </div>
                <div className="flex justify-between w-full">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className={`btn bg-red-500 text-black w-1/2 mr-2 ${
                      currentStep <= 1 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={currentStep <= 1}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={formikProps.isSubmitting || isUploading}
                    className="btn bg-blue-700 text-white w-1/2"
                  >
                    {currentStep === stepComponents.length ? "Submit" : "Next"}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      {/* Modal for submission completion */}
      {showSubmissionModal && (
        <Modal
          open={showSubmissionModal}
          onClose={() => navigate("/app/app/dashboard")}
        >
          <div className="text-center">
            <h3 className="mb-4">Form Submitted</h3>
            <p>
              Your form has been submitted. Once approved, it will be activated.
            </p>
            <button
              className="btn btn-primary mt-4"
              onClick={() => {
                setShowSubmissionModal(false);
                navigate("/app/app/dashboard");
              }}
            >
              Continue
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

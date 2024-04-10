import { useModeController } from "@firecms/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, Formik, FormikHelpers } from "formik";
import React, { useState } from "react";
import { useToaster } from "react-hot-toast";
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

export interface ComprehensiveFormValues {
  lotName: string;
  description: string;
  operatingHours: Array<{
    day: string;
    start: string;
    end: string;
  }>;
  images: string[];
  facilities: string[];
  address: {
    streetNumber?: string;
    unitNumber?: string;
    streetName: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    coordinates?: {
      latitute: number;
      longitude: number;
    };
    formattedAddress?: string;
  };
  slotsConfig: Array<{
    row: string;
    columns: number;
  }>;
  slotTypes: {
    handicapped?: string;
    electric?: string;
  };
  capacity: number;
  rates: Array<{
    rateType: string;
    rate: string;
    duration: string;
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

  const initialValues = {
    // Step 1: Basic Parking Lot Information
    lotName: "",
    description: "",
    facilities: [], // Array of facilities like 'EV Charging', 'CCTV' etc.
    operatingHours: [], // [day: Monday: start: "09:00", end: "17:00"...]
    images: [],

    //Step 2: Parking Location Configuration
    address: {
      streetNumber: "",
      unitNumber: "",
      streetName: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      coordinates: {
        latitute: 0,
        longitude: 0,
      },
      formattedAddress: "",
    },

    // Step 3: Parking Slot Configuration
    capacity: 0,
    slotsConfig: [],
    slotTypes: {
      handicapped: "",
      electric: "",
    },
    // Step 4: Parking Rates
    rates: [], // Array of rates like { rateType: "hour", rate: "5", duration: "1" }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 mt-10">
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
              console.log(values);
            }
            actions.setSubmitting(false);
          }}
          resolver={
            currentValidationSchema
              ? zodResolver(currentValidationSchema)
              : undefined
          }
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
                    className={`btn btn-secondary w-1/2 mr-2 ${
                      currentStep <= 1 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={currentStep <= 1}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={formikProps.isSubmitting}
                    className="btn btn-primary w-1/2"
                  >
                    {currentStep === stepComponents.length ? "Submit" : "Next"}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

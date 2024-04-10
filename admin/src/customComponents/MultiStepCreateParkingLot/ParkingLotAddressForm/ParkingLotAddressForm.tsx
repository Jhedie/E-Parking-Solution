import { Loader } from "@googlemaps/js-api-loader";
import { useFormikContext } from "formik";
import React, { useEffect, useState } from "react";
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import { z } from "zod";
export const ParkingLotAddressFormSchema = z.object({
  address: z.object({
    streetNumber: z.string().optional(),
    unitNumber: z.string().optional(),
    streetName: z.string().min(1, "Street Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    country: z.string().min(1, "Country is required"),
    postalCode: z.string().min(1, "Zip Code is required"),
    coordinates: z
      .object({
        latitute: z.number(),
        longitude: z.number(),
      })
      .optional(),
    formattedAddress: z.string().optional(),
  }),
});

const API_KEY = "AIzaSyDrEiBP1xoICRITuWU3OBRQwG-8nK5hhBE";
const loader = new Loader({
  apiKey: API_KEY,
  version: "weekly",
  libraries: ["places"],
});
export default function ParkingLotAddressForm() {
  const formikProps =
    useFormikContext<z.infer<typeof ParkingLotAddressFormSchema>>();
  const [placeSelected, setPlaceSelected] =
    useState<google.maps.places.PlaceResult | null>(null);

  const [locationSearch, setLocationSearch] = useState<string | "">("");

  function savePlaceDetailsToState(
    placeDetails: google.maps.places.PlaceResult | null
  ): void {
    setPlaceSelected(placeDetails);
  }

  const {
    placesService,
    placePredictions,
    getPlacePredictions,
    isPlacePredictionsLoading,
  } = usePlacesService({
    apiKey: loader.apiKey,
  });

  useEffect(() => {
    // fetch place details for the first element in placePredictions array
    if (placePredictions.length)
      placesService?.getDetails(
        {
          placeId: placePredictions[0].place_id,
        },
        (placeDetails: google.maps.places.PlaceResult | null) => {
          savePlaceDetailsToState(placeDetails);
        }
      );
  }, [placesService, placePredictions]);

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-4">Parking Address</h2>
      <div className="text-lg mb-4">
        Enter your address to see the drop down and choose your desired address
      </div>
      <div className="flex w-full mb-4">
        <label className="w-full my-0 py-0 flex-1">
          <input
            type="text"
            name="locationSearch"
            placeholder="Search for a location"
            value={locationSearch}
            onChange={(e) => {
              setLocationSearch(e.target.value);
              getPlacePredictions({ input: e.target.value });
            }}
            className="input input-bordered bg-white w-full"
          />

          {!isPlacePredictionsLoading && locationSearch !== "" && (
            <div className="mt-5 w-50 h-50 flex flex-col mb-25">
              {placePredictions.map((item) => (
                <div
                  key={item.place_id}
                  className="cursor-pointer p-2 hover:bg-gray-100"
                  onClick={() => {
                    setLocationSearch(item.description);
                  }}
                >
                  {item.description}
                </div>
              ))}
            </div>
          )}
        </label>
        <div className="flex-none ml-4">
          <button
            type="button" // Ensure the button does not submit a form unintentionally
            className="btn btn-primary"
            disabled={locationSearch === ""}
            onClick={(e) => {
              e.preventDefault(); // Prevent default action that might cause navigation

              console.log(placeSelected);

              formikProps.setFieldValue(
                "address.formattedAddress",
                placeSelected?.formatted_address
              );
              placeSelected?.address_components?.forEach((component) => {
                const type = component.types[0];
                switch (type) {
                  case "street_number":
                    formikProps.setFieldValue(
                      "address.streetNumber",
                      component.long_name
                    );
                    break;
                  case "premise": {
                    const currentAddressName =
                      formikProps.values.address.unitNumber;
                    formikProps.setFieldValue(
                      "address.unitNumber",
                      currentAddressName === ""
                        ? component.long_name
                        : `${component.long_name}, ${currentAddressName}`
                    );
                    break;
                  }
                  case "route":
                    formikProps.setFieldValue(
                      "address.streetName",
                      component.long_name
                    );
                    break;
                  case "postal_town":
                    formikProps.setFieldValue(
                      "address.city",
                      component.long_name
                    );
                    break;
                  case "administrative_area_level_2": {
                    const currentCity = formikProps.values.address.city;
                    if (
                      currentCity === "" &&
                      component.long_name === "Greater London"
                    ) {
                      formikProps.setFieldValue("address.city", "London");
                    } else {
                      formikProps.setFieldValue(
                        "address.city",
                        component.long_name
                      );
                    }
                    break;
                  }
                  case "neighborhood":
                    if (formikProps.values.address.city === "")
                      formikProps.setFieldValue(
                        "address.city",
                        component.long_name
                      );
                    break;
                  case "country":
                    formikProps.setFieldValue(
                      "address.country",
                      component.long_name
                    );
                    break;
                  case "postal_code":
                    formikProps.setFieldValue(
                      "address.postalCode",
                      component.long_name
                    );
                    break;
                  default:
                    console.log("irrelevant component type");
                    break;
                }
              });

              const coordinates = placeSelected?.geometry?.location;
              // Set the formik values for latitude and longitude to be used later
              if (coordinates) {
                formikProps.setFieldValue(
                  "address.coordinates.latitute",
                  coordinates.lat()
                );
                formikProps.setFieldValue(
                  "address.coordinates.longitude",
                  coordinates.lng()
                );
              }
              setLocationSearch("");
            }}
          >
            Fill Address
          </button>
        </div>
      </div>
      <div className="flex flex-col mb-4">
        <label className="flex items-center mb-4">
          <input
            type="text"
            name="streetNumber"
            placeholder="Street Number"
            onChange={formikProps.handleChange}
            onBlur={formikProps.handleBlur}
            value={formikProps.values.address.streetNumber}
            className="w-full input input-bordered bg-white p-3"
          />
        </label>

        <label className="flex items-center mb-4">
          <input
            type="text"
            name="address.unitNumber"
            placeholder="Unit Number"
            onChange={formikProps.handleChange}
            onBlur={formikProps.handleBlur}
            value={formikProps.values.address.unitNumber}
            className="w-full input input-bordered bg-white p-3"
          />
        </label>

        <label className="flex items-center mb-4">
          <input
            type="text"
            name="address.streetName"
            placeholder="Street Name"
            onChange={formikProps.handleChange}
            onBlur={formikProps.handleBlur}
            value={formikProps.values.address.streetName}
            className="w-full input input-bordered bg-white p-3"
          />
        </label>

        <label className="flex items-center mb-4">
          <input
            type="text"
            name="address.city"
            placeholder="City"
            onChange={formikProps.handleChange}
            onBlur={formikProps.handleBlur}
            value={formikProps.values.address.city}
            className="w-full input input-bordered bg-white p-3"
          />
        </label>

        {/* state */}
        <label className="flex items-center mb-4">
          <input
            type="text"
            name="address.state"
            placeholder="State"
            onChange={formikProps.handleChange}
            onBlur={formikProps.handleBlur}
            value={formikProps.values.address.state}
            className="w-full input input-bordered bg-white p-3"
          />
        </label>

        <label className="flex items-center mb-4">
          <input
            type="text"
            name="address.postalCode"
            placeholder="Postal Code"
            onChange={formikProps.handleChange}
            onBlur={formikProps.handleBlur}
            value={formikProps.values.address.postalCode}
            className="w-full input input-bordered bg-white p-3"
          />
        </label>
        <label className="flex items-center">
          <input
            type="text"
            name="address.country"
            placeholder="Country"
            onChange={formikProps.handleChange}
            onBlur={formikProps.handleBlur}
            value={formikProps.values.address.country}
            className="w-full input input-bordered bg-white p-3"
          />
        </label>
      </div>
    </div>
  );
}

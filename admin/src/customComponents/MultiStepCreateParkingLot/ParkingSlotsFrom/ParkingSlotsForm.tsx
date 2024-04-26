import { FieldArray, useFormikContext } from "formik";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";

export const ParkingSlotsFormSchema = z.object({
  SlotsConfig: z
    .array(
      z.object({
        row: z.string(),
        columns: z.number(),
      })
    )
    .min(1, "At least one row is required"),
  SlotTypes: z.object({
    disabled: z.string().optional(),
    electric: z.string().optional(),
  }),
  Capacity: z.number(),
});

export type slotTypes = "disabled" | "electric";

export default function ParkingSlotsForm() {
  const formikProps =
    useFormikContext<z.infer<typeof ParkingSlotsFormSchema>>();
  const slotTypesArray: slotTypes[] = ["disabled", "electric"];

  // State to track selected rows for each type
  const [selectedTypes, setSelectedTypes] = useState<
    Record<string, string | null>
  >({
    disabled: null,
    electric: null,
  });

  // Function to handle selection change
  // This function updates the selectedTypes state with the selected row for a given parking slot type
  const handleTypeSelection = (type: slotTypes, rowLetter: string) => {
    setSelectedTypes((previousSelection) => ({
      ...previousSelection,
      [type]: rowLetter,
    }));
    formikProps.setFieldValue(`SlotTypes.${type}`, rowLetter);
  };

  // Function to add a new row with the next letter in the alphabet
  const addRow = () => {
    const rows = formikProps.values.SlotsConfig || [];
    const lastRow = rows[rows.length - 1];
    if (lastRow && lastRow.row === "F") {
      toast.error("Maximum of 6 rows allowed", { duration: 2000 });
      return;
    }
    const nextLetter = lastRow
      ? String.fromCharCode(lastRow.row.charCodeAt(0) + 1)
      : "A";
    const newRow = { row: nextLetter, columns: 1 };
    formikProps.setFieldValue("SlotsConfig", [...rows, newRow]);
  };

  const [capacity, setCapacity] = useState(0);

  // Calculate the total capacity of the parking lot when the number of columns in a row changes
  useEffect(() => {
    const rows = formikProps.values.SlotsConfig || [];
    const totalColumns = rows.reduce((acc, row) => acc + row.columns, 0);

    // Check if the new capacity is different from the current one
    if (formikProps.values.Capacity !== totalColumns) {
      formikProps.setFieldValue("Capacity", totalColumns);
    }
    setCapacity(totalColumns);
  }, [formikProps]);

  return (
    <div className="flex flex-col items-center">
      <div className="text-lg mb-4">
        Each row has a number of columns or parking slots
      </div>
      <div className="flex flex-col justify-between">
        <div className="flex justify-between m-5">
          <FieldArray
            name="SlotsConfig"
            render={(arrayHelpers) => (
              <div className="w-full">
                <div className="flex justify-start w-full">
                  <div className="w-1/2 text-center font-bold">Rows</div>
                  <div className="w-1/2 text-center font-bold">Columns</div>
                </div>
                {formikProps.values.SlotsConfig &&
                formikProps.values.SlotsConfig.length > 0 ? (
                  formikProps.values.SlotsConfig.map((config, index) => (
                    <fieldset
                      key={index}
                      className="mb-4 flex justify-between items-center"
                    >
                      <div className="flex justify-between w-full">
                        <label className="text-center bg-gray-200 p-2 rounded w-1/2">
                          {config.row}
                        </label>
                        <label className="flex justify-center items-end">
                          <input
                            type="number"
                            name={`SlotsConfig[${index}].columns`}
                            placeholder="Columns"
                            onChange={formikProps.handleChange}
                            value={config.columns}
                            className=" w-1/2 input input-bordered bg-white p-3 ml-2 text-center"
                            min="1" // Ensure negative numbers are not allowed
                          />
                        </label>
                      </div>
                    </fieldset>
                  ))
                ) : (
                  <div className="flex justify-center items-center">
                    <p>No rows added yet.</p>
                    {formikProps.touched.SlotsConfig &&
                      formikProps.errors.SlotsConfig && (
                        <div
                          className="tooltip tooltip-open tooltip-warning tooltip-right"
                          data-tip={formikProps.errors.SlotsConfig}
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
                  </div>
                )}
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => addRow()}
                    className="btn btn-secondary btn-outline mt-2 w-1/2"
                  >
                    Add Row
                  </button>
                  <button
                    type="button"
                    onClick={() => arrayHelpers.remove(-1)}
                    className="btn btn-warning btn-outline mt-2 ml-2 w-1/2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          />
        </div>
        <div className="flex flex-col justify-between m-5 items-center">
          <legend className="text-center font-bold mr-3 mb-2">
            Total Capacity
          </legend>
          <div className="flex  w-96 p-3  bg-white border border-gray-200 rounded justify-center">
            <span className="text-center">{capacity}</span>
          </div>
        </div>

        <div className="flex flex-col justify-between m-5 items-center">
          <legend className="text-center font-bold mr-3 mb-2">
            Slot Types per Row
          </legend>

          {slotTypesArray.map((type: slotTypes) => (
            <div key={type} className="w-full flex items-center mb-2">
              {/* Select the row for the slot type */}
              <div className="font-semibold mb-2 w-1/2">
                {type.charAt(0).toUpperCase() + type.slice(1)}:
              </div>

              <select
                className="select select-bordered items-center w-1/2 bg-white"
                value={formikProps.values.SlotTypes[type] || ""}
                onChange={(e) => handleTypeSelection(type, e.target.value)}
              >
                <option disabled value="">
                  {capacity > 0 ? "Select a row" : "Add rows first"}
                </option>
                {formikProps.values.SlotsConfig.filter(
                  (config) =>
                    !Object.values(formikProps.values.SlotTypes).includes(
                      config.row
                    ) || formikProps.values.SlotTypes[type] === config.row
                ).map((config, index) => (
                  <option
                    key={index}
                    value={config.row}
                    className="text-center "
                  >
                    {config.row}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

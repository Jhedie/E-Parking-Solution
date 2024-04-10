import { FieldArray, useFormikContext } from "formik";
import { z } from "zod";
export const ParkingRatesFormSchema = z.object({
  rates: z.array(
    z.object({
      rateType: z.enum(["minute", "hour", "day", "week", "month", "year"]),
      rate: z.string().min(1, "Rate is required"),
      duration: z.string().min(1, "Duration is required"),
    })
  ),
});

export type ParkingLotRateType =
  | "minute"
  | "hour"
  | "day"
  | "week"
  | "month"
  | "year"
  | null;
export default function ParkingRatesForm() {
  const formikProps =
    useFormikContext<z.infer<typeof ParkingRatesFormSchema>>();
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center">
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Parking Rates Configuration
          </h2>
          <p className="text-lg mb-4">
            Here you can add different rates for your parking lot. Add a rate
            type, specify the duration and price/rate.
          </p>
        </div>
        {/* FieldArray component is used to manage an array of form fields source: https://formik.org/docs/api/fieldarray*/}
        <FieldArray name="rates">
          {/* remove and push are functions to add and remove rates */}
          {({ remove, push }) => (
            <div>
              {(
                ["minute", "hour", "day", "week", "month", "year"] as const
              ).map((rateType, index) => (
                <div key={index} className="flex flex-col m-2">
                  <button
                    type="button"
                    className="btn btn-secondary btn-outline m-1"
                    onClick={() => push({ rateType, rate: "", duration: "" })}
                  >
                    Add {rateType} Rate
                  </button>
                  {formikProps.values.rates
                    .map((rate, index) => ({ ...rate, actualIndex: index })) // Add actual index to each rate
                    .filter((rate) => rate.rateType === rateType) // Filter rates by rateType
                    .map((rate, rateIndex) => (
                      <div
                        key={rate.actualIndex} // Use actualIndex for key to ensure uniqueness
                        className="flex flex-row items-center m-2"
                      >
                        <input
                          type="text"
                          name={`rates[${rate.actualIndex}].duration`}
                          placeholder={`Duration in ${rateType}s`}
                          onChange={formikProps.handleChange}
                          value={rate.duration}
                          className="input input-bordered mr-2 bg-white"
                        />
                        <input
                          type="number"
                          name={`rates[${rate.actualIndex}].rate`}
                          placeholder="£ Rate Number"
                          onChange={formikProps.handleChange}
                          value={rate.rate}
                          className="input input-bordered mr-2 bg-white"
                          min="0.01"
                          step="0.01"
                        />
                        <button
                          type="button"
                          className="btn btn-warning btn-xs"
                          onClick={() => remove(rate.actualIndex)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          )}
        </FieldArray>
      </div>
    </div>
  );
}

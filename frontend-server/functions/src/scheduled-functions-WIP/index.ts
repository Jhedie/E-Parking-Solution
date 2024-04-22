import { ScheduleOptions } from "firebase-functions/v2/scheduler";
import { ReservationScheduledFunctions } from "./by-reservations/reservation-scheduled-functions";
import {
  InitializeScheduledFunctions,
  ScheduledFunction as ScheduledFunctionType,
} from "./initialize-scheduled-functions";

/**
 * List of scheduled task initializers.
 *
 * To add a new scheduled task initializer, import it and add it to this list.
 */
const scheduledTaskInitializers: Array<InitializeScheduledFunctions> = [
  new ReservationScheduledFunctions(),
  // Add other initializers as needed
];

/**
 * Initializes and returns the scheduled tasks.
 *
 * This function iterates over the list of scheduled task initializers and calls their initialize method.
 * The initialize method is passed a function that adds the scheduled task to the result object.
 *
 * @returns {object} An object where the keys are the schedule strings and the values are the scheduled task handlers.
 */
// Exporting the scheduledTasks as a constant
export function initializeScheduledTasks(): object {
  const res: object = {};
  for (let initializer of scheduledTaskInitializers) {
    initializer.initialize((params: ScheduledFunctionType) => {
      // Some events are straightforward and happen at regular intervals (like "every 1 minute"),
      // which is handled as a simple string. Others might need more complex scheduling options (like "every Monday at 3 PM").
      // The coordinator (current function) checks if the event's schedule is a simple string or needs more detailed options and adds them to the master schedule accordingly.
      if (typeof params.schedule === "string") {
        // Assuming the handler is directly using a string for the schedule
        res[params.schedule] = {
          schedule: params.schedule,
          handler: params.handler,
        };
      } else {
        // Handling ScheduleOptions type for schedule
        const scheduleOptions: ScheduleOptions =
          params.schedule as ScheduleOptions;
        res[scheduleOptions.schedule] = {
          schedule: scheduleOptions.schedule,
          handler: params.handler,
        };
      }
    });
  }
  console.log("Scheduled tasks initialized", res);
  return res;
}

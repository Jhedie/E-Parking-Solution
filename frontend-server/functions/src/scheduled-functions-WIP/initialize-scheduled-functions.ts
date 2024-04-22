import {
  ScheduleOptions,
  ScheduledEvent,
} from "firebase-functions/v2/scheduler";

/**
 * Type for a scheduled function in Firebase Cloud Functions.
 *
 * @typedef {Object} ScheduledFunction
 * @property {ScheduleOptions | string} schedule - The schedule on which the function runs, in Unix Crontab or AppEngine syntax, or options including the schedule.
 * @property {(event: ScheduledEvent) => void | Promise<void>} handler - The Cloud Function handler for the scheduled task.
 */
export type ScheduledFunction = {
  schedule: ScheduleOptions | string;
  handler: (event: ScheduledEvent) => void | Promise<void>;
};

/** Type for a function that adds a scheduled function.
 * @typedef {Function} AddScheduledFunction
 * @param {ScheduledFunction} params - The scheduled function to add.
 */
export type AddScheduledFunction = (params: ScheduledFunction) => void;

/**
 * Interface for an object that initializes scheduled functions.
 *
 * @interface InitializeScheduledFunctions
 */
export interface InitializeScheduledFunctions {
  initialize(add: AddScheduledFunction): void;
}

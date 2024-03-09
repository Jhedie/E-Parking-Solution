import { CloudFunction } from "firebase-functions/lib/v2";

/**
 * Type for an event trigger function in Firebase Cloud Functions.
 *
 * @typedef {Object} EventTriggerV2Function
 * @property {string} name - The name of the function.
 * @property {CloudFunction<any>} handler - The CloudFunction handler for the function.
 */
export type EventTriggerV2Function = {
  name: string;
  handler: CloudFunction<any>;
};

/**
 * Type for a function that adds an event trigger.
 *
 * @typedef {Function} AddEventTrigger
 * @param {EventTriggerV2Function} params - The event trigger function to add.
 */
export type AddEventTrigger = (params: EventTriggerV2Function) => void;

/**
 * Interface for an object that initializes event triggers.
 *
 * @interface InitializeEventTriggers
 */
export interface InitializeEventTriggers {
  initialize(add: AddEventTrigger): void;
}

import { UsersEventTriggers } from "./by-document/users-event-triggers";
import { InitializeEventTriggers } from "./initialize-event-triggers";

/**
 * List of event trigger initializers.
 *
 * To add a new event trigger initializer, import it and add it to this list.
 */
const eventTriggerList: Array<InitializeEventTriggers> = [
  new UsersEventTriggers(),
];

/**
 * Initializes and returns the event triggers.
 *
 * This function iterates over the list of event trigger initializers and calls their initialize method.
 * The initialize method is passed a function that adds the event trigger to the result object.
 *
 * @returns {object} An object where the keys are event trigger names and the values are event trigger handlers.
 */
export function eventTriggers(): object {
  const res: object = {};
  for (let v2 of eventTriggerList) {
    v2.initialize((params) => {
      res[params.name] = params.handler;
    });
  }
  return res;
}

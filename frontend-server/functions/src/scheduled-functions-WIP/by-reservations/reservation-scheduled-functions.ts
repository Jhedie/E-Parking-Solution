import {
  AddScheduledFunction,
  InitializeScheduledFunctions,
  ScheduledFunction,
} from "../initialize-scheduled-functions";

export class ReservationScheduledFunctions
  implements InitializeScheduledFunctions
{
  initialize(add: AddScheduledFunction): void {
    add(this.updateReservationStatuses);
  }

  private readonly updateReservationStatuses: ScheduledFunction = {
    schedule: "every 5 minutes",
    handler: async () => {
      return console.log(
        "this is a scheduled function to update reservation statuses"
      );
    },
  };
}

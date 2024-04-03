import { buildCollection } from "@firecms/core";

export const DbChangesCollection = buildCollection({
  id: "db-changes",
  name: "Db Changes",
  path: "db-changes",
  icon: "storage",
  properties: {
    description: {
      dataType: "string",
      name: "Description",
      validation: {
        required: true,
      },
    },
    dateTime: {
      dataType: "date",
      name: "DateTime",
      validation: {
        required: true,
      },
    },
    recordId: {
      dataType: "string",
      name: "RecordId",
      validation: {
        required: true,
      },
    },
    uid: {
      dataType: "string",
      readOnly: true,
      name: "Uid",
      validation: {
        required: true,
      },
    },
    code: {
      dataType: "string",
      enumValues: [
        {
          id: "PARKING_LOT_CREATED",
          label: "PARKING LOT CREATED",
        },
        {
          id: "PARKING_LOT_UPDATED",
          label: "PARKING LOT UPDATED",
        },
        {
          id: "USER_CREATED",
          label: "USER CREATED",
        },
      ],
      name: "Code",
      validation: {
        required: true,
      },
    },
  },
});

import { useFireCMSContext } from "@firecms/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ParkingLotRates } from "../../collections/parkingLotRates";
import { ParkingLot } from "../../collections/parkingLots";
import { ParkingReservation } from "../../collections/parkingReservations";
import { ParkingSlots } from "../../collections/parkingSlots";
import Modal from "../../helpers/Modal";

type ParkingLotData = {
  id: string;
  path: string;
  values: ParkingLot;
};

type ParkingSlotData = {
  id: string;
  path: string;
  values: ParkingSlots;
  reservations: ParkingReservationData[];
};
type ParkingLotRatesData = {
  id: string;
  path: string;
  values: ParkingLotRates;
};

type ParkingReservationData = {
  id: string;
  path: string;
  values: ParkingReservation;
};
type ParkingLotFullDetails = {
  id: string;
  path: string;
  values: ParkingLot;
  slots: ParkingSlotData[];
  rates: ParkingLotRatesData[];
};

const Dashboard = () => {
  const { dataSource, authController } = useFireCMSContext();
  const [parkingLots, setParkingLots] = useState<ParkingLotData[]>([]);
  const [activeParkingLotId, setActiveParkingLotId] = useState<string>("");
  const [activeTab, setActiveTab] = useState("overview");
  const [parkingLotFullDetails, setParkingLotFullDetails] = useState<
    ParkingLotFullDetails[]
  >([]);

  const BASE_URL = import.meta.env.VITE_FRONTEND_SERVER_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    dataSource
      .fetchCollection({
        path: `parkingOwner/${authController.user?.uid}/parkingLots`,
      })
      .then((data: ParkingLotData[]) => {
        console.log("Parking lots", data);
        setParkingLots(data);
        setActiveParkingLotId(data[0]?.id);
        Promise.all(
          data.map((parkingLot) =>
            Promise.all([
              dataSource.fetchCollection({
                path: `parkingOwner/${authController.user?.uid}/parkingLots/${parkingLot.id}/parkingSlots`,
              }),
              dataSource.fetchCollection({
                path: `parkingOwner/${authController.user?.uid}/parkingLots/${parkingLot.id}/parkingLotRates`,
              }),
            ]).then(async ([slots, rates]) => {
              const slotsWithReservations = Promise.all(
                slots.map((slot) =>
                  dataSource
                    .fetchCollection({
                      path: `parkingOwner/${authController.user?.uid}/parkingLots/${parkingLot.id}/parkingSlots/${slot.id}/parkingReservations`,
                    })
                    .then((reservations) => ({ ...slot, reservations }))
                )
              );
              return slotsWithReservations.then((slots) => ({
                ...parkingLot,
                slots,
                rates,
              }));
            })
          )
        ).then((parkingLotsDetails) => {
          console.log("Parking lots with slots and rates", parkingLotsDetails);

          setParkingLotFullDetails(parkingLotsDetails);
        });
      });
  }, [dataSource, authController.user?.uid]);

  const getColumns = (currentParkingLot: ParkingLotFullDetails) => {
    const newColumns = [
      ...new Set(
        parkingLotFullDetails.flatMap(() =>
          currentParkingLot.slots.map((slot) => slot.values.position.row)
        )
      ),
    ].sort((a, b) => a.localeCompare(b));
    return newColumns;
  };

  const handleSlotClick = (slot: ParkingSlotData) => {
    alert(
      `slotPosition: ${slot.values.position.row} ${slot.values.position.column}
      slotType: ${slot.values.type}
      slotReservations: ${slot.reservations.length}
      `
    );
  };

  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  // Dynamically generate parking spots based on row positions and sort by columns
  const generateParkingSlots = (row: string) => {
    //Filter out parking slots for the current row
    const slots = parkingLotFullDetails
      .find((lot) => lot.id === activeParkingLotId)
      ?.slots.filter((slot) => slot.values.position.row === row)
      .sort((a, b) => a.values.position.column - b.values.position.column);

    return (
      <div>
        {slots?.map((slot) => (
          <button
            key={slot.id}
            onClick={() => handleSlotClick(slot)}
            className={`card shadow-xl m-4 flex flex-col items-center p-6 w-32 h-22 ${
              slot.values.status === "Occupied"
                ? "bg-red-500" // Occupied slots
                : slot.values.status === "Available" &&
                  slot.values.type === "electric"
                ? "bg-green-500" // Electric slots that are available
                : slot.values.status === "Available" &&
                  slot.values.type === "disabled"
                ? "bg-blue-500" // Disabled slots that are available
                : slot.values.status === "Reserved"
                ? "bg-yellow-500" // Reserved slots
                : slot.values.status === "Available"
                ? "bg-white" // Available slots (default available color)
                : "bg-gray-500" // Default or other statuses
            }`}
          >
            <div className="text-center text-base font-semibold">
              {slot.values.position.row}
              {slot.values.position.column}
            </div>
          </button>
        ))}
      </div>
    );
  };

  const renderParkingLotDetails = (parkingLot: ParkingLotFullDetails) => {
    switch (activeTab) {
      case "overview":
        return (
          <div>
            <div className="text-2xl font-bold m-10">Overview</div>
            <div className="flex flex-row justify-between gap-4">
              <div className="card bg-white shadow-xl p-4 flex-1">
                <h3 className="font-semibold text-lg">Total slots</h3>
                <p className="text-xl font-bold">{parkingLot?.slots.length}</p>
              </div>
              <div className="card bg-white shadow-xl p-4 flex-1">
                <h3 className="font-semibold text-lg">Available slots</h3>
                <p className="text-xl font-bold">{parkingLot?.slots.length}</p>
              </div>
              <div className="card bg-white shadow-xl p-4 flex-1">
                <h3 className="font-semibold text-lg">Occupied slots</h3>
                <p className="text-xl font-bold">
                  {parkingLot?.values?.Occupancy}
                </p>
              </div>
            </div>

            <div className="card bg-white shadow-xl p-4 flex mt-4">
              <h3 className="font-semibold text-lg">Actions</h3>
              {/* <button
                className="btn mt-2 bg-red-300 hover:bg-red-500"
                onClick={() => {
                  authController.getAuthToken().then((token: string) => {
                    axios
                      .delete(
                        `${BASE_URL}/parkingLot/${parkingLot.values.LotId}`,
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        }
                      )
                      .then(() => {
                        toast.success(
                          `Parking lot: ${parkingLot.values.LotName} has been deleted successfully!`
                        );
                      })
                      .catch((error: any) => {
                        toast.error(
                          `Failed to delete parking lot ${parkingLot.values.LotName}: ${error}`
                        );
                      });
                  });
                }}
              >
                Delete Parking Lot
              </button> */}

              <button
                className="btn mt-2 bg-red-300 hover:bg-red-500"
                onClick={() => {
                  navigate(`/app/c/parkingOwner/${parkingLot.id}`);
                }}
              >
                Manage
              </button>
            </div>
          </div>
        );
      case "slots":
        return (
          <div>
            <div className="text-2xl font-bold m-10">Parking Slots</div>
            <div className="flex gap-4">
              {getColumns(parkingLot).map((row) => (
                <div key={row} className="flex flex-col items-center">
                  <div className="font-bold text-lg"> {row}</div>
                  {generateParkingSlots(row)}
                </div>
              ))}
            </div>
            <div className="flex justify-around w-full mt-4 flex-col">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-blue-500"></div>
                <span className="ml-2">Disabled</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-green-500"></div>
                <span className="ml-2">Electric</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-gray-500"></div>
                <span className="ml-2">Regular</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-red-500"></div>
                <span className="ml-2">Unavailable/Occupied</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-yellow-500"></div>
                <span className="ml-2">Reserved</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-white border border-gray-400"></div>
                <span className="ml-2">Available</span>
              </div>
            </div>

            {showSubmissionModal && (
              <Modal
                open={showSubmissionModal}
                onClose={() => setShowSubmissionModal(false)}
              >
                <div className="text-center">
                  {/* <p>Total Reservations: {parkingLot.slots..length}</p>
                  <p>Slot Type: {selectedSlot.type}</p> */}
                </div>
              </Modal>
            )}
          </div>
        );
      // case "reservations":
      // return (
      //   <div>
      //     <div className="text-2xl font-bold m-10">Parking reservations</div>
      //     <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      //       <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      //         <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      //           <tr>
      //             <th scope="col" className="px-6 py-3">
      //               Reservation ID
      //             </th>
      //             <th scope="col" className="px-6 py-3">
      //               User ID
      //             </th>
      //             <th scope="col" className="px-6 py-3">
      //               Slot ID
      //             </th>
      //             <th scope="col" className="px-6 py-3">
      //               Lot ID
      //             </th>
      //             <th scope="col" className="px-6 py-3">
      //               Start Time
      //             </th>
      //             <th scope="col" className="px-6 py-3">
      //               End Time
      //             </th>
      //             <th scope="col" className="px-6 py-3">
      //               Status
      //             </th>

      //             <th scope="col" className="px-6 py-3">
      //               Total Amount
      //             </th>
      //             <th scope="col" className="px-6 py-3">
      //               Actions
      //             </th>
      //           </tr>
      //         </thead>
      //         <tbody>
      //           {/* If there are no slots or all slots are empty first */}
      //           {parkingLot.slots.length === 0 ||
      //           parkingLot.slots.every(
      //             (slot) => slot.reservations.length === 0
      //           ) ? (
      //             <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
      //               <td colSpan={111} className="px-6 py-4 text-center">
      //                 No slots available
      //               </td>
      //             </tr>
      //           ) : (
      //             parkingLot.slots.map((slot) =>
      //               slot.reservations.map((reservation, index) => (
      //                 <tr
      //                   key={index}
      //                   className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
      //                 >
      //                   <td className="w-4 p-4">
      //                     <div className="flex items-center">
      //                       <input
      //                         id={`checkbox-${reservation.id}`}
      //                         type="checkbox"
      //                         className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
      //                       />
      //                       <label
      //                         htmlFor={`checkbox-${reservation.id}`}
      //                         className="sr-only"
      //                       >
      //                         checkbox
      //                       </label>
      //                     </div>
      //                   </td>
      //                   <th
      //                     scope="row"
      //                     className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      //                   >
      //                     {reservation.id}
      //                   </th>
      //                   <td className="px-6 py-4">
      //                     {reservation.values.userId}
      //                   </td>
      //                   <td className="px-6 py-4">
      //                     {reservation.values.slotId}
      //                   </td>
      //                   <td className="px-6 py-4">
      //                     {reservation.values.lotId}
      //                   </td>
      //                   <td className="px-6 py-4">
      //                     {reservation.values.startTime.toLocaleString()}
      //                   </td>
      //                   <td className="px-6 py-4">
      //                     {reservation.values.endTime.toLocaleString()}
      //                   </td>
      //                   <td className="px-6 py-4">
      //                     {reservation.values.parkingStatus}
      //                   </td>

      //                   <td className="px-6 py-4">
      //                     {reservation.values.totalAmount}
      //                   </td>
      //                   <td className="flex items-center px-6 py-4">
      //                     <a
      //                       href="#"
      //                       className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
      //                     >
      //                       Edit
      //                     </a>
      //                     <a
      //                       href="#"
      //                       className="font-medium text-red-600 dark:text-red-500 hover:underline ms-3"
      //                     >
      //                       Remove
      //                     </a>
      //                   </td>
      //                 </tr>
      //               ))
      //             )
      //           )}
      //         </tbody>
      //       </table>
      //     </div>
      //   </div>
      // );
      case "information":
        return (
          <div className="space-y-4 m-10">
            <div className="text-2xl font-bold">Parking Lot Information</div>
            <div className="card bg-white shadow-xl p-4">
              <h3 className="font-semibold">General Details</h3>
              <div className="card-body">
                <p>
                  <span className="font-semibold">Lot Name:</span>{" "}
                  {parkingLot.values.LotName}
                </p>
                <p>
                  <span className="font-semibold">Description:</span>{" "}
                  {parkingLot.values.Description}
                </p>
              </div>
            </div>
            <div className="card bg-white shadow-xl p-4">
              <h3 className="font-semibold">Location Details</h3>
              <div className="card-body">
                <p>
                  <span className="font-semibold">Address:</span>{" "}
                  {`${parkingLot.values.Address.formattedAddress}`}
                </p>
              </div>
            </div>

            <div className="card bg-white shadow-xl p-4">
              <h3 className="font-semibold">Operational Details</h3>
              <div className="card-body">
                <p>
                  <span className="font-semibold">Operating Hours:</span>
                </p>
                <ul>
                  {parkingLot.values.OperatingHours.map((hour, index) => (
                    <li
                      key={index}
                    >{`${hour.day}: ${hour.start} - ${hour.end}`}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="card bg-white shadow-xl p-4">
              <h3 className="font-semibold">Rates</h3>
              <div className="card-body">
                <ul>
                  {parkingLot.rates.length === 0 ? (
                    <li>No rates specified</li>
                  ) : (
                    parkingLot.rates.map((rate, index) => (
                      <li
                        key={index}
                      >{`Type: ${rate.values.rateType}, Rate: ${rate.values.rate}, Duration: ${rate.values.duration}`}</li>
                    ))
                  )}
                </ul>
              </div>
            </div>
            <div className="card bg-white shadow-xl p-4">
              <h3 className="font-semibold">Images</h3>
              <div className="card-body">
                {parkingLot.values.Images.length === 0 ? (
                  <p>No images available</p>
                ) : (
                  <div className="flex flex-wrap">
                    {parkingLot.values.Images.map((image, index) => (
                      <div key={index} className="w-1/4 p-1">
                        <img
                          src={image}
                          alt={`Parking Lot Image ${index + 1}`}
                          className="rounded-lg shadow-md"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      default:
        return <div>No content</div>;
    }
  };

  return (
    <div className="flex min-h-full">
      <div className="flex flex-grow  justify-center p-4 min-h-full">
        <div className="md:flex flex-col items-center">
          <h1 className="text-2xl font-bold mt-10">Parking Lots</h1>
          <div className="flex justify-end items-center mt-10">
            <button
              className="btn btn-secondary mr-2"
              onClick={() => {
                navigate("/app/createParkingLot");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6 inline-block"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add Parking Lot
            </button>
          </div>
          {/* Vertical tabs */}
          <ul className="flex flex-col space-y-2 text-sm font-medium text-black-500 dark:text-gray-4000 m-10">
            {parkingLots.map((parkingLot: any) => (
              <li
                key={parkingLot.id}
                onClick={() => {
                  setActiveParkingLotId(parkingLot.id);
                  setActiveTab("overview"); // Set the default tab when selecting a new parking lot
                }}
                className={`inline-flex items-center justify-center px-4 py-3 w-full rounded-lg cursor-pointer ${
                  activeParkingLotId === parkingLot.id
                    ? "text-white bg-blue-700 dark:bg-blue-600"
                    : "hover:text-gray-900 bg-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
                }`}
              >
                {parkingLot.values.LotName}
                {parkingLot.values.Status === "Inactive" ? (
                  <span
                    className="ml-2 tooltip"
                    data-tip="Inactive: Needs approval"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5 text-red-400 ml-auto"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 00-2 0v3a1 1 0 002 0V6zm-1 8a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                ) : (
                  <span className="ml-2 tooltip" data-tip="Active">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5 text-green-500 ml-auto"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 0a10 10 0 110 20 10 10 0 010-20zm4.5 7.5a.75.75 0 00-1.06-1.06l-4.5 4.5-2.25-2.25a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l5-5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
        {/* Tab content */}
        <div className="flex-grow bg-gray-50 dark:bg-gray-800 p-6">
          {activeParkingLotId && (
            <div>
              {/* Horizontal tabs navigation */}
              <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
                <ul className="flex flex-wrap -mb-px text-sm font-semibold text-center">
                  <li className="mr-2" role="presentation">
                    <button
                      className={` inline-block p-4 rounded-t-lg ${
                        activeTab === "overview"
                          ? "text-blue-700 border-b-2 border-blue-700"
                          : "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                      }`}
                      onClick={() => setActiveTab("overview")}
                    >
                      Overview
                    </button>
                  </li>
                  <li className="mr-2" role="presentation">
                    <button
                      className={`inline-block p-4 rounded-t-lg ${
                        activeTab === "slots"
                          ? "text-blue-700 border-b-2 border-blue-700"
                          : "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                      }`}
                      onClick={() => setActiveTab("slots")}
                    >
                      Slots
                    </button>
                  </li>
                  {/* <li className="mr-2" role="presentation">
                    <button
                      className={`inline-block p-4 rounded-t-lg ${
                        activeTab === "reservations"
                          ? "text-blue-700 border-b-2 border-blue-700"
                          : "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                      }`}
                      onClick={() => setActiveTab("reservations")}
                    >
                      Parking Reservations
                    </button>
                  </li> */}
                  <li className="mr-2" role="presentation">
                    <button
                      className={`inline-block p-4 rounded-t-lg ${
                        activeTab === "information"
                          ? "text-blue-700 border-b-2 border-blue-700"
                          : "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                      }`}
                      onClick={() => setActiveTab("information")}
                    >
                      Parking Lot Information
                    </button>
                  </li>
                </ul>
              </div>

              {/* Horizontal tabs content */}
              <div>
                {renderParkingLotDetails(
                  parkingLotFullDetails.find(
                    (lot) => lot.id === activeParkingLotId
                  )!
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

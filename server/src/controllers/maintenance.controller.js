import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Room } from "../models/rooms.model.js";
import { MaintenanceEventEnum } from "../constants.js";
import { emitSocketEvent } from "../socket/index.js";
const createMaintenance = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const {
    title,
    description,
    maintenanceProvider,
    contactPhone,
    costEstimate,
  } = req.body;

  const room = await Room.findById(roomId);
  if (room.maintenanceRequests.length >= 10) {
    throw new ApiError(404, "Maximum maintenance requests limit reached");
  }
  const maintenance = {
    title,
    description,
    maintenanceProvider,
    contactPhone,
    costEstimate,
  };

  room.maintenanceRequests.push(maintenance);
  await room.save();
  const newMaintenance =
    room.maintenanceRequests[room.maintenanceRequests.length - 1];
  emitSocketEvent(
    req,
    roomId,
    MaintenanceEventEnum.MAINTENANCE_CREATED_EVENT,
    newMaintenance
  );
  return res.json(
    new ApiResponse(
      200,
      newMaintenance,
      "Maintenance request created successfully"
    )
  );
});

const deleteMaintenance = asyncHandler(async (req, res) => {
  const { maintenanceId, roomId } = req.params;

  const room = await Room.findById(roomId);

  const maintenanceIndex = room.maintenanceRequests.findIndex(
    (item) => item._id.toString() === maintenanceId.toString()
  );

  if (maintenanceIndex === -1) {
    throw new ApiError(404, "Maintenance not find");
  }

  room.maintenanceRequests.splice(maintenanceIndex, 1);

  await room.save();
  const user = req.user;
  emitSocketEvent(
    req,
    roomId,
    MaintenanceEventEnum.MAINTENANCE_DELETED_EVENT,
    `${user.fullName} deleted maintenance issue`
  );
  return res.json(new ApiResponse(200, {}, "Maintenance deleted successfully"));
});

const updateMaintenance = asyncHandler(async (req, res) => {
  const { maintenanceId, roomId } = req.params;
  const {
    status,
    title,
    description,
    maintenanceProvider,
    contactPhone,
    costEstimate,
    dateResolved,
  } = req.body;

  const updateMaintenace = await Room.findOneAndUpdate(
    { _id: roomId, "maintenanceRequests._id": maintenanceId },
    {
      $set: {
        "maintenanceRequests.$.title": title,
        "maintenanceRequests.$.description": description,
        "maintenanceRequests.$.dateResolved": dateResolved,
        "maintenanceRequests.$.contactPhone": contactPhone,
        "maintenanceRequests.$.costEstimate": costEstimate,
        "maintenanceRequests.$.maintenanceProvider": maintenanceProvider,
        "maintenanceRequests.$.status": status,
      },
    },
    { new: true, runValidators: true }
  );
 
  if (!updateMaintenance) {
    throw new ApiError(400, "Error updating maintenance");
  }
  const updatedMaintenance =
    updateMaintenace.maintenanceRequests.id(maintenanceId);
  const user = req.user;
  emitSocketEvent(
    req,
    roomId,
    MaintenanceEventEnum.MAINTENANCE_UPDATED_EVENT,
    `${user.fullName} updated maintenance issue`
  );
  return res.json(
    new ApiResponse(200, updatedMaintenance, "Maintenance updated successfully")
  );
});

export { createMaintenance, deleteMaintenance, updateMaintenance };

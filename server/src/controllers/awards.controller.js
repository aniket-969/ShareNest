import { AwardEventEnum } from "../constants.js";
import { Room } from "../models/rooms.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { emitSocketEvent } from "../socket/index.js";
    
const customRoomAward = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const { title, description, image, criteria, assignedTo } = req.body;
 
  const room = await Room.findById(roomId);
 
  const award = {
    title,
    description,
    image,
    criteria,
    assignedTo,
  };
     
  room.awards.push(award);
  await room.save();

  const newAward = room.awards[room.awards.length - 1];
  const user = req.user
  emitSocketEvent(
    req,
    roomId,
    AwardEventEnum.AWARD_CREATED_EVENT,
    newAward
  );
  return res.json(
    new ApiResponse(200, newAward, "Custom award created successfully")
  );
});

const deleteRoomAward = asyncHandler(async (req, res) => {
  const { roomId, awardId } = req.params;

  const room = await Room.findById(roomId);

  const awardIndex = room.awards.findIndex(
    (item) => item._id.toString() === awardId
  );

  if (awardIndex === -1) {
    throw new ApiError(404, "Award not find");
  }

  room.awards.splice(awardIndex, 1);
  await room.save();
  const user = req.user
  emitSocketEvent(
    req,
    roomId,
    AwardEventEnum.AWARD_DELETED_EVENT,
    `${user.fullName} deleted an award`
  );
  return res.json(new ApiResponse(200, {}, "Awards deleted successfully"));
});

const updateRoomAward = asyncHandler(async (req, res) => {
  const { roomId, awardId } = req.params;
  const { title, description, image, criteria, assignedTo } = req.body;

  const updateAward = await Room.findOneAndUpdate(
    { _id: roomId, "awards._id": awardId },
    {
      $set: {
        "awards.$.title": title,
        "awards.$.description": description,
        "awards.$.assignedTo": assignedTo,
        "awards.$.criteria": criteria,
        "awards.$.image": image,
      },
    },
    { new: true, runValidators: true }
  );

  if (!updateAward) {
    throw new ApiError(404, "Error updating awards");
  }

  const updatedAward = updateAward.awards.id(awardId);
  const user = req.user
  emitSocketEvent(
    req,
    roomId,
    AwardEventEnum.AWARD_UPDATED_EVENT,
    `${user.fullName} updated an award`
  );
  return res.json(
    new ApiResponse(200, updateAward, "Award updated successfully")
  );
});

const getRoomAwards = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const roomWithAwards = await Room.findById(roomId).select("awards").populate({
    path: "awards.assignedTo",
    select: "username fullName avatar",
  });

  if (roomWithAwards.length === 0) {
    return res.json(new ApiResponse(200, {}, "No awards for this room yet"));
  }

  console.log(roomWithAwards.awards);
  return res.json(
    new ApiResponse(200, roomWithAwards, "Room awards fetched succesfully")
  );
});
 

export {
  customRoomAward,
  deleteRoomAward, 
  updateRoomAward,
  getRoomAwards
};
